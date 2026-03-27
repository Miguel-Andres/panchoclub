'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Radio, RadioGroup } from '@nextui-org/react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    addressDetail: '',
    paymentMethod: 'cash',
    notes: '',
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: getTotalPrice(),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error('Error al crear pedido')

      const order = await response.json()
      clearCart()
      router.push(`/pedido/${order.id}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pedido. Intentá de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">🛒</span>
        <h1 className="text-xl font-bold text-white mb-2">Tu carrito está vacío</h1>
        <p className="text-zinc-400 mb-6">Agregá algunos panchos para continuar</p>
        <Link href="/">
          <Button className="bg-amber-500 text-black font-bold">
            Ver menú
          </Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
              <ArrowLeftIcon className="h-5 w-5 text-white" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-white">Confirmar pedido</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumen del pedido */}
          <section className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-white font-bold mb-3">Tu pedido</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image || '/hotdogs.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {item.quantity}x {item.product.name}
                    </p>
                  </div>
                  <p className="text-amber-500 font-bold text-sm">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 mt-4 pt-4 flex justify-between">
              <span className="text-zinc-400">Total</span>
              <span className="text-white text-xl font-bold">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </section>

          {/* Datos de contacto */}
          <section className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-white font-bold mb-4">Tus datos</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Nombre *</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Teléfono *</label>
                <input
                  type="tel"
                  placeholder="1123456789"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Dirección */}
          <section className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-white font-bold mb-4">Dirección de entrega</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Dirección *</label>
                <input
                  type="text"
                  placeholder="Calle y número"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Piso / Depto / Referencias</label>
                <input
                  type="text"
                  placeholder="Ej: 3B, timbre roto, casa azul"
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Método de pago */}
          <section className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-white font-bold mb-4">Método de pago</h2>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <Radio
                value="cash"
                classNames={{
                  label: 'text-white',
                  description: 'text-zinc-400',
                }}
                description="Pagás cuando llega tu pedido"
              >
                💵 Efectivo
              </Radio>
              <Radio
                value="mercadopago"
                classNames={{
                  label: 'text-white',
                  description: 'text-zinc-400',
                }}
                description="Próximamente"
                isDisabled
              >
                💳 MercadoPago
              </Radio>
            </RadioGroup>
          </section>

          {/* Notas */}
          <section className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <label className="block text-white font-bold mb-2">Notas adicionales</label>
            <input
              type="text"
              placeholder="Ej: Sin cebolla, extra salsa"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </section>

          {/* Botón confirmar */}
          <Button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl py-6"
            size="lg"
            isLoading={isLoading}
          >
            Confirmar pedido 🛵💵
          </Button>
        </form>
      </div>
    </main>
  )
}
