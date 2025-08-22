import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  const categories = await prisma.category.findMany()
  return NextResponse.json(categories)
}
