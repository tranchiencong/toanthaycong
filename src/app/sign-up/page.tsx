'use client'

import { useActionState, useState } from 'react'
import { signUpAction, SignUpFormState } from './actions'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Loader2 } from 'lucide-react'

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<SignUpFormState, FormData>(
    signUpAction,
    {}
  )
  const [dob, setDob] = useState('')

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d/]/g, '')
    if (val.length > dob.length) {
      const digits = val.replace(/\D/g, '')
      if (digits.length >= 5) {
        val = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
      } else if (digits.length >= 3) {
        val = `${digits.slice(0, 2)}/${digits.slice(2)}`
      }
    }
    setDob(val)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Math Caro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Khung form lịch sự, chuẩn mực */}
      <div className="relative z-10 w-full max-w-lg bg-white border border-gray-200 rounded-xl p-8 sm:p-10 shadow-sm">
        
        {/* Logo Monogram tc */}
        <div className="flex justify-center mb-5">
          <Logo size="md" showText={false} />
        </div>

        {/* Tiêu đề tối giản cốt lõi */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Đăng ký
        </h1>

        {/* Thông báo lỗi nếu có */}
        {state.message && (
          <div className="mb-5 p-3 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg text-center font-medium">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          
          {/* Email đưa lên đầu */}
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
              placeholder="hocsinh@gmail.com"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
            />
            {state.errors?.email && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Mật khẩu đưa lên đầu */}
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

          {/* Họ và tên & Số điện thoại */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Số điện thoại <span className="text-red-500">*</span>
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

          {/* Ngày sinh & Tỉnh thành */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Ngày sinh <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(dd/mm/yyyy)</span>
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="text"
                required
                maxLength={10}
                value={dob}
                onChange={handleDateChange}
                placeholder="dd/mm/yyyy"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
              />
              {state.errors?.dateOfBirth && (
                <p className="mt-1 text-xs text-rose-600">{state.errors.dateOfBirth[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Tỉnh / Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                placeholder="Hà Nội, Nam Định..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
              />
              {state.errors?.address && (
                <p className="mt-1 text-xs text-rose-600">{state.errors.address[0]}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer mt-2"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 pt-6 border-t border-gray-100">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-blue-900 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>

      </div>
    </div>
  )
}
