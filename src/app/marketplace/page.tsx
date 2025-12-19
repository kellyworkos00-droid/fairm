'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, Sprout, Search, MapPin, DollarSign, Package, 
  X, Plus, Minus, Truck, User, LogOut, Menu, ChevronDown, Star,
  Heart, Filter
} from 'lucide-react'
import { signOut } from 'next-auth/react'

type Product = {
  id: string
  name: string
  description?: string
  category: string
  unit: string
  quantity: number
  pricePerUnit: number
  location: string
  farmerId?: string
  farmer?: { name: string; location: string }
}

type CartItem = { 
  productId: string
  name: string
  quantity: number
  pricePerUnit: number
  unit: string
  location: string
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [orderPlacing, setOrderPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const total = useMemo(() => cart.reduce((acc, i) => acc + i.quantity * i.pricePerUnit, 0), [cart])
  const itemCount = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (location) params.set('location', location)
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.pricePerUnit >= priceRange[0] && p.pricePerUnit <= priceRange[1])
  }, [products, priceRange])

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === p.id)
      if (existing && existing.quantity < p.quantity) {
        return prev.map((i) => (i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      if (!existing && p.quantity > 0) {
        return [...prev, { 
          productId: p.id, 
          name: p.name, 
          quantity: 1, 
          pricePerUnit: p.pricePerUnit,
          unit: p.unit,
          location: p.location
        }]
      }
      return prev
    })
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i))
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId))
  }

  const placeOrder = async () => {
    if (cart.length === 0) return
    setOrderPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          deliveryAddress: location || 'Nairobi',
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrderSuccess(true)
        setCart([])
        setCartOpen(false)
        setTimeout(() => setOrderSuccess(false), 3000)
      }
    } catch (e) {
      console.error('Failed to place order')
    } finally {
      setOrderPlacing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">FiarmConnect</span>
            </Link>

            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hidden sm:block text-gray-700 hover:text-green-600 font-medium transition">
                Dashboard
              </Link>
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ShoppingCart className="h-6 w-6 text-green-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fresh From Farms</h1>
          <p className="text-gray-600">Browse products from local Kenyan farmers</p>
        </div>

        {/* Success Alert */}
        {orderSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
            <p className="text-green-800 font-medium">✓ Order placed successfully! Check your dashboard for details.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-20 h-fit`}>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div className="lg:hidden">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Product name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="VEGETABLES">Vegetables</option>
                    <option value="FRUITS">Fruits</option>
                    <option value="GRAINS">Grains</option>
                    <option value="LEGUMES">Legumes</option>
                    <option value="DAIRY">Dairy</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                  <input
                    type="text"
                    placeholder="County or area..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range: KES {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Apply Filters */}
                <button
                  onClick={() => { fetchProducts(); setShowFilters(false) }}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full justify-center"
            >
              <Filter className="h-5 w-5" />
              Show Filters
            </button>

            {/* Products */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-2">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart}
                    inCart={cart.some(i => i.productId === product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Your cart is empty</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-4 px-4 py-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">KES {item.pricePerUnit.toLocaleString()} / {item.unit}</p>
                          <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="flex-1 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 text-right font-semibold text-gray-900">
                        KES {(item.quantity * item.pricePerUnit).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">KES {total.toLocaleString()}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={orderPlacing || cart.length === 0}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition flex items-center justify-center gap-2"
                >
                  <Truck className="h-5 w-5" />
                  {orderPlacing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ 
  product, 
  onAddToCart, 
  inCart 
}: { 
  product: Product
  onAddToCart: (p: Product) => void
  inCart: boolean
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="h-20 w-20 text-green-200" />
        </div>
        {inCart && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            In Cart
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">KES {product.pricePerUnit.toLocaleString()}</span>
            <span className="text-gray-600 text-sm">/ {product.unit}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{product.quantity} {product.unit} available</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{product.location}</span>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
        )}

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.quantity === 0}
          className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            inCart
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {product.quantity === 0 ? 'Out of Stock' : inCart ? 'Add More' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
