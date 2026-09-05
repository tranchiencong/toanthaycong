'use client'

import { useActionState, useState } from 'react'
import { generateActivationCodesAction, GenerateState } from './actions'
import { Key, Loader2, Copy, Check, CheckCircle2, AlertCircle } from 'lucide-react'

type CourseOption = {
  id: string
  title: string
  grade: { name: string }
}

export function BatchGenerateForm({ courses }: { courses: CourseOption[] }) {
  const [state, formAction, isPending] = useActionState<GenerateState, FormData>(
    generateActivationCodesAction,
    {}
  )
  const [selectedQuantity, setSelectedQuantity] = useState(10)
  const [copiedBatch, setCopiedBatch] = useState(false)

  const handleCopyNewCodes = () => {
    if (!state.generatedCodes || state.generatedCodes.length === 0) return
    navigator.clipboard.writeText(state.generatedCodes.join('\n'))
    setCopiedBatch(true)
    setTimeout(() => setCopiedBatch(false), 2500)
  }

  return (
    <div className="bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-3">
        <Key className="h-15 w-15" />
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Tạo mã kích hoạt hàng loạt
          </h3>
          <p className="text-xs text-slate-500">
            Tạo nhiều mã khóa học cùng lúc để cấp cho học sinh đăng ký qua Zalo / Facebook
          </p>
        </div>
      </div>

      {state.message && (
        <div
          className={`p-3.5 text-xs font-medium flex items-start gap-2.5 border ${
            state.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="leading-relaxed">{state.message}</p>
            {state.success && state.generatedCodes && state.generatedCodes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60">
                <button
                  type="button"
                  onClick={handleCopyNewCodes}
                  className="inline-flex items-center gap-1.5 bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  {copiedBatch ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Đã chép {state.generatedCodes.length} mã vào Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép toàn bộ {state.generatedCodes.length} mã vừa tạo</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Course Select */}
        <div>
          <label htmlFor="courseId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Khóa học cần cấp mã <span className="text-rose-500">*</span>
          </label>
          <select
            id="courseId"
            name="courseId"
            required
            className="w-full border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-900 focus:outline-none transition-all"
          >
            <option value="">-- Chọn khóa học --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.grade.name}] {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Preset & Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="quantity" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Số lượng mã <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[10, 20, 50, 100].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSelectedQuantity(q)}
                  className={`px-2 py-0.5 text-[11px] font-semibold border transition-colors ${
                    selectedQuantity === q
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  +{q}
                </button>
              ))}
            </div>
          </div>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={200}
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(parseInt(e.target.value, 10) || 1)}
            required
            className="w-full border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-900 focus:outline-none font-mono"
          />
        </div>

        {/* Prefix Input */}
        <div>
          <label htmlFor="prefix" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tiền tố mã tùy chọn <span className="text-slate-400 font-normal lowercase">(ví dụ: TTC-T10, VIP2026)</span>
          </label>
          <input
            id="prefix"
            name="prefix"
            type="text"
            placeholder="TTC-"
            className="w-full uppercase font-mono tracking-wider border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-900 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Mã ngẫu nhiên được sinh không chứa các ký tự dễ nhầm lẫn như 0, O, 1, I để học sinh gõ trên điện thoại chính xác tuyệt đối.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-900 px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang tạo {selectedQuantity} mã vào cơ sở dữ liệu...</span>
            </>
          ) : (
            <>
              <span>Tạo ngay {selectedQuantity} mã kích hoạt</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
