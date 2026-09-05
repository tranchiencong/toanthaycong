import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { CourseFilters } from './CourseFilters'
type CourseWhereInput = NonNullable<Parameters<typeof prisma.course.findMany>[0]>['where']

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
  const whereClause: CourseWhereInput = {
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
    <div className="relative min-h-screen pb-24 pt-8 bg-white overflow-hidden">
      {/* Math Caro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Link href="/" className="hover:text-purple-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-blue-900 font-semibold">Khóa học</span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cột trái: Bộ lọc (Sidebar) */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 bg-white p-6 border border-slate-200/90 shadow-2xs">
              <CourseFilters grades={grades} />
            </div>
          </div>

          {/* Cột phải: Lưới danh sách khóa học */}
          <div className="flex-1">
            {/* Thanh công cụ Sorting */}
            <div className="flex items-center justify-between bg-white p-4 border border-slate-200/90 mb-6 shadow-2xs">
              <span className="text-sm font-medium text-slate-600">
                Hiển thị <span className="font-bold text-blue-900">{courses.length}</span> khóa học
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                Sắp xếp theo:
                <select className="border-none bg-transparent font-semibold text-blue-900 focus:ring-0 cursor-pointer outline-none">
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
                  <Link href={`/courses/${course.slug}`} key={course.id} className="group bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full overflow-hidden block">
                    <div className="relative h-56 w-full bg-slate-100 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                      <Image
                        src="/images/thumbnail-v2.jpg"
                        alt={course.title}
                        fill
                        className={`object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700 ${hueClass}`}
                      />
                      <div className="absolute top-4 left-4 bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 text-xs font-bold tracking-wider shadow-xs uppercase">
                        {course.grade.name}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-extrabold text-blue-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-6 font-normal line-clamp-2 leading-relaxed flex-1">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5 font-medium">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                            <span>{course._count.chapters} Chương</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="h-5 w-5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center text-[10px] font-bold">
                              {course.teacher.fullName.charAt(0)}
                            </span>
                            <span>{course.teacher.fullName}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {courses.length === 0 && (
              <div className="bg-white border border-slate-200/90 p-12 text-center shadow-2xs">
                <div className="mx-auto w-16 h-16 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Không tìm thấy khóa học</h3>
                <p className="text-slate-500 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
