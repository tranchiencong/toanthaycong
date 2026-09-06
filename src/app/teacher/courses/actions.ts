'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ActionState = {
  success?: boolean
  message?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function extractYouTubeId(urlOrId: string): string {
  const trimmed = urlOrId.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  )
  return match ? match[1] : trimmed
}

async function verifyTeacherOrAdmin() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    throw new Error('Chưa đăng nhập.')
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    throw new Error('Bạn không có quyền thực hiện thao tác này.')
  }

  return user
}

async function verifyCourseOwnership(courseId: string, user: { id: string; role: string }) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      slug: true,
      title: true,
      teacherId: true,
      _count: { select: { enrollments: true } },
    },
  })

  if (!course) {
    throw new Error('Khóa học không tồn tại.')
  }

  if (user.role !== 'ADMIN' && course.teacherId !== user.id) {
    throw new Error('Bạn không có quyền chỉnh sửa hoặc thao tác trên khóa học này.')
  }

  return course
}

// 1. Create Course
export async function createCourseAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  let user: { id: string }
  try {
    user = await verifyTeacherOrAdmin()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi xác thực'
    return { success: false, message: msg }
  }

  const title = (formData.get('title') as string || '').trim()
  const gradeId = formData.get('gradeId') as string
  const subjectId = formData.get('subjectId') as string
  const description = (formData.get('description') as string || '').trim()
  const isPublished = formData.get('isPublished') === 'on'

  if (!title || !gradeId || !subjectId) {
    return { success: false, message: 'Vui lòng điền đầy đủ tiêu đề, khối lớp và môn học.' }
  }

  let slug = slugify(title)
  // Ensure uniqueness
  const existing = await prisma.course.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        slug,
        description: description || null,
        gradeId,
        subjectId,
        teacherId: user.id,
        isPublished,
      },
    })

    revalidatePath('/teacher/courses')
    revalidatePath('/courses')
    redirect(`/teacher/courses/${newCourse.id}/curriculum`)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      // Re-throw redirect error in Next.js
      throw error
    }
    console.error('Error creating course:', error)
    return { success: false, message: 'Không thể tạo khóa học. Vui lòng kiểm tra lại.' }
  }
}

// 2. Update Course
export async function updateCourseAction(
  courseId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await verifyTeacherOrAdmin()
    await verifyCourseOwnership(courseId, user)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi xác thực'
    return { success: false, message: msg }
  }

  const title = (formData.get('title') as string || '').trim()
  const gradeId = formData.get('gradeId') as string
  const subjectId = formData.get('subjectId') as string
  const description = (formData.get('description') as string || '').trim()
  const isPublished = formData.get('isPublished') === 'on'

  if (!title || !gradeId || !subjectId) {
    return { success: false, message: 'Vui lòng điền đủ thông tin.' }
  }

  try {
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        gradeId,
        subjectId,
        description: description || null,
        isPublished,
      },
    })

    revalidatePath('/teacher/courses')
    revalidatePath('/teacher')
    revalidatePath('/courses')
    revalidatePath(`/courses/${updated.slug}`)
    return { success: true, message: 'Đã cập nhật thông tin khóa học thành công.' }
  } catch (error) {
    console.error('Error updating course:', error)
    return { success: false, message: 'Không thể cập nhật khóa học.' }
  }
}

// 3. Delete Course
export async function deleteCourseAction(courseId: string) {
  try {
    const user = await verifyTeacherOrAdmin()
    const course = await verifyCourseOwnership(courseId, user)

    if (course._count.enrollments > 0) {
      return {
        success: false,
        message: `Không thể xóa vì khóa học đang có ${course._count.enrollments} học viên đã ghi danh. Vui lòng gỡ xuất bản (ẩn) khóa học thay vì xóa.`,
      }
    }

    await prisma.course.delete({ where: { id: courseId } })
    revalidatePath('/teacher/courses')
    revalidatePath('/teacher')
    revalidatePath('/courses')
    return { success: true }
  } catch (error: unknown) {
    console.error('Error deleting course:', error)
    const msg = error instanceof Error ? error.message : 'Không thể xóa khóa học này.'
    return { success: false, message: msg }
  }
}

// 4. Create Chapter
export async function createChapterAction(
  courseId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await verifyTeacherOrAdmin()
    await verifyCourseOwnership(courseId, user)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi xác thực'
    return { success: false, message: msg }
  }

  const title = (formData.get('title') as string || '').trim()
  if (!title) {
    return { success: false, message: 'Vui lòng nhập tên chương.' }
  }

  try {
    const maxOrder = await prisma.chapter.aggregate({
      where: { courseId },
      _max: { orderNum: true },
    })
    const nextOrder = (maxOrder._max.orderNum || 0) + 1

    await prisma.chapter.create({
      data: {
        title,
        courseId,
        orderNum: nextOrder,
      },
    })

    revalidatePath(`/teacher/courses/${courseId}/curriculum`)
    return { success: true, message: 'Đã thêm chương học mới.' }
  } catch (error) {
    console.error('Error creating chapter:', error)
    return { success: false, message: 'Lỗi khi tạo chương.' }
  }
}

