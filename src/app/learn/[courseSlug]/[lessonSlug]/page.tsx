import { redirect } from 'next/navigation'

export default async function LegacyLessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>
}) {
  const { courseSlug, lessonSlug } = await params
  redirect(`/learn/${courseSlug}?lesson=${lessonSlug}`)
}
