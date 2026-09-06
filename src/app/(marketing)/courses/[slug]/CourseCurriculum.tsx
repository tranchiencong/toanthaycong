'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import {
  BookOpen,
  PlayCircle,
  Lock,
  CheckCircle2,
  Clock,
  X,
  KeyRound,
  MessageCircle,
  Sparkles,
} from 'lucide-react'

export interface LessonItem {
  id: string
  title: string
  slug: string
  youtubeId: string
  orderNum: number
  isPreview: boolean
  durationSeconds: number
}

export interface ChapterItem {
  id: string
  title: string
  orderNum: number
  lessons: LessonItem[]
}

interface CourseCurriculumProps {
  courseSlug: string
  courseTitle: string
  chapters: ChapterItem[]
  isEnrolled: boolean
  completedIds: string[]
  totalLessons: number
}

export function CourseCurriculum({
  courseSlug,
  courseTitle,
  chapters,
  isEnrolled,
  completedIds,
  totalLessons,
}: CourseCurriculumProps) {
  const searchParams = useSearchParams()
  const completedSet = useMemo(() => new Set(completedIds), [completedIds])

  // All preview lessons available in this course
  const previewLessons = useMemo(() => {
    return chapters.flatMap((c) =>
      c.lessons
        .filter((l) => l.isPreview)
        .map((l) => ({ ...l, chapterTitle: c.title }))
    )
  }, [chapters])

  // Active preview lesson state for modal
  const [activePreviewLesson, setActivePreviewLesson] = useState<
    (LessonItem & { chapterTitle: string }) | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lockedNoticeLesson, setLockedNoticeLesson] = useState<string | null>(null)

  // Open preview modal
  const handleOpenPreview = useCallback(
    (lesson: LessonItem, chapterTitle: string) => {
      setActivePreviewLesson({ ...lesson, chapterTitle })
      setIsModalOpen(true)
      // Update URL query param without full page reload
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('preview', lesson.orderNum.toString())
      window.history.replaceState({}, '', newUrl.toString())
    },
    []
  )

  // Close preview modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    // Clear preview param from URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('preview')
    window.history.replaceState({}, '', newUrl.toString())
  }, [])

  // Auto-open modal if URL contains ?preview=X
  useEffect(() => {
    const previewParam = searchParams.get('preview')
    if (previewParam && previewLessons.length > 0) {
      const order = parseInt(previewParam, 10)
      const targetLesson =
        previewLessons.find((l) => l.orderNum === order) ||
        previewLessons.find((l) => l.slug === previewParam || l.id === previewParam) ||
        previewLessons[0]

      if (targetLesson) {
        setActivePreviewLesson(targetLesson)
        setIsModalOpen(true)
      }
    }
  }, [searchParams, previewLessons])

  // Listen for open-preview-modal event from sidebar thumbnail or other triggers
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<LessonItem & { chapterTitle?: string }>
      if (customEvent.detail) {
        const target = customEvent.detail
        const chapterTitle = target.chapterTitle || 'Bài học thử miễn phí'
        setActivePreviewLesson({ ...target, chapterTitle })
        setIsModalOpen(true)
      } else if (previewLessons.length > 0) {
        setActivePreviewLesson(previewLessons[0])
        setIsModalOpen(true)
      }
    }

    window.addEventListener('open-preview-modal', handleCustomOpen)
    return () => {
      window.removeEventListener('open-preview-modal', handleCustomOpen)
    }
  }, [previewLessons])

  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, handleCloseModal])

  // Scroll to activation form smoothly
  const handleScrollToActivation = () => {
    handleCloseModal()
    setTimeout(() => {
      const target = document.getElementById('activation-section')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const codeInput = document.getElementById('code') as HTMLInputElement | null
        if (codeInput) {
          codeInput.focus()
        }
      }
    }, 150)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2.5">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span>Nội dung khóa học</span>
        </h2>
        {previewLessons.length > 0 && !isEnrolled && (
          <button
            type="button"
            onClick={() => handleOpenPreview(previewLessons[0], previewLessons[0].chapterTitle)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 transition-colors cursor-pointer"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Học thử miễn phí ({previewLessons.length} bài)</span>
          </button>
        )}
      </div>

      <div className="border border-slate-200 shadow-2xs overflow-hidden">
        {chapters.map((chapter, index) => (
          <div key={chapter.id} className={index !== 0 ? 'border-t border-slate-200' : ''}>
            <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-blue-950 text-sm">{chapter.title}</h3>
              <span className="text-xs text-slate-500 font-medium">
                {chapter.lessons.length} bài học
              </span>
            </div>

            <div className="bg-white divide-y divide-slate-100">
              {chapter.lessons.map((lesson) => {
                const isCompleted = completedSet.has(lesson.id)
                const canPlayInLMS = isEnrolled
                const isPreview = lesson.isPreview && !isEnrolled

                // If enrolled -> links to LMS
                if (canPlayInLMS) {
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${courseSlug}?lesson=${lesson.orderNum}`}
                      className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-purple-50/30 cursor-pointer block"
                    >
                      <div className="flex items-center gap-4">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-purple-600 shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            isCompleted
                              ? 'text-slate-500 font-medium'
                              : 'text-slate-900 font-semibold hover:text-blue-900 transition-colors'
                          }`}
                        >
                          {lesson.title}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5">
                            Đã học
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 font-medium shrink-0">
                        <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {Math.floor(lesson.durationSeconds / 60)} phút
                      </div>
                    </Link>
                  )
                }

                // If guest/unactivated AND isPreview -> Opens Modal
                if (isPreview) {
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleOpenPreview(lesson, chapter.title)}
                      className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-purple-50/50 cursor-pointer group bg-purple-50/15"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <PlayCircle className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform shrink-0" />
                        <span className="text-sm font-bold text-blue-950 group-hover:text-purple-700 transition-colors">
                          {lesson.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-purple-600 text-white px-2 py-0.5 shadow-2xs">
                          Học thử
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline-flex items-center text-xs text-purple-700 font-semibold group-hover:underline">
                          Xem video
                        </span>
                        <div className="flex items-center text-xs text-slate-500 font-medium">
                          <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          {Math.floor(lesson.durationSeconds / 60)} phút
                        </div>
                      </div>
                    </div>
                  )
                }

                // Locked lesson for guest
                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setLockedNoticeLesson(lesson.id)
                      setTimeout(() => setLockedNoticeLesson(null), 3000)
                    }}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50/60 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Lock className="h-5 w-5 text-slate-400 shrink-0 group-hover:text-slate-600 transition-colors" />
                      <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700">
                        {lesson.title}
                      </span>
                      {lockedNoticeLesson === lesson.id && (
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 animate-pulse">
                          Cần kích hoạt mã khóa học
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-slate-400 font-medium shrink-0">
                      <Clock className="h-3.5 w-3.5 mr-1 text-slate-300" />
                      {Math.floor(lesson.durationSeconds / 60)} phút
                    </div>
                  </div>
                )
              })}

              {chapter.lessons.length === 0 && (
                <div className="px-6 py-4 text-xs text-slate-400 italic">Chưa có bài học nào.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VIDEO PREVIEW MODAL */}
      {isModalOpen && activePreviewLesson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-lesson-title"
        >
          <div
            className="relative w-full max-w-4xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-blue-950 text-white flex items-center justify-between border-b border-blue-900 shrink-0">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-600 text-white px-2 py-0.5">
                    Học thử miễn phí
                  </span>
                  <span className="text-xs text-blue-200 font-medium truncate max-w-[200px] sm:max-w-md">
                    {activePreviewLesson.chapterTitle}
                  </span>
                </div>
                <h3 id="modal-lesson-title" className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  Bài {activePreviewLesson.orderNum}: {activePreviewLesson.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="h-9 w-9 flex items-center justify-center text-blue-300 hover:text-white hover:bg-blue-900/60 transition-colors shrink-0"
                aria-label="Đóng cửa sổ xem thử"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Video Player Container */}
            <div className="bg-black aspect-video w-full shrink-0 overflow-hidden relative">
              <LiteYouTubeEmbed
                id={activePreviewLesson.youtubeId}
                title={activePreviewLesson.title}
                wrapperClass="yt-lite"
                playerClass="lty-playbtn"
                adNetwork={true}
                params="rel=0&autoplay=1"
              />
            </div>

            {/* Multiple Preview Lessons Selector (if any) */}
            {previewLessons.length > 1 && (
              <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
                <span className="text-slate-500 font-semibold shrink-0">Bài học thử khác:</span>
                <div className="flex items-center gap-2">
                  {previewLessons.map((pl) => {
                    const isCurrent = pl.id === activePreviewLesson.id
                    return (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => setActivePreviewLesson(pl)}
                        className={`px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                          isCurrent
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:text-purple-700'
                        }`}
                      >
                        Bài {pl.orderNum}: {pl.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Modal Conversion Footer (CRO) */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 via-white to-purple-50/80 border-t border-slate-200 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-950 font-bold text-sm sm:text-base">
                    <span>Bạn thấy phương pháp của Thầy Công phù hợp và dễ hiểu?</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kích hoạt khóa học để mở khóa toàn bộ <strong>{totalLessons} bài giảng</strong>, kho tài liệu PDF tuyển chọn và được giải đáp 24/7.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleScrollToActivation}
                    className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold px-5 py-3 transition-colors shadow-xs cursor-pointer"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Kích hoạt khóa học</span>
                  </button>

                  <a
                    href="https://zalo.me/0986999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold px-4 py-3 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="hidden sm:inline">Tư vấn Zalo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
