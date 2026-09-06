'use client'

import { useState, useTransition } from 'react'
import { updateUserRoleAction, updateUserProfileByAdminAction, deleteUserAction } from './actions'
import {
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Edit2,
  Trash2,
  X,
  User,
} from 'lucide-react'

export type UserItem = {
  id: string
  fullName: string
  email: string
  phone?: string | null
  address?: string | null
  dateOfBirth?: Date | string | null
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  createdAt: Date | string
  _count: {
    enrollments: number
  }
}

export function UserRoleTableClient({
  users,
  currentAdminId,
}: {
  users: UserItem[]
  currentAdminId: string
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'ADMIN'>('ALL')
  const [isPending, startTransition] = useTransition()
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  // Edit user state
  const [editUser, setEditUser] = useState<UserItem | null>(null)
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  })

  const handleOpenEdit = (u: UserItem) => {
    setEditUser(u)
    setEditForm({
      fullName: u.fullName,
      phone: u.phone || '',
      address: u.address || '',
      dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split('T')[0] : '',
    })
  }

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return

    startTransition(async () => {
      const res = await updateUserProfileByAdminAction(editUser.id, editForm)
      if (res.success) {
        setActionFeedback({ type: 'success', text: res.message || 'Cập nhật thành công!' })
        setEditUser(null)
      } else {
        setActionFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setActionFeedback(null), 4000)
    })
  }

  const handleDeleteUser = (u: UserItem) => {
    if (u.id === currentAdminId) {
      alert('Bạn không thể tự xóa tài khoản của chính mình!')
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${u.fullName}" (${u.email})? Thao tác này không thể hoàn tác.`)) {
      return
    }

    startTransition(async () => {
      const res = await deleteUserAction(u.id)
      if (res.success) {
        setActionFeedback({ type: 'success', text: res.message || 'Đã xóa tài khoản!' })
      } else {
        setActionFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setActionFeedback(null), 4000)
    })
  }

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      const matchName = u.fullName.toLowerCase().includes(q)
      const matchEmail = u.email.toLowerCase().includes(q)
      const matchPhone = u.phone?.includes(q)
      return matchName || matchEmail || matchPhone
    }

    return true
  })

  const handleRoleChange = (userId: string, newRole: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
    if (userId === currentAdminId && newRole !== 'ADMIN') {
      setActionFeedback({
        type: 'error',
        text: 'Bạn không thể tự hạ quyền của chính mình!',
      })
      return
    }

    setUpdatingUserId(userId)
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, newRole)
      setUpdatingUserId(null)

      if (res.success) {
        setActionFeedback({
          type: 'success',
          text: res.message || 'Cập nhật phân quyền thành công!',
        })
      } else {
        setActionFeedback({
          type: 'error',
          text: res.message || 'Lỗi khi cập nhật phân quyền.',
        })
      }

      setTimeout(() => setActionFeedback(null), 4000)
    })
  }

  const studentCount = users.filter((u) => u.role === 'STUDENT').length
  const teacherCount = users.filter((u) => u.role === 'TEACHER').length
  const adminCount = users.filter((u) => u.role === 'ADMIN').length

  return (
    <div className="bg-white border border-slate-200/80 shadow-2xs space-y-4">
      {/* Feedback Toast */}
      {actionFeedback && (
        <div
          className={`m-4 p-3 text-xs font-medium flex items-center gap-2 border animate-in fade-in duration-200 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{actionFeedback.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Tên, Email hoặc Số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-blue-900 focus:outline-none"
          />
        </div>

        {/* Role Tabs */}
        <div className="inline-flex border border-slate-200 p-0.5 bg-slate-50">
          <button
            type="button"
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              roleFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('STUDENT')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              roleFilter === 'STUDENT'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Học viên ({studentCount})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('TEACHER')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              roleFilter === 'TEACHER'
                ? 'bg-white text-amber-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Giáo viên ({teacherCount})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              roleFilter === 'ADMIN'
                ? 'bg-white text-rose-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quản trị ({adminCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-4">Tài khoản & Liên hệ</th>
              <th className="py-2.5 px-3">Số điện thoại</th>
              <th className="py-2.5 px-3">Khóa học</th>
              <th className="py-2.5 px-3">Ngày tham gia</th>
              <th className="py-2.5 px-4 text-right">Vai trò & Phân quyền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  Không tìm thấy tài khoản nào phù hợp với từ khóa.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isCurrentAdmin = u.id === currentAdminId
                const isThisUpdating = isPending && updatingUserId === u.id

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User info */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{u.fullName}</span>
                        {isCurrentAdmin && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                            (Bạn)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-700">
                      {u.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{u.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">--</span>
                      )}
                    </td>

                    {/* Enrollments Count */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {u._count.enrollments > 0 ? (
                        <span className="px-2 py-0.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 text-[11px]">
                          {u._count.enrollments} khóa học
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0 khóa</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>

                    {/* Role & User Actions */}
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {isThisUpdating && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-900" />
                        )}

                        <select
                          value={u.role}
                          disabled={isPending || isCurrentAdmin}
                          onChange={(e) =>
                            handleRoleChange(
                              u.id,
                              e.target.value as 'STUDENT' | 'TEACHER' | 'ADMIN'
                            )
                          }
                          className={`text-xs font-bold px-2.5 py-1 border transition-colors cursor-pointer disabled:cursor-not-allowed ${
                            u.role === 'ADMIN'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : u.role === 'TEACHER'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-blue-50 text-blue-950 border-blue-200'
                          }`}
                          title={isCurrentAdmin ? 'Không thể tự đổi quyền của bạn' : 'Chọn đổi vai trò'}
                        >
                          <option value="STUDENT">Học viên (STUDENT)</option>
                          <option value="TEACHER">Giáo viên (TEACHER)</option>
                          <option value="ADMIN">Quản trị viên (ADMIN)</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                          title="Sửa thông tin học sinh"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isPending || isCurrentAdmin}
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title={isCurrentAdmin ? 'Không thể xóa chính bạn' : 'Xóa tài khoản này'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-blue-900" />
                <span>Chỉnh Sửa Thông Tin Tài Khoản</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="text"
                  value={editUser.email}
                  disabled
                  className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="09..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-900 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ / Tỉnh thành</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Ví dụ: Lục Nam, Bắc Ninh"
                  className="w-full text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-bold px-4 py-2 hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          Hiển thị <strong>{filteredUsers.length}</strong> / {users.length} tài khoản trong hệ thống
        </div>
        <div className="flex items-center gap-3">
          <span>{teacherCount} Giáo viên</span>
          <span>•</span>
          <span>{adminCount} Quản trị viên</span>
        </div>
      </div>
    </div>
  )
}
