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

  if (!content || content.trim().length < 3) {
    return { success: false, message: 'Nội dung câu hỏi quá ngắn, vui lòng nhập chi tiết hơn.' }
  }

  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        lessonId,
        userId: user.id
      }
    })

    revalidatePath(`/learn/${courseSlug}/${lessonSlug}`)
    return { success: true, message: 'Đã gửi câu hỏi thành công!' }
  } catch (error) {
    console.error('Error posting comment:', error)
    return { success: false, message: 'Lỗi hệ thống khi gửi câu hỏi. Vui lòng thử lại.' }
  }
}
