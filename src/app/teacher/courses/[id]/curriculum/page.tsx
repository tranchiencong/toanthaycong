import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
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

  const course = await prisma.course.findUnique({
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
  })

  if (!course) {
    notFound()
  }

  return <CurriculumManager course={course} />
}
