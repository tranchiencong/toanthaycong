import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, CheckCircle2, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

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
            orderBy: { orderNum: 'asc' }
          }
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  // Check enrollment
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  let isEnrolled = false
  let completedLessons: string[] = []

  if (authData.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: authData.user.id,
          courseId: course.id
        }
      }
    })
    
    if (enrollment) {
      isEnrolled = true
      completedLessons = enrollment.completedLessons
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar Curriculum */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-slate-50 shrink-0">
        <div className="p-4 border-b border-gray-200 bg-white">
          <Link href={`/courses/${course.slug}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang khóa học
          </Link>
          <h2 className="font-bold text-black line-clamp-2">{course.title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="border-b border-gray-200 last:border-b-0">
              <div className="bg-slate-100/50 px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">{chapter.title}</h3>
              </div>
              <div>
                {chapter.lessons.map((lesson) => {
                  const canPlay = isEnrolled || lesson.isPreview
                  const isCompleted = completedLessons.includes(lesson.id)

                  return (
                    <Link
                      key={lesson.id}
                      href={canPlay ? `/learn/${course.slug}/${lesson.slug}` : '#'}
                      className={`block px-4 py-3 text-sm border-b border-gray-50 last:border-b-0 transition-colors ${
                        canPlay ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {!canPlay ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-black" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`line-clamp-2 ${canPlay ? 'text-gray-900' : 'text-gray-500'}`}>
                            {lesson.title}
                          </p>
                          {lesson.isPreview && !isEnrolled && (
                            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm">
                              Học thử
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
