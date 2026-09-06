import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  href?: string
}

export function Logo({
  size = 'md',
  showText = true,
  className = '',
  href = '/',
}: LogoProps) {
  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const markSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  }

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-extrabold',
  }

  const content = (
    <div className={`inline-flex items-center gap-2.5 group transition-transform ${className}`}>
      {/* Biểu tượng logo Toán Thầy Công */}
      <div
        className={`${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform group-hover:scale-105`}
      >
        <Image
          src="/icon.svg"
          alt="Toán Thầy Công Logo"
          width={markSizes[size]}
          height={markSizes[size]}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center text-left">
          <span
            className={`${textSizes[size]} tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-tight font-heading`}
          >
            Toán Thầy Công
          </span>
          {size === 'lg' && (
            <span className="text-xs text-slate-500 font-medium tracking-normal mt-0.5">
              Học Toán từ bản chất
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    )
  }

  return content
}
