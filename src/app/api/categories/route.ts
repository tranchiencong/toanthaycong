import { NextResponse } from 'next/server'
import { getCategoriesFromDB } from '@/lib/data/categories'

export async function GET() {
  const categories = await getCategoriesFromDB()
  return NextResponse.json(categories)
}
