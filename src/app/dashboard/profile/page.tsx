import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileTabs } from './ProfileTabs'

export const metadata = {
  title: 'Hồ sơ & Tài khoản học viên | Toán Thầy Công',
  description: 'Quản lý thông tin cá nhân, cài đặt bảo mật và khóa học của bạn.',
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?redirect=/dashboard/profile')
  }

  // Fetch full user profile
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              grade: true,
              subject: true,
              chapters: {
                include: {
                  lessons: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
      usedCodes: {
        include: {
          course: {
            select: { title: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const courses = user.enrollments.map((e) => {
    const totalLessons = e.course.chapters.flatMap((c) => c.lessons).length
    const completedCount = e.completedLessons?.length || 0
    return {
      id: e.course.id,
      title: e.course.title,
      slug: e.course.slug,
      gradeName: e.course.grade.name,
      subjectName: e.course.subject.name,
      progress: e.progress,
      totalLessons,
      completedCount,
    }
  })

  const usedCodes = user.usedCodes.map((c) => ({
    id: c.id,
    code: c.code,
    courseTitle: c.course.title,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileTabs
        initialTab={tab || 'profile'}
        user={{
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
          address: user.address,
          bio: user.bio,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        }}
        courses={courses}
        usedCodes={usedCodes}
      />
    </div>
  )
}
