'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Sprout, PlusCircle, BarChart3, TrendingUp, Package, MapPin, 
  Eye, Trash2, Edit2, LogOut, Menu, X, AlertCircle, CheckCircle,
  DollarSign, ShoppingCart, Users
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
  images: string[]
  quality?: string
  available: boolean
  createdAt?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [perf, setPerf] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add'>('overview')

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'VEGETABLES',
    unit: 'KG',
    quantity: 0,
    pricePerUnit: 0,
    location: '',
    quality: 'A',
  })

  const canSubmit = useMemo(() => {
    return (
      form.name && form.category && form.unit && form.quantity > 0 && form.pricePerUnit > 0 && form.location
    )
  }, [form])

  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0)
  }, [products])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      setError('Failed to load products')
    }
  }

  const fetchPerformance = async () => {
    try {
      const res = await fetch('/api/farmer/performance')
      if (res.ok) {
        const data = await res.json()
        setPerf(data)
      }
    } catch {}
  }

  useEffect(() => {
    fetchProducts()
    fetchPerformance()
  }, [])

  const createProduct = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create product')
        return
      }
      setSuccess('Product added successfully!')
      setForm({
        name: '',
        description: '',
        category: 'VEGETABLES',
        unit: 'KG',
        quantity: 0,
        pricePerUnit: 0,
        location: '',
        quality: 'A',
      })
      setShowForm(false)
      setActiveTab('products')
      await fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Failed to create product')
    } finally {
      setLoading(false)
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
            
            <nav className="hidden md:flex gap-8">
              <Link href="/marketplace" className="text-gray-700 hover:text-green-600 font-medium transition">
                Marketplace
              </Link>
              <Link href="/" className="text-gray-700 hover:text-green-600 font-medium transition">
                Market Data
              </Link>
              <Link href="/" className="text-gray-700 hover:text-green-600 font-medium transition">
                Education
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="h-5 w-5" />
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
          <p className="text-gray-600">Manage your products and track performance</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3 gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-700">×</button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-gap-3 gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-medium transition border-b-2 ${
              activeTab === 'overview'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 font-medium transition border-b-2 ${
              activeTab === 'products'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-4 font-medium transition border-b-2 ${
              activeTab === 'add'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Add Product
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                icon={<Package className="h-6 w-6" />}
                label="Total Products"
                value={products.length}
                trend="+2 this month"
                color="blue"
              />
              <KPICard
                icon={<DollarSign className="h-6 w-6" />}
                label="Inventory Value"
                value={`KES ${(totalInventoryValue / 1000).toFixed(1)}K`}
                trend="All products"
                color="green"
              />
              <KPICard
                icon={<ShoppingCart className="h-6 w-6" />}
                label="Total Orders"
                value={perf?.totalOrders ?? 0}
                trend="+12% vs last month"
                color="amber"
              />
              <KPICard
                icon={<TrendingUp className="h-6 w-6" />}
                label="Revenue"
                value={`KES ${(perf?.totalRevenue ?? 0) / 1000 > 1000 ? ((perf?.totalRevenue ?? 0) / 1000000).toFixed(1) + 'M' : ((perf?.totalRevenue ?? 0) / 1000).toFixed(0) + 'K'}`}
                trend="Year to date"
                color="emerald"
              />
            </div>

            {/* Performance Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                </div>
                <div className="space-y-4">
                  <Metric label="Average Order Value" value={`KES ${(perf?.avgOrderValue ?? 0).toFixed(0)}`} />
                  <Metric label="Top Product" value={perf?.topProducts?.[0]?.name ?? 'No sales yet'} />
                  <Metric label="Total Quantity Sold" value={perf?.totalQuantitySold ?? 0 + ' units'} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Inventory Summary</h3>
                </div>
                <div className="space-y-4">
                  <Metric label="Total Items" value={products.reduce((sum, p) => sum + p.quantity, 0) + ' units'} />
                  <Metric label="Categories" value={new Set(products.map(p => p.category)).size + ' types'} />
                  <Metric label="Locations" value={new Set(products.map(p => p.location)).size + ' areas'} />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-green-50">
                <li>✓ Keep inventory updated for better visibility</li>
                <li>✓ Use accurate pricing to compete in the marketplace</li>
                <li>✓ Add product descriptions to attract more buyers</li>
              </ul>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Products ({products.length})</h2>
              <button
                onClick={() => setActiveTab('add')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <PlusCircle className="h-5 w-5" />
                Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first product to the marketplace</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Input 
                  label="Product Name *" 
                  placeholder="e.g., Fresh Tomatoes" 
                  value={form.name} 
                  onChange={(v) => setForm({ ...form, name: v })} 
                />
                <Select 
                  label="Category *" 
                  value={form.category} 
                  onChange={(v) => setForm({ ...form, category: v })} 
                  options={['VEGETABLES','FRUITS','GRAINS','LEGUMES','DAIRY','LIVESTOCK','POULTRY','OTHER']}
                />
                <Input 
                  label="Location *" 
                  placeholder="e.g., Nakuru County" 
                  value={form.location} 
                  onChange={(v) => setForm({ ...form, location: v })} 
                />
                <Select 
                  label="Unit *" 
                  value={form.unit} 
                  onChange={(v) => setForm({ ...form, unit: v })} 
                  options={['KG','TONNE','BAG','PIECE','LITRE','CRATE']}
                />
                <NumberInput 
                  label="Quantity *" 
                  placeholder="0" 
                  value={form.quantity} 
                  onChange={(v) => setForm({ ...form, quantity: v })} 
                />
                <NumberInput 
                  label="Price per Unit (KES) *" 
                  placeholder="0" 
                  value={form.pricePerUnit} 
                  onChange={(v) => setForm({ ...form, pricePerUnit: v })} 
                />
                <Input 
                  label="Quality" 
                  placeholder="e.g., A, B, C" 
                  value={form.quality || ''} 
                  onChange={(v) => setForm({ ...form, quality: v })} 
                />
                <Input 
                  label="Description" 
                  placeholder="Brief description of your product" 
                  value={form.description} 
                  onChange={(v) => setForm({ ...form, description: v })} 
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  💡 Total inventory value for this product: <span className="font-semibold">KES {(form.quantity * form.pricePerUnit).toLocaleString()}</span>
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={createProduct}
                  disabled={!canSubmit || loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium transition"
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function KPICard({ 
  icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: any
  trend: string
  color: 'blue' | 'green' | 'amber' | 'emerald'
}) {
  const colorStyles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  }

  return (
    <div className={`rounded-xl p-6 border ${colorStyles[color]} bg-white border-gray-100`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-xs text-gray-500">{trend}</p>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          {product.available && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
              Available
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">KES {product.pricePerUnit.toLocaleString()}</span>
            <span>/ {product.unit}</span>
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
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        )}

        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition flex items-center justify-center gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition flex items-center justify-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function Input({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
      />
    </div>
  )
}

function NumberInput({ 
  label, 
  value, 
  onChange,
  placeholder
}: { 
  label: string
  value: number
  onChange: (v: number) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
      />
    </div>
  )
}

function Select({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
