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
    <div className="space-y-8">
      {/* Search Box */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tìm kiếm</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tên khóa học..." 
            className="w-full pl-4 pr-10 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
            defaultValue={searchParams.get('q') || ''}
            onChange={(e) => {
              // Debounce in a real app, but for simplicity here we just use blur or enter
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                router.push(`/courses?${createQueryString('q', e.currentTarget.value)}`, { scroll: false })
              }
            }}
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grade Filter */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Khối Lớp</h3>
        <div className="space-y-3">
          {grades.map((grade) => {
            const isSelected = currentGradeId === grade.id
            return (
              <label key={grade.id} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-900 border-blue-900 text-white' : 'border-gray-300 bg-white group-hover:border-blue-900'}`}>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-colors ${isSelected ? 'font-bold text-blue-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
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
