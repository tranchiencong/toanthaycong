import { prisma } from '@/lib/prisma'
import { CourseForm } from '../CourseForm'

export const metadata = {
  title: 'Tạo Khóa Học Mới | Cổng Giáo Viên',
  description: 'Thêm mới khóa học Toán học vào hệ thống.',
}

export default async function NewCoursePage() {
  const [grades, subjects] = await Promise.all([
    prisma.grade.findMany({ orderBy: { orderNum: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <CourseForm
      grades={grades.map((g) => ({ id: g.id, name: g.name }))}
      subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
    />
  )
}
