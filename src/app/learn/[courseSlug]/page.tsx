import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VideoPlayer } from './VideoPlayer'
import { LessonTabs } from './LessonTabs'
import { LessonActionBar } from './LessonActionBar'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CourseLearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseSlug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { courseSlug } = await params
  const resolvedQuery = await searchParams
  const rawLessonParam = typeof resolvedQuery.lesson === 'string' ? resolvedQuery.lesson : undefined

  // 1. Fetch the course and all chapters with lessons ordered by curriculum sequence
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug, isPublished: true },
    include: {
      chapters: {
        orderBy: { orderNum: 'asc' },
        include: {
          lessons: {
            orderBy: { orderNum: 'asc' },
            include: {
              resources: true,
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      role: true,
                      avatarUrl: true,
                    },
                  },
                },
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const allLessons = course.chapters.flatMap((c) =>
    c.lessons.map((l) => ({
      ...l,
      chapterTitle: c.title,
    }))
  )

  if (allLessons.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-center">
        <p className="text-gray-500 text-sm">Khóa học này hiện chưa có bài giảng nào.</p>
      </div>
    )
  }

  // 2. Identify the active lesson based on ?lesson query param or default to first lesson
  let activeLesson = allLessons[0]

  if (rawLessonParam) {
    const num = Number(rawLessonParam)
    if (!isNaN(num)) {
      // Lookup by orderNum (e.g. ?lesson=1, ?lesson=2)
      const foundByOrder = allLessons.find((l) => l.orderNum === num)
      if (foundByOrder) activeLesson = foundByOrder
    } else {
      // Lookup by slug or id
      const foundBySlugOrId = allLessons.find(
        (l) => l.slug === rawLessonParam || l.id === rawLessonParam
      )
      if (foundBySlugOrId) activeLesson = foundBySlugOrId
    }
  }

  // 3. Compute Previous & Next lesson navigation
  const currentIdx = allLessons.findIndex((l) => l.id === activeLesson.id)
  const prevLessonObj = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLessonObj = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  const prevLesson = prevLessonObj
    ? { param: prevLessonObj.orderNum, title: prevLessonObj.title }
    : null
  const nextLesson = nextLessonObj
    ? { param: nextLessonObj.orderNum, title: nextLessonObj.title }
    : null

  // 4. Check enrollment & current student profile
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let isEnrolled = false
  let isCompleted = false
  let currentProfile: { id: string; fullName: string; role: string } | null = null

  if (authUser) {
    const [enrollment, userRecord] = await Promise.all([
      prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: authUser.id,
            courseId: course.id,
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: authUser.id },
        select: { id: true, fullName: true, role: true },
      }),
    ])

    if (enrollment) {
      isEnrolled = true
      isCompleted = enrollment.completedLessons.includes(activeLesson.id)
    }

    if (userRecord) {
      currentProfile = userRecord
    }
  }

  // 5. Block access if lesson is private and user is not enrolled
  if (!isEnrolled && !activeLesson.isPreview) {
    return (
      <div className="relative flex-1 flex items-center justify-center bg-white p-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="relative max-w-md w-full bg-white border border-slate-200/90 p-8 text-center shadow-md">
          <ShieldAlert className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-blue-900 mb-2">Bài học này yêu cầu quyền truy cập</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Bạn cần kích hoạt mã khóa học hoặc đăng ký khóa học để mở khóa toàn bộ bài giảng và tài liệu đính kèm.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/courses/${courseSlug}`}
              className="w-full bg-blue-900 text-white font-bold py-3 text-sm hover:bg-purple-600 transition-colors shadow-xs"
            >
              Kích hoạt / Đăng ký khóa học
            </Link>
            <Link
              href="/dashboard"
              className="text-xs text-slate-500 hover:text-purple-600 transition-colors underline"
            >
              Về trang cá nhân của tôi
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-y-auto min-h-screen">
      {/* Signature Math Caro Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Context Bar / Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${courseSlug}`}
              className="font-semibold text-blue-900 hover:text-purple-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{course.title}</span>
            </Link>
            <span>/</span>
            <span className="text-slate-600 truncate max-w-[200px] sm:max-w-none">
              {activeLesson.chapterTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeLesson.isPreview && !isEnrolled && (
              <span className="bg-purple-50 border border-purple-200 text-purple-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Học thử miễn phí
              </span>
            )}
            <span className="text-slate-400">
              Bài {activeLesson.orderNum} / {allLessons.length}
            </span>
          </div>
        </div>

        {/* Video Player: Cinema Focus Container */}
        <div className="overflow-hidden border border-slate-200 bg-black shadow-md aspect-video w-full mb-5">
          <VideoPlayer youtubeId={activeLesson.youtubeId} title={activeLesson.title} />
        </div>

        {/* Unified Lesson Header: Title & Navigation Toolbar (Chuẩn Coursera / Udemy) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-6 border-b border-slate-200/90">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1.5">
              <span>{activeLesson.chapterTitle}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 font-medium">Bài {activeLesson.orderNum} / {allLessons.length}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-900 tracking-tight leading-snug">
              {activeLesson.title}
            </h1>
          </div>

          {/* Compact Action Toolbar (Bài trước • Hoàn thành • Bài sau) */}
          <div className="shrink-0 self-start sm:self-center">
            <LessonActionBar
              key={activeLesson.id}
              courseSlug={courseSlug}
              lessonId={activeLesson.id}
              initialCompleted={isCompleted}
              isEnrolled={isEnrolled}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
            />
          </div>
        </div>

        {/* Tabs System: Overview, Resources, Q&A, Notes */}
        <LessonTabs
          key={activeLesson.id}
          lesson={{
            id: activeLesson.id,
            title: activeLesson.title,
            slug: activeLesson.slug,
            durationSeconds: activeLesson.durationSeconds,
            isPreview: activeLesson.isPreview,
          }}
          resources={activeLesson.resources}
          comments={activeLesson.comments}
          courseSlug={courseSlug}
          currentUser={currentProfile}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  )
}
