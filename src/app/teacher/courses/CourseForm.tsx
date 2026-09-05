'use client'

import { useActionState } from 'react'
import { createCourseAction, updateCourseAction, ActionState } from './actions'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type GradeOption = { id: string; name: string }
type SubjectOption = { id: string; name: string }

export type CourseFormData = {
  id?: string
  title?: string
  gradeId?: string
  subjectId?: string
  description?: string | null
  isPublished?: boolean
}

export function CourseForm({
  initialData,
  grades,
  subjects,
}: {
  initialData?: CourseFormData
  grades: GradeOption[]
  subjects: SubjectOption[]
}) {
  const isEditing = Boolean(initialData?.id)

  const boundAction = isEditing
    ? updateCourseAction.bind(null, initialData!.id!)
    : createCourseAction

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {}
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/teacher/courses"
          className="p-2 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Quay lại danh sách"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEditing ? 'Chỉnh sửa thông tin khóa học' : 'Tạo khóa học mới'}
          </h1>
          <p className="text-xs text-slate-500">
            {isEditing
              ? 'Cập nhật tiêu đề, khối lớp và trạng thái hiển thị.'
              : 'Điền thông tin ban đầu trước khi cấu hình bài giảng.'}
          </p>
        </div>
      </div>

      {state.message && (
        <div
          className={`p-3.5 text-xs font-medium border ${
            state.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tiêu đề khóa học <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData?.title || ''}
            placeholder="Ví dụ: Toán 12 - Lộ trình Kép 9+ Điểm Thi Đại Học"
            className="w-full border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-900 focus:outline-none"
          />
        </div>

        {/* Grade & Subject Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gradeId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Khối lớp <span className="text-rose-500">*</span>
            </label>
            <select
              id="gradeId"
              name="gradeId"
              required
              defaultValue={initialData?.gradeId || ''}
              className="w-full border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-900 focus:outline-none"
            >
              <option value="">-- Chọn khối lớp --</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subjectId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phân môn <span className="text-rose-500">*</span>
            </label>
            <select
              id="subjectId"
              name="subjectId"
              required
              defaultValue={initialData?.subjectId || ''}
              className="w-full border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-900 focus:outline-none"
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Mô tả tóm tắt khóa học
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData?.description || ''}
            placeholder="Nội dung tóm tắt, mục tiêu kiến thức, phương pháp giải nhanh..."
            className="w-full border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-900 focus:outline-none"
          />
        </div>

        {/* Is Published Checkbox */}
        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={initialData?.isPublished ?? false}
              className="h-4 w-4 rounded-none border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <div>
              <span className="text-xs font-bold text-slate-800">
                Xuất bản công khai (Published)
              </span>
              <p className="text-[11px] text-slate-500">
                Khi bật, khóa học sẽ xuất hiện trong danh mục công khai trên website để học sinh tìm hiểu.
              </p>
            </div>
          </label>
        </div>

        {/* Submit button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/teacher/courses"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 bg-blue-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang lưu thông tin...</span>
              </>
            ) : (
              <span>{isEditing ? 'Lưu thay đổi' : 'Tiếp tục thêm bài giảng →'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
