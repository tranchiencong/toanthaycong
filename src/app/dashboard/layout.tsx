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
  const [profile, categories] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authUser.id },
    }),
    getCategoriesFromDB(),
  ])

  // Enforce onboarding completion
  if (!profile || !profile.phone || !profile.dateOfBirth) {
    redirect('/onboarding')
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
