import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  Key,
  ArrowRight,
  Phone,
  Shield,
  BookOpen,
} from 'lucide-react'

export const metadata = {
  title: 'Bảng Điều Khiển Quản Trị | Toán Thầy Công',
  description: 'Tổng quan chỉ số tăng trưởng, CRM học sinh và quản lý phân quyền.',
}

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAdmins,
    enrolledStudentsCount,
    totalCourses,
    totalCodes,
    usedCodes,
    recentStudents,
    topCourses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    // Count distinct students who have at least one enrollment
    prisma.enrollment
      .groupBy({
        by: ['studentId'],
      })
      .then((res) => res.length),
    prisma.course.count(),
    prisma.activationCode.count(),
    prisma.activationCode.count({ where: { isUsed: true } }),
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.course.findMany({
      include: {
        grade: true,
        _count: { select: { enrollments: true, activationCodes: true } },
      },
      orderBy: { enrollments: { _count: 'desc' } },
      take: 5,
    }),
  ])

  const leadStudentsCount = totalStudents - enrolledStudentsCount
  const conversionRate =
    totalStudents > 0
      ? Math.round((enrolledStudentsCount / totalStudents) * 100)
      : 0

  return (
    <div className="space-y-5">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tổng quan Vận hành & Tuyển sinh
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tỷ lệ chuyển đổi học viên, tệp khách hàng tiềm năng và quản trị phân quyền.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/students?filter=LEADS"
            className="inline-flex items-center gap-1.5 border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all shadow-2xs"
          >
            <Phone className="h-3.5 w-3.5 text-amber-700" />
            <span>Gọi Leads ({leadStudentsCount})</span>
          </Link>

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Shield className="h-3.5 w-3.5 text-slate-600" />
            <span>Phân quyền</span>
          </Link>

          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-all shadow-2xs"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Bảng CRM Học sinh</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row: 4 Essential KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Students */}
        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tổng số học sinh
            </span>
            <div className="p-1.5 bg-blue-50 text-blue-900">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900">{totalStudents}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Tổng tài khoản: {totalUsers} ({totalTeachers} GV • {totalAdmins} Admin)
          </p>
        </div>

        {/* Active Enrolled Learners */}
        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Đã sở hữu khóa học
            </span>
            <div className="p-1.5 bg-emerald-50 text-emerald-800">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-emerald-900">
            {enrolledStudentsCount}
          </div>
          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
            Học viên chính thức đang học bài
          </p>
        </div>

        {/* Leads: Registered without course */}
        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Leads cần tư vấn
            </span>
            <div className="p-1.5 bg-amber-50 text-amber-800">
              <UserPlus className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-amber-900">
            {leadStudentsCount}
          </div>
          <p className="text-[10px] text-amber-700 font-medium mt-0.5">
            Đã đăng ký nhưng chưa kích hoạt khóa
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tỷ lệ kích hoạt (CR)
            </span>
            <div className="p-1.5 bg-purple-50 text-purple-900">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">{conversionRate}%</span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({usedCodes}/{totalCodes} mã)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Quy mô {totalCourses} khóa học hệ thống
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Registrations (Leads) & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left: Recent Students / Leads (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-900" />
              <span>Học sinh đăng ký gần đây</span>
            </h2>
            <Link
              href="/admin/students"
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
            >
              <span>Xem CRM đầy đủ</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3.5">Học sinh</th>
                    <th className="py-2.5 px-3">Số điện thoại</th>
                    <th className="py-2.5 px-3">Năm sinh</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3.5 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents.map((st) => {
                    const isEnrolled = st._count.enrollments > 0
                    const birthYear = st.dateOfBirth
                      ? new Date(st.dateOfBirth).getFullYear()
                      : null

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                          <div>{st.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            {st.email}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                          {st.phone || <span className="text-slate-400 italic">Chưa có</span>}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                          {birthYear ? (
                            <span className="bg-slate-100 px-1.5 py-0.5 font-semibold">
                              {birthYear}
                            </span>
                          ) : (
                            <span className="text-slate-400">--</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {isEnrolled ? (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                              Đã có khóa học ({st._count.enrollments})
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5">
                              Chưa có khóa (Lead)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                          {st.phone ? (
                            <a
                              href={`tel:${st.phone}`}
                              className="inline-flex items-center gap-1 text-blue-900 hover:underline font-semibold"
                              title="Gọi tư vấn ngay"
                            >
                              <Phone className="h-3 w-3" />
                              <span>Gọi ngay</span>
                            </a>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Top Courses (1 col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-900" />
              <span>Khóa học nổi bật</span>
            </h2>
            <Link
              href="/teacher/courses"
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              Quản lý
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 p-3.5 shadow-2xs space-y-2.5">
            {topCourses.map((c) => (
              <div
                key={c.id}
                className="p-2.5 border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-900 px-1.5 py-0.2">
                    {c.grade.name}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {c._count.enrollments} học viên
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1 truncate" title={c.title}>
                  {c.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Key className="h-3 w-3" />
                  <span>{c._count.activationCodes} mã thẻ đã tạo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
