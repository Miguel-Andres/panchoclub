'use client'

import { PlusIcon, CheckIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store/cart'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300">
      {/* Imagen con overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={product.image || '/hotdogs.png'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

        {/* Badge precio */}
        <div className="absolute top-3 left-3">
          <span className="bg-amber-500 text-black text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 -mt-8 relative z-10">
        <h3 className="text-xl font-bold text-white mb-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Incluye - pills horizontales */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.includes.slice(0, 4).map((item, index) => (
            <span
              key={index}
              className="text-xs text-zinc-400 bg-zinc-800/80 px-2 py-1 rounded-md"
            >
              {item}
            </span>
          ))}
          {product.includes.length > 4 && (
            <span className="text-xs text-zinc-500 px-2 py-1">
              +{product.includes.length - 4} más
            </span>
          )}
        </div>

        {/* Botón */}
        <button
          onClick={handleAddToCart}
          className={`w-full font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
            added
              ? 'bg-green-500 hover:bg-green-400 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-black'
          }`}
        >
          {added ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
          {added ? 'Agregado!' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}
