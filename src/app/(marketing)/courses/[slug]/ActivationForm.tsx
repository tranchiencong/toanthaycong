'use client'

import { useActionState, useEffect } from 'react'
import { activateCourseAction } from './actions'
import { AlertCircle, CheckCircle2, Loader2, Key } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ActivationForm({ courseId }: { courseId: string }) {
  const [state, action, isPending] = useActionState(activateCourseAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      // Refresh router sau khi thành công để tải lại Server Component
      router.refresh()
    }
  }, [state?.success, router])

  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-200 p-6 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
        <h4 className="text-lg font-bold text-green-900 mb-2">Kích hoạt thành công!</h4>
        <p className="text-green-700 text-sm">Cảm ơn bạn đã đồng hành cùng Toán Thầy Công.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Key className="h-5 w-5" />
        Kích hoạt Khóa học
      </h3>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Nhập mã kích hoạt gồm 6-12 ký tự được in trên thẻ hoặc gửi qua email của bạn.
      </p>

      <form action={action} className="space-y-4">
        <input type="hidden" name="courseId" value={courseId} />
        
        <div>
          <label htmlFor="code" className="sr-only">Mã kích hoạt</label>
          <input
            type="text"
            id="code"
            name="code"
            placeholder="VD: VIP2026"
            required
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent uppercase placeholder:normal-case font-mono"
          />
        </div>

        {state?.success === false && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 border border-red-100">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>{state.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-purple-600 text-white font-bold py-3 px-4 hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Kích hoạt ngay'
          )}
        </button>
      </form>
    </div>
  )
}
