'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { authSchema } from '@/lib/validations'
import { prisma } from '@/lib/prisma'

export type AuthFormState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
}

export async function authAction(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = await createClient()

  const intent = formData.get('intent')
  
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validatedData = authSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại thông tin đăng nhập.',
    }
  }

  const { email, password } = validatedData.data

  if (intent === 'login') {
    let loginRes = await supabase.auth.signInWithPassword({ email, password })

    // Auto-confirm resilience: if unconfirmed email was preventing login, auto-confirm and retry
    if (
      loginRes.error &&
      (loginRes.error.message.toLowerCase().includes('email not confirmed') ||
        loginRes.error.code === 'email_not_confirmed')
    ) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = $1 AND email_confirmed_at IS NULL`,
          email
        )
        loginRes = await supabase.auth.signInWithPassword({ email, password })
      } catch (confirmErr) {
        console.warn('Auto-confirm retry error:', confirmErr)
      }
    }

    if (loginRes.error || !loginRes.data.user) {
      return { message: 'Email hoặc mật khẩu không chính xác.' }
    }

    const profile = await prisma.user.findUnique({
      where: { id: loginRes.data.user.id },
    })

    if (!profile || !profile.phone || !profile.dateOfBirth) {
      redirect('/onboarding')
    }

    redirect('/dashboard')
  } else if (intent === 'signup') {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      return { message: signUpError.message || 'Lỗi khi đăng ký tài khoản.' }
    }

    if (signUpData.user) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = $1::uuid AND email_confirmed_at IS NULL`,
          signUpData.user.id
        )
      } catch (err) {
        console.warn('Auto-confirm signup error:', err)
      }
      await supabase.auth.signInWithPassword({ email, password })
    }

    redirect('/onboarding')
  }

  redirect('/dashboard')
}