// 5. Delete Chapter
export async function deleteChapterAction(chapterId: string, courseId: string) {
  try {
    const user = await verifyTeacherOrAdmin()
    await verifyCourseOwnership(courseId, user)
    await prisma.chapter.delete({ where: { id: chapterId } })
    revalidatePath(`/teacher/courses/${courseId}/curriculum`)
    return { success: true }
  } catch (error: unknown) {
    console.error('Error deleting chapter:', error)
    const msg = error instanceof Error ? error.message : 'Không thể xóa chương.'
    return { success: false, message: msg }
  }
}

// 6. Create Lesson
export async function createLessonAction(
  courseId: string,
  chapterId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  let course: { id: string; slug: string }
  try {
    const user = await verifyTeacherOrAdmin()
    course = await verifyCourseOwnership(courseId, user)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi xác thực'
    return { success: false, message: msg }
  }

  const title = (formData.get('title') as string || '').trim()
  const rawYoutube = (formData.get('youtubeUrl') as string || '').trim()
  const isPreview = formData.get('isPreview') === 'on'
  const rawMinutes = parseInt(formData.get('durationMinutes') as string || '0', 10)
  const durationMinutes = isNaN(rawMinutes) || rawMinutes < 0 ? 0 : Math.min(rawMinutes, 1440)

  if (!title || !rawYoutube) {
    return { success: false, message: 'Vui lòng nhập tiêu đề và link video YouTube.' }
  }

  const youtubeId = extractYouTubeId(rawYoutube)
  if (!youtubeId) {
    return { success: false, message: 'Mã hoặc link YouTube không hợp lệ.' }
  }

  try {
    const maxOrder = await prisma.lesson.aggregate({
      where: { chapter: { courseId } },
      _max: { orderNum: true },
    })
    const nextOrder = (maxOrder._max.orderNum || 0) + 1
    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`

    await prisma.lesson.create({
      data: {
        title,
        slug,
        youtubeId,
        isPreview,
        durationSeconds: durationMinutes * 60,
        orderNum: nextOrder,
        chapterId,
      },
    })

    revalidatePath(`/teacher/courses/${courseId}/curriculum`)
    revalidatePath(`/learn/${course.slug}`)
    return { success: true, message: 'Đã thêm bài giảng thành công.' }
  } catch (error) {
    console.error('Error creating lesson:', error)
    return { success: false, message: 'Không thể tạo bài giảng.' }
  }
}

// 7. Delete Lesson
export async function deleteLessonAction(lessonId: string, courseId: string) {
  try {
    const user = await verifyTeacherOrAdmin()
    const course = await verifyCourseOwnership(courseId, user)
    await prisma.lesson.delete({ where: { id: lessonId } })
    revalidatePath(`/teacher/courses/${courseId}/curriculum`)
    revalidatePath(`/learn/${course.slug}`)
    return { success: true }
  } catch (error: unknown) {
    console.error('Error deleting lesson:', error)
    const msg = error instanceof Error ? error.message : 'Không thể xóa bài giảng.'
    return { success: false, message: msg }
  }
}

// 8. Add Lesson Resource (PDF, Google Drive)
export async function createResourceAction(
  lessonId: string,
  courseId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  let course: { id: string; slug: string }
  try {
    const user = await verifyTeacherOrAdmin()
    course = await verifyCourseOwnership(courseId, user)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi xác thực'
    return { success: false, message: msg }
  }

  const title = (formData.get('title') as string || '').trim()
  const externalUrl = (formData.get('externalUrl') as string || '').trim()

  if (!title || !externalUrl) {
    return { success: false, message: 'Vui lòng nhập tên tài liệu và đường dẫn.' }
  }

  // Security: Prevent Stored XSS by enforcing http:// or https:// URLs
  try {
    const parsed = new URL(externalUrl)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { success: false, message: 'Đường dẫn tài liệu phải bắt đầu bằng http:// hoặc https://' }
    }
  } catch {
    return { success: false, message: 'Định dạng đường dẫn liên kết không hợp lệ.' }
  }

  try {
    await prisma.lessonResource.create({
      data: {
        title,
        externalUrl,
        lessonId,
      },
    })

    revalidatePath(`/teacher/courses/${courseId}/curriculum`)
    revalidatePath(`/learn/${course.slug}`)
    return { success: true, message: 'Đã thêm tài liệu đính kèm.' }
  } catch (error) {
    console.error('Error creating resource:', error)
    return { success: false, message: 'Không thể thêm tài liệu.' }
  }
}

// 9. Delete Lesson Resource
export async function deleteResourceAction(resourceId: string, courseId: string) {
  try {
    const user = await verifyTeacherOrAdmin()
    const course = await verifyCourseOwnership(courseId, user)
    await prisma.lessonResource.delete({ where: { id: resourceId } })
    revalidatePath(`/teacher/courses/${courseId}/curriculum`)
    revalidatePath(`/learn/${course.slug}`)
    return { success: true }
  } catch (error: unknown) {
    console.error('Error deleting resource:', error)
    const msg = error instanceof Error ? error.message : 'Không thể xóa tài liệu.'
    return { success: false, message: msg }
  }
}
