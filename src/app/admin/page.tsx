import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CurrencyDollarIcon, ShoppingBagIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import SalesChart from './SalesChart'

async function getStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalOrders, todayOrders, pendingOrders, totalRevenue, todayRevenue, cashRevenue, mpRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: { createdAt: { gte: today } }
    }),
    prisma.order.count({
      where: { status: 'pending' }
    }),
    prisma.order.aggregate({
      _sum: { total: true }
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { total: true }
    }),
    // Cobrado en efectivo
    prisma.order.aggregate({
      where: { paymentMethod: 'cash' },
      _sum: { total: true },
      _count: true
    }),
    // Cobrado en MercadoPago/transferencia
    prisma.order.aggregate({
      where: { paymentMethod: { not: 'cash' } },
      _sum: { total: true },
      _count: true
    })
  ])

  return {
    totalOrders,
    todayOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    todayRevenue: todayRevenue._sum.total || 0,
    cashRevenue: cashRevenue._sum.total || 0,
    cashCount: cashRevenue._count || 0,
    mpRevenue: mpRevenue._sum.total || 0,
    mpCount: mpRevenue._count || 0
  }
}

async function getSalesData() {
  // Obtener ventas de los últimos 7 días
  const days = 7
  const salesData = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const dayOrders = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: date,
          lt: nextDate
        }
      },
      _sum: { total: true },
      _count: true
    })

    salesData.push({
      date: date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }),
      ventas: dayOrders._sum.total || 0,
      pedidos: dayOrders._count || 0
    })
  }

  return salesData
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  })
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentOrders = await getRecentOrders()
  const salesData = await getSalesData()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendiente', variant: 'outline' },
    confirmed: { label: 'Confirmado', variant: 'secondary' },
    preparing: { label: 'Preparando', variant: 'secondary' },
    delivered: { label: 'Entregado', variant: 'default' },
    cancelled: { label: 'Cancelado', variant: 'destructive' },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <CurrencyDollarIcon className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Ventas hoy</p>
                <p className="text-2xl font-bold text-white">{formatPrice(stats.todayRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <ShoppingBagIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Pedidos hoy</p>
                <p className="text-2xl font-bold text-white">{stats.todayOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <ClockIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Total pedidos</p>
                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue total */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
        <CardContent className="pt-4">
          <p className="text-amber-200 text-sm mb-1">Ingresos totales</p>
          <p className="text-4xl font-bold text-white">{formatPrice(stats.totalRevenue)}</p>
        </CardContent>
      </Card>

      {/* Payment methods breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <span className="text-2xl">💵</span>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Efectivo</p>
                  <p className="text-2xl font-bold text-white">{formatPrice(stats.cashRevenue)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-sm">{stats.cashCount} pedidos</p>
                <p className="text-green-500 font-medium">
                  {stats.totalRevenue > 0 ? Math.round((stats.cashRevenue / stats.totalRevenue) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">MercadoPago / Transferencia</p>
                  <p className="text-2xl font-bold text-white">{formatPrice(stats.mpRevenue)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-sm">{stats.mpCount} pedidos</p>
                <p className="text-blue-500 font-medium">
                  {stats.totalRevenue > 0 ? Math.round((stats.mpRevenue / stats.totalRevenue) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Ventas últimos 7 días</CardTitle>
          <CardDescription>Ingresos diarios en pesos argentinos</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart data={salesData} />
        </CardContent>
      </Card>

      {/* Recent orders */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Pedidos recientes</CardTitle>
          <CardDescription>Últimos 5 pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              No hay pedidos todavía
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-amber-500">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-white font-medium">{order.customerName}</p>
                      <p className="text-zinc-500 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusConfig[order.status]?.variant || 'outline'}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                    <p className="text-white font-bold">{formatPrice(order.total)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
