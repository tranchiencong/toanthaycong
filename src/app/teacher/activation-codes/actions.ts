'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export type GenerateState = {
  success?: boolean
  message?: string
  generatedCodes?: string[]
}

// Characters without ambiguous 0/O, 1/I/l to avoid student typing errors
const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

function generateCodeChunk(length: number): string {
  const bytes = crypto.randomBytes(length)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARSET[bytes[i] % CHARSET.length]
  }
  return result
}

export async function generateActivationCodesAction(
  _prevState: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return { success: false, message: 'Bạn chưa đăng nhập.' }
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return { success: false, message: 'Bạn không có quyền thực hiện thao tác này.' }
  }

  const courseId = formData.get('courseId') as string
  const quantityStr = formData.get('quantity') as string
  const customPrefix = ((formData.get('prefix') as string) || '').trim().toUpperCase()

  if (!courseId) {
    return { success: false, message: 'Vui lòng chọn khóa học cần cấp mã.' }
  }

  const quantity = parseInt(quantityStr, 10)
  if (isNaN(quantity) || quantity < 1 || quantity > 200) {
    return { success: false, message: 'Số lượng mã hợp lệ từ 1 đến 200 mã.' }
  }

  // Verify course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (!course) {
    return { success: false, message: 'Không tìm thấy khóa học.' }
  }

  try {
    // Generate unique codes
    const existingCodes = new Set(
      (await prisma.activationCode.findMany({ select: { code: true } })).map(
        (c) => c.code
      )
    )

    const newCodes: string[] = []
    const prefix = customPrefix ? `${customPrefix.replace(/[-_]+$/, '')}-` : 'TTC-'

    while (newCodes.length < quantity) {
      const part1 = generateCodeChunk(4)
      const part2 = generateCodeChunk(4)
      const code = `${prefix}${part1}-${part2}`

      if (!existingCodes.has(code) && !newCodes.includes(code)) {
        newCodes.push(code)
      }
    }

    // Insert batch into Database
    await prisma.activationCode.createMany({
      data: newCodes.map((code) => ({
        code,
        courseId,
        isUsed: false,
      })),
    })

    revalidatePath('/teacher/activation-codes')
    revalidatePath('/teacher')

    return {
      success: true,
      message: `Đã sinh thành công ${quantity} mã kích hoạt cho khóa "${course.title}".`,
      generatedCodes: newCodes,
    }
  } catch (error) {
    console.error('Error generating activation codes:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra trong quá trình sinh mã. Vui lòng thử lại.',
    }
  }
}

export async function deleteActivationCodeAction(codeId: string) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return { success: false, message: 'Chưa đăng nhập.' }
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return { success: false, message: 'Không có quyền.' }
  }

  try {
    const code = await prisma.activationCode.findUnique({
      where: { id: codeId },
    })

    if (!code) {
      return { success: false, message: 'Mã không tồn tại.' }
    }

    if (code.isUsed) {
      return {
        success: false,
        message: 'Không thể xóa mã đã được học sinh kích hoạt.',
      }
    }

    await prisma.activationCode.delete({
      where: { id: codeId },
    })

    revalidatePath('/teacher/activation-codes')
    revalidatePath('/teacher')
    return { success: true }
  } catch (error) {
    console.error('Error deleting code:', error)
    return { success: false, message: 'Không thể xóa mã này.' }
  }
}
