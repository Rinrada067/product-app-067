// app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>ยินดีต้อนรับ, {session.user.username}</p>
      <p>บทบาท: {session.user.role}</p>

      <div className="mt-4">
        <Link
          href="/profile"
          className="text-blue-600 underline hover:text-blue-800"
        >
          ไปที่โปรไฟล์ (แก้ไขรหัสผ่าน)
        </Link>
      </div>
    </div>
  )
}
