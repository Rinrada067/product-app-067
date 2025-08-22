'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  c_id: number
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

  const [newCategoryName, setNewCategoryName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/categories')
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

  const handleAddCategoryFromInput = async () => {
    if (!newCategoryName.trim()) {
      alert('กรุณากรอกชื่อหมวดหมู่')
      return
    }

    setAddingCategory(true)

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })

      if (!res.ok) {
        alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่')
        setAddingCategory(false)
        return
      }

      const createdCategory: Category = await res.json()

      setCategories(prev => [...prev, createdCategory])
      setCategoryId(createdCategory.c_id)
      setNewCategoryName('')
      setErrors(prev => ({ ...prev, category: '' }))
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่')
      console.error(error)
    } finally {
      setAddingCategory(false)
    }
  }

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

    console.log('Submitting categoryId:', categoryId)  // debug

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
        setNewCategoryName('')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
            <span className="ml-4 text-lg text-orange-700">กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="max-w-2xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="text-orange-600 hover:text-orange-700 text-2xl"
              title="กลับ"
            >
              ←
            </button>
            <h1 className="text-4xl font-bold text-orange-800 flex items-center gap-3">
              <span className="text-orange-600 text-4xl">➕</span>
              เพิ่มสินค้าใหม่
            </h1>
          </div>
          <p className="text-orange-700">กรอกข้อมูลสินค้าที่ต้องการเพิ่มเข้าสู่ระบบ</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <span>📝</span>
              ข้อมูลสินค้า
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-orange-700 flex items-center gap-2">
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
                    : 'border-orange-200 focus:ring-orange-500 focus:border-orange-500'
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
              <label className="block text-sm font-semibold text-orange-700 flex items-center gap-2">
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
                    : 'border-orange-200 focus:ring-orange-500 focus:border-orange-500'
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
                <p className="text-orange-500 text-sm ml-auto">
                  {description.length} ตัวอักษร
                </p>
              </div>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700 flex items-center gap-2">
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
                        : 'border-orange-200 focus:ring-orange-500 focus:border-orange-500'
                    }`}
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 text-sm">
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

              {/* Product Category (input + datalist) */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700 flex items-center gap-2">
                  <span>📂</span>
                  หมวดหมู่สินค้า
                  <span className="text-red-500">*</span>
                </label>
                <input
                  list="category-list"
                  value={newCategoryName !== '' ? newCategoryName : (categoryId !== 0 ? categories.find(c => c.c_id === categoryId)?.name || '' : '')}
                  onChange={(e) => {
                    const value = e.target.value
                    const matched = categories.find(c => c.name.toLowerCase() === value.toLowerCase())

                    if (matched) {
                      setCategoryId(matched.c_id)
                      setNewCategoryName('')
                    } else {
                      setCategoryId(0)
                      setNewCategoryName(value)
                    }
                    if (errors.category) setErrors(prev => ({ ...prev, category: '' }))
                  }}
                  placeholder="เลือกหรือตั้งชื่อหมวดหมู่ใหม่"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.category
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-orange-200 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  required
                />
                <datalist id="category-list">
                  {categories.map(cat => (
                    <option key={cat.c_id} value={cat.name} />
                  ))}
                </datalist>

                {errors.category && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <span>⚠️</span>
                    {errors.category}
                  </p>
                )}

                {!categories.some(c => c.name.toLowerCase() === (newCategoryName || '').toLowerCase()) && newCategoryName.trim() !== '' && (
                  <button
                    onClick={handleAddCategoryFromInput}
                    disabled={addingCategory}
                    className={`mt-2 px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors ${
                      addingCategory ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {addingCategory ? 'กำลังเพิ่ม...' : `เพิ่มหมวดหมู่ "${newCategoryName}"`}
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-4 rounded-lg bg-orange-600 text-white text-lg font-semibold hover:bg-orange-700 transition-colors ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลสินค้า'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
