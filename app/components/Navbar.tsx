"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const pathname = usePathname()

  // ปิด dropdown เมื่อคลิกนอก/กด Esc/เปลี่ยนหน้า
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!open) return
      const t = e.target as Node
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("mousedown", onClickOutside)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onClickOutside)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])
  useEffect(() => { if (open) setOpen(false) }, [pathname])

  const user = session?.user

  return (
    <header className="w-full bg-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* โลโก้ */}
        <Link href="/" className="text-xl font-bold text-red-700">ระบบสินค้า</Link>

        {/* เมนูกลาง — แสดงเฉพาะเมื่อ login แล้ว */}
        {user && (
          <nav className="hidden md:flex gap-4">
            <Link href="/products" className="px-3 py-2 rounded hover:bg-gray-100">
              ดูสินค้า
            </Link>

            {/* ถ้าต้องการเฉพาะ admin: {user.role === "admin" && ( ... )} */}
            <Link href="/products/new" className="px-3 py-2 rounded hover:bg-gray-100">
              เพิ่มสินค้าใหม่
            </Link>
          </nav>
        )}

        {/* ด้านขวา */}
        <div className="flex items-center gap-3 relative">
          {status === "loading" ? (
            <div className="h-9 w-28 bg-gray-100 rounded animate-pulse" />
          ) : !user ? (
            <>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                ลงทะเบียน
              </Link>
            </>
          ) : (
            <>
              <button
                ref={btnRef}
                onClick={() => setOpen(v => !v)}
                className="flex items-center focus:outline-none"
                aria-haspopup="menu" aria-expanded={open} aria-label="เปิดเมนูผู้ใช้"
              >
                <span className="text-2xl">👤</span>
              </button>

              {open && (
                <div
                  ref={menuRef}
                  role="menu"
                  className="absolute right-0 top-12 w-56 bg-white shadow-lg rounded-md border overflow-hidden"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-semibold truncate">{user.username}</div>
                    <div className="text-gray-500">role: {user.role}</div>
                  </div>

                  <Link href="/dashboard" role="menuitem" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    แดชบอร์ด
                  </Link>
                  <Link href="/profile" role="menuitem" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    โปรไฟล์ / เปลี่ยนรหัสผ่าน
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin/users" role="menuitem" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      จัดการผู้ใช้ (Admin)
                    </Link>
                  )}
                  <button
                    role="menuitem"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
