'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

type LessonItem = {
  id: string
  title: string
  slug: string
  orderNum: number
  isPreview: boolean
  durationSeconds: number
}

type ChapterItem = {
  id: string
  title: string
  orderNum: number
  lessons: LessonItem[]
}

type CurriculumSidebarProps = {
  course: {
    id: string
    title: string
    slug: string
    chapters: ChapterItem[]
  }
  isEnrolled: boolean
  completedLessons: string[]
}

export function CurriculumSidebar({
  course,
  isEnrolled,
  completedLessons,
}: CurriculumSidebarProps) {
  const searchParams = useSearchParams()
  const currentLessonParam = searchParams.get('lesson')

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    // Expand all chapters by default
    const initial: Record<string, boolean> = {}
    course.chapters.forEach((c) => {
      initial[c.id] = true
    })
    return initial
  })

  const totalLessons = course.chapters.reduce((acc, c) => acc + c.lessons.length, 0)
  const completedCount = completedLessons.length
  const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }))
  }

  // Determine which lesson is currently active
  const isLessonActive = (lesson: LessonItem, indexInAll: number) => {
    if (currentLessonParam) {
      return (
        currentLessonParam === String(lesson.orderNum) ||
        currentLessonParam === lesson.slug ||
        currentLessonParam === lesson.id
      )
    }
    // Default to first lesson if no query param provided
    return indexInAll === 0
  }

  let allLessonsCounter = 0

  if (isCollapsed) {
    return (
      <aside className="border-r border-gray-200 bg-white p-3 flex flex-col items-center justify-between shrink-0 z-20">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-600 hover:text-blue-900 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Mở rộng danh sách bài giảng"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>

        <div className="writing-vertical text-xs font-bold text-gray-400 tracking-wider uppercase py-4">
          BÀI GIẢNG ({progressPercent}%)
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="p-2 text-gray-500 hover:text-blue-900 hover:bg-gray-100 transition-colors"
          title="Về trang khóa học"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </aside>
    )
  }

  return (
    <aside className="w-80 md:w-88 border-r border-gray-200 flex flex-col bg-white shrink-0 z-20 transition-all">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            <span>Về khóa học</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Thu gọn sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <h2 className="text-sm font-extrabold text-blue-900 line-clamp-2 leading-snug">
          {course.title}
        </h2>

        {/* Course Progress Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Tiến độ học tập</span>
            <span className="font-bold text-blue-900">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-900 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-slate-400 text-right">
            Đã học {completedCount}/{totalLessons} bài
          </div>
        </div>
      </div>

      {/* Curriculum Chapters Accordion */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {course.chapters.map((chapter) => {
          const isExpanded = expandedChapters[chapter.id] ?? true
          const chapterCompleted = chapter.lessons.filter((l) => completedLessons.includes(l.id)).length

          return (
            <div key={chapter.id} className="border-b border-gray-200 last:border-b-0">
              {/* Chapter Accordion Header */}
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/80 hover:bg-gray-100/80 border-b border-gray-100 text-left transition-colors cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide truncate">
                    {chapter.title}
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    {chapterCompleted}/{chapter.lessons.length} bài hoàn thành
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                )}
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div className="divide-y divide-gray-50 bg-white">
                  {chapter.lessons.map((lesson) => {
                    const currentIndex = allLessonsCounter++
                    const isActive = isLessonActive(lesson, currentIndex)
                    const canPlay = isEnrolled || lesson.isPreview
                    const isCompleted = completedLessons.includes(lesson.id)
                    const durationMins = Math.round((lesson.durationSeconds || 1200) / 60)
                    const lessonHref = canPlay ? `/learn/${course.slug}?lesson=${lesson.orderNum}` : '#'

                    return (
                      <Link
                        key={lesson.id}
                        href={lessonHref}
                        className={`block px-4 py-3 text-xs transition-colors ${
                          isActive
                            ? 'bg-blue-50/90 text-blue-900 font-bold border-l-3 border-blue-900'
                            : canPlay
                            ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
                            : 'text-gray-400 opacity-60 cursor-not-allowed bg-gray-50/30'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            {!canPlay ? (
                              <Lock className="h-3.5 w-3.5 text-gray-400" />
                            ) : isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            ) : isActive ? (
                              <PlayCircle className="h-3.5 w-3.5 text-blue-900 fill-blue-100" />
                            ) : (
                              <PlayCircle className="h-3.5 w-3.5 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="line-clamp-2 leading-relaxed font-medium">
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                              <span>{durationMins} phút</span>
                              {lesson.isPreview && !isEnrolled && (
                                <>
                                  <span>•</span>
                                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                                    Học thử
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
