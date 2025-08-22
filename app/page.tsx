'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <h1 className="text-4xl font-bold text-orange-800 mb-6 text-center flex items-center gap-3">
        <span>🍽️</span>
        ยินดีต้อนรับเข้าสู่ระบบเมนูอาหาร
      </h1>

      <p className="text-orange-600 mb-8 text-center">
        สำรวจเมนูอาหาร หรือเพิ่มเมนูใหม่ได้ที่นี่ 🍜
      </p>

      <nav>
        <ul className="flex flex-col md:flex-row gap-4">
          <li>
            <Link
              href="/products"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600 transition"
            >
              🍲 ดูรายการอาหาร
            </Link>
          </li>
          <li>
            <Link
              href="/products/new"
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
            >
              ➕ เพิ่มเมนูใหม่
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
