import { prisma } from '@/lib/prisma'
import { StudentTableClient } from './StudentTableClient'

export const metadata = {
  title: 'CRM Dữ Liệu Học Sinh | Cổng Quản Trị',
  description: 'Quản lý thông tin học sinh, lọc độ tuổi thi tốt nghiệp và hỗ trợ Telesale tuyển sinh.',
}

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams

  const [students, allCourses] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        enrollments: {
          include: {
            course: {
              select: { id: true, title: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    }),
  ])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          CRM Dữ Liệu Học Sinh & Telesale
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Lọc học sinh theo năm sinh (ôn thi 10, 11, 12), tỉnh thành, gọi điện tư vấn và xuất file Excel bàn giao tuyển sinh.
        </p>
      </div>

      {/* CRM Student Table */}
      <StudentTableClient students={students} allCourses={allCourses} initialFilter={filter} />
    </div>
  )
}
