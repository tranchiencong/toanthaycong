'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type FilterOption = {
  id: string
  name: string
}

export function CourseFilters({ grades }: { grades: FilterOption[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentGradeId = searchParams.get('grade') || ''

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleGradeChange = (gradeId: string) => {
    // Nếu click lại vào lớp đang chọn thì bỏ chọn
    const newValue = currentGradeId === gradeId ? '' : gradeId
    router.push(`/courses?${createQueryString('grade', newValue)}`, { scroll: false })
  }

  return (
    <div className="space-y-7">
      {/* Search Box */}
      <div>
        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">Tìm kiếm</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tên khóa học..." 
            className="w-full pl-3.5 pr-9 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 text-sm text-slate-800 placeholder:text-slate-400 bg-white"
            defaultValue={searchParams.get('q') || ''}
            onChange={() => {
              // Debounce search in future iteration
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                router.push(`/courses?${createQueryString('q', e.currentTarget.value)}`, { scroll: false })
              }
            }}
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grade Filter */}
      <div>
        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">Khối Lớp</h3>
        <div className="space-y-2.5">
          {grades.map((grade) => {
            const isSelected = currentGradeId === grade.id
            return (
              <label
                key={grade.id}
                onClick={() => handleGradeChange(grade.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-900 border-blue-900 text-white' : 'border-slate-300 bg-white group-hover:border-purple-600'}`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-colors ${isSelected ? 'font-bold text-blue-900' : 'text-slate-600 group-hover:text-purple-600'}`}>
                  {grade.name}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {(currentGradeId || searchParams.get('q')) && (
        <button 
          onClick={() => router.push('/courses', { scroll: false })}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium underline underline-offset-4"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  )
}
