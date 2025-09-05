// app/page.tsx
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 to-red-200">
      <h1 className="text-4xl font-bold text-red-800 mb-4">
        ยินดีต้อนรับเข้าสู่ระบบสินค้า
      </h1>
      <p className="text-gray-700 text-lg">
        กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานระบบ
      </p>
    </div>
  )
}
