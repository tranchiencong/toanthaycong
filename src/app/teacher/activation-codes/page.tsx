import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { BatchGenerateForm } from './BatchGenerateForm'
import { CodeTableClient } from './CodeTableClient'

export const metadata = {
  title: 'Kho Mã Kích Hoạt | Cổng Giáo Viên',
  description: 'Sinh mã học tập hàng loạt và quản lý danh sách mã kích hoạt.',
}

export default async function ActivationCodesPage() {
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

  const [courses, codes] = await Promise.all([
    prisma.course.findMany({
      where: isTeacher && authUser ? { teacherId: authUser.id } : {},
      select: {
        id: true,
        title: true,
        grade: { select: { name: true } },
      },
      orderBy: { title: 'asc' },
    }),
    prisma.activationCode.findMany({
      where: isTeacher && authUser ? { course: { teacherId: authUser.id } } : {},
      include: {
        course: {
          select: {
            id: true,
            title: true,
            grade: { select: { name: true } },
          },
        },
        usedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kho Mã Kích Hoạt Khóa Học
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sinh mã học tập hàng loạt không giới hạn, sao chép gửi nhanh qua Zalo và theo dõi tiến độ kích hoạt của học viên.
        </p>
      </div>

      {/* Grid: Batch Generator on Left, Code Table on Right/Full */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form: Batch Generator (1 col) */}
        <div className="lg:col-span-1">
          <BatchGenerateForm courses={courses} />
        </div>

        {/* Right Table: All Codes (2 cols) */}
        <div className="lg:col-span-2">
          <CodeTableClient codes={codes} courses={courses} />
        </div>
      </div>
    </div>
  )
}
