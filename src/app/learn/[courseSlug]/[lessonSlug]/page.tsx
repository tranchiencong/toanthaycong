import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VideoPlayer } from './VideoPlayer'
import { MessageSquare, FileText, Download, PlayCircle } from 'lucide-react'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>
}) {
  const { courseSlug, lessonSlug } = await params
  
  // Find the lesson and verify it belongs to the course
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      chapter: {
        course: {
          slug: courseSlug,
          isPublished: true
        }
      }
    },
    include: {
      resources: true,
      chapter: {
        include: {
          course: true
        }
      }
    }
  })

  if (!lesson) {
    notFound()
  }

  // Check enrollment
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  let isEnrolled = false
  if (authData.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: authData.user.id,
          courseId: lesson.chapter.course.id
        }
      }
    })
    isEnrolled = !!enrollment
  }

  // If not enrolled and not preview, block access
  if (!isEnrolled && !lesson.isPreview) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md w-full bg-white border border-gray-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-4">Nội dung bị khóa</h2>
          <p className="text-gray-600 mb-6">
            Bài học này yêu cầu bạn phải kích hoạt khóa học mới có thể xem được.
          </p>
          <a href={`/courses/${courseSlug}`} className="inline-block bg-blue-900 text-white font-bold py-3 px-6 hover:bg-blue-800 transition-colors">
            Quay lại trang khóa học
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        {/* Breadcrumb / Status */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
          <span className="text-black font-bold bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wider border border-gray-200">Đang học</span>
          <span className="hidden sm:inline">{lesson.chapter.title}</span>
          <span className="hidden sm:inline text-gray-300">/</span>
          <span className="text-gray-900 truncate">{lesson.title}</span>
        </div>

        {/* Video Player */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-sm aspect-video w-full mb-8">
          <VideoPlayer youtubeId={lesson.youtubeId} title={lesson.title} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 leading-tight">
          {lesson.title}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info & Discussion */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-gray-200 rounded-xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                Hỏi đáp & Thảo luận
              </h3>
              <div className="bg-slate-50 border border-gray-100 p-8 text-center rounded-lg">
                <p className="text-gray-500 text-sm mb-4">
                  Khu vực thảo luận sẽ được mở sau khi bạn hoàn thành bài học này.
                </p>
                <button disabled className="bg-gray-200 text-gray-400 font-bold py-2.5 px-6 rounded-lg text-sm cursor-not-allowed">
                  Gửi câu hỏi
                </button>
              </div>
            </div>
          </div>

          {/* Resources Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-xl p-6 bg-slate-50/50">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <FileText className="h-5 w-5 text-black" />
                Tài liệu đính kèm
              </h3>
              
              {lesson.resources && lesson.resources.length > 0 ? (
                <ul className="space-y-3">
                  {lesson.resources.map(res => (
                    <li key={res.id}>
                      <a 
                        href={res.externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-black group"
                      >
                        <div className="bg-gray-100 p-2 rounded-md text-black shrink-0 group-hover:bg-blue-100 transition-colors">
                          <Download className="h-4 w-4" />
                        </div>
                        <span className="line-clamp-2">{res.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-6 border border-dashed border-gray-200 rounded-lg bg-white">
                  <p className="text-sm text-gray-500">
                    Chưa có tài liệu
                  </p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
