import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Toán Thầy Công | Nền tảng học Toán trực tuyến hàng đầu',
  description: 'Học Toán trực tuyến cùng Thầy Công với bài giảng chất lượng cao, bám sát chương trình phổ thông và luyện thi Đại học.',
  keywords: ['học toán', 'thầy công', 'toán trực tuyến', 'toán cấp 3', 'luyện thi đại học'],
  openGraph: {
    title: 'Toán Thầy Công | Nền tảng học Toán trực tuyến hàng đầu',
    description: 'Học Toán trực tuyến cùng Thầy Công với bài giảng chất lượng cao.',
    type: 'website',
    locale: 'vi_VN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`h-full antialiased scroll-smooth ${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans min-h-full flex flex-col bg-white text-slate-900 leading-relaxed">
        {children}
      </body>
    </html>
  )
}
