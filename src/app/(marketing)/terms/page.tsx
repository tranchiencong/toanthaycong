import Link from 'next/link'

export const metadata = {
  title: 'Điều Khoản Dịch Vụ | Toán Thầy Công',
  description:
    'Điều khoản sử dụng dịch vụ học tập trực tuyến trên hệ thống Toán Thầy Công. Các quy định về quyền sở hữu trí tuệ, tài khoản học viên và nghĩa vụ học tập.',
}

export default function TermsPage() {
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
            Pháp lý
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-tight">
            Điều khoản sử dụng dịch vụ
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Áp dụng cho toàn bộ học viên và người dùng hệ thống Toán Thầy Công.
          </p>
        </div>

        {/* Legal Content */}
        <div className="space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              1. Giới thiệu và phạm vi áp dụng
            </h2>
            <p>
              Chào mừng bạn đến với nền tảng học Toán trực tuyến Toán Thầy Công. Khi bạn đăng ký tài khoản, tham gia khóa học hoặc sử dụng bất kỳ tính năng nào trên website, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản quy định dưới đây.
            </p>
            <p>
              Học sinh dưới 18 tuổi cần có sự đồng ý hoặc giám sát của cha mẹ hoặc người giám hộ khi đăng ký tham gia các khóa học.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              2. Quyền sở hữu trí tuệ và bản quyền bài giảng
            </h2>
            <div className="p-4 bg-gray-50 border border-gray-200 text-gray-800 text-sm">
              Toàn bộ video bài giảng, đề thi, lời giải chi tiết, tài liệu và sơ đồ tư duy trên hệ thống thuộc quyền sở hữu trí tuệ độc quyền của Thầy Trần Chiến Công.
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                Nghiêm cấm quay màn hình, tải xuống trái phép hoặc chia sẻ video bài giảng lên bất kỳ nền tảng công cộng nào.
              </li>
              <li>
                Mỗi tài khoản chỉ dành riêng cho một cá nhân học tập. Nghiêm cấm dùng chung tài khoản. Hệ thống sẽ tự động khóa vĩnh viễn các tài khoản có dấu hiệu phát tán bài giảng hoặc đăng nhập bất thường ở nhiều địa điểm cùng lúc mà không cần thông báo trước.
              </li>
              <li>
                Tài liệu chỉ được sử dụng cho mục đích học tập cá nhân, không được thương mại hóa dưới mọi hình thức.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              3. Tài khoản học viên và bảo mật
            </h2>
            <p>
              Học viên có trách nhiệm cung cấp thông tin chính xác khi đăng ký (Họ tên, Số điện thoại, Email) để được hỗ trợ học tập và kích hoạt tài khoản.
            </p>
            <p>
              Học viên chịu trách nhiệm bảo mật thông tin đăng nhập của mình và thông báo ngay cho ban quản trị nếu phát hiện tài khoản bị truy cập trái phép.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              4. Đăng ký và kích hoạt khóa học
            </h2>
            <p>
              Sau khi hoàn tất đăng ký và nhập mã kích hoạt hợp lệ, khóa học sẽ được mở trực tiếp trên tài khoản học tập của học viên.
            </p>
            <p>
              Thời hạn sử dụng khóa học có giá trị theo đúng quy định cụ thể của từng khóa học tương ứng.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              5. Luật áp dụng
            </h2>
            <p>
              Các điều khoản này được diễn giải và điều chỉnh theo pháp luật Việt Nam. Mọi phát sinh sẽ được giải quyết trước hết thông qua trao đổi và thương lượng thiện chí giữa hai bên.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 text-xs text-gray-500">
            Mọi thắc mắc vui lòng liên hệ email: hotro@toanthaycong.com hoặc hotline: 0981.234.567.
          </div>

        </div>
      </div>
    </div>
  )
}
