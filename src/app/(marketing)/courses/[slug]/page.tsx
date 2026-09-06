import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, PlayCircle, Lock, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ActivationForm } from './ActivationForm'
import { JsonLd } from '@/components/seo/JsonLd'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      grade: true,
    },
  })

  if (!course) {
    return {
      title: 'Khóa học không tồn tại',
    }
  }

  const title = `${course.title} - ${course.grade.name}`
  const description =
    course.description && course.description.length > 155
      ? `${course.description.slice(0, 152)}...`
      : course.description || 'Khóa học Toán chất lượng cao cùng Thầy Trần Chiến Công.'

  return {
    title,
    description,
    alternates: {
      canonical: `/courses/${slug}`,
    },
    openGraph: {
      title: `${title} | Toán Thầy Công`,
      description,
      type: 'article',
      url: `/courses/${slug}`,
      images: ['/images/thumbnail-v2.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Toán Thầy Công`,
      description,
      images: ['/images/thumbnail-v2.jpg'],
    },
  }
}

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
  
  let enrollment = null
  if (authData.user) {
    enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: authData.user.id,
          courseId: course.id
        }
      }
    })
  }
  const isEnrolled = !!enrollment

  const allLessons = course.chapters.flatMap((c) => c.lessons)
  const totalLessons = allLessons.length
  const completedIds = new Set(enrollment?.completedLessons || [])
  const completedCount = allLessons.filter((l) => completedIds.has(l.id)).length
  const nextLesson = allLessons.find((l) => !completedIds.has(l.id)) || allLessons[0]
  const nextLessonOrder = nextLesson ? nextLesson.orderNum : 1
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toanthaycong.com'

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || course.title,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Toán Thầy Công',
      sameAs: baseUrl,
    },
    instructor: {
      '@type': 'Person',
      name: course.teacher.fullName,
    },
    inLanguage: 'vi',
    educationalLevel: course.grade.name,
    image: `${baseUrl}/images/thumbnail-v2.jpg`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Khóa học',
        item: `${baseUrl}/courses`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: course.title,
        item: `${baseUrl}/courses/${course.slug}`,
      },
    ],
  }

  return (
    <div className="relative bg-white min-h-screen pb-24 overflow-hidden">
      <JsonLd data={[courseSchema, breadcrumbSchema]} />
      {/* Math Caro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Breadcrumb & Navigation */}
      <div className="relative bg-white/80 backdrop-blur-xs border-b border-slate-200 py-4">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors">
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
              <div className="flex items-center gap-2.5 mb-6">
                <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  {course.grade.name}
                </span>
                <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  {course.subject.name}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 leading-[1.2] tracking-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-3xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-base font-bold text-blue-900">
                    {course.teacher.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Giảng viên</p>
                    <p className="text-sm font-bold text-blue-950">{course.teacher.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Thời lượng</p>
                    <p className="text-sm font-bold text-blue-950">{totalLessons} bài học</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Học viên</p>
                    <p className="text-sm font-bold text-blue-950">{course._count.enrollments} đã học</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2.5">
                <BookOpen className="h-6 w-6 text-purple-600" />
                <span>Nội dung khóa học</span>
              </h2>

              <div className="border border-slate-200 shadow-2xs overflow-hidden">
                {course.chapters.map((chapter, index) => (
                  <div key={chapter.id} className={index !== 0 ? "border-t border-slate-200" : ""}>
                    <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-bold text-blue-950 text-sm">{chapter.title}</h3>
                      <span className="text-xs text-slate-500 font-medium">{chapter.lessons.length} bài học</span>
                    </div>

                    <div className="bg-white divide-y divide-slate-100">
                      {chapter.lessons.map((lesson) => {
                        const isCompleted = completedIds.has(lesson.id)
                        const canPlay = isEnrolled || lesson.isPreview
                        
                        const Content = (
                          <div className={`flex items-center justify-between px-6 py-4 transition-colors ${canPlay ? "hover:bg-purple-50/30 cursor-pointer" : ""}`}>
                            <div className="flex items-center gap-4">
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                              ) : canPlay ? (
                                <PlayCircle className="h-5 w-5 text-purple-600 shrink-0" />
                              ) : (
                                <Lock className="h-5 w-5 text-slate-400 shrink-0" />
                              )}
                              <span className={canPlay ? (isCompleted ? "text-slate-500 font-medium" : "text-slate-900 font-semibold hover:text-blue-900 transition-colors") : "text-slate-400"}>
                                {lesson.title}
                              </span>
                              {isCompleted && (
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5">Đã học</span>
                              )}
                              {lesson.isPreview && !isEnrolled && (
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5">Học thử</span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-slate-500 font-medium">
                              <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                              {Math.floor(lesson.durationSeconds / 60)} phút
                            </div>
                          </div>
                        )

                        return canPlay ? (
                          <Link key={lesson.id} href={`/learn/${course.slug}?lesson=${lesson.orderNum}`} className="block">
                            {Content}
                          </Link>
                        ) : (
                          <div key={lesson.id}>
                            {Content}
                          </div>
                        )
                      })}
                      {chapter.lessons.length === 0 && (
                        <div className="px-6 py-4 text-xs text-slate-400 italic">Chưa có bài học nào.</div>
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
              <div className="relative h-64 w-full bg-slate-100 border border-slate-200 overflow-hidden hidden lg:block shadow-xs">
                <Image
                  src="/images/thumbnail-v2.jpg"
                  alt={course.title}
                  fill
                  sizes="(max-width: 1280px) 33vw, 384px"
                  className="object-cover mix-blend-multiply opacity-90"
                />
              </div>

              {/* Action Box */}
              {isEnrolled ? (
                <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 uppercase tracking-wider">
                      Đã sở hữu khóa học
                    </span>
                    <span className="text-xs font-bold text-blue-900">
                      {progressPercent}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-blue-900">
                      Tiến độ học tập của bạn
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Đã hoàn thành {completedCount}/{totalLessons} bài học
                    </p>
                    
                    {/* Progress Bar with Blue to Purple Gradient */}
                    <div className="mt-3 h-2 w-full bg-slate-100 overflow-hidden rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-900 to-purple-600 transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {nextLesson && (
                    <div className="bg-blue-50/50 border border-blue-100 p-3.5 space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-purple-700 font-bold">
                        {completedCount === 0 ? 'Bắt đầu với bài học' : 'Bài học tiếp theo'}
                      </p>
                      <p className="text-xs font-bold text-blue-950 line-clamp-1">
                        Bài {nextLesson.orderNum}: {nextLesson.title}
                      </p>
                    </div>
                  )}

                  <div className="pt-1 space-y-2.5">
                    <Link 
                      href={`/learn/${course.slug}?lesson=${nextLessonOrder}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-900 text-white font-bold py-3.5 px-4 hover:bg-purple-600 transition-colors shadow-xs"
                    >
                      <span>{completedCount === 0 ? 'Bắt đầu học ngay' : 'Tiếp tục học ngay'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/dashboard"
                      className="w-full inline-flex items-center justify-center text-xs font-medium text-slate-500 hover:text-purple-600 py-1.5 transition-colors"
                    >
                      Quay về không gian học tập
                    </Link>
                  </div>
                </div>
              ) : (
                <ActivationForm 
                  courseId={course.id} 
                  courseSlug={course.slug} 
                  courseTitle={course.title} 
                />
              )}
              
              <div className="bg-white p-6 border border-slate-200 text-sm shadow-2xs">
                <h4 className="font-bold text-blue-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                  <span>Đặc quyền khóa học</span>
                </h4>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-3 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Lộ trình bài bản, bám sát chương trình chuẩn của Bộ Giáo dục</span>
                  </li>
                  <li className="flex items-start gap-3 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Phương pháp dạy tối giản, bản chất, tuyệt đối không học vẹt</span>
                  </li>
                  <li className="flex items-start gap-3 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Đội ngũ trợ giảng chuyên môn cao, hỗ trợ giải đáp bài tập 24/7</span>
                  </li>
                  <li className="flex items-start gap-3 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Truy cập bài giảng vĩnh viễn, xem lại mọi lúc trên máy tính & điện thoại</span>
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
