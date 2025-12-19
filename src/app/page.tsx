import Link from 'next/link'
import { Sprout, TrendingUp, Users, BookOpen, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">FiarmConnect</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/marketplace" className="text-gray-700 hover:text-green-600">
              Marketplace
            </Link>
            <Link href="/market-data" className="text-gray-700 hover:text-green-600">
              Market Data
            </Link>
            <Link href="/education" className="text-gray-700 hover:text-green-600">
              Education
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-green-600">
              Pricing
            </Link>
          </nav>
          <div className="flex gap-3">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-green-600 hover:text-green-700"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6">
          Connecting Kenya's Farmers
          <br />
          <span className="text-green-600">Directly to Markets</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Eliminate middlemen, maximize profits, and reduce waste. Get real-time market
          prices, connect with verified buyers, and grow your agricultural business.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signup?role=FARMER"
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2"
          >
            I'm a Farmer <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/auth/signup?role=BUYER"
            className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-semibold"
          >
            I'm a Buyer
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-green-600" />}
            title="Farm-to-Market"
            description="Connect directly with retailers, restaurants, and exporters. No middlemen, better prices."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-green-600" />}
            title="Market Intelligence"
            description="Real-time commodity prices, weather forecasts, and demand predictions to maximize profits."
          />
          <FeatureCard
            icon={<Sprout className="h-10 w-10 text-green-600" />}
            title="Bulk Aggregation"
            description="Pool produce from multiple farmers to meet large buyer orders and get better rates."
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-green-600" />}
            title="Farmer Education"
            description="Access expert guides on crop management, pest control, and modern farming techniques."
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-20 bg-green-50 rounded-3xl">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-4">
          Flexible Pricing for Every Farmer
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Start free, upgrade as you grow
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Free"
            price="0"
            features={['5 product listings', '10% commission', 'Basic market data', 'Community support']}
            cta="Start Free"
            ctaLink="/auth/signup"
          />
          <PricingCard
            name="Premium"
            price="500"
            features={['50 product listings', '7% commission', 'Real-time prices', 'Premium content', 'Price alerts']}
            cta="Go Premium"
            ctaLink="/auth/signup"
            highlighted
          />
          <PricingCard
            name="Enterprise"
            price="2,500"
            features={['Unlimited listings', '5% commission', 'Advanced analytics', 'API access', 'Dedicated support']}
            cta="Go Enterprise"
            ctaLink="/auth/signup"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-green-900 mb-6">
          Ready to Transform Your Farm Business?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of Kenyan farmers already using FiarmConnect
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
        >
          Get Started Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 FiarmConnect. Empowering Kenyan Agriculture.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-green-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  features,
  cta,
  ctaLink,
  highlighted = false,
}: {
  name: string
  price: string
  features: string[]
  cta: string
  ctaLink: string
  highlighted?: boolean
}) {
  return (
    <div
      className={`p-8 bg-white rounded-xl ${
        highlighted ? 'ring-2 ring-green-600 shadow-lg scale-105' : 'shadow-sm'
      }`}
    >
      {highlighted && (
        <div className="text-center mb-4">
          <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-green-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-green-600">KES {price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="mb-8 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`block w-full py-3 rounded-lg text-center font-semibold ${
          highlighted
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'border-2 border-green-600 text-green-600 hover:bg-green-50'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
