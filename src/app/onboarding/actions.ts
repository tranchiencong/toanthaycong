'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { onboardingSchema, parseDDMMYYYY } from '@/lib/validations'

export type FormState = {
  errors?: {
    fullName?: string[]
    phone?: string[]
    dateOfBirth?: string[]
    address?: string[]
  }
  message?: string
}

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Security: Extract and validate input using Zod before touching Database
  const rawData = {
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    dateOfBirth: formData.get('dateOfBirth'),
    address: formData.get('address'),
  }

  const validatedData = onboardingSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại các trường thông tin.',
    }
  }

  const { fullName, phone, dateOfBirth, address } = validatedData.data

  const parsedDate = parseDDMMYYYY(dateOfBirth) || new Date()

  try {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { 
        fullName, 
        phone, 
        dateOfBirth: parsedDate, 
        address 
      },
      create: { 
        id: user.id, 
        email: user.email ?? '', 
        fullName, 
        phone, 
        dateOfBirth: parsedDate, 
        address 
      }
    })
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: 'Lỗi hệ thống hoặc kết nối Database chưa sẵn sàng. Vui lòng thử lại sau.',
    }
  }

  redirect('/dashboard')
}
