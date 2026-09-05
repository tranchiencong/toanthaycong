import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CourseForm } from '../../CourseForm'

export const metadata = {
  title: 'Chỉnh Sửa Khóa Học | Cổng Giáo Viên',
  description: 'Cập nhật thông tin chi tiết khóa học.',
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [course, grades, subjects] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
    }),
    prisma.grade.findMany({ orderBy: { orderNum: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!course) {
    notFound()
  }

  return (
    <CourseForm
      initialData={{
        id: course.id,
        title: course.title,
        gradeId: course.gradeId,
        subjectId: course.subjectId,
        description: course.description,
        isPublished: course.isPublished,
      }}
      grades={grades.map((g) => ({ id: g.id, name: g.name }))}
      subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
    />
  )
}
