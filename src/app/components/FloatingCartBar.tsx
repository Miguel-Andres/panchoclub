'use client'

import { ShoppingBagIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '@/lib/store/cart'

export default function FloatingCartBar() {
  const { items, getTotalItems, getTotalPrice, openCart } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="container mx-auto max-w-lg">
        <button
          onClick={openCart}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 px-6 rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-between transition-all duration-200 pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBagIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-amber-500 text-xs font-bold rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            </div>
            <span>Ver carrito</span>
          </div>
          <span className="text-lg">{formatPrice(getTotalPrice())}</span>
        </button>
      </div>
    </div>
  )
}
