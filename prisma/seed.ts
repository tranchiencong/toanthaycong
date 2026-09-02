import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Clearing database...')
  // Cleanup existing data
  await prisma.enrollment.deleteMany()
  await prisma.activationCode.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.course.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.grade.deleteMany()
  
  // NOTE: We don't delete Users entirely to avoid deleting the dev's auth accounts, 
  // but we should create a Teacher if one doesn't exist.
  
  console.log('Seeding Grades...')
  const grade10 = await prisma.grade.create({ data: { name: 'Lớp 10', orderNum: 10 } })
  const grade11 = await prisma.grade.create({ data: { name: 'Lớp 11', orderNum: 11 } })
  const grade12 = await prisma.grade.create({ data: { name: 'Lớp 12', orderNum: 12 } })

  console.log('Seeding Subjects...')
  const mathSubject = await prisma.subject.create({ data: { name: 'Toán Học' } })

  console.log('Ensuring a Teacher exists...')
  let teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } })
  if (!teacher) {
    // Just create a dummy teacher if none exists. In Supabase, this ID won't match Auth, 
    // but it's fine for displaying Course data.
    teacher = await prisma.user.create({
      data: {
        email: 'teacher@toanthaycong.edu.vn',
        fullName: 'Thầy Công',
        role: 'TEACHER',
        bio: 'Hơn 10 năm kinh nghiệm luyện thi Đại học khối A, A1.',
      }
    })
  }

  console.log('Seeding Courses...')
  const course11 = await prisma.course.create({
    data: {
      title: 'Toán 11 - Hình học Không gian',
      slug: 'toan-11-hinh-hoc-khong-gian',
      description: 'Làm chủ hình học không gian, thấu hiểu bản chất qua phương pháp trực quan 3D. Loại bỏ nỗi sợ hình học.',
      isPublished: true,
      tags: ['Lớp 11', 'Hình học'],
      teacherId: teacher.id,
      gradeId: grade11.id,
      subjectId: mathSubject.id,
      chapters: {
        create: [
          {
            title: 'Chương 1: Đường thẳng và Mặt phẳng trong không gian',
            orderNum: 1,
            lessons: {
              create: [
                {
                  title: 'Bài 1: Khái niệm mở đầu về mặt phẳng',
                  slug: 'bai-1-khai-niem-mo-dau',
                  youtubeId: 'jNQXAC9IVRw', // Example video ID
                  isPreview: true,
                  durationSeconds: 1500,
                  orderNum: 1
                },
                {
                  title: 'Bài 2: Giao tuyến của hai mặt phẳng',
                  slug: 'bai-2-giao-tuyen',
                  youtubeId: 'ScMzIvxBSi4',
                  isPreview: false,
                  durationSeconds: 1800,
                  orderNum: 2
                }
              ]
            }
          },
          {
            title: 'Chương 2: Quan hệ song song',
            orderNum: 2,
            lessons: {
              create: [
                {
                  title: 'Bài 1: Hai đường thẳng song song',
                  slug: 'bai-1-hai-duong-thang-song-song',
                  youtubeId: 'ScMzIvxBSi4',
                  isPreview: false,
                  durationSeconds: 2100,
                  orderNum: 1
                }
              ]
            }
          }
        ]
      }
    }
  })

  const course12 = await prisma.course.create({
    data: {
      title: 'Toán 12 - Lộ trình Kép 9+ (Tổng ôn)',
      slug: 'toan-12-lo-trinh-kep-9-plus',
      description: 'Khóa học thiết kế chuyên biệt để quét cạn mọi dạng bài thi THPT Quốc gia. Mục tiêu 9+ không còn là ước mơ.',
      isPublished: true,
      tags: ['Lớp 12', 'Tổng ôn', 'THPT QG'],
      teacherId: teacher.id,
      gradeId: grade12.id,
      subjectId: mathSubject.id,
      chapters: {
        create: [
          {
            title: 'Chuyên đề: Khảo sát Hàm số',
            orderNum: 1,
            lessons: {
              create: [
                {
                  title: 'Thực chiến 1: Bài toán Cực trị Hàm ẩn',
                  slug: 'thuc-chien-1-cuc-tri-ham-an',
                  youtubeId: 'jNQXAC9IVRw',
                  isPreview: true,
                  durationSeconds: 2700,
                  orderNum: 1
                },
                {
                  title: 'Thực chiến 2: Tương giao đồ thị bậc cao',
                  slug: 'thuc-chien-2-tuong-giao',
                  youtubeId: 'jNQXAC9IVRw',
                  isPreview: false,
                  durationSeconds: 3200,
                  orderNum: 2
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Seeding Activation Codes...')
  // VIP2026 for Course 11
  await prisma.activationCode.create({
    data: {
      code: 'VIP2026',
      courseId: course11.id,
      isUsed: false
    }
  })
  
  // MATH999 for Course 12
  await prisma.activationCode.create({
    data: {
      code: 'MATH999',
      courseId: course12.id,
      isUsed: false
    }
  })

  console.log('Seed completed successfully!')
  console.log('You can use codes: VIP2026 (For Toán 11) and MATH999 (For Toán 12)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
