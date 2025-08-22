import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const categories = await prisma.category.findMany()
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const body = await req.json()

  // ตรวจสอบว่า name ถูกส่งมาหรือไม่
  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'กรุณาระบุชื่อหมวดหมู่ (name)' }, { status: 400 })
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
      },
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'ไม่สามารถเพิ่มหมวดหมู่ได้' }, { status: 500 })
  }
}