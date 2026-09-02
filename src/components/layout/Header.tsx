'use client'

import Link from 'next/link'
import { Calculator, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-colors hover:text-blue-900 group">
          <div className="flex h-8 w-8 items-center justify-center bg-blue-900 text-white transition-transform group-hover:bg-purple-600">
            <Calculator className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight text-gray-900 group-hover:text-blue-900">
            Toán Thầy Công
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/courses" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 px-2 py-1">Khóa học</Link>
          <Link href="#features" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 px-2 py-1">Phương pháp</Link>
          <Link href="#reviews" className="hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 px-2 py-1">Đánh giá</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 px-2 py-1">
            Đăng nhập
          </Link>
          <Link href="/courses" className="bg-purple-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2">
            Bắt đầu học
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-6 shadow-sm">
          <nav className="flex flex-col gap-4">
            <Link href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-600 hover:text-blue-900">Khóa học</Link>
            <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-600 hover:text-blue-900">Phương pháp</Link>
            <Link href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-600 hover:text-blue-900">Đánh giá</Link>
            <hr className="border-gray-100 my-2" />
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-600 hover:text-blue-900">
              Đăng nhập
            </Link>
            <Link href="/courses" onClick={() => setIsMobileMenuOpen(false)} className="bg-purple-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-purple-700">
              Bắt đầu học ngay
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
