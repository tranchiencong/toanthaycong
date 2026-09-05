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

export async function grantEnrollmentAction(studentId: string, courseId: string) {
  try {
    await checkAdminAuth()

    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        }
      }
    })

    if (existing) {
      return { success: false, message: 'Học sinh này đã sở hữu khóa học từ trước.' }
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true }
    })

    await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        progress: 0,
        completedLessons: [],
      }
    })

    revalidatePath('/admin/students')
    revalidatePath('/admin')
    revalidatePath('/courses')
    revalidatePath('/dashboard')

    return { 
      success: true, 
      message: `Đã cấp thành công khóa học "${course?.title || ''}" cho học sinh!` 
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi cấp khóa học'
    return { success: false, message }
  }
}

export async function revokeEnrollmentAction(studentId: string, courseId: string) {
  try {
    await checkAdminAuth()

    await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        }
      }
    })

    revalidatePath('/admin/students')
    revalidatePath('/admin')
    revalidatePath('/courses')
    revalidatePath('/dashboard')

    return { success: true, message: 'Đã thu hồi khóa học thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi thu hồi khóa học'
    return { success: false, message }
  }
}
