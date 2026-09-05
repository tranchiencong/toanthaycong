import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { UserRoleTableClient } from './UserRoleTableClient'

export const metadata = {
  title: 'Quản Lý Tài Khoản & Phân Quyền | Cổng Quản Trị',
  description: 'Quản lý danh sách người dùng và gán vai trò Giáo viên, Quản trị viên.',
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Quản Lý Tài Khoản & Phân Quyền
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gán quyền Giáo viên / Trợ giảng để vào Cổng Giáo viên tạo bài học, hoặc nâng quyền Quản trị viên.
        </p>
      </div>

      {/* Users Table */}
      <UserRoleTableClient users={users} currentAdminId={authUser?.id || ''} />
    </div>
  )
}
