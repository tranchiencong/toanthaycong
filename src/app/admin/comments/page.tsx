import { prisma } from '@/lib/prisma'
import { CommentModerationClient } from './CommentModerationClient'

export const metadata = {
  title: 'Kiểm Duyệt Hỏi Đáp & Bình Luận | Cổng Quản Trị',
  description: 'Quản lý, giải đáp và xóa các bình luận spam dưới video bài giảng.',
}

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
          orderNum: true,
          chapter: {
            select: {
              title: true,
              course: {
                select: {
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Kiểm Duyệt Hỏi Đáp & Bình Luận Bài Giảng
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Theo dõi tất cả câu hỏi học tập của học sinh dưới các bài học, phát hiện và xóa nhanh các bình luận spam.
        </p>
      </div>

      {/* Comments Table */}
      <CommentModerationClient comments={comments} />
    </div>
  )
}
