'use client'

import { useState, useTransition } from 'react'
import { deleteActivationCodeAction } from './actions'
import {
  Search,
  Copy,
  Check,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Loader2,
} from 'lucide-react'

export type ActivationCodeItem = {
  id: string
  code: string
  isUsed: boolean
  createdAt: Date | string
  updatedAt: Date | string
  course: {
    id: string
    title: string
    grade: { name: string }
  }
  usedBy: {
    id: string
    fullName: string
    email: string
    phone?: string | null
  } | null
}

export function CodeTableClient({
  codes,
  courses,
}: {
  codes: ActivationCodeItem[]
  courses: { id: string; title: string }[]
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNUSED' | 'USED'>('ALL')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter logic
  const filteredCodes = codes.filter((item) => {
    // Course filter
    if (selectedCourseId !== 'ALL' && item.course.id !== selectedCourseId) {
      return false
    }

    // Status filter
    if (statusFilter === 'UNUSED' && item.isUsed) return false
    if (statusFilter === 'USED' && !item.isUsed) return false

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      const matchCode = item.code.toLowerCase().includes(q)
      const matchCourse = item.course.title.toLowerCase().includes(q)
      const matchUser = item.usedBy?.fullName.toLowerCase().includes(q)
      const matchPhone = item.usedBy?.phone?.includes(q)
      return matchCode || matchCourse || matchUser || matchPhone
    }

    return true
  })

  // Copy single code
  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Copy all unused codes in current filter
  const handleCopyAllUnused = () => {
    const unusedInFilter = filteredCodes
      .filter((c) => !c.isUsed)
      .map((c) => c.code)

    if (unusedInFilter.length === 0) return
    navigator.clipboard.writeText(unusedInFilter.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2500)
  }

  // Delete unused code
  const handleDeleteCode = (id: string, code: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mã ${code}?`)) return
    setDeletingId(id)
    startDeleteTransition(async () => {
      await deleteActivationCodeAction(id)
      setDeletingId(null)
    })
  }

  const unusedCount = filteredCodes.filter((c) => !c.isUsed).length

  return (
    <div className="bg-white border border-slate-200/80 shadow-xs space-y-4">
      {/* Filters Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search & Course dropdown */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã hoặc học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-blue-900 focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-900 focus:outline-none"
            >
              <option value="ALL">Tất cả khóa học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Status Tabs & Copy All Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({codes.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('UNUSED')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'UNUSED'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chưa dùng ({codes.filter((c) => !c.isUsed).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('USED')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'USED'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã dùng ({codes.filter((c) => c.isUsed).length})
            </button>
          </div>

          {unusedCount > 0 && (
            <button
              type="button"
              onClick={handleCopyAllUnused}
              className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              title="Sao chép toàn bộ mã chưa dùng trong bộ lọc hiện tại"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Đã sao chép {unusedCount} mã!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Chép {unusedCount} mã chưa dùng</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Mã kích hoạt</th>
              <th className="py-3 px-3">Khóa học</th>
              <th className="py-3 px-3">Trạng thái</th>
              <th className="py-3 px-3">Người kích hoạt</th>
              <th className="py-3 px-3">Ngày tạo</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCodes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>Không tìm thấy mã nào phù hợp với điều kiện lọc.</p>
                </td>
              </tr>
            ) : (
              filteredCodes.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Code */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 border border-slate-200">
                        {item.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(item.id, item.code)}
                        className="p-1 text-slate-400 hover:text-blue-900 transition-colors"
                        title="Sao chép mã"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-3 px-3">
                    <div className="max-w-[200px] truncate font-medium text-slate-800" title={item.course.title}>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 mr-1.5">
                        {item.course.grade.name}
                      </span>
                      {item.course.title}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {item.isUsed ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 px-2 py-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>Đã kích hoạt</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Chưa sử dụng</span>
                      </span>
                    )}
                  </td>

                  {/* Used By Student */}
                  <td className="py-3 px-3">
                    {item.usedBy ? (
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-400" />
                          <span>{item.usedBy.fullName}</span>
                        </div>
                        {item.usedBy.phone && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{item.usedBy.phone}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">--</span>
                    )}
                  </td>

                  {/* Created At */}
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {!item.isUsed ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteCode(item.id, item.code)}
                        disabled={isDeleting && deletingId === item.id}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors disabled:opacity-50"
                        title="Xóa mã chưa dùng"
                      >
                        {isDeleting && deletingId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-300 text-[11px]">Khóa</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          Hiển thị <strong>{filteredCodes.length}</strong> / {codes.length} mã trong hệ thống
        </div>
        <div>
          Còn <strong>{codes.filter((c) => !c.isUsed).length}</strong> mã sẵn sàng cấp cho học sinh
        </div>
      </div>
    </div>
  )
}
