import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // ช่วย debug ดูคําสั่งที่ยิงไป DB ระหว่างพัฒนา
  })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma