// app/api/products/[id]/route.ts
import { prisma } from '@/libs/prisma'
import { NextResponse } from 'next/server'
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const id = parseInt(params.id)
    const updated = await prisma.product.update({
        where: { id },
        data: {
            name: body.name,
            description: body.description,
            price: body.price,
        },
    })
    return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id)
    const deleted = await prisma.product.delete({
        where: { id },
    })
    return NextResponse.json({ message: 'Deleted', deleted })
}