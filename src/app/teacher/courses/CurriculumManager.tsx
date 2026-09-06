'use client'

import { useState, useTransition, useActionState, useEffect } from 'react'
import {
  createChapterAction,
  updateChapterAction,
  deleteChapterAction,
  createLessonAction,
  updateLessonAction,
  deleteLessonAction,
  createResourceAction,
  deleteResourceAction,
  ActionState,
} from './actions'
import {
  Plus,
  Trash2,
  Video,
  FileText,
  Link as LinkIcon,
  Eye,
  Loader2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Pencil,
} from 'lucide-react'
import Link from 'next/link'

type LessonResourceItem = {
  id: string
  title: string
  externalUrl: string
}

type LessonItem = {
  id: string
  title: string
  slug: string
  youtubeId: string
  isPreview: boolean
  durationSeconds: number
  orderNum: number
  resources: LessonResourceItem[]
}

type ChapterItem = {
  id: string
  title: string
  orderNum: number
  lessons: LessonItem[]
}

export function CurriculumManager({
  course,
}: {
  course: {
    id: string
    title: string
    slug: string
    chapters: ChapterItem[]
  }
}) {
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    course.chapters.forEach((c) => {
      init[c.id] = true
    })
    return init
  })

  const [activeAddLessonChapterId, setActiveAddLessonChapterId] = useState<string | null>(null)
  const [activeEditChapterId, setActiveEditChapterId] = useState<string | null>(null)
  const [activeAddResourceLessonId, setActiveAddResourceLessonId] = useState<string | null>(null)
  const [activeEditLessonId, setActiveEditLessonId] = useState<string | null>(null)

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/teacher/courses" className="hover:text-blue-900 hover:underline">
              Khóa học
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 truncate max-w-sm">
              {course.title}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Giáo Trình & Bài Giảng
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/learn/${course.slug}?lesson=1`}
            target="_blank"
            className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <span>Mở phòng học</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>
          <Link
            href={`/teacher/courses/${course.id}/edit`}
            className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <span>Sửa thông tin</span>
          </Link>
        </div>
      </div>

      {/* Chapters Container */}
      <div className="space-y-6">
        {course.chapters.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Layers className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">
              Khóa học này chưa có chương học nào
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Hãy bắt đầu bằng cách thêm chương học đầu tiên (ví dụ: &quot;Chương 1: Mệnh đề & Tập hợp&quot;).
            </p>
          </div>
        ) : (
          course.chapters.map((chapter, chIdx) => {
            const isOpen = openChapters[chapter.id] ?? true

            return (
              <div
                key={chapter.id}
                className="bg-white border border-slate-200/90 shadow-xs overflow-hidden"
              >
                {/* Chapter Header */}
                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex items-center gap-2.5 text-left font-bold text-slate-900 text-sm hover:text-blue-900 transition-colors flex-1 min-w-0"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                    <span className="text-xs font-mono text-slate-400">
                      Chương {chIdx + 1}:
                    </span>
                    <span className="truncate">{chapter.title}</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({chapter.lessons.length} bài)
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveEditChapterId(
                          activeEditChapterId === chapter.id ? null : chapter.id
                        )
                      }
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-blue-900 hover:text-blue-900 px-2 py-1 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                      title="Đổi tên chương"
                    >
                      <Pencil className="h-3 w-3 text-slate-500" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveAddLessonChapterId(
                          activeAddLessonChapterId === chapter.id ? null : chapter.id
                        )
                      }
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-blue-900 hover:text-blue-900 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Thêm bài giảng</span>
                    </button>

                    <DeleteChapterButton
                      chapterId={chapter.id}
                      courseId={course.id}
                      lessonCount={chapter.lessons.length}
                    />
                  </div>
                </div>

                {/* Edit Chapter Form (if toggled) */}
                {activeEditChapterId === chapter.id && (
                  <EditChapterForm
                    chapter={chapter}
                    courseId={course.id}
                    onClose={() => setActiveEditChapterId(null)}
                  />
                )}

                {/* Chapter Body: Lessons List */}
                {isOpen && (
                  <div className="p-4 space-y-3">
                    {/* Add Lesson Form Panel (if toggled) */}
                    {activeAddLessonChapterId === chapter.id && (
                      <AddLessonForm
                        courseId={course.id}
                        chapterId={chapter.id}
                        onClose={() => setActiveAddLessonChapterId(null)}
                      />
                    )}

                    {chapter.lessons.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Chương này chưa có bài giảng nào. Bấm &quot;Thêm bài giảng&quot; để tạo video đầu tiên.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="border border-slate-200/80 p-3 hover:border-slate-300 transition-colors bg-white space-y-2"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="p-1.5 bg-blue-50 text-blue-900 shrink-0">
                                  <Video className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900">
                                      {lesson.title}
                                    </span>
                                    {lesson.isPreview && (
                                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2">
                                        <Eye className="h-3 w-3" />
                                        <span>Học thử</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                                    <span>YouTube ID: {lesson.youtubeId}</span>
                                    {lesson.durationSeconds > 0 && (
                                      <span>
                                        Thời lượng: {Math.round(lesson.durationSeconds / 60)} phút
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveAddResourceLessonId(
                                      activeAddResourceLessonId === lesson.id ? null : lesson.id
                                    )
                                  }
                                  className="text-xs font-semibold text-slate-600 hover:text-blue-900 px-2 py-1 border border-slate-200 hover:bg-slate-50 transition-colors"
                                  title="Đính kèm tài liệu PDF / Drive"
                                >
                                  + Tài liệu ({lesson.resources.length})
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveEditLessonId(
                                      activeEditLessonId === lesson.id ? null : lesson.id
                                    )
                                  }
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-900 px-2 py-1 border border-slate-200 hover:bg-slate-50 transition-colors"
                                  title="Chỉnh sửa bài giảng"
                                >
                                  <Pencil className="h-3 w-3 text-slate-500" />
                                  <span>Sửa</span>
                                </button>

                                <DeleteLessonButton
                                  lessonId={lesson.id}
                                  courseId={course.id}
                                  title={lesson.title}
                                />
                              </div>
                            </div>

                            {/* Edit Lesson Form (if toggled) */}
                            {activeEditLessonId === lesson.id && (
                              <EditLessonForm
                                lesson={lesson}
                                courseId={course.id}
                                onClose={() => setActiveEditLessonId(null)}
                              />
                            )}

                            {/* Resource Form (if toggled) */}
                            {activeAddResourceLessonId === lesson.id && (
                              <AddResourceForm
                                lessonId={lesson.id}
                                courseId={course.id}
                                onClose={() => setActiveAddResourceLessonId(null)}
                              />
                            )}

                            {/* Resource List */}
                            {lesson.resources.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                                {lesson.resources.map((res) => (
                                  <div
                                    key={res.id}
                                    className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs text-slate-700"
                                  >
                                    <FileText className="h-3 w-3 text-slate-400" />
                                    <a
                                      href={res.externalUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium hover:text-blue-900 hover:underline max-w-[180px] truncate"
                                    >
                                      {res.title}
                                    </a>
                                    <DeleteResourceButton
                                      resourceId={res.id}
                                      courseId={course.id}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Add New Chapter Card */}
        <AddChapterForm courseId={course.id} />
      </div>
    </div>
  )
}

// 1. Add Chapter Form Component
function AddChapterForm({ courseId }: { courseId: string }) {
  const boundAction = createChapterAction.bind(null, courseId)
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {}
  )

  return (
    <div className="bg-slate-50 border border-dashed border-slate-300 p-5 space-y-3">
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
        <Plus className="h-4 w-4 text-blue-900" />
        <span>Thêm chương học mới</span>
      </h4>

      {state.message && (
        <p
          className={`text-xs ${
            state.success ? 'text-emerald-700' : 'text-rose-600'
          }`}
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="flex flex-col sm:flex-row gap-3">
        <input
          name="title"
          type="text"
          required
          placeholder="Ví dụ: Chương 2: Phương trình & Bất phương trình quy về bậc hai"
          className="flex-1 border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          <span>Thêm chương</span>
        </button>
      </form>
    </div>
  )
}

// 2. Add Lesson Form Component
function AddLessonForm({
  courseId,
  chapterId,
  onClose,
}: {
  courseId: string
  chapterId: string
  onClose: () => void
}) {
  const boundAction = createLessonAction.bind(null, courseId, chapterId)
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {}
  )

  return (
    <div className="bg-blue-50/40 border border-blue-200 p-4 space-y-3 mb-3">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-900" />
          <span>Thêm bài giảng mới vào chương</span>
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-700"
        >
          Đóng lại
        </button>
      </div>

      {state.message && (
        <p
          className={`text-xs ${
            state.success ? 'text-emerald-700' : 'text-rose-600'
          }`}
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Tiêu đề bài học <span className="text-rose-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            placeholder="Ví dụ: Bài 1: Khái niệm Mệnh đề toán học & Bài tập áp dụng"
            className="w-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Link YouTube hoặc ID video <span className="text-rose-500">*</span>
            </label>
            <input
              name="youtubeUrl"
              type="text"
              required
              placeholder="https://www.youtube.com/watch?v=... hoặc ID"
              className="w-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Thời lượng dự kiến (phút)
            </label>
            <input
              name="durationMinutes"
              type="number"
              min={0}
              placeholder="Ví dụ: 45"
              className="w-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPreview"
              className="h-3.5 w-3.5 rounded-none border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <span className="text-xs font-semibold text-slate-700">
              Cho phép học thử miễn phí (Preview)
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 bg-blue-900 px-3.5 py-1 text-xs font-bold text-white hover:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              <span>Lưu bài giảng</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// 3. Add Resource Form Component
function AddResourceForm({
  lessonId,
  courseId,
  onClose,
}: {
  lessonId: string
  courseId: string
  onClose: () => void
}) {
  const boundAction = createResourceAction.bind(null, lessonId, courseId)
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {}
  )

  return (
    <div className="bg-slate-50 border border-slate-200 p-3 space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Đính kèm tài liệu học tập
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] text-slate-400 hover:text-slate-700"
        >
          Đóng
        </button>
      </div>

      {state.message && (
        <p
          className={`text-[11px] ${
            state.success ? 'text-emerald-700' : 'text-rose-600'
          }`}
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="flex flex-col sm:flex-row gap-2">
        <input
          name="title"
          type="text"
          required
          placeholder="Tên tài liệu (VD: Phiếu bài tập tự luyện.pdf)"
          className="flex-1 border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
        />
        <input
          name="externalUrl"
          type="url"
          required
          placeholder="Link Google Drive / PDF..."
          className="flex-1 border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1 bg-slate-900 text-white px-3 py-1 text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <LinkIcon className="h-3 w-3" />}
          <span>Gắn link</span>
        </button>
      </form>
    </div>
  )
}

// 4. Delete Chapter Button
function DeleteChapterButton({
  chapterId,
  courseId,
  lessonCount,
}: {
  chapterId: string
  courseId: string
  lessonCount: number
}) {
  const [isDeleting, startTransition] = useTransition()

  const handleDelete = () => {
    const msg =
      lessonCount > 0
        ? `Chương này đang có ${lessonCount} bài giảng. Bạn có chắc muốn xóa toàn bộ chương này và các bài giảng bên trong?`
        : 'Bạn có chắc muốn xóa chương này?'
    if (!confirm(msg)) return

    startTransition(async () => {
      await deleteChapterAction(chapterId, courseId)
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1 text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-50"
      title="Xóa chương học"
    >
      {isDeleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

// 5. Delete Lesson Button
function DeleteLessonButton({
  lessonId,
  courseId,
  title,
}: {
  lessonId: string
  courseId: string
  title: string
}) {
  const [isDeleting, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Xóa bài giảng "${title}"?`)) return

    startTransition(async () => {
      await deleteLessonAction(lessonId, courseId)
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1 text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-50"
      title="Xóa bài học"
    >
      {isDeleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

// 6. Delete Resource Button
function DeleteResourceButton({
  resourceId,
  courseId,
}: {
  resourceId: string
  courseId: string
}) {
  const [isDeleting, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Xóa tài liệu đính kèm này?')) return

    startTransition(async () => {
      await deleteResourceAction(resourceId, courseId)
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-50"
      title="Xóa tài liệu"
    >
      {isDeleting ? (
        <Loader2 className="h-3 w-3 animate-spin text-rose-600" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
    </button>
  )
}

// 7. Edit Chapter Form Component
function EditChapterForm({
  chapter,
  courseId,
  onClose,
}: {
  chapter: ChapterItem
  courseId: string
  onClose: () => void
}) {
  const boundAction = updateChapterAction.bind(null, chapter.id, courseId)
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {}
  )

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [state.success, onClose])

  return (
    <div className="bg-slate-100/90 border-b border-slate-200 p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Pencil className="h-3.5 w-3.5 text-blue-900" />
          <span>Đổi tên chương</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          Đóng
        </button>
      </div>

      {state.message && (
        <p
          className={`text-xs ${
            state.success ? 'text-emerald-700 font-medium' : 'text-rose-600'
          }`}
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="flex flex-col sm:flex-row gap-2">
        <input
          name="title"
          type="text"
          required
          defaultValue={chapter.title}
          placeholder="Nhập tên chương mới..."
          className="flex-1 border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Lưu tên chương</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// 8. Edit Lesson Form Component
function EditLessonForm({
  lesson,
  courseId,
  onClose,
}: {
  lesson: LessonItem
  courseId: string
  onClose: () => void
}) {
  const boundAction = updateLessonAction.bind(null, lesson.id, courseId)
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {}
  )

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose()
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [state.success, onClose])

  return (
    <div className="border border-blue-300 p-4 space-y-3 mt-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
          <Pencil className="h-3.5 w-3.5 text-amber-800" />
          <span>Chỉnh sửa bài giảng (Bài {lesson.orderNum})</span>
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          Đóng
        </button>
      </div>

      {state.message && (
        <p
          className={`text-xs ${
            state.success ? 'text-emerald-700 font-semibold' : 'text-rose-600'
          }`}
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Tiêu đề bài học <span className="text-rose-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={lesson.title}
            placeholder="Ví dụ: Bài 1: Khái niệm Mệnh đề toán học"
            className="w-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Link YouTube hoặc ID video <span className="text-rose-500">*</span>
            </label>
            <input
              name="youtubeUrl"
              type="text"
              required
              defaultValue={lesson.youtubeId}
              placeholder="https://www.youtube.com/watch?v=... hoặc ID"
              className="w-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Thời lượng dự kiến (phút)
            </label>
            <input
              name="durationMinutes"
              type="number"
              min={0}
              defaultValue={Math.round(lesson.durationSeconds / 60) || ''}
              placeholder="Ví dụ: 45"
              className="w-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isPreview"
              defaultChecked={lesson.isPreview}
              className="h-3.5 w-3.5 rounded-none border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <span className="text-xs font-semibold text-slate-700">
              Cho phép học thử miễn phí (Preview)
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 bg-blue-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
