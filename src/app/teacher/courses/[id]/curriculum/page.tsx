import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { CurriculumManager } from '../../CurriculumManager'

export const metadata = {
  title: 'Quản Lý Giáo Trình & Bài Giảng | Cổng Giáo Viên',
  description: 'Thêm, sửa, sắp xếp các chương và bài giảng video YouTube.',
}

export default async function CourseCurriculumPage({
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

  const [course, profile] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { orderNum: 'asc' },
          include: {
            lessons: {
              orderBy: { orderNum: 'asc' },
              include: {
                resources: {
                  orderBy: { createdAt: 'asc' },
                },
              },
            },
          },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true },
    }),
  ])

  if (!course) {
    notFound()
  }

  if (profile?.role !== 'ADMIN' && course.teacherId !== authUser.id) {
    notFound()
  }

  return <CurriculumManager course={course} />
}
