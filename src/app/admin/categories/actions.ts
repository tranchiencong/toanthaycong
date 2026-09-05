'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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

// Validation schemas
const gradeSchema = z.object({
  name: z.string().min(2, 'Tên khối lớp phải từ 2 ký tự').max(50, 'Tên quá dài'),
  orderNum: z.coerce.number().int().default(0)
})

const subjectSchema = z.object({
  name: z.string().min(2, 'Tên môn học phải từ 2 ký tự').max(50, 'Tên quá dài')
})

// Grade Actions
export async function createGradeAction(formData: FormData) {
  try {
    await checkAdminAuth()
    const name = formData.get('name') as string
    const orderNum = formData.get('orderNum') as string

    const validated = gradeSchema.safeParse({ name, orderNum })
    if (!validated.success) {
      return { success: false, message: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    await prisma.grade.create({
      data: {
        name: validated.data.name,
        orderNum: validated.data.orderNum,
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/courses')
    revalidatePath('/teacher/courses/new')
    revalidatePath('/', 'layout')

    return { success: true, message: `Đã thêm khối lớp "${validated.data.name}" thành công!` }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi tạo khối lớp'
    return { success: false, message }
  }
}

export async function updateGradeAction(id: string, formData: FormData) {
  try {
    await checkAdminAuth()
    const name = formData.get('name') as string
    const orderNum = formData.get('orderNum') as string

    const validated = gradeSchema.safeParse({ name, orderNum })
    if (!validated.success) {
      return { success: false, message: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    await prisma.grade.update({
      where: { id },
      data: {
        name: validated.data.name,
        orderNum: validated.data.orderNum,
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/courses')
    revalidatePath('/teacher/courses/new')
    revalidatePath('/', 'layout')

    return { success: true, message: `Đã cập nhật khối lớp thành công!` }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi cập nhật khối lớp'
    return { success: false, message }
  }
}

export async function deleteGradeAction(id: string) {
  try {
    await checkAdminAuth()
    
    // Check if grade has courses
    const count = await prisma.course.count({
      where: { gradeId: id }
    })

    if (count > 0) {
      return { 
        success: false, 
        message: `Không thể xóa vì khối lớp này đang có ${count} khóa học trực thuộc. Vui lòng chuyển hoặc xóa các khóa học trước.` 
      }
    }

    await prisma.grade.delete({
      where: { id }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/courses')
    revalidatePath('/teacher/courses/new')
    revalidatePath('/', 'layout')

    return { success: true, message: 'Đã xóa khối lớp thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi xóa khối lớp'
    return { success: false, message }
  }
}

// Subject Actions
export async function createSubjectAction(formData: FormData) {
  try {
    await checkAdminAuth()
    const name = formData.get('name') as string

    const validated = subjectSchema.safeParse({ name })
    if (!validated.success) {
      return { success: false, message: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    await prisma.subject.create({
      data: {
        name: validated.data.name,
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/courses')
    revalidatePath('/teacher/courses/new')
    revalidatePath('/', 'layout')

    return { success: true, message: `Đã thêm môn học "${validated.data.name}" thành công!` }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi tạo môn học'
    return { success: false, message }
  }
}

export async function updateSubjectAction(id: string, formData: FormData) {
  try {
    await checkAdminAuth()
    const name = formData.get('name') as string

    const validated = subjectSchema.safeParse({ name })
    if (!validated.success) {
      return { success: false, message: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    await prisma.subject.update({
      where: { id },
      data: {
        name: validated.data.name,
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/courses')
    revalidatePath('/teacher/courses/new')
    revalidatePath('/', 'layout')

    return { success: true, message: 'Đã cập nhật môn học thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi cập nhật môn học'
    return { success: false, message }
  }
}

export async function deleteSubjectAction(id: string) {
  try {
    await checkAdminAuth()
    
    // Check if subject has courses
    const count = await prisma.course.count({
      where: { subjectId: id }
    })

    if (count > 0) {
      return { 
        success: false, 
        message: `Không thể xóa vì môn học này đang có ${count} khóa học trực thuộc.` 
      }
    }

    await prisma.subject.delete({
      where: { id }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/courses')
    revalidatePath('/teacher/courses/new')
    revalidatePath('/', 'layout')

    return { success: true, message: 'Đã xóa môn học thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi xóa môn học'
    return { success: false, message }
  }
}
