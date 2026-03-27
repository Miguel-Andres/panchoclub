import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import OrderStatusButtons from './OrderStatusButtons'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: { product: true }
      }
    }
  })
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrder(id)

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/admin/pedidos"
        className="text-zinc-400 hover:text-white text-sm transition-colors"
      >
        ← Volver a pedidos
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">Pedido #{order.id}</h1>
          <p className="text-zinc-400 text-sm mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-400 text-sm">Total</p>
          <p className="text-3xl font-bold text-white">{formatPrice(order.total)}</p>
        </div>
      </div>

      {/* Status changer */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <h2 className="text-white font-bold mb-4">Estado del pedido</h2>
        <OrderStatusButtons orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Items */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <h2 className="text-white font-bold mb-4">Productos</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500 text-black text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
                <div>
                  <p className="text-white font-medium">{item.product.name}</p>
                  <p className="text-zinc-500 text-sm">{formatPrice(item.price)} c/u</p>
                </div>
              </div>
              <p className="text-amber-500 font-bold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer info */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <h2 className="text-white font-bold mb-4">Datos del cliente</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-zinc-400 text-sm">Nombre</p>
            <p className="text-white font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Teléfono</p>
            <a href={`tel:${order.customerPhone}`} className="text-amber-500 font-medium hover:underline">
              {order.customerPhone}
            </a>
          </div>
          <div className="col-span-2">
            <p className="text-zinc-400 text-sm">Dirección</p>
            <p className="text-white font-medium">{order.address}</p>
            {order.addressDetail && (
              <p className="text-zinc-400 text-sm mt-1">{order.addressDetail}</p>
            )}
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Método de pago</p>
            <p className="text-white font-medium">
              {order.paymentMethod === 'cash' ? '💵 Efectivo' : '💳 MercadoPago'}
            </p>
          </div>
          {order.notes && (
            <div className="col-span-2">
              <p className="text-zinc-400 text-sm">Notas</p>
              <p className="text-white font-medium bg-zinc-800 p-3 rounded-lg mt-1">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp button */}
      <a
        href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=Hola ${order.customerName}! Te escribimos de Pancho Club por tu pedido %23${order.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-center transition-colors"
      >
        💬 Escribir al cliente por WhatsApp
      </a>
    </div>
  )
}
