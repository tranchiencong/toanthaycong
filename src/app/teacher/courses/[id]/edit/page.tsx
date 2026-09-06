import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
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

  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?redirect=/teacher')
  }

  const [course, profile, grades, subjects] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
    }),
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true },
    }),
    prisma.grade.findMany({ orderBy: { orderNum: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!course) {
    notFound()
  }

  if (profile?.role !== 'ADMIN' && course.teacherId !== authUser.id) {
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
