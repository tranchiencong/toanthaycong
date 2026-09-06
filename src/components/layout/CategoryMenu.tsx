'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import type { CategoryGrade } from '@/lib/data/categories'

export function CategoryMenu({
  categories: initialCategories = [],
}: {
  categories?: CategoryGrade[]
}) {
  const [categories, setCategories] = useState<CategoryGrade[]>(initialCategories)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGradeId, setSelectedGradeId] = useState<string>('')

  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch categories from database API if initialCategories was empty
  useEffect(() => {
    if (initialCategories.length > 0) return

    let isMounted = true
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data: CategoryGrade[]) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCategories(data)
        }
      })
      .catch((err) => {
        console.warn('Could not fetch categories from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [initialCategories.length])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  // Close on Escape or click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Instant opening on mouse enter (0ms delay)
  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(true)
  }, [])

  // Gentle grace period on mouse leave (120ms) so slight slip does not drop menu
  const handleMouseLeave = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      closeTimeoutRef.current = null
    }, 120)
  }, [])

  // Instant grade switch on hover (0ms delay)
  const handleGradeHover = useCallback((gradeId: string) => {
    setSelectedGradeId(gradeId)
  }, [])

  // Derive active grade
  const effectiveGradeId =
    selectedGradeId ||
    categories.find((c) => c.name.includes('12'))?.id ||
    categories[0]?.id ||
    ''

  const activeGrade =
    categories.find((c) => c.id === effectiveGradeId) || categories[0]

  return (
    <div
      className="relative flex items-center"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button: Minimalist, clean, instant feedback */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-3 h-9 text-sm font-medium transition-colors cursor-pointer select-none ${
          isOpen
            ? 'text-blue-900 bg-gray-50'
            : 'text-gray-700 hover:text-blue-900 hover:bg-gray-50'
        }`}
        aria-expanded={isOpen}
      >
        <LayoutGrid className="h-4 w-4 text-blue-900 shrink-0" />
        <span>Danh mục khóa học</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-blue-900' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu: Seamless zero-gap bridge, instant render */}
      <div
        className={`absolute left-0 top-full pt-1 w-[620px] z-50 transition-all duration-150 ease-out origin-top-left ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto visible'
            : 'opacity-0 scale-95 pointer-events-none invisible'
        }`}
      >
        <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
          {/* 2-Column Minimalist Layout */}
          <div className="grid grid-cols-12 min-h-[250px]">
            
            {/* Cột 1: Khối lớp (Minimalist Sidebar) */}
            <div className="col-span-4 bg-gray-50/60 border-r border-gray-100 py-2">
              <div className="px-3.5 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Khối lớp
              </div>
              <div className="space-y-0.5 px-1.5 mt-1">
                {categories.map((grade) => {
                  const isSelected = grade.id === activeGrade?.id

                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onMouseEnter={() => handleGradeHover(grade.id)}
                      onClick={() => handleGradeHover(grade.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-white text-blue-900 font-semibold border-l-2 border-blue-900 shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                      }`}
                    >
                      <span>{grade.name}</span>
                      <span className="text-[11px] text-gray-400 font-normal">
                        {grade.totalCoursesCount} khóa
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cột 2: Môn học & Khóa học tương ứng (Instant Update) */}
            <div className="col-span-8 p-5 flex flex-col justify-between bg-white">
              <div>
                {/* Header khối lớp đang chọn */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-900">
                    Khóa học {activeGrade?.name}
                  </span>
                  {activeGrade && (
                    <Link
                      href={`/courses?grade=${activeGrade.id}`}
                      onClick={() => setIsOpen(false)}
                      className="text-xs text-blue-900 hover:underline font-medium"
                    >
                      Lọc {activeGrade.name}
                    </Link>
                  )}
                </div>

                {/* Danh sách Môn & Khóa học */}
                {activeGrade && activeGrade.subjects && activeGrade.subjects.length > 0 ? (
                  <div className="space-y-3">
                    {activeGrade.subjects.map((subject) => (
                      <div key={subject.id}>
                        {/* Tên môn học từ DB */}
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          {subject.name}
                        </div>

                        <div className="space-y-1">
                          {subject.courses.map((course) => (
                            <Link
                              key={course.id}
                              href={`/courses/${course.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="group block py-1.5 px-2 -mx-2 hover:bg-gray-50 transition-colors rounded-sm"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-gray-700 group-hover:text-blue-900 font-medium line-clamp-1 transition-colors">
                                  {course.title}
                                </span>
                                <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-900 shrink-0 transition-colors" />
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span>{course.chaptersCount} chương</span>
                                {course.tags && course.tags.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-gray-500">
                                      {course.tags.slice(0, 2).join(', ')}
                                    </span>
                                  </>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-gray-400">
                    Chưa có khóa học cho {activeGrade?.name}.
                  </div>
                )}
              </div>

              {/* Chân menu: Tinh gọn */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <Link
                  href="/courses"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Xem tất cả danh mục
                </Link>
                {activeGrade && (
                  <Link
                    href={`/courses?grade=${activeGrade.id}`}
                    onClick={() => setIsOpen(false)}
                    className="text-blue-900 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Toàn bộ {activeGrade.name}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
