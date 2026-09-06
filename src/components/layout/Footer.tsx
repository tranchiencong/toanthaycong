import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <Logo size="sm" showText={true} href="/" />
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Hệ thống học tập trực tuyến dành cho học sinh Tiểu học, THCS và THPT. Tập trung phát triển tư duy logic và bản chất toán học.
            </p>
            {/* Social Links with Original Brand Logos */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Toán Thầy Công"
                className="hover:opacity-90 hover:scale-105 transition-transform duration-150 inline-flex items-center justify-center cursor-pointer"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="white" />
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Toán Thầy Công"
                className="hover:opacity-90 hover:scale-105 transition-transform duration-150 inline-flex items-center justify-center cursor-pointer"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#FF0000"
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                  />
                  <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Toán Thầy Công"
                className="hover:opacity-90 hover:scale-105 transition-transform duration-150 inline-flex items-center justify-center cursor-pointer"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="5" fill="#000000" />
                  <g transform="translate(3.6, 3.6) scale(0.7)">
                    <path
                      fill="white"
                      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    />
                  </g>
                </svg>
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo Toán Thầy Công"
                className="hover:opacity-90 hover:scale-105 transition-transform duration-150 inline-flex items-center justify-center cursor-pointer"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="5" fill="#0068FF" />
                  <g transform="translate(2.4, 2.4) scale(0.8)">
                    <path
                      fill="white"
                      d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9453 0 1.0746.8697 1.9453 1.945 1.9453z"
                    />
                  </g>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Khóa học */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Khóa học
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses?grade=grade-10" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Toán lớp 10
                </Link>
              </li>
              <li>
                <Link href="/courses?grade=grade-11" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Toán lớp 11
                </Link>
              </li>
              <li>
                <Link href="/courses?grade=grade-12" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Toán lớp 12
                </Link>
              </li>
              <li>
                <Link href="/courses?grade=grade-12&tag=thpt-qg" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Luyện thi THPT Quốc Gia
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-900 font-medium hover:underline">
                  Tất cả khóa học
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hỗ trợ */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Hỗ trợ
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/activation-guide" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Hướng dẫn kích hoạt
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Liên hệ tư vấn
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Thông tin & Pháp lý */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Thông tin
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Về Thầy Công
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Minimalist & Clean */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {currentYear} Toán Thầy Công. Tất cả các quyền được bảo lưu.</p>
          <p>Học toán từ bản chất</p>
        </div>
      </div>
    </footer>
  )
}
