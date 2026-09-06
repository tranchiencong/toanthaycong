import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Plus,
  BookOpen,
  Clock,
  Settings,
  ListTree,
  ExternalLink,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Quản Lý Khóa Học | Cổng Giáo Viên',
  description: 'Danh sách và quản lý các khóa học Toán Thầy Công.',
}

export default async function TeacherCoursesPage() {
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

  const courses = await prisma.course.findMany({
    where: isTeacher && authUser ? { teacherId: authUser.id } : {},
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
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Khóa Học & Bài Giảng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xây dựng lộ trình học tập, cập nhật video bài giảng và quản trị tài liệu toán học.
          </p>
        </div>

        <div>
          <Link
            href="/teacher/courses/new"
            className="inline-flex items-center gap-2 bg-blue-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo khóa học mới</span>
          </Link>
        </div>
      </div>

      {/* Courses Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const totalLessons = course.chapters.reduce(
            (acc, ch) => acc + ch._count.lessons,
            0
          )

          return (
            <div
              key={course.id}
              className="bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                {/* Grade & Subject & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-900">
                      {course.grade.name}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700">
                      {course.subject.name}
                    </span>
                  </div>

                  {course.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5">
                      <span>Đã xuất bản</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5">
                      <Clock className="h-3 w-3" />
                      <span>Bản nháp</span>
                    </span>
                  )}
                </div>

                {/* Course Title */}
                <h3 className="font-bold text-slate-900 text-base line-clamp-2" title={course.title}>
                  {course.title}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    <span>{course._count.chapters} chương • {totalLessons} bài</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{course._count.enrollments} học viên</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/teacher/courses/${course.id}/curriculum`}
                  className="inline-flex items-center gap-1.5 font-bold text-blue-900 hover:text-blue-700"
                >
                  <ListTree className="h-3.5 w-3.5" />
                  <span>Quản lý giáo trình</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/teacher/courses/${course.id}/edit`}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                    title="Cấu hình thông tin khóa học"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/learn/${course.slug}?lesson=1`}
                    target="_blank"
                    className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-200 transition-colors"
                    title="Mở phòng học"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
