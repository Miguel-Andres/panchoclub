'use client'

import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const router = useRouter()
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-zinc-400" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-zinc-400 text-lg">Tu carrito está vacío</p>
              <p className="text-zinc-500 text-sm mt-2">
                Agregá algunos panchos deliciosos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-zinc-800/50 rounded-xl p-3"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image || '/hotdogs.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-amber-500 font-bold text-sm">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
                      >
                        <MinusIcon className="h-4 w-4 text-white" />
                      </button>
                      <span className="text-white font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 text-white" />
                      </button>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1.5 rounded-full hover:bg-red-500/20 transition-colors group"
                      >
                        <TrashIcon className="h-4 w-4 text-zinc-500 group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-white font-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 space-y-4">
            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full text-sm text-zinc-500 hover:text-red-500 transition-colors"
            >
              Vaciar carrito
            </button>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Total</span>
              <span className="text-2xl font-bold text-white">
                {formatPrice(getTotalPrice())}
              </span>
            </div>

            {/* Checkout button */}
            <button
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl py-4 px-6 flex items-center justify-center gap-2 transition-colors"
              onClick={handleCheckout}
            >
              <span>Mandale, confirmar pedido</span>
              <span>🛵💵</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}
