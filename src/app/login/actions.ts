'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { authSchema } from '@/lib/validations'

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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { message: 'Email hoặc mật khẩu không chính xác.' }
    }
  } else if (intent === 'signup') {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return { message: error.message || 'Lỗi khi đăng ký tài khoản.' }
    }
    // Note: If Supabase is configured to require email confirmation, 
    // we would show a different message here.
  }

  redirect('/dashboard')
}
