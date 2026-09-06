import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Về Toán Thầy Công | Học Toán Từ Bản Chất',
  description:
    'Giới thiệu hệ thống đào tạo Toán Thầy Công. Triết lý giảng dạy học toán từ bản chất, tư duy logic vững chắc, chinh phục điểm 9+ THPT và Đại học.',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="py-12 md:py-20 border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Quay lại trang chủ
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-4">
            Giới thiệu
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 tracking-tight leading-[1.2] mb-6">
            Đưa học sinh chạm tới bản chất thật sự của Toán học.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Chúng tôi tin rằng mọi học sinh đều có thể học tốt môn Toán nếu được tiếp cận đúng phương pháp: Không giải vẹt, không ghi nhớ máy móc, mà thấu hiểu cội nguồn tư duy logic.
          </p>
        </div>
      </section>

      {/* Teacher Profile Section */}
      <section className="py-16 md:py-20 border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src="/images/hero-v3.jpg"
                  alt="Thầy Trần Chiến Công"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
                  Người sáng lập
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight">
                  Thầy Trần Chiến Công
                </h2>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Với hơn 5 năm kinh nghiệm trực tiếp giảng dạy Toán THCS & THPT, luyện thi vào 10 và luyện thi THPT Quốc Gia, Thầy Công đã đồng hành cùng hơn 500 học sinh xây dựng tư duy logic vững chắc, bứt phá điểm số và đỗ vào các trường Chuyên, trường Đại học hàng đầu.
              </p>
              
              {/* Stats - Clean Minimal Grid */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-b border-gray-100 py-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-900">5+</div>
                  <div className="text-xs text-gray-500 mt-0.5">Năm kinh nghiệm</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-900">500+</div>
                  <div className="text-xs text-gray-500 mt-0.5">Học sinh theo học</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-900">98.5%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Đạt điểm 8+ và 9+</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center bg-blue-900 text-white px-8 py-3.5 text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  Xem các khóa học
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Core Values - Minimalist Grid */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Triết lý</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight">
              3 nguyên tắc đào tạo cốt lõi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-gray-100">
            <div className="p-8 border-b border-r border-gray-100 bg-white">
              <span className="text-3xl font-light text-gray-300 block mb-4">01</span>
              <h4 className="text-base font-bold text-blue-900 mb-2">Học từ bản chất</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mỗi công thức và định lý đều được chứng minh nguồn gốc rõ ràng, giúp học sinh hiểu vì sao lại có cách làm đó và tự tin xử lý bài toán biến thể.
              </p>
            </div>

            <div className="p-8 border-b border-r border-gray-100 bg-white">
              <span className="text-3xl font-light text-gray-300 block mb-4">02</span>
              <h4 className="text-base font-bold text-blue-900 mb-2">Lộ trình bài bản</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nội dung phân cấp rõ ràng từ nắm chắc kiến thức cơ bản đến rèn luyện tư duy vận dụng cao 9+, bám sát cấu trúc đề thi mới nhất.
              </p>
            </div>

            <div className="p-8 border-b border-r border-gray-100 bg-white">
              <span className="text-3xl font-light text-gray-300 block mb-4">03</span>
              <h4 className="text-base font-bold text-blue-900 mb-2">Hỗ trợ tận tâm</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Học viên được hỗ trợ giải đáp bài tập trực tiếp qua Zalo, nhận đề thi thử định kỳ và theo dõi sát sao tiến độ học tập.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
            Bắt đầu học thử cùng Thầy Công
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Đăng ký tài khoản để trải nghiệm phương pháp học Toán từ bản chất cùng Thầy Công.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-blue-900 hover:bg-purple-600 text-white px-8 py-3.5 text-sm font-medium transition-colors"
            >
              Khám phá khóa học
            </Link>
            <Link
              href="/contact"
              className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 px-8 py-3.5 text-sm font-medium transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
