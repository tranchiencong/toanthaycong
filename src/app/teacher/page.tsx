import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  BookOpen,
  Key,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  const profile = authUser
    ? await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true },
      })
    : null

  const isTeacher = profile?.role === 'TEACHER'
  const courseFilter = isTeacher && authUser ? { teacherId: authUser.id } : {}
  const codeFilter = isTeacher && authUser ? { course: { teacherId: authUser.id } } : {}
  const lessonFilter = isTeacher && authUser ? { chapter: { course: { teacherId: authUser.id } } } : {}
  const enrollmentFilter = isTeacher && authUser ? { course: { teacherId: authUser.id } } : {}

  const [
    totalCourses,
    totalLessons,
    totalEnrollments,
    totalCodes,
    usedCodes,
    courses,
    recentActivations,
  ] = await Promise.all([
    prisma.course.count({ where: courseFilter }),
    prisma.lesson.count({ where: lessonFilter }),
    prisma.enrollment.count({ where: enrollmentFilter }),
    prisma.activationCode.count({ where: codeFilter }),
    prisma.activationCode.count({ where: { ...codeFilter, isUsed: true } }),
    prisma.course.findMany({
      where: courseFilter,
      include: {
        grade: true,
        subject: true,
        _count: {
          select: { chapters: true, enrollments: true, activationCodes: true },
        },
        chapters: {
          include: {
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
    prisma.activationCode.findMany({
      where: { ...codeFilter, isUsed: true },
      include: {
        course: { select: { title: true, slug: true } },
        usedBy: { select: { fullName: true, email: true, phone: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])

  const availableCodes = totalCodes - usedCodes

  return (
    <div className="space-y-5">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tổng quan Giảng dạy & Quản trị
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chào mừng Thầy Công! Theo dõi và quản lý toàn diện các chuyên đề Toán học.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/teacher/activation-codes"
            className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Key className="h-3.5 w-3.5 text-slate-600" />
            <span>Tạo mã kích hoạt</span>
          </Link>

          <Link
            href="/teacher/courses/new"
            className="inline-flex items-center gap-1.5 bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-all shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm khóa học mới</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khóa học quản lý</span>
            
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900">{totalCourses}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Đang hoạt động trên hệ thống</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số bài giảng</span>
           
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900">{totalLessons}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Video bài giảng chất lượng cao</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Học sinh đăng ký</span>
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900">{totalEnrollments}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Lượt tham gia học thực tế</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kho mã kích hoạt</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">{totalCodes}</span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({availableCodes} mã còn lại)
            </span>
          </div>
          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
            Đã kích hoạt: {usedCodes} mã
          </p>
        </div>
      </div>

      {/* Main Grid: Courses Table & Recent Activations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left: Courses List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-900" />
              <span>Khóa học gần đây</span>
            </h2>
            <Link
              href="/teacher/courses"
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Tên khóa học</th>
                    <th className="py-3 px-3">Khối lớp</th>
                    <th className="py-3 px-3">Quy mô</th>
                    <th className="py-3 px-3">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => {
                    const totalCourseLessons = course.chapters.reduce(
                      (acc, ch) => acc + ch._count.lessons,
                      0
                    )

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          <div className="max-w-[240px] truncate" title={course.title}>
                            {course.title}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {course.grade.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                          {course._count.chapters} chương • {totalCourseLessons} bài
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {course.isPublished ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Đã xuất bản</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Bản nháp</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right space-x-2 whitespace-nowrap">
                          <Link
                            href={`/teacher/courses/${course.id}/curriculum`}
                            className="font-semibold text-blue-900 hover:underline"
                          >
                            Giáo trình
                          </Link>
                          <span className="text-slate-300">|</span>
                          <Link
                            href={`/learn/${course.slug}?lesson=1`}
                            target="_blank"
                            className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-0.5"
                            title="Mở phòng học thử nghiệm"
                          >
                            <span>Xem</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Recent Activations (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-700" />
              <span>Học sinh kích hoạt gần đây</span>
            </h2>
            <Link
              href="/teacher/activation-codes"
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              Xem kho mã
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 shadow-xs space-y-3">
            {recentActivations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Chưa có mã kích hoạt nào được sử dụng.
              </div>
            ) : (
              recentActivations.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-950">
                      {item.code}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.updatedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 mt-1">
                    {item.usedBy?.fullName || 'Học viên'}
                    {item.usedBy?.phone && (
                      <span className="text-slate-500 font-normal ml-1">
                        ({item.usedBy.phone})
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.course.title}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
