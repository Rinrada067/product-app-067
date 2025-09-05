"use client"
import { useEffect, useState } from "react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])

  async function loadUsers() {
    const res = await fetch("/api/admin/users")
    if (res.ok) setUsers(await res.json())
  }

  useEffect(() => { loadUsers() }, [])

  async function changeRole(id: string, role: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
    loadUsers()
  }

  async function deleteUser(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    loadUsers()
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">จัดการผู้ใช้</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.username}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">
                <button onClick={() => changeRole(u.id, u.role === "admin" ? "user" : "admin")} className="btn bg-blue-500 text-white mr-2">เปลี่ยน Role</button>
                <button onClick={() => deleteUser(u.id)} className="btn bg-red-500 text-white">ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
