import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    // ยังไม่ได้ login → ส่งไปหน้า login
    redirect("/login")
  }

  if (session.user.role !== "admin") {
    // login แล้วแต่ไม่ใช่ admin → ส่งไป unauthorized
    redirect("/unauthorized")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Area</h1>
      <p>ผู้ใช้: {session.user.username}</p>
      <p>บทบาท: {session.user.role}</p>
      <p className="text-sm text-gray-600 mt-2">
        หน้านี้สำหรับผู้ดูแลระบบเท่านั้น
      </p>
    </div>
  )
}
