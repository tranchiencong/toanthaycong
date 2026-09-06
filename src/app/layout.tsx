import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/seo/JsonLd'

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toanthaycong.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Toán Thầy Công | Học Toán Từ Bản Chất - Chinh Phục Điểm 9+',
    template: '%s | Toán Thầy Công',
  },
  description:
    'Nền tảng học Toán trực tuyến THCS & THPT hàng đầu cùng Thầy Trần Chiến Công. Phương pháp tư duy bản chất, bám sát cấu trúc đề thi mới nhất của Bộ Giáo dục.',
  keywords: [
    'Toán Thầy Công',
    'Thầy Trần Chiến Công',
    'Học Toán từ bản chất',
    'Luyện thi THPT Quốc Gia',
    'Toán lớp 6',
    'Toán lớp 7',
    'Toán lớp 8',
    'Toán lớp 9',
    'Toán lớp 10',
    'Toán lớp 11',
    'Toán lớp 12',
    'Đánh giá năng lực môn Toán',
  ],
  authors: [{ name: 'Thầy Trần Chiến Công', url: baseUrl }],
  creator: 'Thầy Trần Chiến Công',
  publisher: 'Toán Thầy Công',
  alternates: {
    canonical: './',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Toán Thầy Công | Học Toán Từ Bản Chất - Chinh Phục Điểm 9+',
    description:
      'Nền tảng học Toán trực tuyến THCS & THPT hàng đầu cùng Thầy Trần Chiến Công. Lộ trình bài bản, bám sát cấu trúc đề thi mới nhất.',
    url: baseUrl,
    siteName: 'Toán Thầy Công',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toán Thầy Công | Học Toán Từ Bản Chất - Chinh Phục Điểm 9+',
    description:
      'Nền tảng học Toán trực tuyến THCS & THPT hàng đầu cùng Thầy Trần Chiến Công.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Toán Thầy Công',
  url: baseUrl,
  logo: `${baseUrl}/icon.svg`,
  description:
    'Hệ thống học Toán trực tuyến dành cho học sinh THCS và THPT, tập trung phát triển tư duy logic và bản chất toán học.',
  founder: {
    '@type': 'Person',
    name: 'Trần Chiến Công',
    jobTitle: 'Giáo viên Toán THCS & THPT',
  },
  sameAs: [
    'https://facebook.com',
    'https://youtube.com',
    'https://tiktok.com',
    'https://zalo.me',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`h-full antialiased scroll-smooth ${inter.variable}`}
    >
      <body suppressHydrationWarning className="font-sans min-h-full flex flex-col bg-white text-slate-900 leading-relaxed">
        <JsonLd data={organizationSchema} />
        {children}
      </body>
    </html>
  )
}
