import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { UserNav } from '@/components/layout/UserNav'
import { TeacherNav } from './TeacherNav'

export const metadata = {
  title: 'Cổng Quản Trị Giáo Viên | Toán Thầy Công',
  description: 'Quản lý khóa học, bài giảng và mã kích hoạt dành cho Thầy Công.',
}

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?redirect=/teacher')
  }

  const profile = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!profile || (profile.role !== 'TEACHER' && profile.role !== 'ADMIN')) {
    redirect('/dashboard')
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* Math Caro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Teacher Top Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" href="/teacher" />
            <span className="text-slate-300 font-light text-lg select-none">/</span>
            <span className="text-xs font-semibold text-slate-700 tracking-wider">
              Giảng dạy
            </span>
          </div>

          <div className="flex items-center gap-3">
            <UserNav user={profile} showMyLearningLink={false} />
          </div>
        </div>
      </header>

      {/* Sub Navigation Bar */}
      <TeacherNav />

      {/* Main Workspace */}
      <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5">
        {children}
      </main>
    </div>
  )
}
