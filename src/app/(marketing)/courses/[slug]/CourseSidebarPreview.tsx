'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export interface PreviewLessonData {
  id: string
  title: string
  slug: string
  youtubeId: string
  orderNum: number
  durationSeconds: number
  chapterTitle?: string
}

interface CourseSidebarPreviewProps {
  courseSlug: string
  courseTitle: string
  firstPreviewLesson?: PreviewLessonData | null
  totalPreviewLessons: number
  isEnrolled: boolean
  nextLessonOrder?: number
}

export function CourseSidebarPreview({
  courseSlug,
  courseTitle,
  firstPreviewLesson,
  totalPreviewLessons,
  isEnrolled,
  nextLessonOrder = 1,
}: CourseSidebarPreviewProps) {
  const [thumbSrc, setThumbSrc] = useState(
    firstPreviewLesson?.youtubeId
      ? `https://img.youtube.com/vi/${firstPreviewLesson.youtubeId}/maxresdefault.jpg`
      : '/images/thumbnail-v2.jpg'
  )

  const handleOpenPreview = () => {
    if (firstPreviewLesson) {
      window.dispatchEvent(
        new CustomEvent('open-preview-modal', {
          detail: {
            ...firstPreviewLesson,
            chapterTitle: firstPreviewLesson.chapterTitle || 'Bài học thử miễn phí',
          },
        })
      )
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('preview', firstPreviewLesson.orderNum.toString())
      window.history.replaceState({}, '', newUrl.toString())
    }
  }

  // If user is already enrolled, clicking thumbnail navigates straight to LMS
  if (isEnrolled) {
    return (
      <Link
        href={`/learn/${courseSlug}?lesson=${nextLessonOrder}`}
        className="group relative block aspect-video w-full bg-slate-900 border border-slate-200 overflow-hidden shadow-xs cursor-pointer"
      >
        <Image
          src={thumbSrc}
          alt={courseTitle}
          fill
          sizes="(max-width: 1280px) 33vw, 384px"
          className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-300"
          onError={() => {
            if (firstPreviewLesson?.youtubeId && thumbSrc.includes('maxresdefault')) {
              setThumbSrc(`https://img.youtube.com/vi/${firstPreviewLesson.youtubeId}/hqdefault.jpg`)
            } else {
              setThumbSrc('/images/thumbnail-v2.jpg')
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-black/20 to-transparent flex flex-col justify-between p-4">
          <span className="self-start text-[10px] uppercase font-bold tracking-wider bg-blue-900 text-white px-2.5 py-1 shadow-2xs">
            Đã sở hữu khóa học
          </span>
          <div className="flex items-center gap-2 text-white">
            <PlayCircle className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-xs font-bold">Vào phòng học ngay</span>
          </div>
        </div>
      </Link>
    )
  }

  // If there are preview lessons available for guest
  if (firstPreviewLesson) {
    return (
      <div
        onClick={handleOpenPreview}
        className="group relative aspect-video w-full bg-slate-950 border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpenPreview()
          }
        }}
        aria-label="Xem video bài học thử miễn phí"
      >
        <Image
          src={thumbSrc}
          alt={firstPreviewLesson.title || courseTitle}
          fill
          sizes="(max-width: 1280px) 33vw, 384px"
          className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
          onError={() => {
            if (firstPreviewLesson.youtubeId && thumbSrc.includes('maxresdefault')) {
              setThumbSrc(`https://img.youtube.com/vi/${firstPreviewLesson.youtubeId}/hqdefault.jpg`)
            } else {
              setThumbSrc('/images/thumbnail-v2.jpg')
            }
          }}
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Center Floating Play Button with Gentle Breathing / Radar Pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* Gentle Breathing Outer Halo */}
            <div className="absolute -inset-3 rounded-full bg-blue-600/35 animate-pulse" />
            
            {/* Subtle Expanding Radar Ripple */}
            <div
              className="absolute -inset-1.5 rounded-full border border-white/50 animate-ping opacity-30"
              style={{ animationDuration: '2.5s' }}
            />

            {/* Main Play Button - Brand Blue-900 with White Border & White Icon */}
            <div className="relative h-16 w-16 rounded-full bg-blue-900 text-white border-2 border-white shadow-[0_0_20px_rgba(30,58,138,0.7)] flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-800 group-hover:shadow-[0_0_30px_rgba(30,58,138,0.9)] transition-all duration-300">
              <Play className="h-7 w-7 fill-white text-white ml-1 drop-shadow-md" />
            </div>
          </div>
        </div>

        {/* Bottom Bar with Click Indicator */}
        <div className="absolute bottom-0 inset-x-0 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white drop-shadow-sm">
            <span>Bấm để xem video học thử</span>
          </div>
        </div>
      </div>
    )
  }

  // Fallback if no preview lessons exist in course
  return (
    <div className="relative aspect-video w-full bg-slate-100 border border-slate-200 overflow-hidden shadow-xs">
      <Image
        src="/images/thumbnail-v2.jpg"
        alt={courseTitle}
        fill
        sizes="(max-width: 1280px) 33vw, 384px"
        className="object-cover mix-blend-multiply opacity-90"
      />
    </div>
  )
}
