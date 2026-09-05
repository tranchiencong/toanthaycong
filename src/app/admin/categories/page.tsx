import { prisma } from '@/lib/prisma'
import { GradeManagerClient } from './GradeManagerClient'
import { SubjectManagerClient } from './SubjectManagerClient'

export const metadata = {
  title: 'Quản Lý Khối Lớp & Môn Học | Cổng Quản Trị',
  description: 'Thêm, sửa, xóa các khối lớp và danh mục phân môn trong hệ thống.',
}

export default async function AdminCategoriesPage() {
  const [grades, subjects] = await Promise.all([
    prisma.grade.findMany({
      orderBy: { orderNum: 'asc' },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    }),
    prisma.subject.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    }),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Quản Lý Khối Lớp & Môn Học
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tạo thêm khối lớp mới (ví dụ: Lớp 6, Lớp 7, Ôn thi ĐGNL) hoặc phân môn để mở rộng hệ thống khóa học.
        </p>
      </div>

      {/* 2 Management Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <GradeManagerClient grades={grades} />
        <SubjectManagerClient subjects={subjects} />
      </div>
    </div>
  )
}
