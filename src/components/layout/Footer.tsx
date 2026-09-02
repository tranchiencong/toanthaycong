import Link from 'next/link'
import { Calculator } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="container mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center bg-blue-900 text-white transition-colors group-hover:bg-purple-600">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="text-lg font-heading font-bold text-gray-900 group-hover:text-blue-900 transition-colors">Toán Thầy Công</span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed pr-4">
            Hệ thống học toán trực tuyến hàng đầu, cung cấp bài giảng chất lượng cao bám sát chương trình phổ thông và luyện thi đại học.
          </p>
        </div>
        
        <div>
          <h3 className="mb-4 text-sm font-heading font-semibold text-gray-900 uppercase tracking-wider">Khóa học</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-light">
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Toán lớp 10</Link></li>
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Toán lớp 11</Link></li>
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Toán lớp 12</Link></li>
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Luyện thi THPT Quốc Gia</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-heading font-semibold text-gray-900 uppercase tracking-wider">Hỗ trợ</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-light">
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Hướng dẫn kích hoạt mã</Link></li>
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Câu hỏi thường gặp</Link></li>
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Liên hệ tư vấn</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-heading font-semibold text-gray-900 uppercase tracking-wider">Pháp lý</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-light">
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Điều khoản sử dụng</Link></li>
            <li><Link href="#" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900">Chính sách bảo mật</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl mt-12 border-t border-gray-100 px-4 pt-8 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Toán Thầy Công. Tất cả các quyền được bảo lưu.
        </p>
        <p className="text-sm text-gray-400">
          Được thiết kế để truyền cảm hứng học tập.
        </p>
      </div>
    </footer>
  )
}
