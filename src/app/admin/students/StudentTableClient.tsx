'use client'

import { useState, useTransition } from 'react'
import {
  Search,
  Phone,
  Copy,
  Check,
  Download,
  Filter,
  Mail,
  MapPin,
  BookOpen,
  Plus,
  Loader2,
  X,
} from 'lucide-react'
import { grantEnrollmentAction, revokeEnrollmentAction } from './actions'

export type StudentItem = {
  id: string
  fullName: string
  email: string
  phone?: string | null
  address?: string | null
  dateOfBirth?: Date | string | null
  createdAt: Date | string
  enrollments: {
    id: string
    course: {
      id: string
      title: string
    }
  }[]
}

export function StudentTableClient({
  students,
  allCourses,
  initialFilter,
}: {
  students: StudentItem[]
  allCourses: { id: string; title: string }[]
  initialFilter?: string
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ENROLLED' | 'LEADS'>(
    initialFilter === 'LEADS' ? 'LEADS' : 'ALL'
  )
  const [yearFilter, setYearFilter] = useState<string>('ALL')
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [grantModalStudent, setGrantModalStudent] = useState<StudentItem | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')

  // Extract unique birth years
  const availableYears = Array.from(
    new Set(
      students
        .map((s) => (s.dateOfBirth ? new Date(s.dateOfBirth).getFullYear().toString() : null))
        .filter(Boolean) as string[]
    )
  ).sort((a, b) => b.localeCompare(a))

  // Filter students
  const filteredStudents = students.filter((s) => {
    // Status filter
    const hasCourse = s.enrollments.length > 0
    if (statusFilter === 'ENROLLED' && !hasCourse) return false
    if (statusFilter === 'LEADS' && hasCourse) return false

    // Year filter
    if (yearFilter !== 'ALL') {
      const bYear = s.dateOfBirth ? new Date(s.dateOfBirth).getFullYear().toString() : ''
      if (bYear !== yearFilter) return false
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      const matchName = s.fullName.toLowerCase().includes(q)
      const matchEmail = s.email.toLowerCase().includes(q)
      const matchPhone = s.phone?.includes(q)
      const matchAddress = s.address?.toLowerCase().includes(q)
      return matchName || matchEmail || matchPhone || matchAddress
    }

    return true
  })

  // Copy phone
  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone)
    setCopiedPhoneId(id)
    setTimeout(() => setCopiedPhoneId(null), 2000)
  }

  // Grant enrollment handler
  const handleGrantEnrollment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!grantModalStudent || !selectedCourseId) return

    startTransition(async () => {
      const res = await grantEnrollmentAction(grantModalStudent.id, selectedCourseId)
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Cấp khóa học thành công!' })
        setGrantModalStudent(null)
        setSelectedCourseId('')
      } else {
        setFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  // Revoke enrollment handler
  const handleRevokeEnrollment = (studentId: string, courseId: string, courseTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn thu hồi khóa học "${courseTitle}" của học sinh này?`)) return

    startTransition(async () => {
      const res = await revokeEnrollmentAction(studentId, courseId)
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Thu hồi khóa học thành công!' })
      } else {
        setFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  // Export CSV with UTF-8 BOM for flawless Excel Vietnamese display
  const handleExportCSV = () => {
    const headers = ['Họ và tên', 'Email', 'Số điện thoại', 'Năm sinh', 'Địa chỉ', 'Số khóa học', 'Khóa học đã đăng ký', 'Ngày đăng ký']
    const rows = filteredStudents.map((s) => [
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.email}"`,
      `"${s.phone || ''}"`,
      `"${s.dateOfBirth ? new Date(s.dateOfBirth).getFullYear() : ''}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`,
      s.enrollments.length,
      `"${s.enrollments.map((e) => e.course.title).join('; ')}"`,
      `"${new Date(s.createdAt).toLocaleDateString('vi-VN')}"`,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `danh-sach-hoc-sinh-toanthaycong-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const enrolledCount = students.filter((s) => s.enrollments.length > 0).length
  const leadsCount = students.length - enrolledCount

  return (
    <div className="bg-white border border-slate-200/80 shadow-2xs space-y-4">
      {/* Controls / Filter Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search & Year dropdown */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo Tên, SĐT, Tỉnh thành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-blue-900 focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-900 focus:outline-none"
            >
              <option value="ALL">Tất cả năm sinh</option>
              {availableYears.map((y) => {
                const hint =
                  y === '2007'
                    ? ' (Lớp 12 - Thi ĐH)'
                    : y === '2008'
                    ? ' (Lớp 11)'
                    : y === '2009'
                    ? ' (Lớp 10)'
                    : ''
                return (
                  <option key={y} value={y}>
                    Năm {y}{hint}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* Right: Status Tabs & Export Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('LEADS')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'LEADS'
                  ? 'bg-white text-amber-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leads cần gọi ({leadsCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ENROLLED')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'ENROLLED'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã có khóa ({enrolledCount})
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Xuất file Excel/CSV danh sách học sinh"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`mx-4 mt-2 p-3 text-xs font-semibold border ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-4">Họ tên & Email</th>
              <th className="py-2.5 px-3">Số điện thoại</th>
              <th className="py-2.5 px-3">Năm sinh</th>
              <th className="py-2.5 px-3">Địa chỉ / Tỉnh thành</th>
              <th className="py-2.5 px-3">Khóa học & Kích hoạt</th>
              <th className="py-2.5 px-4 text-right">Telesale & CSKH</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <Filter className="h-7 w-7 mx-auto mb-1.5 opacity-40" />
                  <p>Không tìm thấy học sinh nào phù hợp với bộ lọc.</p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((st) => {
                const hasCourse = st.enrollments.length > 0
                const birthYear = st.dateOfBirth
                  ? new Date(st.dateOfBirth).getFullYear()
                  : null

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Email */}
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900">{st.fullName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />
                        <span>{st.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono font-semibold">
                      {st.phone ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-900">{st.phone}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(st.id, st.phone!)}
                            className="text-slate-400 hover:text-blue-900 transition-colors"
                            title="Sao chép SĐT"
                          >
                            {copiedPhoneId === st.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">Chưa điền</span>
                      )}
                    </td>

                    {/* Birth Year */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {birthYear ? (
                        <span className="font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-700">
                          {birthYear}
                        </span>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>

                    {/* Address */}
                    <td className="py-2.5 px-3">
                      {st.address ? (
                        <div className="flex items-center gap-1 text-slate-600 max-w-[180px] truncate" title={st.address}>
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{st.address}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">--</span>
                      )}
                    </td>

                    {/* Course Status & Grant Action */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-1.5">
                        {hasCourse ? (
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {st.enrollments.map((en) => (
                              <span
                                key={en.id}
                                className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800"
                                title={en.course.title}
                              >
                                <span className="truncate max-w-[120px]">{en.course.title}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRevokeEnrollment(st.id, en.course.id, en.course.title)}
                                  className="text-emerald-600 hover:text-rose-600 transition-colors p-0.5"
                                  title="Thu hồi khóa học này"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5">
                            <span>Chưa kích hoạt (Lead)</span>
                          </span>
                        )}

                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              setGrantModalStudent(st)
                              const enrolledCourseIds = new Set(st.enrollments.map((e) => e.course.id))
                              const available = allCourses.find((c) => !enrolledCourseIds.has(c.id))
                              setSelectedCourseId(available ? available.id : (allCourses[0]?.id || ''))
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:text-blue-700 hover:underline"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Cấp khóa học</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      {st.phone ? (
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`tel:${st.phone}`}
                            className="inline-flex items-center gap-1 bg-blue-900 text-white px-2.5 py-1 text-xs font-bold hover:bg-blue-800 transition-colors shadow-2xs"
                            title="Bấm gọi ngay cho học sinh"
                          >
                            <Phone className="h-3 w-3" />
                            <span>Gọi</span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Grant Course Modal */}
      {grantModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-900" />
                <span>Cấp Khóa Học Cho Học Sinh</span>
              </h3>
              <button
                type="button"
                onClick={() => setGrantModalStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 text-xs space-y-1 text-slate-700 border border-slate-200/60">
              <p><strong>Học sinh:</strong> {grantModalStudent.fullName}</p>
              <p><strong>Email:</strong> {grantModalStudent.email}</p>
              {grantModalStudent.phone && <p><strong>SĐT:</strong> {grantModalStudent.phone}</p>}
            </div>

            <form onSubmit={handleGrantEnrollment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chọn khóa học cần cấp quyền truy cập *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-900 bg-white"
                  required
                >
                  {allCourses.map((c) => {
                    const isEnrolled = grantModalStudent.enrollments.some((e) => e.course.id === c.id)
                    return (
                      <option key={c.id} value={c.id} disabled={isEnrolled}>
                        {c.title} {isEnrolled ? '(Đã sở hữu)' : ''}
                      </option>
                    )
                  })}
                </select>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Khóa học sẽ được kích hoạt ngay lập tức vào tài khoản học sinh.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGrantModalStudent(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isPending || !selectedCourseId}
                  className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-bold px-4 py-2 hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Xác nhận Cấp Khóa Học</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          Hiển thị <strong>{filteredStudents.length}</strong> / {students.length} học sinh
        </div>
        <div>
          Đang có <strong>{leadsCount}</strong> học sinh tiềm năng cần gọi tư vấn
        </div>
      </div>
    </div>
  )
}
