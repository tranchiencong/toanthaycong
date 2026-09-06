'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type RoleActionState = {
  success?: boolean
  message?: string
}

export async function updateUserRoleAction(
  targetUserId: string,
  newRole: 'STUDENT' | 'TEACHER' | 'ADMIN'
): Promise<RoleActionState> {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return { success: false, message: 'Bạn chưa đăng nhập.' }
  }

  const currentAdmin = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!currentAdmin || currentAdmin.role !== 'ADMIN') {
    return { success: false, message: 'Chỉ Quản trị viên tối cao (ADMIN) mới có quyền phân quyền.' }
  }

  // Self-lockout prevention: Admin cannot demote themselves
  if (targetUserId === currentAdmin.id && newRole !== 'ADMIN') {
    return {
      success: false,
      message: 'Bạn không thể tự hạ quyền Quản trị viên của chính tài khoản mình để tránh mất quyền truy cập.',
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin')
    revalidatePath('/teacher')

    const roleName =
      newRole === 'ADMIN'
        ? 'Quản trị viên (ADMIN)'
        : newRole === 'TEACHER'
        ? 'Giáo viên / Trợ giảng (TEACHER)'
        : 'Học viên (STUDENT)'

    return {
      success: true,
      message: `Đã phân quyền thành công tài khoản "${updated.fullName}" sang vai trò ${roleName}.`,
    }
  } catch (error) {
    console.error('Error updating user role:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật phân quyền. Vui lòng thử lại.',
    }
  }
}

export async function updateUserProfileByAdminAction(
  userId: string,
  data: {
    fullName: string
    phone?: string
    address?: string
    dateOfBirth?: string
  }
) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) return { success: false, message: 'Bạn chưa đăng nhập.' }

  const currentAdmin = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!currentAdmin || currentAdmin.role !== 'ADMIN') {
    return { success: false, message: 'Chỉ Quản trị viên mới có quyền cập nhật thông tin người dùng.' }
  }

  if (!data.fullName || data.fullName.trim().length < 2) {
    return { success: false, message: 'Họ tên phải có ít nhất 2 ký tự.' }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        address: data.address?.trim() || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      }
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin/students')

    return {
      success: true,
      message: `Đã cập nhật thông tin tài khoản "${updated.fullName}" thành công!`,
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, message: 'Lỗi khi cập nhật thông tin người dùng.' }
  }
}

export async function deleteUserAction(userId: string) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) return { success: false, message: 'Bạn chưa đăng nhập.' }

  const currentAdmin = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!currentAdmin || currentAdmin.role !== 'ADMIN') {
    return { success: false, message: 'Chỉ Quản trị viên mới có quyền xóa tài khoản.' }
  }

  // Prevent self-deletion
  if (userId === currentAdmin.id) {
    return { success: false, message: 'Bạn không thể tự xóa tài khoản Quản trị viên của chính mình!' }
  }

  const userToDelete = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      _count: { select: { courses: true } },
    },
  })

  if (!userToDelete) {
    return { success: false, message: 'Người dùng không tồn tại.' }
  }

  if (userToDelete._count.courses > 0) {
    return {
      success: false,
      message: `Không thể xóa vì tài khoản "${userToDelete.fullName}" đang sở hữu ${userToDelete._count.courses} khóa học. Vui lòng chuyển giao hoặc xóa các khóa học trước.`,
    }
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    })

    // Also clean up Supabase Auth user record so accounts don't remain orphaned
    try {
      await prisma.$executeRawUnsafe(
        `DELETE FROM auth.users WHERE id = $1::uuid`,
        userId
      )
    } catch (authDeleteErr) {
      console.warn('Could not delete from auth.users:', authDeleteErr)
    }

    revalidatePath('/admin/users')
    revalidatePath('/admin/students')
    revalidatePath('/admin')

    return { success: true, message: 'Đã xóa tài khoản thành công!' }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, message: 'Lỗi khi xóa tài khoản. Tài khoản có thể đang ràng buộc dữ liệu khóa học.' }
  }
}

