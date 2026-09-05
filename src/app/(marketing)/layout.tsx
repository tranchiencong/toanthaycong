import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCategoriesFromDB } from '@/lib/data/categories'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategoriesFromDB()

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  )
}
