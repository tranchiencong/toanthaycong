'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { signUpSchema, parseDDMMYYYY } from '@/lib/validations'
import { checkRegistrationRateLimit, verifyTurnstileToken } from '@/lib/anti-spam'

export type SignUpFormState = {
  errors?: {
    fullName?: string[]
    phone?: string[]
    email?: string[]
    password?: string[]
    dateOfBirth?: string[]
    address?: string[]
  }
  message?: string
}

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const rawData = {
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    password: formData.get('password'),
    dateOfBirth: formData.get('dateOfBirth'),
    address: formData.get('address'),
  }

  const validated = signUpSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại các trường thông tin đăng ký.',
    }
  }

  const { fullName, phone, email, password, dateOfBirth, address } = validated.data

  // Anti-abuse rate limiting check per email
  const rateCheck = checkRegistrationRateLimit(email)
  if (!rateCheck.allowed) {
    return {
      message: `Bạn đang gửi quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau ${rateCheck.remainingTimeSeconds || 60} giây.`,
    }
  }

  // Anti-abuse: Cloudflare Turnstile bot verification
  const turnstileToken = formData.get('cf-turnstile-response') as string | null
  const isTurnstileValid = await verifyTurnstileToken(turnstileToken)
  if (!isTurnstileValid) {
    return {
      message: 'Xác minh an toàn chống bot không thành công. Vui lòng tải lại trang và thử lại.',
    }
  }

  const supabase = await createClient()

  // 1. Check if email already registered in Database
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      message: 'Email này đã được đăng ký tài khoản. Bạn vui lòng đăng nhập hoặc sử dụng email khác.',
    }
  }

  // 2. Register user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        phone,
      },
    },
  })

  if (
    authError ||
    !authData.user ||
    (authData.user.identities && authData.user.identities.length === 0)
  ) {
    return {
      message:
        authError?.message ||
        'Email này đã được đăng ký tài khoản. Bạn vui lòng đăng nhập hoặc sử dụng email khác.',
    }
  }

  // 3. Save student profile into PostgreSQL Database via Prisma
  const parsedDate = dateOfBirth ? parseDDMMYYYY(dateOfBirth) : null

  try {
    // Ensure email is confirmed in auth.users
    await prisma.$executeRawUnsafe(
      `UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = $1::uuid AND email_confirmed_at IS NULL`,
      authData.user.id
    )

    await prisma.user.upsert({
      where: { id: authData.user.id },
      update: {
        fullName,
        phone,
        dateOfBirth: parsedDate,
        address: address || null,
      },
      create: {
        id: authData.user.id,
        email,
        fullName,
        phone,
        dateOfBirth: parsedDate,
        address: address || null,
        role: 'STUDENT',
      },
    })
  } catch (dbError) {
    console.error('Lỗi khi lưu thông tin học sinh vào Database:', dbError)
    return {
      message: 'Lỗi hệ thống khi khởi tạo hồ sơ học viên. Vui lòng liên hệ Thầy Công để được hỗ trợ.',
    }
  }

  // 4. If Supabase signUp didn't issue a session, sign in now to set session cookies
  if (!authData.session) {
    await supabase.auth.signInWithPassword({ email, password })
  }

  // 5. Redirect straight to student dashboard
  redirect('/dashboard')
}
