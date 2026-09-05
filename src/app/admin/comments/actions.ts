'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

export async function deleteCommentAction(commentId: string) {
  try {
    await checkAdminAuth()

    await prisma.comment.delete({
      where: { id: commentId }
    })

    revalidatePath('/admin/comments')
    revalidatePath('/learn/[courseSlug]', 'page')

    return { success: true, message: 'Đã xóa bình luận thành công!' }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, message: 'Lỗi khi xóa bình luận.' }
  }
}
