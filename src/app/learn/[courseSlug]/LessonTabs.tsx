'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  BookOpen,
  FileText,
  MessageSquare,
  PenTool,
  Download,
  Send,
  User,
  GraduationCap,
  Clock,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react'
import { postCommentAction } from './actions'

type Resource = {
  id: string
  title: string
  externalUrl: string
}

type CommentItem = {
  id: string
  content: string
  createdAt: Date | string
  user: {
    id: string
    fullName: string
    role: string
    avatarUrl?: string | null
  }
}

type LessonTabsProps = {
  lesson: {
    id: string
    title: string
    slug: string
    durationSeconds: number
    isPreview: boolean
  }
  resources: Resource[]
  comments: CommentItem[]
  courseSlug: string
  currentUser: {
    id: string
    fullName: string
    role: string
  } | null
  isCompleted: boolean
}

export function LessonTabs({
  lesson,
  resources,
  comments,
  courseSlug,
  currentUser,
  isCompleted,
}: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'qa' | 'notes'>('overview')
  const [commentContent, setCommentContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const [commentMsg, setCommentMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Local storage personal notes
  const noteStorageKey = `ttc_notes_${lesson.id}`
  const [noteContent, setNoteContent] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(noteStorageKey)
        if (saved) setNoteContent(saved)
      } catch {
        // Ignore storage errors
      }
    }
    const id = requestAnimationFrame(handleStorage)
    return () => cancelAnimationFrame(id)
  }, [noteStorageKey])

  const handleNoteChange = (text: string) => {
    setNoteContent(text)
    try {
      localStorage.setItem(noteStorageKey, text)
    } catch {
      // Ignore storage errors
    }
  }

  const handleCopyNote = () => {
    navigator.clipboard.writeText(noteContent)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    setCommentMsg(null)
    startTransition(async () => {
      const res = await postCommentAction(lesson.id, commentContent, courseSlug, lesson.slug)
      if (res.success) {
        setCommentContent('')
        setCommentMsg({ type: 'success', text: 'Câu hỏi của bạn đã được gửi thành công!' })
        setTimeout(() => setCommentMsg(null), 4000)
      } else {
        setCommentMsg({ type: 'error', text: res.message || 'Lỗi gửi câu hỏi.' })
      }
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} phút ${secs > 0 ? `${secs} giây` : ''}`
  }

  const formatDate = (dateInput: Date | string) => {
    const date = new Date(dateInput)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  type TabItem = {
    id: 'overview' | 'resources' | 'qa' | 'notes'
    label: string
    icon: typeof BookOpen
    badge?: number
  }

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Tổng quan bài học', icon: BookOpen },
    {
      id: 'resources',
      label: 'Tài liệu đính kèm',
      icon: FileText,
      badge: resources.length > 0 ? resources.length : undefined,
    },
    {
      id: 'qa',
      label: 'Hỏi đáp & Thảo luận',
      icon: MessageSquare,
      badge: comments.length > 0 ? comments.length : undefined,
    },
    { id: 'notes', label: 'Ghi chú cá nhân', icon: PenTool },
  ]

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
      {/* Tab Navigation Header: Minimalist & Crisp */}
      <div className="flex items-center border-b border-gray-200 overflow-x-auto bg-gray-50/70 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-blue-900' : 'text-gray-400'}`} />
              <span>{t.label}</span>
              {typeof t.badge === 'number' && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Body Contents */}
      <div className="p-6 sm:p-8">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Thời lượng: {formatDuration(lesson.durationSeconds || 1200)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                    <span>Giảng viên: Thầy Công</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className="p-4 border border-slate-200/90 bg-white hover:border-purple-300 hover:bg-purple-50/20 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950 group-hover:text-purple-600 mb-1">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span>Tài liệu bài học</span>
                </div>
                <p className="text-xs text-slate-500">
                  {resources.length > 0
                    ? `${resources.length} tài liệu học tập đính kèm`
                    : 'Chưa có tài liệu đính kèm'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className="p-4 border border-slate-200/90 bg-white hover:border-purple-300 hover:bg-purple-50/20 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950 group-hover:text-purple-600 mb-1">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span>Hỏi đáp & Thảo luận</span>
                </div>
                <p className="text-xs text-slate-500">
                  {comments.length > 0
                    ? `${comments.length} câu hỏi thảo luận`
                    : 'Gửi thắc mắc cho Thầy Công'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className="p-4 border border-slate-200/90 bg-white hover:border-purple-300 hover:bg-purple-50/20 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950 group-hover:text-purple-600 mb-1">
                  <PenTool className="h-4 w-4 text-purple-600" />
                  <span>Sổ tay ghi chú</span>
                </div>
                <p className="text-xs text-slate-500">
                  {noteContent.trim()
                    ? 'Đã có ghi chú cá nhân'
                    : 'Ghi chép công thức bài giảng'}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* 2. RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Tài liệu học tập & Phiếu bài tập ({resources.length})
              </h3>
            </div>

            {resources.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-start justify-between gap-3 p-4 border border-slate-200/90 bg-white hover:border-purple-300 hover:shadow-2xs transition-all group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-9 w-9 bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 border border-purple-100">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-blue-950 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {res.title}
                        </h4>
                        <span className="inline-block mt-1 text-[11px] text-slate-400">
                          Tài liệu PDF • Tải xuống miễn phí
                        </span>
                      </div>
                    </div>

                    <a
                      href={res.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-purple-600 transition-colors shrink-0 shadow-2xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Tải về</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border border-dashed border-gray-200 bg-gray-50/40">
                <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Chưa có tài liệu đính kèm cho bài giảng này.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Thầy Công và ban chuyên môn sẽ sớm cập nhật phiếu bài tập bổ trợ.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. Q&A / DISCUSSION TAB */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Hỏi đáp & Thảo luận ({comments.length})
              </h3>
              <span className="text-xs text-slate-500">
                Được hỗ trợ giải đáp trực tiếp bởi Thầy Công & Trợ giảng
              </span>
            </div>

            {/* Comment Form */}
            {currentUser ? (
              <form onSubmit={handlePostComment} className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Đặt câu hỏi về bài giảng, dạng bài chưa hiểu hoặc chia sẻ thắc mắc của bạn..."
                    className="w-full p-3.5 text-sm border border-slate-200 focus:outline-none focus:border-blue-900 transition-all placeholder:text-slate-400 bg-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Đặt câu hỏi có số câu và mốc thời gian video để được giải đáp nhanh nhất.
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || !commentContent.trim()}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-2xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isPending ? 'Đang gửi...' : 'Gửi câu hỏi'}</span>
                  </button>
                </div>

                {commentMsg && (
                  <div
                    className={`p-3 text-xs font-semibold ${
                      commentMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {commentMsg.text}
                  </div>
                )}
              </form>
            ) : (
              <div className="p-4 border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Bạn cần đăng nhập tài khoản để đặt câu hỏi cho Thầy Công.
                </div>
                <a
                  href={`/login?redirect=/learn/${courseSlug}`}
                  className="px-4 py-2 bg-blue-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-600 transition-colors shrink-0 shadow-2xs"
                >
                  Đăng nhập
                </a>
              </div>
            )}

            {/* List of Comments */}
            {comments.length > 0 ? (
              <div className="space-y-4 pt-2">
                {comments.map((comment) => {
                  const isTeacher = comment.user.role === 'TEACHER' || comment.user.role === 'ADMIN'

                  return (
                    <div
                      key={comment.id}
                      className={`p-4 border ${
                        isTeacher
                          ? 'border-blue-200 bg-blue-50/40'
                          : 'border-slate-200 bg-white'
                      } shadow-2xs`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isTeacher
                                ? 'bg-blue-900 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isTeacher ? <GraduationCap className="h-4 w-4" /> : <User className="h-3.5 w-3.5" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-blue-900">
                              {comment.user.fullName}
                            </span>
                            {isTeacher && (
                              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 bg-blue-900 text-white">
                                Giáo viên
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed pl-9">
                        {comment.content}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-10 text-center border border-dashed border-slate-200 bg-slate-50/40">
                <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  Chưa có câu hỏi nào cho bài học này.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Hãy gửi câu hỏi đầu tiên để được Thầy Công và các bạn cùng giải đáp nhé!
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Ghi chú bài học cá nhân
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tự động lưu vào trình duyệt của bạn cho bài học này.
                </p>
              </div>

              {noteContent && (
                <button
                  type="button"
                  onClick={handleCopyNote}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-purple-600 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép ghi chú</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              rows={8}
              value={noteContent}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Ghi lại công thức, định lý quan trọng, hoặc các mốc thời gian (ví dụ: 05:20 cách giải nhanh) khi xem bài giảng..."
              className="w-full p-4 text-sm font-mono border border-slate-200 focus:outline-none focus:border-blue-900 transition-all placeholder:text-slate-400 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  )
}
