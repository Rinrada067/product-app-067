import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

import { Session } from "inspector/promises";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" as const }, // ✅ ตัวเล็ก
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // 1) ค้นหาผู้ใช้
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        })
        if (!user) return null

        // 2) ตรวจรหัสผ่าน
        const ok = await bcrypt.compare(credentials.password, user.password)
        if (!ok) return null

        // 3) return เฉพาะ field ที่จำเป็น
        return { id: user.id, username: user.username, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.username = (user as any).username
        token.role = (user as any).role
      }
      return token   // ✅ ต้อง return token
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        id: token.id as string,
        username: token.username as string,
        role: token.role as string,
      }
      return session   // ✅ return session ที่แก้แล้ว
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }