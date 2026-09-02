'use client'

import { useActionState } from 'react'
import { authAction } from './actions'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(authAction, {})

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Toán Thầy Công
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Đăng nhập để vào không gian học tập
        </p>

        {state.message && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nhapemail@gmail.com"
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                state.errors?.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {state.errors?.email && (
              <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                state.errors?.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {state.errors?.password && (
              <p className="mt-1 text-xs text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              name="intent"
              value="login"
              disabled={isPending}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
            >
              {isPending ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <button
              type="submit"
              name="intent"
              value="signup"
              disabled={isPending}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
