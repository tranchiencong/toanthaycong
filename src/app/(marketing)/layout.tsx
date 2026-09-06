import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCategoriesFromDB } from '@/lib/data/categories'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, supabase] = await Promise.all([
    getCategoriesFromDB(),
    createClient(),
  ])

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let profile = null
  if (authUser) {
    profile = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
      },
    })
  }

  return (
    <>
      <Header user={profile} categories={categories} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  )
}
