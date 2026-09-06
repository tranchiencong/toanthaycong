'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLessonCompleteAction(courseSlug: string, lessonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Vui lòng đăng nhập để lưu tiến độ học tập.' }
  }

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: {
        include: {
          lessons: { select: { id: true } }
        }
      }
    }
  })

  if (!course) {
    return { success: false, message: 'Không tìm thấy khóa học.' }
  }

  const allLessonIds = course.chapters.flatMap(c => c.lessons.map(l => l.id))
  if (!allLessonIds.includes(lessonId)) {
    return { success: false, message: 'Bài học không thuộc khóa học này.' }
  }
  const totalLessons = allLessonIds.length || 1

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: course.id
      }
    }
  })

  if (!enrollment) {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })
    if (profile?.role === 'TEACHER' || profile?.role === 'ADMIN') {
      return { success: true, isCompleted: true, progress: 100 }
    }
    return { success: false, message: 'Bạn chưa kích hoạt khóa học này.' }
  }

  let updatedCompleted: string[] = []
  const isCurrentlyCompleted = enrollment.completedLessons.includes(lessonId)

  if (isCurrentlyCompleted) {
    updatedCompleted = enrollment.completedLessons.filter(id => id !== lessonId)
  } else {
    updatedCompleted = [...enrollment.completedLessons, lessonId]
  }

  const newProgress = Math.min(100, Math.round((updatedCompleted.length / totalLessons) * 100))

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      completedLessons: updatedCompleted,
      progress: newProgress
    }
  })

  revalidatePath(`/learn/${courseSlug}`, 'layout')
  revalidatePath('/dashboard')

  return {
    success: true,
    isCompleted: !isCurrentlyCompleted,
    progress: newProgress
  }
}

export async function postCommentAction(lessonId: string, content: string, courseSlug: string, lessonSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Vui lòng đăng nhập để đặt câu hỏi thảo luận.' }
  }

  const trimmed = (content || '').trim()
  if (trimmed.length < 3) {
    return { success: false, message: 'Nội dung câu hỏi quá ngắn, vui lòng nhập chi tiết hơn.' }
  }

  if (trimmed.length > 1000) {
    return { success: false, message: 'Nội dung câu hỏi tối đa 1.000 ký tự.' }
  }

  try {
    const [course, profile] = await Promise.all([
      prisma.course.findUnique({
        where: { slug: courseSlug },
        include: {
          chapters: {
            include: {
              lessons: { select: { id: true } },
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      }),
    ])

    if (!course) {
      return { success: false, message: 'Khóa học không tồn tại.' }
    }

    const allLessonIds = course.chapters.flatMap((c) => c.lessons.map((l) => l.id))
    if (!allLessonIds.includes(lessonId)) {
      return { success: false, message: 'Bài học không thuộc khóa học này.' }
    }

    const isPrivileged = profile?.role === 'TEACHER' || profile?.role === 'ADMIN'

    if (!isPrivileged) {
      const isEnrolled = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: course.id
          }
        }
      })

      if (!isEnrolled) {
        return { success: false, message: 'Bạn cần sở hữu khóa học để gửi câu hỏi thảo luận.' }
      }
    }

    await prisma.comment.create({
      data: {
        content: trimmed,
        lessonId,
        userId: user.id
      }
    })

    // Revalidate the actual course learning room where comments are viewed
    revalidatePath(`/learn/${courseSlug}`)
    revalidatePath(`/learn/${courseSlug}/${lessonSlug}`)
    return { success: true, message: 'Đã gửi câu hỏi thành công!' }
  } catch (error) {
    console.error('Error posting comment:', error)
    return { success: false, message: 'Lỗi hệ thống khi gửi câu hỏi. Vui lòng thử lại.' }
  }
}
