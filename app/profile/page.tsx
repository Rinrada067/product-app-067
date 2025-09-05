// app/profile/page.tsx
'use client'
import { useState } from 'react'

export default function ProfilePage() {
  const [currentPassword, setCur] = useState('')
  const [newPassword, setNew] = useState('')
  const [msg, setMsg] = useState<{ok?:string; err?:string}>({})

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/profile/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const data = await res.json()
    res.ok ? setMsg({ok: data.message || 'เปลี่ยนรหัสผ่านสำเร็จ'}) : setMsg({err: data.error || 'ไม่สำเร็จ'})
    setCur(''); setNew('')
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">โปรไฟล์</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" type="password" placeholder="รหัสปัจจุบัน"
               value={currentPassword} onChange={e=>setCur(e.target.value)} required />
        <input className="w-full border p-2 rounded" type="password" placeholder="รหัสใหม่ (≥6)"
               value={newPassword} onChange={e=>setNew(e.target.value)} required minLength={6} />
        {msg.err && <p className="text-red-600 text-sm">{msg.err}</p>}
        {msg.ok  && <p className="text-green-600 text-sm">{msg.ok}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">บันทึก</button>
      </form>
    </main>
  )
}
