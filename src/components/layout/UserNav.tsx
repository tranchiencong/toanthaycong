'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  User as UserIcon,
  BookOpen,
  KeyRound,
  ShieldCheck,
  History,
  LogOut,
  GraduationCap,
  ShieldAlert,
  Bell,
  HelpCircle,
  Check,
  ChevronRight,
} from 'lucide-react'
import { signOutAction } from '@/app/dashboard/actions'

export type UserNavProfile = {
  id: string
  email: string
  fullName: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  avatarUrl?: string | null
}

function getInitials(name?: string | null): string {
  if (!name) return 'TC'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function UserNav({
  user,
  showMyLearningLink = true,
}: {
  user: UserNavProfile
  showMyLearningLink?: boolean
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isBellOpen, setIsBellOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)

  const initials = getInitials(user.fullName)

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsBellOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
        setIsBellOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const roleLabel =
    user.role === 'ADMIN'
      ? 'Quản trị viên'
      : user.role === 'TEACHER'
      ? 'Giáo viên'
      : 'Học viên'

  const roleBadgeClass =
    user.role === 'ADMIN'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : user.role === 'TEACHER'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-blue-50 text-blue-900 border-blue-200'

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* 1. "Khóa học của tôi" / My Learning Quick Link (Udemy style) */}
      {showMyLearningLink && (
        <Link
          href="/dashboard"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <BookOpen className="h-4 w-4 text-slate-500" />
          <span>Học tập</span>
        </Link>
      )}

      {/* 2. Notification Bell (Udemy style) */}
      <div className="relative" ref={bellRef}>
        <button
          type="button"
          onClick={() => {
            setIsBellOpen(!isBellOpen)
            setIsDropdownOpen(false)
          }}
          title="Thông báo"
          className="relative p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900"
          aria-expanded={isBellOpen}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
        </button>

        {isBellOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Thông báo học tập</h4>
              <span className="text-[11px] text-blue-900 font-semibold cursor-pointer hover:underline">
                Đánh dấu đã đọc
              </span>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto divide-y divide-slate-50">
              <div className="px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Chào mừng bạn đến với Toán Thầy Công!
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Hãy khám phá các bài giảng chất lượng cao nhé.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Vừa xong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. User Avatar & Udemy-Style Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen)
            setIsBellOpen(false)
          }}
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 transition-transform active:scale-95"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-900 via-indigo-800 to-blue-700 text-white font-bold text-xs sm:text-sm tracking-wider shadow-sm ring-2 ring-slate-100 hover:ring-blue-300 transition-all">
            {initials}
          </div>
        </button>

        {/* Dropdown Menu (Udemy Profile Card) */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* User Header Profile Card */}
            <Link
              href="/dashboard/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="group block px-4 py-3 hover:bg-slate-50/80 transition-colors border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-900 to-indigo-800 text-white font-bold text-base shadow-sm ring-2 ring-blue-100">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-900 transition-colors">
                      {user.fullName}
                    </h4>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-900 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {user.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleBadgeClass}`}
                    >
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Menu Items: Learning Section */}
            <div className="px-2 py-1.5">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Học tập
              </div>
              <Link
                href="/dashboard"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:text-blue-900 hover:bg-blue-50/60 rounded-xl transition-colors font-medium"
              >
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span>Khóa học của tôi</span>
              </Link>
              <Link
                href="/dashboard#activation"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:text-blue-900 hover:bg-blue-50/60 rounded-xl transition-colors font-medium"
              >
                <KeyRound className="h-4 w-4 text-slate-400" />
                <span>Kích hoạt mã khóa học</span>
              </Link>
            </div>

            <div className="h-px bg-slate-100 my-1" />

            {/* Menu Items: Profile & Settings Section */}
            <div className="px-2 py-1.5">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Tài khoản & Hồ sơ
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:text-blue-900 hover:bg-blue-50/60 rounded-xl transition-colors font-medium"
              >
                <UserIcon className="h-4 w-4 text-slate-400" />
                <span>Hồ sơ cá nhân</span>
              </Link>
              <Link
                href="/dashboard/profile?tab=security"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:text-blue-900 hover:bg-blue-50/60 rounded-xl transition-colors font-medium"
              >
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <span>Bảo mật & Đổi mật khẩu</span>
              </Link>
              <Link
                href="/dashboard/profile?tab=history"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:text-blue-900 hover:bg-blue-50/60 rounded-xl transition-colors font-medium"
              >
                <History className="h-4 w-4 text-slate-400" />
                <span>Lịch sử học tập & Mã thẻ</span>
              </Link>
            </div>

            {/* Teacher / Admin Management Portal Links */}
            {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
              <>
                <div className="h-px bg-slate-100 my-1" />
                <div className="px-2 py-1.5">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Khu vực quản lý
                  </div>
                  <Link
                    href="/teacher"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-amber-900 hover:bg-amber-50 rounded-xl transition-colors font-semibold"
                  >
                    <GraduationCap className="h-4 w-4 text-amber-600" />
                    <span>Cổng Giáo viên</span>
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-rose-900 hover:bg-rose-50 rounded-xl transition-colors font-semibold"
                    >
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>Cổng Quản trị CRM</span>
                    </Link>
                  )}
                </div>
              </>
            )}

            <div className="h-px bg-slate-100 my-1" />

            {/* Support link */}
            <div className="px-2 py-1">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-blue-900 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Hỗ trợ & Hỏi bài Zalo</span>
              </a>
            </div>

            <div className="h-px bg-slate-100 my-1" />

            {/* Sign Out Button */}
            <div className="px-2 pt-1 pb-0.5">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-medium text-left"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Đăng xuất</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
