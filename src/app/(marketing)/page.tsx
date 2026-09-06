import Image from 'next/image'
import Link from 'next/link'
import { PlayCircle, ShieldCheck, Zap, Users, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function Home() {
  const featuredCourses = await prisma.course.findMany({
    where: { isPublished: true },
    take: 3,
    include: {
      grade: true,
      _count: { select: { enrollments: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  const hueRotates = ['', 'hue-rotate-90', 'hue-rotate-180']

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 lg:pt-32 pb-24 border-b border-gray-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="flex h-1.5 w-1.5 bg-purple-600 motion-safe:animate-pulse"></span>
                500+ Học Sinh
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-blue-900 leading-[1.2] mb-6 tracking-tight">
                Toán Thầy Công. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 font-extrabold">Chinh phục điểm 9+</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
                Học Toán bằng bản chất, không giải mẹo, không học vẹt. Lộ trình đào tạo chuyên sâu giúp học sinh THCS & THPT xây dựng tư duy logic vững chắc và bứt phá điểm số trong mọi kỳ thi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses" className="inline-flex items-center justify-center gap-2 bg-blue-900 px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2">
                  Khám phá khóa học
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#features" className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-blue-950 transition-colors hover:bg-purple-50/50 hover:border-purple-200 hover:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2">
                  <PlayCircle className="h-4 w-4 text-purple-600" />
                  Phương pháp
                </Link>
              </div>
            </div>
            <div className="relative lg:h-[580px] flex items-center justify-center lg:justify-end">
              {/* Ethereal Ambient Glow matching the purple/blue theme */}
              <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-tr from-purple-600/25 via-indigo-500/15 to-blue-600/20 rounded-[3rem] blur-3xl -z-10 pointer-events-none" />

              {/* Decorative Math Elements in background */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border border-purple-100 flex items-center justify-center text-purple-600 font-serif font-bold text-lg pointer-events-none hidden sm:flex">
                ∑
              </div>
              <div className="absolute -bottom-8 right-16 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md shadow-md border border-blue-100 flex items-center justify-center text-blue-700 font-serif font-bold text-sm pointer-events-none hidden sm:flex">
                π
              </div>

              {/* Main Card Container with Premium Rounded Border and Shadow */}
              <div className="relative w-full max-w-md sm:max-w-lg aspect-square rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-900/15 ring-1 ring-slate-900/5 bg-gradient-to-tr from-purple-900 to-indigo-900">
                <Image
                  src="/images/hero-v3.jpg"
                  alt="Thầy Công - Toán Thầy Công"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                  className="object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                  priority
                />
              </div>

              {/* Floating Trust Badge 1: Top Right */}
              <div className="absolute -top-3 sm:-top-5 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 z-10">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">9+</div>
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">★</div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">Chinh phục 9+</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">500+ Học sinh</p>
                </div>
              </div>

              {/* Floating Credential Card 2: Bottom Left */}
              <div className="absolute -bottom-5 sm:-bottom-7 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3.5 z-10 max-w-[280px] sm:max-w-xs">
                <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Học Toán Bản Chất</p>
                  <p className="text-[11px] text-slate-600 font-normal mt-0.5 leading-snug">
                    Tư duy logic vững chắc, không học vẹt, tối ưu điểm thi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Triết lý thiết kế khóa học</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">Mọi yếu tố gây nhiễu đều bị loại bỏ. Bạn chỉ tập trung vào cốt lõi của Toán học.</h3>
          </div>
          <div className="grid md:grid-cols-3 border-t border-l border-gray-100">
            {/* Feature 1 */}
            <div className="group p-8 md:p-12 border-b border-r border-gray-100 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <span className="text-4xl font-light text-gray-200 group-hover:text-purple-200 transition-colors">01</span>
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-4">Chất lượng sắc nét</h4>
              <p className="text-gray-600 leading-relaxed">Hình ảnh độ phân giải cao, trình bày bài giảng dưới dạng sơ đồ tư duy phẳng, tối ưu hóa việc ghi nhớ.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="group p-8 md:p-12 border-b border-r border-gray-100 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-4xl font-light text-gray-200 group-hover:text-purple-200 transition-colors">02</span>
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-4">Lộ trình tinh gọn</h4>
              <p className="text-gray-600 leading-relaxed">Lược bỏ các bài tập lặp lại vô nghĩa. Chỉ giữ lại những dạng bài có tính hệ thống và bao quát.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="group p-8 md:p-12 border-b border-r border-gray-100 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-4xl font-light text-gray-200 group-hover:text-purple-200 transition-colors">03</span>
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-4">Môi trường chuyên nghiệp</h4>
              <p className="text-gray-600 leading-relaxed">Cộng đồng học sinh chất lượng cao, chia sẻ tài liệu và giải đáp thắc mắc trên tinh thần học thuật.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-medium text-blue-900 mb-3">Chương trình đào tạo</h2>
              <p className="text-gray-600 text-lg font-light">Các khóa học được chuẩn hóa theo tiêu chuẩn đánh giá năng lực mới.</p>
            </div>
            <Link href="/courses" className="text-purple-600 font-medium hover:text-purple-700 flex items-center gap-2 group">
              Xem toàn bộ <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => {
              const hueClass = hueRotates[index % hueRotates.length]
              
              return (
              <Link href={`/courses/${course.slug}`} key={course.id} className="group bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-sm overflow-hidden block">
                <div className="relative h-64 w-full bg-slate-100 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                  <Image
                    src="/images/thumbnail-v2.jpg"
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700 ${hueClass}`}
                  />
                  <div className="absolute top-4 left-4 bg-white px-2 py-1 text-xs font-bold text-blue-900 tracking-widest border border-gray-200 shadow-sm">
                    {course.grade.name.toUpperCase()}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-blue-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-6 font-light line-clamp-3 leading-relaxed flex-1">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                      {course._count.enrollments > 0 ? `${course._count.enrollments} Học viên` : 'Mới ra mắt'}
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
              )
            })}
            
            {featuredCourses.length < 3 && (
              <div className="group bg-purple-50/30 border border-dashed border-purple-200 flex flex-col h-full overflow-hidden items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-white border border-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600 shadow-2xs group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-extrabold text-blue-900 mb-2">Khóa học tiếp theo</h3>
                <p className="text-slate-500 font-normal text-sm mb-6 max-w-xs">Chúng tôi đang biên soạn một chương trình đặc biệt hoàn toàn mới. Hãy đón chờ!</p>
                <span className="inline-block bg-white border border-purple-200 px-4 py-1.5 text-xs font-bold text-purple-700 uppercase tracking-widest shadow-2xs">
                  Sắp ra mắt
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="relative py-24 bg-white border-t border-slate-200/90 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 tracking-tight">Học viên nói gì?</h2>
            <p className="text-slate-600 text-lg font-normal mx-auto max-w-2xl">
              Hơn 500 học sinh THCS & THPT đã thay đổi tư duy và bứt phá điểm số sau khi tham gia lộ trình học tập.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Em từng rất sợ hình học, nhưng phương pháp trực quan của thầy đã giúp em nhìn ra vấn đề ngay lập tức. Đề thi năm nay em tự tin 9+.",
                author: "Nguyễn Tuấn Anh",
                school: "THPT Lục Nam",
                score: "Học sinh lớp 10"
              },
              {
                quote: "Không giải mẹo, học đến đâu chắc đến đấy. Lộ trình của thầy giúp em tiết kiệm rất nhiều thời gian ôn thi vì chỉ cần học đúng trọng tâm bản chất.",
                author: "Trần Minh Châu",
                school: "THPT Phương Sơn",
                score: "Học sinh lớp 10"
              },
              {
                quote: "Điều em thích nhất là môi trường học nghiêm túc. Các thầy/cô trợ giảng hỗ trợ 24/7 siêu nhiệt tình mỗi khi em gặp khó.",
                author: "Lê Hoàng Hải",
                school: "THPT Lục Nam",
                score: "Học sinh Lớp 11"
              }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all shadow-2xs relative flex flex-col justify-between">
                <div>
                  <div className="text-purple-200 mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21L16.411 14.286C14.618 14.072 13.25 12.585 13.25 10.75C13.25 8.679 14.929 7 17 7C19.071 7 20.75 8.679 20.75 10.75C20.75 14.893 17.5 19.393 14.017 21ZM3.267 21L5.661 14.286C3.868 14.072 2.5 12.585 2.5 10.75C2.5 8.679 4.179 7 6.25 7C8.321 7 10 8.679 10 10.75C10 14.893 6.75 19.393 3.267 21Z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 italic mb-8 leading-relaxed line-clamp-4">&ldquo;{review.quote}&rdquo;</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <h4 className="font-bold text-blue-900">{review.author}</h4>
                    <p className="text-xs text-slate-500">{review.school}</p>
                  </div>
                  <div className="bg-purple-50 text-purple-700 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-purple-200">
                    {review.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-900 border-t border-blue-950">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Xây dựng nền tảng. Chinh phục đỉnh cao.</h2>
          <p className="text-blue-100/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-normal">
            Tham gia cộng đồng học thuật chuyên nghiệp nhất ngay hôm nay. Trải nghiệm phương pháp tư duy mới.
          </p>
          <div className="flex justify-center">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white px-10 py-5 text-sm font-bold uppercase tracking-widest text-blue-900 transition-all hover:bg-purple-50 hover:text-purple-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Đăng ký tài khoản
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-blue-100/90 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-300" />
              <span>Bài giảng bám sát đề thi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-300" />
              <span>Kích hoạt 1 lần duy nhất</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-300" />
              <span>Hỗ trợ chuyên môn 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
