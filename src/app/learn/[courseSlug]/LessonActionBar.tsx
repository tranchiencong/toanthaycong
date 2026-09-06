'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { toggleLessonCompleteAction } from './actions'

type LessonLink = {
  param: string | number
  title: string
}

type LessonActionBarProps = {
  courseSlug: string
  lessonId: string
  initialCompleted: boolean
  isEnrolled: boolean
  prevLesson: LessonLink | null
  nextLesson: LessonLink | null
}

export function LessonActionBar({
  courseSlug,
  lessonId,
  initialCompleted,
  isEnrolled,
  prevLesson,
  nextLesson,
}: LessonActionBarProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [isPending, startTransition] = useTransition()

  const handleToggleComplete = () => {
    if (!isEnrolled) return

    startTransition(async () => {
      const res = await toggleLessonCompleteAction(courseSlug, lessonId)
      if (res.success && typeof res.isCompleted === 'boolean') {
        setIsCompleted(res.isCompleted)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      {/* Nút Bài trước */}
      {prevLesson ? (
        <Link
          href={`/learn/${courseSlug}?lesson=${prevLesson.param}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-900 hover:border-purple-300 transition-colors shadow-2xs"
          title={`Bài trước: ${prevLesson.title}`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Bài trước</span>
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed"
          title="Đã ở bài học đầu tiên"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Bài trước</span>
        </span>
      )}

      {/* Nút Đánh dấu hoàn thành */}
      {isEnrolled && (
        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer shadow-2xs ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
              : 'bg-blue-900 text-white hover:bg-purple-600 border border-blue-900'
          }`}
          title={isCompleted ? 'Nhấp để hủy đánh dấu hoàn thành' : 'Đánh dấu đã hoàn thành bài học này'}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-600' : 'text-white'}`} />
          )}
          <span>{isCompleted ? 'Đã học' : 'Hoàn thành'}</span>
        </button>
      )}

      {/* Nút Bài tiếp theo */}
      {nextLesson ? (
        <Link
          href={`/learn/${courseSlug}?lesson=${nextLesson.param}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-purple-600 border border-blue-900 transition-colors shadow-2xs"
          title={`Bài tiếp theo: ${nextLesson.title}`}
        >
          <span className="hidden sm:inline">Bài sau</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed"
          title="Đã hết bài giảng trong khóa"
        >
          <span className="hidden sm:inline">Bài sau</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </div>
  )
}
