'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

const codeSchema = z.object({
  code: z
    .string()
    .min(3, 'Mã kích hoạt quá ngắn')
    .max(30, 'Mã kích hoạt không hợp lệ')
    .trim(),
})

export type ActivationState = {
  success?: boolean
  message?: string
  courseSlug?: string
}

export async function activateCodeAction(
  prevState: ActivationState,
  formData: FormData
): Promise<ActivationState> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập để kích hoạt khóa học.' }
    }

    const rawCode = formData.get('code') as string
    const validated = codeSchema.safeParse({ code: rawCode })

    if (!validated.success) {
      return { success: false, message: validated.error.issues[0]?.message || 'Mã không hợp lệ' }
    }

    const code = validated.data.code.toUpperCase()

    // Transaction to safely check and claim the code
    const courseInfo = await prisma.$transaction(async (tx) => {
      // 1. Find activation code
      const activationRecord = await tx.activationCode.findUnique({
        where: { code },
        include: { course: true },
      })

      if (!activationRecord) {
        throw new Error('Mã kích hoạt không tồn tại hoặc bạn đã nhập sai ký tự.')
      }

      if (activationRecord.isUsed) {
        throw new Error('Mã kích hoạt này đã được sử dụng trước đó.')
      }

      // 2. Check if student already enrolled in this course
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: activationRecord.courseId,
          },
        },
      })

      if (existingEnrollment) {
        throw new Error(`Bạn đã sở hữu khóa học "${activationRecord.course.title}" rồi.`)
      }

      // 3. Mark code as used
      await tx.activationCode.update({
        where: { id: activationRecord.id },
        data: {
          isUsed: true,
          usedById: user.id,
        },
      })

      // 4. Create enrollment record
      await tx.enrollment.create({
        data: {
          studentId: user.id,
          courseId: activationRecord.courseId,
          progress: 0,
          completedLessons: [],
        },
      })

      return {
        title: activationRecord.course.title,
        slug: activationRecord.course.slug,
      }
    })

    // Revalidate dashboard and course pages
    revalidatePath('/dashboard')
    revalidatePath('/courses')

    return {
      success: true,
      message: `Chúc mừng bạn đã kích hoạt thành công khóa học "${courseInfo.title}"!`,
      courseSlug: courseInfo.slug,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra trong quá trình kích hoạt. Vui lòng thử lại.'
    return {
      success: false,
      message,
    }
  }
}
