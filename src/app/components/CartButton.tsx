'use client'

import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/lib/store/cart'

export default function CartButton() {
  const { toggleCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <button
      onClick={toggleCart}
      className="relative w-11 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
    >
      <ShoppingCartIcon className="h-5 w-5 text-white" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  )
}
