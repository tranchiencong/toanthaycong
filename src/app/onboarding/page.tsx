'use client'

import { useActionState } from 'react'
import { updateProfile } from './actions'

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState(updateProfile, {})

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Hoàn tất hồ sơ
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Vui lòng cập nhật thông tin để chúng tôi hỗ trợ bạn tốt nhất
        </p>

        {state.message && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              name="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                state.errors?.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {state.errors?.fullName && (
              <p className="mt-1 text-xs text-red-500">{state.errors.fullName[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="0987654321"
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                state.errors?.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {state.errors?.phone && (
              <p className="mt-1 text-xs text-red-500">{state.errors.phone[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ngày sinh (dd/mm/yyyy)
            </label>
            <input
              name="dateOfBirth"
              type="text"
              placeholder="dd/mm/yyyy"
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                state.errors?.dateOfBirth ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {state.errors?.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{state.errors.dateOfBirth[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Địa chỉ (Tỉnh/Thành phố)
            </label>
            <input
              name="address"
              type="text"
              placeholder="Hà Nội"
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                state.errors?.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {state.errors?.address && (
              <p className="mt-1 text-xs text-red-500">{state.errors.address[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            {isPending ? 'Đang lưu hệ thống...' : 'Lưu thông tin & Bắt đầu học'}
          </button>
        </form>
      </div>
    </div>
  )
}
