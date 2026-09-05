'use client'

import { useActionState, useEffect, useRef } from 'react'
import { activateCodeAction, ActivationState } from './actions'
import { CheckCircle2, AlertCircle, Loader2, Key, PlayCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function DashboardActivationCard() {
  const [state, formAction, isPending] = useActionState<ActivationState, FormData>(
    activateCodeAction,
    {}
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden relative">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex items-center gap-3 mb-4">
        <div className="">
          <Key className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Kích hoạt khóa học
          </h3>
          <p className="text-xs text-slate-500">
            Nhập mã kích hoạt được cấp để mở khóa bài học
          </p>
        </div>
      </div>

      {state.message && (
        <div
          className={`mb-4 rounded-xl p-4 text-xs font-medium space-y-2.5 ${
            state.success
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {state.success ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed font-semibold">{state.message}</span>
          </div>

          {state.success && state.courseSlug && (
            <div className="pt-1">
              <Link
                href={`/learn/${state.courseSlug}?lesson=1`}
                className="inline-flex items-center gap-2 bg-blue-900 text-white font-bold py-2 px-3.5 hover:bg-blue-800 transition-colors shadow-xs"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                <span>Vào phòng học ngay</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-3">
        <div>
          <label htmlFor="code" className="sr-only">
            Mã kích hoạt
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            placeholder="Ví dụ: TTC-TOAN10-XXXX"
            className="w-full uppercase font-mono tracking-wider border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 placeholder:normal-case placeholder:font-sans focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang kiểm tra mã...</span>
            </>
          ) : (
            <>
              <span>Mở khóa học ngay</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-500">
          Chưa có mã kích hoạt?{' '}
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-900 font-semibold hover:underline"
          >
            Liên hệ Thầy Công nhận mã
          </a>
        </p>
      </div>
    </div>
  )
}
