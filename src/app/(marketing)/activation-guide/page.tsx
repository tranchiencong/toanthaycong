import Link from 'next/link'

export const metadata = {
  title: 'Hướng Dẫn Kích Hoạt Khóa Học | Toán Thầy Công',
  description:
    'Hướng dẫn 3 bước kích hoạt mã thẻ học tập trên hệ thống Toán Thầy Công.',
}

export default function ActivationGuidePage() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-gray-200 pb-8 mb-10">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
            Hướng dẫn
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-tight">
            Hướng dẫn kích hoạt khóa học
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            3 bước đơn giản để kích hoạt bài giảng và tài liệu học tập vào tài khoản của bạn.
          </p>
        </div>

        {/* 3 Step Minimal Process */}
        <div className="space-y-6 mb-12">
          
          <div className="p-6 border border-gray-200 bg-white flex flex-col sm:flex-row items-start gap-5">
            <span className="text-2xl font-light text-gray-400 block shrink-0">01</span>
            <div>
              <h3 className="text-base font-bold text-blue-900 mb-1">
                Đăng nhập hoặc đăng ký tài khoản
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nếu bạn là học viên mới, hãy <Link href="/sign-up" className="text-blue-900 font-medium underline">Đăng ký tài khoản</Link> (có thể dùng tài khoản Google). Nếu đã có tài khoản, vui lòng <Link href="/login" className="text-blue-900 font-medium underline">Đăng nhập</Link>.
              </p>
            </div>
          </div>

          <div className="p-6 border border-gray-200 bg-white flex flex-col sm:flex-row items-start gap-5">
            <span className="text-2xl font-light text-gray-400 block shrink-0">02</span>
            <div>
              <h3 className="text-base font-bold text-blue-900 mb-1">
                Truy cập Bàn học và tìm ô kích hoạt mã
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sau khi đăng nhập, truy cập vào trang Bàn học. Tại đây bạn sẽ thấy mục nhập mã thẻ khóa học được cấp khi bạn đăng ký khóa học.
              </p>
            </div>
          </div>

          <div className="p-6 border border-gray-200 bg-white flex flex-col sm:flex-row items-start gap-5">
            <span className="text-2xl font-light text-gray-400 block shrink-0">03</span>
            <div>
              <h3 className="text-base font-bold text-blue-900 mb-1">
                Nhập mã thẻ và bắt đầu học
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Điền chính xác chuỗi mã thẻ và nhấn nút Kích hoạt. Hệ thống sẽ mở toàn bộ video bài giảng và tài liệu đính kèm ngay lập tức.
              </p>
            </div>
          </div>

        </div>

        {/* Action Box */}
        <div className="p-6 border border-gray-200 bg-gray-50 text-center mb-10">
          <h3 className="text-base font-bold text-blue-900 mb-2">Bạn đã có mã thẻ kích hoạt?</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
            Bấm nút bên dưới để chuyển đến Bàn học và kích hoạt khóa học ngay.
          </p>
          <Link
            href="/dashboard#activation"
            className="inline-block bg-blue-900 hover:bg-purple-600 text-white font-medium px-8 py-3 text-sm transition-colors"
          >
            Kích hoạt mã thẻ ngay
          </Link>
        </div>

        {/* Note */}
        <div className="p-5 bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-600 space-y-2">
          <div className="font-bold text-gray-900">Lưu ý khi kích hoạt mã:</div>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm leading-relaxed">
            <li>Mỗi mã thẻ chỉ có giá trị kích hoạt 01 lần duy nhất trên 01 tài khoản học viên.</li>
            <li>Khóa học sau khi kích hoạt sẽ gắn liền với tài khoản của bạn.</li>
            <li>Nếu gặp sự cố về mã thẻ, vui lòng liên hệ hotline/Zalo: 0981.234.567 để được hỗ trợ trong 5 phút.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
