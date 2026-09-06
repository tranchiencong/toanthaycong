import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export const metadata = {
  title: '404 - Không Tìm Thấy Trang | Toán Thầy Công',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển trên hệ thống Toán Thầy Công.',
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-white overflow-hidden text-gray-900">
      {/* Background Math Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800e_1px,transparent_1px),linear-gradient(to_bottom,#8080800e_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Bar with Logo */}
      <header className="relative z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Logo size="sm" showText={true} href="/" />
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Quay lại trang chủ
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto max-w-xl px-4 py-16 sm:py-24 text-center">
        <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">
          Mã lỗi 404 · Không tìm thấy
        </p>

        <h1 className="text-7xl sm:text-8xl font-extrabold text-blue-900 tracking-tight font-mono mb-4">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          Trang không tồn tại hoặc đã được di chuyển
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
          Đường dẫn bạn vừa truy cập không tồn tại trên hệ thống Toán Thầy Công hoặc đã được sắp xếp sang vị trí mới.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-blue-900 hover:bg-purple-600 text-white text-sm font-medium px-6 py-3 transition-colors text-center"
          >
            Quay lại trang chủ
          </Link>
          <Link
            href="/courses"
            className="w-full sm:w-auto border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-3 transition-colors text-center"
          >
            Khám phá khóa học
          </Link>
        </div>

        {/* Quick Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
          <Link href="/faq" className="hover:text-gray-900 transition-colors">
            Câu hỏi thường gặp
          </Link>
          <span>·</span>
          <Link href="/activation-guide" className="hover:text-gray-900 transition-colors">
            Hướng dẫn kích hoạt
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 border-t border-gray-100 px-6 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Toán Thầy Công. Học Toán từ bản chất.
      </footer>
    </div>
  )
}
