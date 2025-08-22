'use client'
import { useEffect, useState } from 'react'

type Category = {
  id: number
  name: string
}

type Product = {
  id: number
  name: string
  description: string
  price: number
  category?: Category | null
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoriesRes = await fetch('/api/categories')
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }
        
        // Fetch products
        const productsRes = await fetch('/api/products')
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData)
        }
        
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.category?.id === selectedCategory
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('th-TH')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-600">กำลังโหลดสินค้า...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="text-blue-600 text-4xl">📦</span>
            รายการสินค้า
          </h1>
          <p className="text-gray-600">ค้นหาและเลือกซื้อสินค้าคุณภาพดีในราคาที่คุ้มค่า</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-lg">🔧</span>
              <select
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-48"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <span className="text-xs">🏷️</span>
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <span className="text-xs">🔍</span>
                  "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            พบสินค้า <span className="font-semibold text-blue-600">{filteredProducts.length}</span> รายการ
            {selectedCategory && ` ในหมวดหมู่ "${categories.find(cat => cat.id === selectedCategory)?.name}"`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-400 mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบสินค้าที่ตรงกับการค้นหา</h3>
            <p className="text-gray-500">ลองปรับเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-6xl text-gray-400">📦</span>
                </div>
                
                <div className="p-6">
                  {/* Product Name */}
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h2>
                  
                  {/* Product Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Category */}
                  <div className="mb-4">
                    {product.category ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        <span className="text-xs">🏷️</span>
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium italic">
                        <span className="text-xs">🏷️</span>
                        ไม่มีหมวดหมู่
                      </span>
                    )}
                  </div>
                  
                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                      <span className="text-lg">💰</span>
                      {formatPrice(product.price)} บาท
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}