import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { CourseFilters } from './CourseFilters'
import { Prisma } from '@prisma/client'

// Trang này sẽ render dynamic vì nó phụ thuộc vào searchParams
export const dynamic = 'force-dynamic'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const gradeFilter = typeof resolvedParams.grade === 'string' ? resolvedParams.grade : undefined
  const qFilter = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined

  // Xây dựng câu query Prisma động
  const whereClause: Prisma.CourseWhereInput = {
    isPublished: true,
  }

  if (gradeFilter) {
    whereClause.gradeId = gradeFilter
  }

  if (qFilter) {
    whereClause.title = {
      contains: qFilter,
      mode: 'insensitive',
    }
  }

  // Lấy danh sách khóa học và khối lớp song song để tối ưu tốc độ
  const [courses, grades] = await Promise.all([
    prisma.course.findMany({
      where: whereClause,
      include: {
        grade: true,
        teacher: true,
        _count: {
          select: { chapters: true, enrollments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.grade.findMany({
      orderBy: { orderNum: 'asc' }
    })
  ])

  const hueRotates = ['', 'hue-rotate-90', 'hue-rotate-180', 'hue-rotate-60']

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Link href="/" className="hover:text-blue-900 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Khóa học</span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cột trái: Bộ lọc (Sidebar) */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 bg-white p-6 border border-gray-200 shadow-sm">
              <CourseFilters grades={grades} />
            </div>
          </div>

          {/* Cột phải: Lưới danh sách khóa học */}
          <div className="flex-1">
            {/* Thanh công cụ Sorting (Giả lập) */}
            <div className="flex items-center justify-between bg-white p-4 border border-gray-200 mb-6 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                Hiển thị <span className="font-bold text-blue-900">{courses.length}</span> khóa học
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Sắp xếp theo:
                <select className="border-none bg-transparent font-medium text-gray-900 focus:ring-0 cursor-pointer outline-none">
                  <option>Mới nhất</option>
                  <option>Học viên nhiều nhất</option>
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course, index) => {
                const hueClass = hueRotates[index % hueRotates.length]
                
                return (
                  <Link href={`/courses/${course.slug}`} key={course.id} className="group bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-sm overflow-hidden block">
                    <div className="relative h-56 w-full bg-slate-100 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                      <Image
                        src="/images/thumbnail-v2.jpg"
                        alt={course.title}
                        fill
                        className={`object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700 ${hueClass}`}
                      />
                      <div className="absolute top-4 left-4 bg-white px-2 py-1 text-xs font-bold text-blue-900 tracking-widest border border-gray-200 shadow-sm">
                        {course.grade.name.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 font-light line-clamp-2 leading-relaxed flex-1">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{course._count.chapters} Chương</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-bold">
                              {course.teacher.fullName.charAt(0)}
                            </span>
                            <span>{course.teacher.fullName}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {courses.length === 0 && (
              <div className="bg-white border border-gray-200 p-12 text-center shadow-sm">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h3>
                <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
