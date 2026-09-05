import React from 'react'
import Link from 'next/link'

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
    <div className={`inline-flex items-center gap-3 group transition-transform ${className}`}>
      {/* Biểu tượng logo Monogram "tc" */}
      <div
        className={`${iconSizes[size]} shrink-0 flex items-center justify-center rounded-lg bg-blue-900 text-white shadow-sm transition-all group-hover:bg-blue-800 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 40 40"
          width={markSizes[size]}
          height={markSizes[size]}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Chữ tc thiết kế dạng Monogram hình học hiện đại */}
          <text
            x="20"
            y="27"
            textAnchor="middle"
            fill="white"
            style={{
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 900,
              fontSize: '22px',
              letterSpacing: '1.5px',
            }}
          >
            tc
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
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
    return <Link href={href}>{content}</Link>
  }

  return content
}
