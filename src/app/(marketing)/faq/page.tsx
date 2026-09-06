'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'

type FAQItem = {
  question: string
  answer: string
  category: 'method' | 'learning' | 'support'
}

const FAQS: FAQItem[] = [
  {
    category: 'method',
    question: 'Phương pháp học bản chất khác gì so với học mẹo thông thường?',
    answer:
      'Thầy Công tập trung chứng minh nguồn gốc của mọi công thức và định lý. Khi học sinh hiểu bản chất bài toán, các em có thể tự suy luận để giải quyết mọi dạng bài biến thể trong đề thi một cách tự tin mà không lo quên công thức.',
  },
  {
    category: 'method',
    question: 'Học sinh đang mất gốc hoặc học lực trung bình có theo kịp không?',
    answer:
      'Mỗi chuyên đề luôn bắt đầu từ phần lý thuyết nền tảng và các ví dụ cơ bản nhất, sau đó mới nâng dần lên mức vận dụng và vận dụng cao 9+. Học sinh bị hổng kiến thức các lớp dưới đều có thể từng bước lấy lại gốc vững vàng.',
  },
  {
    category: 'method',
    question: 'Bài giảng có bám sát chương trình sách giáo khoa mới không?',
    answer:
      'Toàn bộ giáo trình và bài giảng được biên soạn bám sát chương trình GDPT 2018 mới nhất và định dạng cấu trúc đề thi của Bộ Giáo dục và Đào tạo.',
  },
  {
    category: 'learning',
    question: 'Học trực tuyến có được hỗ trợ giải đáp bài tập không?',
    answer:
      'Dưới mỗi video bài giảng đều có phần thảo luận. Ngoài ra, học viên được tham gia nhóm Zalo học tập trực tiếp cùng Thầy Công và trợ giảng để hỏi đáp bài tập chi tiết.',
  },
  {
    category: 'learning',
    question: 'Làm thế nào để kích hoạt khóa học vào tài khoản?',
    answer:
      'Sau khi nhận mã thẻ kích hoạt, bạn đăng nhập tài khoản, truy cập vào mục Bàn học và nhập mã để mở ngay toàn bộ bài giảng và tài liệu khóa học.',
  },
  {
    category: 'learning',
    question: 'Có thể học trên điện thoại hay máy tính bảng không?',
    answer:
      'Hệ thống tối ưu hiển thị trên mọi thiết bị: máy tính, laptop, máy tính bảng và điện thoại. Học viên chỉ cần mở trình duyệt và đăng nhập là có thể học bất cứ lúc nào.',
  },
  {
    category: 'learning',
    question: 'Thời hạn xem bài giảng là bao lâu?',
    answer:
      'Học viên được xem lại bài giảng không giới hạn số lần trong suốt thời hạn khóa học, thường kéo dài đến hết kỳ thi của năm học tương ứng.',
  },
  {
    category: 'support',
    question: 'Tài liệu và đề thi tải về bằng cách nào?',
    answer:
      'Mỗi bài giảng đều có đính kèm file PDF tài liệu và đề thi có đáp án chi tiết để học viên tải về in ra làm bài trực tiếp.',
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filteredFaqs =
    activeCategory === 'all'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <JsonLd data={faqSchema} />
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
        <div className="border-b border-gray-200 pb-8 mb-8">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
            Trợ giúp
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-tight">
            Câu hỏi thường gặp
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Giải đáp các thắc mắc về khóa học, phương pháp và cách thức học tập tại Toán Thầy Công.
          </p>
        </div>

        {/* Category Tabs - Minimalist buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'method', label: 'Phương pháp học' },
            { id: 'learning', label: 'Thiết bị và kích hoạt' },
            { id: 'support', label: 'Tài liệu và hỏi bài' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Minimal Accordion List */}
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100 mb-12">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx

            return (
              <div key={faq.question} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none py-1"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-blue-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pt-3 pb-1 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="p-6 border border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Chưa tìm thấy câu trả lời?</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Đội ngũ trợ giảng sẵn sàng hỗ trợ tư vấn chi tiết cho bạn.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-blue-900 hover:bg-purple-600 text-white text-xs font-medium px-5 py-2.5 transition-colors shrink-0"
          >
            Liên hệ tư vấn
          </Link>
        </div>

      </div>
    </div>
  )
}
