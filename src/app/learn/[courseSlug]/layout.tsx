import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CurriculumSidebar } from './CurriculumSidebar'

export const dynamic = 'force-dynamic'

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ courseSlug: string }>
}) {
  const { courseSlug } = await params

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug, isPublished: true },
    include: {
      chapters: {
        orderBy: { orderNum: 'asc' },
        include: {
          lessons: {
            orderBy: { orderNum: 'asc' },
            select: {
              id: true,
              title: true,
              slug: true,
              orderNum: true,
              isPreview: true,
              durationSeconds: true,
            },
          },
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  // Check enrollment & completed lessons
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let isEnrolled = false
  let completedLessons: string[] = []

  if (authUser) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: authUser.id,
          courseId: course.id,
        },
      },
      select: {
        completedLessons: true,
      },
    })

    if (enrollment) {
      isEnrolled = true
      completedLessons = enrollment.completedLessons
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar Curriculum (Clean, White, Responsive, Collapsible) */}
      <CurriculumSidebar
        course={{
          id: course.id,
          title: course.title,
          slug: course.slug,
          chapters: course.chapters,
        }}
        isEnrolled={isEnrolled}
        completedLessons={completedLessons}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
