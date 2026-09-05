'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { profileSchema, parseDDMMYYYY } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type ProfileFormState = {
  success?: boolean
  message?: string
  errors?: {
    fullName?: string[]
    phone?: string[]
    dateOfBirth?: string[]
    address?: string[]
    bio?: string[]
  }
}

export async function updateProfileAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Bạn cần đăng nhập để thực hiện thao tác này.' }
  }

  const rawData = {
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    dateOfBirth: formData.get('dateOfBirth'),
    address: formData.get('address'),
    bio: formData.get('bio') || undefined,
  }

  const validated = profileSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại các trường thông tin.',
    }
  }

  const { fullName, phone, dateOfBirth, address, bio } = validated.data
  const parsedDate = parseDDMMYYYY(dateOfBirth)

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName,
        phone,
        dateOfBirth: parsedDate,
        address,
        bio: bio || null,
      },
    })

    // Also update full name in Supabase user metadata
    await supabase.auth.updateUser({
      data: { fullName },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/profile')

    return {
      success: true,
      message: 'Cập nhật thông tin hồ sơ thành công!',
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật hồ sơ:', error)
    return {
      success: false,
      message: 'Không thể cập nhật hồ sơ vào lúc này. Vui lòng thử lại sau.',
    }
  }
}

const passwordSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export type PasswordFormState = {
  success?: boolean
  message?: string
  errors?: {
    password?: string[]
    confirmPassword?: string[]
  }
}

export async function updatePasswordAction(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Bạn cần đăng nhập để đổi mật khẩu.' }
  }

  const rawData = {
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  const validated = passwordSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại mật khẩu nhập vào.',
    }
  }

  const { password } = validated.data

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return {
      success: false,
      message: error.message || 'Không thể đổi mật khẩu. Vui lòng thử lại sau.',
    }
  }

  return {
    success: true,
    message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.',
  }
}
