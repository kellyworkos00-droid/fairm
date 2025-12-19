'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, LayoutGrid, BookOpen, Menu, X, LogOut, User,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'

export function FloatingNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  if (!session?.user) return null

  const isFarmer = session.user.role === 'FARMER'

  const navItems = [
    ...(isFarmer
      ? [
          { href: '/dashboard', label: 'Dashboard', icon: Home },
          { href: '/marketplace', label: 'Marketplace', icon: LayoutGrid },
          { href: '/', label: 'Education', icon: BookOpen },
        ]
      : [
          { href: '/marketplace', label: 'Marketplace', icon: LayoutGrid },
        ]),
  ]

  return (
    <>
      {/* Desktop Floating Nav */}
      <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-white/20 px-2 py-3 gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`p-3 rounded-full transition-all duration-200 hover:scale-110 group relative ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
              title={label}
            >
              <Icon className="h-6 w-6" />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
              </div>
            </Link>
          )
        })}

        <div className="w-px bg-gray-200 mx-1"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="p-3 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 hover:scale-110 group"
            title="Account"
          >
            <User className="h-6 w-6" />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Account
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-48 z-50">
              <div className="pb-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{session.user.role}</p>
              </div>
              <button
                onClick={() => {
                  signOut({ redirect: true, callbackUrl: '/' })
                  setUserMenuOpen(false)
                }}
                className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="md:hidden fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-4 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 transition-transform hover:scale-110"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {mobileOpen && (
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 w-56 p-4 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              )
            })}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
              <button
                onClick={() => {
                  signOut({ redirect: true, callbackUrl: '/' })
                  setMobileOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
