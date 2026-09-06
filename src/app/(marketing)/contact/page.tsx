'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: 'grade-12',
    targetScore: '9+',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
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

        {/* Page Header */}
        <div className="border-b border-gray-200 pb-8 mb-10">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
            Liên hệ
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-tight">
            Liên hệ và tư vấn lộ trình
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Để lại thông tin để nhận tư vấn khóa học và đánh giá năng lực môn Toán cùng Thầy Công.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Col 1: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Hotline và Zalo
                </h3>
                <a href="tel:0981234567" className="text-lg font-bold text-blue-900 hover:underline">
                  0981.234.567
                </a>
                <p className="text-xs text-gray-500 mt-0.5">8:00 đến 22:00 hàng ngày</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Email hỗ trợ
                </h3>
                <a href="mailto:hotro@toanthaycong.com" className="text-base text-gray-900 hover:underline">
                  hotro@toanthaycong.com
                </a>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Trụ sở
                </h3>
                <p className="text-sm text-gray-700">
                  Tầng 5, Tòa nhà Công Nghệ, Cầu Giấy, Hà Nội
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 text-center text-sm font-medium text-blue-900 hover:bg-gray-50 transition-colors"
              >
                Nhắn tin Zalo trực tiếp →
              </a>
            </div>
          </div>

          {/* Col 2: Consultation Form */}
          <div className="lg:col-span-7">
            <div className="border border-gray-200 p-6 sm:p-8 bg-white">
              <h3 className="text-lg font-bold text-blue-900 mb-1">
                Đăng ký tư vấn học tập
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Chuyên viên học thuật sẽ liên hệ và tư vấn chi tiết cho bạn.
              </p>

              {isSubmitted ? (
                <div className="p-6 bg-gray-50 border border-gray-200 text-center space-y-3">
                  <h4 className="text-base font-bold text-blue-900">
                    Đã gửi thông tin thành công
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Cảm ơn bạn đã quan tâm. Ban trợ giảng sẽ liên hệ qua số điện thoại <strong>{formData.phone}</strong> trong thời gian sớm nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-gray-500 underline hover:text-gray-900 cursor-pointer pt-2"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Họ và tên
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Nguyễn Văn Nam"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-900 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Số điện thoại (Zalo)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="0981234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-900 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="grade" className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Khối lớp
                      </label>
                      <select
                        id="grade"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-900 focus:outline-none transition-all"
                      >
                        <option value="grade-10">Toán lớp 10</option>
                        <option value="grade-11">Toán lớp 11</option>
                        <option value="grade-12">Toán lớp 12</option>
                        <option value="dgnl">Luyện thi THPT & ĐGNL</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="targetScore" className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Mục tiêu
                      </label>
                      <select
                        id="targetScore"
                        value={formData.targetScore}
                        onChange={(e) => setFormData({ ...formData, targetScore: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-900 focus:outline-none transition-all"
                      >
                        <option value="8+">Điểm 8.0 - 8.5</option>
                        <option value="9+">Điểm 9.0 - 9.6</option>
                        <option value="10">Điểm 10 và Thủ khoa</option>
                        <option value="lost">Lấy lại gốc</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Ghi chú thêm
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Tình hình học tập hiện tại của bạn..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-900 focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-900 hover:bg-purple-600 text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    Gửi yêu cầu tư vấn
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
