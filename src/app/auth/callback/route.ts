import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { prisma } from '@/lib/prisma'

function getSafeRedirectUrl(target: string | null): string {
  if (!target) return '/dashboard'
  const trimmed = target.trim()
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.includes('://')
  ) {
    return '/dashboard'
  }
  return trimmed
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const rawRedirect = requestUrl.searchParams.get('redirect')
  const safeRedirect = getSafeRedirectUrl(rawRedirect)

  if (code) {
    const redirectUrl = new URL(safeRedirect, request.url)
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      try {
        const user = data.user
        const fullName =
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          user.email?.split('@')[0] ||
          'Học viên'
        const avatarUrl = (user.user_metadata?.avatar_url as string) || null

        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            avatarUrl: avatarUrl || undefined,
          },
          create: {
            id: user.id,
            email: user.email ?? '',
            fullName,
            avatarUrl,
            role: 'STUDENT',
          },
        })
      } catch (dbErr) {
        console.error('Lỗi khi đồng bộ user profile từ OAuth callback:', dbErr)
      }

      return response
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url))
}
