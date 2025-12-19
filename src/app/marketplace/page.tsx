'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Sprout, Search } from 'lucide-react'

type Product = {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  pricePerUnit: number
  location: string
}

type CartItem = { productId: string; name: string; quantity: number; pricePerUnit: number }

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  const total = useMemo(() => cart.reduce((acc, i) => acc + i.quantity * i.pricePerUnit, 0), [cart])

  const fetchProducts = async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (location) params.set('location', location)
    const res = await fetch(`/api/products?${params.toString()}`)
    const data = await res.json()
    setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const addToCart = (p: Product) => {
    const qty = 1
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === p.id)
      if (existing) {
        return prev.map((i) => (i.productId === p.id ? { ...i, quantity: i.quantity + qty } : i))
      }
      return [...prev, { productId: p.id, name: p.name, quantity: qty, pricePerUnit: p.pricePerUnit }]
    })
  }

  const placeOrder = async () => {
    if (cart.length === 0) return
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        deliveryAddress: 'Nairobi',
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setCart([])
      alert(`Order placed! Total KES ${data.totalAmount}`)
    } else {
      alert(data.error || 'Failed to place order')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">FiarmConnect</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-green-700" />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 rounded-full">{cart.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Marketplace</h1>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <FilterInput label="Search" value={search} onChange={setSearch} icon={<Search className="h-5 w-5 text-gray-500" />} />
          <Select label="Category" value={category} onChange={setCategory} options={[ '', 'VEGETABLES','FRUITS','GRAINS','LEGUMES','DAIRY','LIVESTOCK','POULTRY','OTHER' ]} />
          <FilterInput label="Location" value={location} onChange={setLocation} />
          <button onClick={fetchProducts} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Apply</button>
        </div>

        {/* Products */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="p-4 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-green-900">{p.name}</h3>
              <p className="text-gray-600">{p.category} · {p.unit}</p>
              <p className="text-gray-700 mt-2">KES {p.pricePerUnit} / {p.unit}</p>
              <p className="text-gray-500">{p.location}</p>
              <button onClick={() => addToCart(p)} className="mt-3 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">Add to Cart</button>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="mt-4">
              {cart.map((i) => (
                <div key={i.productId} className="flex justify-between py-2 border-b">
                  <span>{i.name} x {i.quantity}</span>
                  <span>KES {(i.quantity * i.pricePerUnit).toFixed(0)}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 font-semibold">
                <span>Total</span>
                <span>KES {total.toFixed(0)}</span>
              </div>
              <button onClick={placeOrder} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Place Order</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function FilterInput({ label, value, onChange, icon }: { label: string; value: string; onChange: (v: string) => void; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt || 'All'}</option>
        ))}
      </select>
    </div>
  )
}
