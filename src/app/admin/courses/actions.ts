'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function checkAdminAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Yêu cầu đăng nhập.')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  })
  if (!dbUser || dbUser.role !== 'ADMIN') {
    throw new Error('Chỉ Quản trị viên mới có quyền thực hiện thao tác này.')
  }
  return user
}

export async function togglePublishCourseAction(courseId: string, currentStatus: boolean) {
  try {
    await checkAdminAuth()

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: !currentStatus }
    })

    revalidatePath('/admin/courses')
    revalidatePath('/admin')
    revalidatePath('/courses')
    revalidatePath(`/courses/${updated.slug}`)
    revalidatePath('/', 'layout')

    return {
      success: true,
      message: `Đã ${!currentStatus ? 'xuất bản công khai' : 'gỡ xuất bản (ẩn)'} khóa học "${updated.title}"!`,
    }
  } catch (error) {
    console.error('Error toggling course publish:', error)
    return { success: false, message: 'Lỗi khi thay đổi trạng thái xuất bản khóa học.' }
  }
}

export async function deleteCourseByAdminAction(courseId: string) {
  try {
    await checkAdminAuth()

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, _count: { select: { enrollments: true } } }
    })

    if (!course) {
      return { success: false, message: 'Khóa học không tồn tại.' }
    }

    if (course._count.enrollments > 0) {
      return {
        success: false,
        message: `Không thể xóa vì khóa học đang có ${course._count.enrollments} học viên đã ghi danh. Vui lòng ẩn khóa học thay vì xóa.`
      }
    }

    await prisma.course.delete({
      where: { id: courseId }
    })

    revalidatePath('/admin/courses')
    revalidatePath('/admin')
    revalidatePath('/courses')
    revalidatePath('/teacher/courses')
    revalidatePath('/', 'layout')

    return { success: true, message: `Đã xóa vĩnh viễn khóa học "${course.title}"!` }
  } catch (error) {
    console.error('Error deleting course:', error)
    return { success: false, message: 'Lỗi khi xóa khóa học.' }
  }
}
