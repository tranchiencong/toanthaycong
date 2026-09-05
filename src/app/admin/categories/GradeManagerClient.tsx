'use client'

import { useState, useTransition } from 'react'
import { createGradeAction, updateGradeAction, deleteGradeAction } from './actions'
import { Plus, Edit2, Trash2, Check, X, Layers, Loader2 } from 'lucide-react'

export type GradeWithCount = {
  id: string
  name: string
  orderNum: number
  _count: {
    courses: number
  }
}

export function GradeManagerClient({ grades }: { grades: GradeWithCount[] }) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Add state
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newOrder, setNewOrder] = useState('6')

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editOrder, setEditOrder] = useState('0')

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const formData = new FormData()
    formData.append('name', newName.trim())
    formData.append('orderNum', newOrder)

    startTransition(async () => {
      const res = await createGradeAction(formData)
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Thành công!' })
        setNewName('')
        setIsAdding(false)
      } else {
        setFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  const handleStartEdit = (grade: GradeWithCount) => {
    setEditingId(grade.id)
    setEditName(grade.name)
    setEditOrder(grade.orderNum.toString())
  }

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return

    const formData = new FormData()
    formData.append('name', editName.trim())
    formData.append('orderNum', editOrder)

    startTransition(async () => {
      const res = await updateGradeAction(id, formData)
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Đã cập nhật' })
        setEditingId(null)
      } else {
        setFeedback({ type: 'error', text: res.message || 'Lỗi xảy ra' })
      }
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  const handleDelete = (grade: GradeWithCount) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khối "${grade.name}"?`)) return

    startTransition(async () => {
      const res = await deleteGradeAction(grade.id)
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Đã xóa' })
      } else {
        setFeedback({ type: 'error', text: res.message || 'Không thể xóa' })
      }
      setTimeout(() => setFeedback(null), 4000)
    })
  }

  return (
    <div className="bg-white border border-slate-200 shadow-2xs">
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-900" />
          <h2 className="text-base font-bold text-slate-900">Danh Sách Khối Lớp</h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
            {grades.length} khối
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-semibold px-3 py-2 hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm Khối Lớp</span>
        </button>
      </div>

      {feedback && (
        <div className={`m-4 p-3 text-xs font-semibold border ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Form Add New */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-blue-50/40 border-b border-blue-100 space-y-3">
          <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">
            Thêm khối lớp mới (Ví dụ: Lớp 6, Lớp 7, Ôn thi ĐGNL...)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên khối lớp *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Lớp 6 hoặc Luyện thi ĐGNL"
                required
                className="w-full text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Thứ tự hiển thị</label>
              <input
                type="number"
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value)}
                placeholder="6"
                className="w-full text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-900 bg-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-bold px-4 py-1.5 hover:bg-blue-800 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Lưu Khối Lớp</span>
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-3 px-4 w-16 text-center">Thứ tự</th>
              <th className="py-3 px-4">Tên Khối Lớp</th>
              <th className="py-3 px-4 text-center">Số khóa học</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grades.map((grade) => {
              const isEditing = editingId === grade.id

              if (isEditing) {
                return (
                  <tr key={grade.id} className="bg-amber-50/40">
                    <td className="py-2.5 px-4 text-center">
                      <input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(e.target.value)}
                        className="w-14 text-center text-xs px-1.5 py-1 border border-slate-300 focus:outline-none focus:border-blue-900"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full max-w-xs text-xs px-2.5 py-1 border border-slate-300 focus:outline-none focus:border-blue-900 font-medium"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-500">
                      {grade._count.courses} khóa
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleSaveEdit(grade.id)}
                          disabled={isPending}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 transition-colors"
                          title="Lưu"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors"
                          title="Hủy"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={grade.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-center font-mono font-medium text-slate-500">
                    {grade.orderNum}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {grade.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {grade._count.courses} khóa học
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(grade)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-blue-900 px-2 py-1 hover:bg-slate-100 transition-colors"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(grade)}
                        disabled={isPending || grade._count.courses > 0}
                        title={grade._count.courses > 0 ? "Không thể xóa vì đang có khóa học" : "Xóa"}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 hover:text-rose-900 px-2 py-1 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
