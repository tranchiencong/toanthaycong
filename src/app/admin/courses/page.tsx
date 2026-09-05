import { prisma } from '@/lib/prisma'
import { AdminCoursesClient } from './AdminCoursesClient'

export const metadata = {
  title: 'Quản Trị Khóa Học Toàn Hệ Thống | Cổng Quản Trị',
  description: 'Kiểm soát, xuất bản và điều phối toàn bộ khóa học trong hệ thống.',
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      teacher: {
        select: { fullName: true, email: true },
      },
      grade: {
        select: { name: true },
      },
      subject: {
        select: { name: true },
      },
      _count: {
        select: {
          enrollments: true,
          chapters: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Quản Trị Khóa Học Toàn Hệ Thống
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Bật/tắt trạng thái xuất bản ra trang chủ, theo dõi số lượng học viên và truy cập thẳng vào soạn giáo trình.
        </p>
      </div>

      {/* Courses Client Table */}
      <AdminCoursesClient courses={courses} />
    </div>
  )
}
