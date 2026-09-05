'use client'

import Link from 'next/link'
import {
  Menu,
  X,
  Search,
  BookOpen,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  ChevronRight,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'
import { CategoryMenu } from './CategoryMenu'
import { UserNav, type UserNavProfile } from './UserNav'
import type { CategoryGrade } from '@/lib/data/categories'
import { signOutAction } from '@/app/dashboard/actions'

export function Header({
  user: initialUser,
  categories = [],
}: {
  user?: UserNavProfile | null
  categories?: CategoryGrade[]
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserNavProfile | null>(
    initialUser || null
  )

  useEffect(() => {
    if (initialUser) return

    const supabase = createClient()

    // 1. Initial check
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUser({
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.fullName || 'Học viên',
          role:
            (data.user.user_metadata?.role as 'STUDENT' | 'TEACHER' | 'ADMIN') ||
            'STUDENT',
          avatarUrl: data.user.user_metadata?.avatarUrl || null,
        })
      }
    })

    // 2. Real-time auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.fullName || 'Học viên',
          role:
            (session.user.user_metadata?.role as 'STUDENT' | 'TEACHER' | 'ADMIN') ||
            'STUDENT',
          avatarUrl: session.user.user_metadata?.avatarUrl || null,
        })
      } else {
        setCurrentUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-2xs">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo (always home /) & Mega-Menu Danh mục khóa học */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          {/* Logo ALWAYS redirects to home page / */}
          <Logo size="sm" showText={true} href="/" />

          {/* Education-standard Category Mega-Menu (Database-driven) */}
          <div className="hidden md:block">
            <CategoryMenu categories={categories} />
          </div>
        </div>

        {/* Center: Search Bar (Coursera / Udemy standard) */}
        <div className="hidden sm:flex flex-1 max-w-md lg:max-w-lg mx-2">
          <form
            action="/courses"
            method="GET"
            className="relative w-full flex items-center"
          >
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Tìm kiếm bài giảng, chuyên đề môn Toán..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-900 focus:outline-none transition-all placeholder:text-gray-400 text-gray-900"
            />
          </form>
        </div>

        {/* Right Action: Auth or UserNav Dropdown */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-gray-700 hover:text-blue-900 transition-colors flex items-center gap-1.5 px-2 py-1.5"
              >
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span>Khóa học của tôi</span>
              </Link>
              <UserNav user={currentUser} showMyLearningLink={false} />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-900 transition-colors px-3 py-2"
              >
                Đăng nhập
              </Link>
              {/* Nút Đăng ký không bo tròn - nguyên bản vuông vắn */}
              <Link
                href="/sign-up"
                className="bg-purple-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile Header Controls */}
        <div className="flex items-center gap-2 sm:hidden">
          {currentUser && (
            <UserNav user={currentUser} showMyLearningLink={false} />
          )}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-4 py-5 shadow-lg space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Bar */}
          <form action="/courses" method="GET" className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Tìm kiếm bài giảng môn Toán..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-900 focus:outline-none transition-all placeholder:text-gray-400 text-gray-900"
            />
          </form>

          {currentUser && (
            /* Mobile User Profile Info */
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-900 to-indigo-800 text-white font-bold text-sm shadow-sm">
                  {currentUser.fullName?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-sm truncate">
                    {currentUser.fullName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50/70 border border-blue-100"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Bàn học</span>
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Hồ sơ</span>
                </Link>
              </div>
            </div>
          )}

          {/* Categories by Grade on Mobile (From Database) */}
          <div className="space-y-1">
            <div className="px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Khóa học theo khối lớp
            </div>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/courses?grade=${cat.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-800"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 text-gray-500">
                    {cat.totalCoursesCount ?? cat.courses.length} khóa học
                  </span>
                </Link>
              ))
            ) : (
              <Link
                href="/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 text-sm text-gray-600 hover:text-blue-900"
              >
                Xem danh mục khóa học
              </Link>
            )}
            <Link
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 text-sm font-bold text-blue-900 hover:bg-blue-50/50 rounded-lg"
            >
              <span>Xem tất cả khóa học</span>
              <ChevronRight className="h-4 w-4 text-blue-900" />
            </Link>
          </div>

          <hr className="border-gray-100 my-1" />

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-blue-900 font-semibold hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Khóa học của tôi</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/dashboard/profile?tab=security"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                    <span>Bảo mật tài khoản</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>

                {currentUser.role === 'TEACHER' && (
                  <Link
                    href="/teacher"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-amber-800 hover:bg-amber-50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-amber-600" />
                      <span>Cổng Giáo viên</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-amber-600" />
                  </Link>
                )}

                {currentUser.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-rose-800 hover:bg-rose-50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>Cổng Quản trị CRM</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-rose-600" />
                  </Link>
                )}

                <div className="pt-2">
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-gray-700 hover:text-blue-900 border border-gray-200"
                >
                  Đăng nhập
                </Link>
                {/* Nút Đăng ký mobile không bo tròn */}
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-purple-600 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-purple-700"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
