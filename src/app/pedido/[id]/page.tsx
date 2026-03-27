import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@nextui-org/react'

interface PageProps {
  params: { id: string }
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  return order
}

export default async function PedidoPage({ params }: PageProps) {
  const order = await getOrder(params.id)

  if (!order) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-500' },
    preparing: { label: 'Preparando', color: 'bg-orange-500' },
    delivered: { label: 'Entregado', color: 'bg-green-500' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500' },
  }

  const status = statusLabels[order.status] || statusLabels.pending

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/95 border-b border-zinc-800/50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-amber-500 text-sm">
            ← Volver al menú
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Success message */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold text-white mb-2">
            ¡Pedido confirmado!
          </h1>
          <p className="text-zinc-400">
            Tu pedido #{order.id} fue recibido
          </p>
        </div>

        {/* Status */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Estado</span>
            <span className={`${status.color} text-white text-sm font-medium px-3 py-1 rounded-full`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Order details */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-4">
          <h2 className="text-white font-bold mb-3">Detalle del pedido</h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-zinc-300">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="text-amber-500 font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800 mt-3 pt-3 flex justify-between">
            <span className="text-white font-bold">Total</span>
            <span className="text-amber-500 font-bold text-lg">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-4">
          <h2 className="text-white font-bold mb-3">Datos de entrega</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Nombre</span>
              <span className="text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Teléfono</span>
              <span className="text-white">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Dirección</span>
              <span className="text-white text-right">{order.address}</span>
            </div>
            {order.addressDetail && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Detalles</span>
                <span className="text-white text-right">{order.addressDetail}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-400">Pago</span>
              <span className="text-white">
                {order.paymentMethod === 'cash' ? '💵 Efectivo' : '💳 MercadoPago'}
              </span>
            </div>
            {order.notes && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Notas</span>
                <span className="text-white text-right">{order.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp contact */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-6">
          <p className="text-zinc-400 text-sm text-center">
            ¿Tenés alguna consulta? Escribinos por WhatsApp
          </p>
          <a
            href={`https://wa.me/5491112345678?text=Hola! Tengo una consulta sobre mi pedido %23${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3"
          >
            <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold">
              💬 Escribir por WhatsApp
            </Button>
          </a>
        </div>

        {/* Back to menu */}
        <Link href="/">
          <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold">
            Hacer otro pedido
          </Button>
        </Link>
      </div>
    </main>
  )
}
