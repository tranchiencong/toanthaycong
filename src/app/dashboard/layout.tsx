import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { getCategoriesFromDB } from '@/lib/data/categories'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?redirect=/dashboard')
  }

  // Fetch full user profile and categories from Prisma
  const [existingProfile, categories] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authUser.id },
    }),
    getCategoriesFromDB(),
  ])

  let profile = existingProfile

  // Auto-initialize profile for OAuth users if not yet created
  if (!profile) {
    try {
      profile = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email ?? '',
          fullName:
            (authUser.user_metadata?.full_name as string) ||
            (authUser.user_metadata?.name as string) ||
            authUser.email?.split('@')[0] ||
            'Học viên',
          role: 'STUDENT',
          avatarUrl: (authUser.user_metadata?.avatar_url as string) || null,
        },
      })
    } catch (createErr) {
      console.error('Error auto-creating profile in dashboard layout:', createErr)
    }
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Math Caro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Header user={profile} categories={categories} />
      <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
