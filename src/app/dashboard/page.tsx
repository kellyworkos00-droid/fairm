'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sprout, PlusCircle, BarChart3 } from 'lucide-react'

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
}

export default function DashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [perf, setPerf] = useState<any>(null)

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
      form.name && form.category && form.unit && form.quantity > 0 && form.pricePerUnit > 0
    )
  }, [form])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
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
      fetchProducts()
    } catch (e) {
      setError('Failed to create product')
    } finally {
      setLoading(false)
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
          <nav className="flex gap-6">
            <Link href="/marketplace" className="text-gray-700 hover:text-green-600">Marketplace</Link>
            <Link href="/market-data" className="text-gray-700 hover:text-green-600">Market Data</Link>
            <Link href="/education" className="text-gray-700 hover:text-green-600">Education</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Farmer Dashboard</h1>

        {/* Performance */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold">Performance</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Metric label="Total Orders" value={perf?.totalOrders ?? 0} />
              <Metric label="Total Revenue" value={`KES ${(perf?.totalRevenue ?? 0).toFixed(0)}`} />
              <Metric label="Avg Order Value" value={`KES ${(perf?.avgOrderValue ?? 0).toFixed(0)}`} />
              <Metric label="Top Products" value={(perf?.topProducts?.[0]?.name ?? '—')} />
            </div>
          </div>
        </section>

        {/* Create Product */}
        <section className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Product</h2>
            <PlusCircle className="h-6 w-6 text-green-600" />
          </div>

          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
            <Select label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={[
              'VEGETABLES','FRUITS','GRAINS','LEGUMES','DAIRY','LIVESTOCK','POULTRY','OTHER']}
            />
            <Select label="Unit" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} options={['KG','TONNE','BAG','PIECE','LITRE','CRATE']} />
            <NumberInput label="Quantity" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
            <NumberInput label="Price per Unit (KES)" value={form.pricePerUnit} onChange={(v) => setForm({ ...form, pricePerUnit: v })} />
            <Input label="Quality" value={form.quality || ''} onChange={(v) => setForm({ ...form, quality: v })} />
            <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          </div>
          <button
            onClick={createProduct}
            disabled={!canSubmit || loading}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </section>

        {/* Product List */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 border rounded-xl">
                  <h3 className="text-lg font-semibold text-green-900">{p.name}</h3>
                  <p className="text-gray-600">{p.category} · {p.unit}</p>
                  <p className="text-gray-700 mt-2">KES {p.pricePerUnit} / {p.unit}</p>
                  <p className="text-gray-700">Qty: {p.quantity}</p>
                  <p className="text-gray-500 mt-1">{p.location}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-semibold text-green-900">{value}</p>
    </div>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
      />
    </div>
  )
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
      />
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
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
