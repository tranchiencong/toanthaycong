'use client'

import { useActionState, Suspense } from 'react'
import { authAction } from './actions'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'

function LoginForm() {
  const [state, formAction, isPending] = useActionState(authAction, {})
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect') || ''

  return (
    <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 sm:p-10 shadow-sm">
      {/* Logo Monogram tc */}
      <div className="flex justify-center mb-4">
        <Logo size="md" showText={false} />
      </div>

      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
        Đăng nhập
      </h1>
      <p className="text-xs text-slate-500 text-center mb-6">
        Chào mừng bạn quay trở lại lớp học Toán Thầy Công
      </p>

      {/* 1. Đăng nhập 1-chạm bằng Google */}
      <div className="mb-5">
        <GoogleAuthButton text="Tiếp tục với Google" redirectTo={redirectParam || '/dashboard'} />
      </div>

      {/* Dải phân cách "Hoặc" */}
      <div className="relative flex items-center justify-center mb-5">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider shrink-0 font-medium">
          Hoặc đăng nhập bằng Email
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
        <input type="hidden" name="intent" value="login" />
        <input type="hidden" name="redirect" value={redirectParam} />

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
            autoFocus
            placeholder="Nhập email của bạn"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
          />
          {state.errors?.email && (
            <p className="mt-1 text-xs text-rose-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-gray-700"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-blue-900 transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
          />
          {state.errors?.password && (
            <p className="mt-1 text-xs text-rose-600">{state.errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer mt-2"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đăng nhập'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6 pt-6 border-t border-gray-100">
        Chưa có tài khoản?{' '}
        <Link href="/sign-up" className="text-blue-900 font-semibold hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Math Caro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-900" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
