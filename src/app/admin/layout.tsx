'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Pedidos', href: '/admin/pedidos', icon: ClipboardDocumentListIcon },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-amber-500">
              🌭 Pancho Admin
            </Link>
          </div>
          <Link
            href="/"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Ver tienda →
          </Link>
        </div>
      </header>

      {/* Nav tabs */}
      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
