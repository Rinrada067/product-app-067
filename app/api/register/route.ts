import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import {prisma} from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json()

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Username/Password ห้ามว่าง' }, { status: 400 })
    }

    // ตรวจว่ามี username นี้แล้วหรือยัง
    const exists = await prisma.user.findUnique({ where: { username } })
    if (exists) {
      return NextResponse.json({ error: 'Username นี้ถูกใช้แล้ว' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        // ป้องกัน: ถ้าไม่ใช่ admin ให้บังคับเป็น user
        role: role === 'admin' ? 'admin' : 'user',
      },
      select: { id: true, username: true, role: true, createdAt: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
