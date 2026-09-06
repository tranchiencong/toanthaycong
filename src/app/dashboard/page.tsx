import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  PlayCircle,
  ArrowRight,
  Layers,
  User as UserIcon,
} from 'lucide-react'
import { DashboardActivationCard } from './DashboardActivationCard'

export const metadata = {
  title: 'Không gian học tập | Toán Thầy Công',
  description: 'Theo dõi tiến độ học tập và các chuyên đề Toán của bạn.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  // Fetch enrolled courses with curriculum details
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: authUser.id },
    include: {
      course: {
        include: {
          grade: true,
          subject: true,
          chapters: {
            orderBy: { orderNum: 'asc' },
            include: {
              lessons: {
                orderBy: { orderNum: 'asc' },
              },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Fetch recommended courses if student has no or few courses
  const recommendedCourses =
    enrollments.length === 0
      ? await prisma.course.findMany({
          where: { isPublished: true },
          take: 3,
          include: {
            grade: true,
            subject: true,
            _count: { select: { chapters: true } },
          },
          orderBy: { createdAt: 'desc' },
        })
      : []

  // Stats calculation
  const totalCourses = enrollments.length
  const totalCompletedLessons = enrollments.reduce(
    (acc, curr) => acc + (curr.completedLessons?.length || 0),
    0
  )
  const averageProgress =
    totalCourses > 0
      ? Math.round(
          enrollments.reduce((acc, curr) => acc + curr.progress, 0) / totalCourses
        )
      : 0

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
         
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Chào mừng trở lại, {user?.fullName || 'Học viên'}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Học tập kiên trì mỗi ngày là chìa khóa để đạt điểm 9+ môn Toán. Hãy tiếp tục hoàn thành bài giảng hôm nay nhé!
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white border border-white/15 backdrop-blur-md transition-colors shadow-xs"
            >
              <UserIcon className="h-3.5 w-3.5 text-blue-200" />
              <span>Hồ sơ cá nhân</span>
            </Link>
          </div>
        </div>

        {/* Decorative background geometry */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-900 font-bold">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {totalCourses}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Khóa học đã sở hữu
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {totalCompletedLessons}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Bài học đã hoàn thành
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {averageProgress}%
            </div>
            <div className="text-xs font-medium text-slate-500">
              Tiến độ trung bình
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: My Courses & Activation Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: My Courses (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-900" />
              <span>Khóa học của tôi</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {totalCourses}
              </span>
            </h2>
            <Link
              href="/courses"
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Xem tất cả khóa học</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* If student has enrolled courses */}
          {enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const course = enrollment.course
                const allLessons = course.chapters.flatMap((c) => c.lessons)
                const totalLessons = allLessons.length
                const completedCount = enrollment.completedLessons?.length || 0

                // Find next lesson to continue
                const nextLesson =
                  allLessons.find(
                    (l) => !enrollment.completedLessons?.includes(l.id)
                  ) || allLessons[0]

                const continueUrl = nextLesson
                  ? `/learn/${course.slug}?lesson=${nextLesson.orderNum}`
                  : `/learn/${course.slug}`

                return (
                  <div
                    key={enrollment.id}
                    className="group rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-900">
                          {course.grade.name}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-900">
                          {course.subject.name}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900 transition-colors line-clamp-1">
                        {course.title}
                      </h3>

                      {/* Progress bar */}
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>
                            Tiến độ: {completedCount}/{totalLessons} bài học
                          </span>
                          <span className="font-bold text-slate-900">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                            style={{ width: `${Math.min(enrollment.progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      <Link
                        href={continueUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-all group-hover:shadow-md"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Tiếp tục học</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center space-y-4">
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900">
                  Bạn chưa đăng ký khóa học nào
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Nếu bạn đã có mã kích hoạt từ Thầy Công, hãy nhập mã ở cột bên phải để mở khóa ngay bài giảng của mình!
                </p>
              </div>

              {/* Recommended Courses preview */}
              {recommendedCourses.length > 0 && (
                <div className="pt-4 border-t border-slate-100 text-left">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Các khóa học trọng tâm dành cho bạn:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {recommendedCourses.map((c) => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.slug}`}
                        className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-[10px] font-bold text-blue-900 mb-1">
                            {c.grade.name}
                          </div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-2">
                            {c.title}
                          </div>
                        </div>
                        <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <span>Chi tiết</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm"
                >
                  <span>Khám phá khóa học </span> <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Activation Sidebar (1 col on lg) */}
        <div className="space-y-6">
          <DashboardActivationCard />

          {/* Student Support Contact Card */}
          <div className="rounded-2xl bg-purple-900 p-6 text-white shadow-sm space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <span>Hỗ trợ học tập 24/7</span>
            </h3>
            <p className="text-xs text-blue-200/90 leading-relaxed">
              Bạn gặp khó khăn trong quá trình học hoặc cần giải đáp bài toán khó? Đội ngũ trợ giảng luôn sẵn sàng đồng hành cùng bạn.
            </p>
            <div className="pt-2">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-bold text-white transition-colors"
              >
                <span>Nhắn tin Zalo trực tiếp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
