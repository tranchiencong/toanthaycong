'use client'

import { useState, useTransition } from 'react'
import { deleteCommentAction } from './actions'
import {
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  Loader2,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

export type CommentItem = {
  id: string
  content: string
  createdAt: Date | string
  user: {
    id: string
    fullName: string
    email: string
    role: string
  }
  lesson: {
    id: string
    title: string
    orderNum: number
    chapter: {
      title: string
      course: {
        title: string
        slug: string
      }
    }
  }
}

export function CommentModerationClient({ comments }: { comments: CommentItem[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredComments = comments.filter((cm) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      const matchContent = cm.content.toLowerCase().includes(q)
      const matchUser = cm.user.fullName.toLowerCase().includes(q)
      const matchEmail = cm.user.email.toLowerCase().includes(q)
      const matchLesson = cm.lesson.title.toLowerCase().includes(q)
      const matchCourse = cm.lesson.chapter.course.title.toLowerCase().includes(q)
      return matchContent || matchUser || matchEmail || matchLesson || matchCourse
    }
    return true
  })

  const handleDelete = (cm: CommentItem) => {
    if (!confirm(`Bạn có chắc muốn xóa bình luận của "${cm.user.fullName}"? Thao tác này không thể hoàn tác.`)) {
      return
    }

    setDeletingId(cm.id)
    startTransition(async () => {
      const res = await deleteCommentAction(cm.id)
      setDeletingId(null)

      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Đã xóa bình luận!' })
      } else {
        setFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setFeedback(null), 3500)
    })
  }

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

      {/* Toolbar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung bình luận, tên học sinh, bài học..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 text-xs focus:outline-none focus:border-blue-900 bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Tổng số <strong>{comments.length}</strong> bình luận hỏi đáp
        </div>
      </div>

      {/* Comments Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <th className="py-3 px-4 w-60">Học sinh hỏi</th>
              <th className="py-3 px-4">Nội dung bình luận / câu hỏi</th>
              <th className="py-3 px-3 w-52">Bài học & Khóa học</th>
              <th className="py-3 px-3 w-32">Thời gian</th>
              <th className="py-3 px-4 w-28 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <MessageSquare className="h-7 w-7 mx-auto mb-1.5 opacity-40" />
                  <p>Chưa có bình luận nào hoặc không tìm thấy kết quả phù hợp.</p>
                </td>
              </tr>
            ) : (
              filteredComments.map((cm) => {
                const isThisDeleting = deletingId === cm.id
                const courseSlug = cm.lesson.chapter.course.slug
                const lessonOrder = cm.lesson.orderNum

                return (
                  <tr key={cm.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 text-xs mt-0.5">
                          {cm.user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{cm.user.fullName}</div>
                          <div className="text-[11px] text-slate-400">{cm.user.email}</div>
                          <span className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.2 mt-0.5 border ${
                            cm.user.role === 'ADMIN'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : cm.user.role === 'TEACHER'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {cm.user.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Content */}
                    <td className="py-3 px-4">
                      <div className="bg-slate-50 border border-slate-200/60 p-2.5 text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                        {cm.content}
                      </div>
                    </td>

                    {/* Lesson & Course */}
                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          Bài {cm.lesson.orderNum}: {cm.lesson.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {cm.lesson.chapter.course.title}
                        </div>
                        <Link
                          href={`/learn/${courseSlug}?lesson=${lessonOrder}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-900 font-semibold hover:underline mt-1"
                        >
                          <span>Mở bài học</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{new Date(cm.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(cm.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(cm)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 px-2 py-1 transition-colors disabled:opacity-40"
                        title="Xóa bình luận vi phạm này"
                      >
                        {isThisDeleting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
        Hiển thị <strong>{filteredComments.length}</strong> / {comments.length} bình luận
      </div>
    </div>
  )
}
