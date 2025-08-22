'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: number
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ดึงหมวดหมู่จากฐานข้อมูลจริง
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/categories') // เรียก API ของเรา
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้')
        const data: Category[] = await res.json()
        setCategories(data)
      } catch (error) {
        console.error(error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'กรุณากรอกชื่อสินค้า'
    else if (name.length < 3) newErrors.name = 'ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร'

    if (!description.trim()) newErrors.description = 'กรุณากรอกรายละเอียดสินค้า'
    else if (description.length < 10) newErrors.description = 'รายละเอียดสินค้าต้องมีอย่างน้อย 10 ตัวอักษร'

    if (!price) newErrors.price = 'กรุณากรอกราคาสินค้า'
    else if (parseFloat(price) <= 0) newErrors.price = 'ราคาสินค้าต้องมากกว่า 0'

    if (categoryId === 0) newErrors.category = 'กรุณาเลือกหมวดหมู่สินค้า'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price: parseFloat(price), categoryId }),
      })

      if (res.ok) {
        alert('✅ เพิ่มสินค้าสำเร็จ!')
        setName('')
        setDescription('')
        setPrice('')
        setCategoryId(0)
        setErrors({})
        router.push('/products')
      } else {
        alert('❌ เกิดข้อผิดพลาดในการเพิ่มสินค้า')
      }
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาดในการเพิ่มสินค้า')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value)
      if (errors.price) setErrors(prev => ({ ...prev, price: '' }))
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    if (errors.description) setErrors(prev => ({ ...prev, description: '' }))
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(parseInt(e.target.value))
    if (errors.category) setErrors(prev => ({ ...prev, category: '' }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-700 text-2xl"
              title="กลับ"
            >
              ←
            </button>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-blue-600 text-4xl">➕</span>
              เพิ่มสินค้าใหม่
            </h1>
          </div>
          <p className="text-gray-600">กรอกข้อมูลสินค้าที่ต้องการเพิ่มเข้าสู่ระบบ</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <span>📝</span>
              ข้อมูลสินค้า
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>🏷️</span>
                ชื่อสินค้า
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="ระบุชื่อสินค้า (เช่น สมาร์ทโฟน iPhone 15)"
                value={name}
                onChange={handleNameChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.name 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>📄</span>
                รายละเอียดสินค้า
                <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="อธิบายรายละเอียดสินค้า คุณสมบัติ และข้อมูลที่สำคัญ"
                value={description}
                onChange={handleDescriptionChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-colors ${
                  errors.description 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.description}
                  </p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {description.length} ตัวอักษร
                </p>
              </div>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>💰</span>
                  ราคาสินค้า (บาท)
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0.00"
                    value={price}
                    onChange={handlePriceChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.price 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    บาท
                  </span>
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Product Category */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>📂</span>
                  หมวดหมู่สินค้า
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={handleCategoryChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white transition-colors ${
                    errors.category 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  required
                >
                  <option value={0} disabled>เลือกหมวดหมู่สินค้า</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังเพิ่มสินค้า...
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      เพิ่มสินค้า
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setName('')
                    setDescription('')
                    setPrice('')
                    setCategoryId(0)
                    setErrors({})
                  }}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={submitting}
                >
                  🔄 ล้างข้อมูล
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 bg-blue-50 rounded-lg p-4">
                <p className="flex items-center gap-2 mb-2">
                  <span>💡</span>
                  <strong>คำแนะนำ:</strong>
                </p>
                <ul className="space-y-1 ml-6 text-xs">
                  <li>• ชื่อสินค้าควรชัดเจนและสื่อความหมาย</li>
                  <li>• รายละเอียดสินค้าควรครบถ้วนเพื่อให้ลูกค้าเข้าใจ</li>
                  <li>• ตรวจสอบราคาให้ถูกต้องก่อนบันทึก</li>
                  <li>• เลือกหมวดหมู่ที่เหมาะสมกับสินค้า</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}