import { prisma } from '@/lib/prisma'
import { cache } from 'react'

export type CategoryCourse = {
  id: string
  title: string
  slug: string
  tags: string[]
  subjectId: string
  subjectName: string
  chaptersCount: number
}

export type CategorySubject = {
  id: string
  name: string
  courses: CategoryCourse[]
}

export type CategoryGrade = {
  id: string
  name: string
  orderNum: number
  totalCoursesCount: number
  subjects: CategorySubject[]
  // Flat courses list for backward compatibility and quick lookups
  courses: CategoryCourse[]
}

export const getCategoriesFromDB = cache(async (): Promise<CategoryGrade[]> => {
  try {
    const grades = await prisma.grade.findMany({
      orderBy: { orderNum: 'asc' },
      include: {
        courses: {
          where: { isPublished: true },
          include: {
            subject: {
              select: { id: true, name: true },
            },
            _count: {
              select: { chapters: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return grades.map((grade) => {
      const courses: CategoryCourse[] = grade.courses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        tags: c.tags,
        subjectId: c.subject?.id || '',
        subjectName: c.subject?.name || 'Môn Học',
        chaptersCount: c._count.chapters,
      }))

      // Group courses dynamically by their actual Subject in the database
      const subjectMap = new Map<string, CategorySubject>()

      for (const course of courses) {
        const subId = course.subjectId || 'default'
        const subName = course.subjectName

        if (!subjectMap.has(subId)) {
          subjectMap.set(subId, {
            id: subId,
            name: subName,
            courses: [],
          })
        }
        subjectMap.get(subId)!.courses.push(course)
      }

      const subjects = Array.from(subjectMap.values())

      return {
        id: grade.id,
        name: grade.name,
        orderNum: grade.orderNum,
        totalCoursesCount: courses.length,
        subjects,
        courses,
      }
    })
  } catch (error) {
    console.error('Error fetching categories from database:', error)
    return []
  }
})
