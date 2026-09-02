import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, PlayCircle, Lock, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ActivationForm } from './ActivationForm'

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const course = await prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      teacher: true,
      grade: true,
      subject: true,
      chapters: {
        orderBy: { orderNum: 'asc' },
        include: {
          lessons: {
            orderBy: { orderNum: 'asc' }
          }
        }
      },
      _count: {
        select: { enrollments: true }
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
  if (authData.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: authData.user.id,
          courseId: course.id
        }
      }
    })
    isEnrolled = !!enrollment
  }

  const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumb & Navigation */}
      <div className="bg-slate-50 border-b border-gray-200 py-4">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Header */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-gray-100 text-black px-3 py-1 text-xs font-bold uppercase tracking-widest border border-gray-200">
                  {course.grade.name}
                </span>
                <span className="bg-gray-100 text-black px-3 py-1 text-xs font-bold uppercase tracking-widest border border-gray-200">
                  {course.subject.name}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-[1.2]">
                {course.title}
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-black">
                    {course.teacher.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Giảng viên</p>
                    <p className="text-sm font-bold text-gray-900">{course.teacher.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center text-gray-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Thời lượng</p>
                    <p className="text-sm font-bold text-gray-900">{totalLessons} bài học</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center text-gray-500">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Học viên</p>
                    <p className="text-sm font-bold text-gray-900">{course._count.enrollments} đã học</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Nội dung khóa học</h2>
              <div className="border border-gray-200">
                {course.chapters.map((chapter, index) => (
                  <div key={chapter.id} className={index !== 0 ? "border-t border-gray-200" : ""}>
                    <div className="bg-slate-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">{chapter.title}</h3>
                    </div>
                    <div className="bg-white">
                      {chapter.lessons.map((lesson, lIndex) => {
                        const canPlay = isEnrolled || lesson.isPreview
                        
                        const Content = (
                          <div className={`flex items-center justify-between px-6 py-4 ${lIndex !== chapter.lessons.length - 1 ? "border-b border-gray-100" : ""} ${canPlay ? "hover:bg-slate-50 transition-colors" : ""}`}>
                            <div className="flex items-center gap-4">
                              {canPlay ? (
                                <PlayCircle className="h-5 w-5 text-black shrink-0" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400 shrink-0" />
                              )}
                              <span className={canPlay ? "text-gray-900 font-medium" : "text-gray-500"}>
                                {lesson.title}
                              </span>
                              {lesson.isPreview && !isEnrolled && (
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-sm">Học thử</span>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {Math.floor(lesson.durationSeconds / 60)} phút
                            </div>
                          </div>
                        )

                        return canPlay ? (
                          <Link key={lesson.id} href={`/learn/${course.slug}/${lesson.slug}`} className="block">
                            {Content}
                          </Link>
                        ) : (
                          <div key={lesson.id}>
                            {Content}
                          </div>
                        )
                      })}
                      {chapter.lessons.length === 0 && (
                        <div className="px-6 py-4 text-sm text-gray-500 italic">Chưa có bài học nào.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (Right Column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Course Image */}
              <div className="relative h-64 w-full bg-slate-100 border border-gray-200 overflow-hidden hidden lg:block">
                <Image
                  src="/images/thumbnail-v2.jpg"
                  alt={course.title}
                  fill
                  className="object-cover mix-blend-multiply opacity-90"
                />
              </div>

              {/* Action Box */}
              {isEnrolled ? (
                <div className="bg-black p-8 border border-black text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Đã kích hoạt khóa học</h3>
                  <p className="text-gray-300 text-sm mb-6">Bạn đã sẵn sàng để bắt đầu lộ trình chinh phục điểm số.</p>
                  <Link 
                    href={`/learn/${course.slug}/${course.chapters[0]?.lessons[0]?.slug || ''}`}
                    className="block w-full bg-black text-white font-bold py-4 px-6 hover:bg-gray-800 transition-colors"
                  >
                    Vào học ngay
                  </Link>
                </div>
              ) : (
                <ActivationForm courseId={course.id} />
              )}
              
              <div className="bg-slate-50 p-6 border border-gray-200 text-sm text-gray-600">
                <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Đặc quyền khóa học</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lộ trình bài bản, bám sát chương trình chuẩn của Bộ Giáo dục</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Phương pháp dạy tối giản, dễ hiểu, tuyệt đối không học vẹt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Đội ngũ trợ giảng chuyên môn cao, hỗ trợ giải đáp 24/7</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Truy cập bài giảng vĩnh viễn, xem lại bất cứ lúc nào</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
