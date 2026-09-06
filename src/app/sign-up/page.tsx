'use client'

import { useActionState } from 'react'
import { signUpAction, SignUpFormState } from './actions'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Loader2 } from 'lucide-react'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { TurnstileWidget } from '@/components/auth/TurnstileWidget'

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<SignUpFormState, FormData>(
    signUpAction,
    {}
  )

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Math Caro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Khung form chuẩn EdTech tối giản */}
      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 sm:p-9 shadow-sm">
        {/* Logo Monogram tc */}
        <div className="flex justify-center mb-4">
          <Logo size="lg" showText={false} />
        </div>

        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Đăng ký
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          Bắt đầu chinh phục điểm 9+ môn Toán cùng Thầy Công
        </p>

        {/* 1. Đăng ký 1-chạm bằng Google */}
        <div className="mb-5">
          <GoogleAuthButton text="Đăng ký với Google" redirectTo="/dashboard" />
        </div>

        {/* Dải phân cách "Hoặc" */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider shrink-0 font-medium">
            Hoặc đăng ký bằng Email
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Thông báo lỗi nếu có */}
        {state.message && (
          <div className="mb-5 p-3 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg text-center font-medium">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Họ và tên & Số điện thoại */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoFocus
                placeholder="Nguyễn Văn Nam"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
              />
              {state.errors?.fullName && (
                <p className="mt-1 text-xs text-rose-600">{state.errors.fullName[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Số điện thoại (Zalo) <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="0912 345 678"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
              />
              {state.errors?.phone && (
                <p className="mt-1 text-xs text-rose-600">{state.errors.phone[0]}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Nhập email của bạn"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
            />
            {state.errors?.email && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
            />
            {state.errors?.password && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.password[0]}</p>
            )}
          </div>

          {/* Cloudflare Turnstile bot verification (tự động hiện khi có key trong .env) */}
          <TurnstileWidget />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer mt-2"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tạo tài khoản'}
          </button>

          {/* Điều khoản dịch vụ & Chính sách bảo mật */}
          <p className="text-[11.5px] text-slate-500 leading-relaxed text-center mt-3 px-1">
            <span className="text-amber-600 font-bold">(*)</span> Khi bấm vào đăng ký tài khoản, bạn chắc chắn đã đọc và đồng ý với{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-blue-900 font-semibold underline hover:text-blue-700 transition-colors"
            >
              Chính sách bảo mật
            </Link>
            {', '}
            <Link
              href="/terms"
              target="_blank"
              className="text-blue-900 font-semibold underline hover:text-blue-700 transition-colors"
            >
              Điều khoản dịch vụ và chính sách tư vấn
            </Link>{' '}
            của Toán Thầy Công.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 pt-5 border-t border-gray-100">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-blue-900 font-semibold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
