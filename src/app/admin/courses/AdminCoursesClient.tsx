'use client'

import { useState, useTransition } from 'react'
import { togglePublishCourseAction, deleteCourseByAdminAction } from './actions'
import {
  Search,
  BookOpen,
  Users,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Loader2,
  Layers,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'

export type AdminCourseItem = {
  id: string
  title: string
  slug: string
  isPublished: boolean
  createdAt: Date | string
  teacher: {
    fullName: string
    email: string
  }
  grade: {
    name: string
  }
  subject: {
    name: string
  }
  _count: {
    enrollments: number
    chapters: number
  }
}

export function AdminCoursesClient({ courses }: { courses: AdminCourseItem[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null)

  const filteredCourses = courses.filter((c) => {
    if (statusFilter === 'PUBLISHED' && !c.isPublished) return false
    if (statusFilter === 'DRAFT' && c.isPublished) return false

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      const matchTitle = c.title.toLowerCase().includes(q)
      const matchTeacher = c.teacher.fullName.toLowerCase().includes(q)
      const matchGrade = c.grade.name.toLowerCase().includes(q)
      return matchTitle || matchTeacher || matchGrade
    }

    return true
  })

  const handleTogglePublish = (c: AdminCourseItem) => {
    setTogglingCourseId(c.id)
    startTransition(async () => {
      const res = await togglePublishCourseAction(c.id, c.isPublished)
      setTogglingCourseId(null)

      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Cập nhật thành công!' })
      } else {
        setFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  const handleDeleteCourse = (c: AdminCourseItem) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn khóa học "${c.title}"? Thao tác này không thể hoàn tác.`)) {
      return
    }

    startTransition(async () => {
      const res = await deleteCourseByAdminAction(c.id)
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Đã xóa khóa học!' })
      } else {
        setFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setFeedback(null), 4000)
    })
  }

  const publishedCount = courses.filter((c) => c.isPublished).length
  const draftCount = courses.filter((c) => !c.isPublished).length

  return (
    <div className="bg-white border border-slate-200 shadow-2xs space-y-4">
      {/* Feedback Banner */}
      {feedback && (
        <div className={`m-4 p-3 text-xs font-semibold border ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên khóa học, giáo viên, khối lớp..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'PUBLISHED' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đang công khai ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'DRAFT' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bản nháp / Ẩn ({draftCount})
            </button>
          </div>

          <Link
            href="/teacher/courses/new"
            className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-semibold px-3 py-2 hover:bg-blue-800 transition-colors shadow-xs"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Tạo Khóa Học</span>
          </Link>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <th className="py-3 px-4">Tên Khóa Học & Chuyên Đề</th>
              <th className="py-3 px-3">Khối Lớp & Môn</th>
              <th className="py-3 px-3">Giáo Viên Phụ Trách</th>
              <th className="py-3 px-3 text-center">Học viên</th>
              <th className="py-3 px-3 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-right">Quản trị nội dung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <BookOpen className="h-7 w-7 mx-auto mb-1.5 opacity-40" />
                  <p>Không tìm thấy khóa học nào phù hợp.</p>
                </td>
              </tr>
            ) : (
              filteredCourses.map((c) => {
                const isToggling = togglingCourseId === c.id

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm max-w-sm">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{c._count.chapters} chương bài học</span>
                        <span>•</span>
                        <Link
                          href={`/courses/${c.slug}`}
                          target="_blank"
                          className="text-blue-900 hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Xem trang bán</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    </td>

                    {/* Grade & Subject */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                          {c.grade.name}
                        </span>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {c.subject.name}
                        </div>
                      </div>
                    </td>

                    {/* Teacher */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{c.teacher.fullName}</div>
                      <div className="text-[11px] text-slate-400">{c.teacher.email}</div>
                    </td>

                    {/* Student count */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                        <Users className="h-3 w-3 text-slate-500" />
                        <span>{c._count.enrollments}</span>
                      </span>
                    </td>

                    {/* Publish Status Toggle */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleTogglePublish(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold transition-all shadow-2xs border ${
                          c.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                        title={c.isPublished ? 'Bấm để ẩn khóa học khỏi học sinh' : 'Bấm để xuất bản khóa học công khai'}
                      >
                        {isToggling ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : c.isPublished ? (
                          <Eye className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-amber-600" />
                        )}
                        <span>{c.isPublished ? 'Đang công khai' : 'Bản nháp (Ẩn)'}</span>
                      </button>
                    </td>

                    {/* Content Admin Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/teacher/courses/${c.id}/curriculum`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:bg-blue-50 border border-blue-200 px-2.5 py-1 transition-colors"
                          title="Vào soạn chương, bài học và tài liệu"
                        >
                          <Layers className="h-3 w-3" />
                          <span>Giáo trình</span>
                        </Link>

                        <button
                          type="button"
                          disabled={isPending || c._count.enrollments > 0}
                          onClick={() => handleDeleteCourse(c)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title={c._count.enrollments > 0 ? "Không thể xóa vì đã có học viên học" : "Xóa khóa học này"}
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

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          Tổng số <strong>{courses.length}</strong> khóa học trong hệ thống
        </div>
        <div className="flex items-center gap-3 font-medium">
          <span className="text-emerald-700">{publishedCount} Đang công khai</span>
          <span>•</span>
          <span className="text-amber-700">{draftCount} Bản nháp</span>
        </div>
      </div>
    </div>
  )
}
