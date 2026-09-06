import Link from 'next/link'

export const metadata = {
  title: 'Chính Sách Bảo Mật | Toán Thầy Công',
  description:
    'Chính sách bảo mật và quyền riêng tư thông tin học viên trên hệ thống Toán Thầy Công.',
}

export default function PrivacyPage() {
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
            Bảo mật
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-tight">
            Chính sách bảo mật thông tin
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của học sinh và phụ huynh.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              1. Cam kết bảo mật
            </h2>
            <p>
              Toán Thầy Công tôn trọng và cam kết bảo vệ dữ liệu cá nhân của học sinh và phụ huynh. Hệ thống được triển khai các tiêu chuẩn an ninh mạng để đảm bảo thông tin cá nhân không bị rò rỉ hoặc truy cập trái phép.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              2. Thông tin chúng tôi thu thập
            </h2>
            <p>Chúng tôi chỉ thu thập các thông tin cần thiết phục vụ học tập:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                Họ và tên, địa chỉ email và mật khẩu (đã được mã hóa an toàn).
              </li>
              <li>
                Số điện thoại Zalo để liên hệ hỗ trợ giải đáp thắc mắc và gửi tài liệu học tập.
              </li>
              <li>
                Lịch sử học tập và kết quả bài kiểm tra nhằm theo dõi mức độ tiến bộ của học viên.
              </li>
              <li>
                Trường hợp đăng nhập bằng Google, hệ thống chỉ nhận họ tên, email và ảnh đại diện công khai từ Google.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              3. Mục đích sử dụng thông tin
            </h2>
            <p>Dữ liệu chỉ được dùng cho các mục đích sau:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Cấp quyền truy cập bài giảng và tài liệu học tập.</li>
              <li>Hỗ trợ giải bài tập và giải đáp thắc mắc học thuật.</li>
              <li>Gửi thông báo đề thi mới và lịch ôn tập định kỳ.</li>
              <li>Bảo vệ an toàn tài khoản học viên.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              4. Không chia sẻ cho bên thứ ba
            </h2>
            <div className="p-4 bg-gray-50 border border-gray-200 text-gray-800 text-sm">
              Toán Thầy Công cam kết không bán, không cho thuê, không chia sẻ thông tin học viên cho bất kỳ bên thứ ba nào vì mục đích thương mại hoặc quảng cáo.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900">
              5. Quyền của học viên đối với dữ liệu
            </h2>
            <p>
              Học viên có quyền xem, chỉnh sửa thông tin trong phần Hồ sơ cá nhân bất kỳ lúc nào, hoặc yêu cầu xóa dữ liệu tài khoản bằng cách liên hệ qua email hotro@toanthaycong.com.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
