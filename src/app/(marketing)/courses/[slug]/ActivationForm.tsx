'use client'

import { useActionState, useEffect } from 'react'
import { activateCourseAction } from './actions'
import { AlertCircle, CheckCircle2, Loader2, Key, PlayCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ActivationFormProps {
  courseId: string
  courseSlug: string
  courseTitle: string
}

export function ActivationForm({ courseId, courseSlug, courseTitle }: ActivationFormProps) {
  const [state, action, isPending] = useActionState(activateCourseAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.refresh()
      const timer = setTimeout(() => {
        router.push(`/learn/${courseSlug}?lesson=1`)
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [state?.success, courseSlug, router])

  if (state?.success) {
    return (
      <div className="bg-white border border-emerald-200/90 p-6 shadow-sm text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        
        <div>
          <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 uppercase tracking-wider mb-2">
            Kích hoạt thành công
          </span>
          <h4 className="text-base font-bold text-slate-900">
            Khóa học đã sẵn sàng!
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Chúc mừng bạn đã mở khóa <strong>{courseTitle}</strong>. Hãy bắt đầu ngay để bứt phá điểm 9+ môn Toán.
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          <Link
            href={`/learn/${courseSlug}?lesson=1`}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-900 text-white text-xs font-bold py-3.5 px-4 hover:bg-blue-800 transition-colors shadow-xs"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Vào phòng học ngay</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-[11px] text-slate-400 italic flex items-center justify-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin text-blue-900" />
            <span>Đang tự động đưa bạn vào phòng học...</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200/90 p-6 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Key className="h-5 w-5 text-blue-900" />
        <span>Kích hoạt Khóa học</span>
      </h3>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Nhập mã kích hoạt được cấp để mở khóa toàn bộ bài giảng và tài liệu
      </p>

      <form action={action} className="space-y-3.5">
        <input type="hidden" name="courseId" value={courseId} />
        
        <div>
          <label htmlFor="code" className="sr-only">Mã kích hoạt</label>
          <input
            type="text"
            id="code"
            name="code"
            placeholder="Ví dụ: TTC-TOAN12-XXXX"
            required
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 focus:outline-none focus:border-blue-900 uppercase placeholder:normal-case font-mono tracking-wider"
          />
        </div>

        {state?.success === false && (
          <div className="flex items-start gap-2 text-xs text-rose-800 bg-rose-50 p-3 border border-rose-200">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
            <p>{state.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer bg-blue-900 text-white text-xs font-bold py-3 px-4 hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang kiểm tra mã...</span>
            </>
          ) : (
            <span>Kích hoạt mở khóa ngay</span>
          )}
        </button>
      </form>
    </div>
  )
}
