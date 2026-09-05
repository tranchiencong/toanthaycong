'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const activationSchema = z.object({
  code: z.string().min(3, 'Mã kích hoạt quá ngắn').max(20, 'Mã kích hoạt không hợp lệ'),
  courseId: z.string().uuid()
})

export type ActionState = {
  success: boolean
  message?: string
} | null

export async function activateCourseAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) {
      return { success: false, message: 'Bạn cần đăng nhập để kích hoạt khóa học.' }
    }

    const code = formData.get('code') as string
    const courseId = formData.get('courseId') as string

    // Validate
    const validatedFields = activationSchema.safeParse({ code, courseId })
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    // Prisma Transaction
    await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra mã kích hoạt
      const activationRecord = await tx.activationCode.findUnique({
        where: { code: validatedFields.data.code }
      })

      if (!activationRecord) {
        throw new Error('Mã kích hoạt không tồn tại.')
      }

      if (activationRecord.isUsed) {
        throw new Error('Mã kích hoạt này đã được sử dụng.')
      }

      if (activationRecord.courseId !== validatedFields.data.courseId) {
        throw new Error('Mã kích hoạt này không dành cho khóa học này.')
      }

      // 2. Kiểm tra xem user đã sở hữu khóa học chưa
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: authData.user.id,
            courseId: validatedFields.data.courseId
          }
        }
      })

      if (existingEnrollment) {
        throw new Error('Bạn đã sở hữu khóa học này rồi.')
      }

      // 3. Đánh dấu mã đã sử dụng
      await tx.activationCode.update({
        where: { id: activationRecord.id },
        data: {
          isUsed: true,
          usedById: authData.user.id
        }
      })

      // 4. Tạo Enrollment
      await tx.enrollment.create({
        data: {
          studentId: authData.user.id,
          courseId: validatedFields.data.courseId,
          progress: 0,
          completedLessons: []
        }
      })

      return true
    })

    // Revalidate trang chi tiết khóa học
    revalidatePath('/courses/[slug]', 'page')
    
    return { success: true, message: 'Kích hoạt khóa học thành công!' }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.'
    return { success: false, message }
  }
}
