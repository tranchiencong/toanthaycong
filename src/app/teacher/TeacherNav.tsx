'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Key, ExternalLink } from 'lucide-react'

const navItems = [
  {
    href: '/teacher',
    label: 'Tổng quan',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/teacher/courses',
    label: 'Khóa học & Bài giảng',
    icon: BookOpen,
    exact: false,
  },
  {
    href: '/teacher/activation-codes',
    label: 'Kho Mã Kích Hoạt',
    icon: Key,
    exact: false,
  },
]

export function TeacherNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <nav className="flex space-x-1 sm:space-x-2 -mb-px">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-blue-900 text-blue-900 font-bold bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-900 px-2 py-1 transition-colors"
          >
            <span>Khu vực học tập</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}
