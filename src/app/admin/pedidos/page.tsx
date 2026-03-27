import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  })
}

export default async function PedidosPage() {
  const orders = await getOrders()

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
      year: 'numeric',
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Todos los pedidos</h1>
        <Badge variant="secondary">{orders.length} pedidos</Badge>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-zinc-400 text-lg">No hay pedidos todavía</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">#</TableHead>
                  <TableHead className="text-zinc-400">Cliente</TableHead>
                  <TableHead className="text-zinc-400">Dirección</TableHead>
                  <TableHead className="text-zinc-400">Items</TableHead>
                  <TableHead className="text-zinc-400">Total</TableHead>
                  <TableHead className="text-zinc-400">Estado</TableHead>
                  <TableHead className="text-zinc-400">Fecha</TableHead>
                  <TableHead className="text-zinc-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell>
                      <span className="text-amber-500 font-bold">#{order.id}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{order.customerName}</p>
                        <p className="text-zinc-500 text-sm">{order.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-zinc-300 text-sm max-w-[200px] truncate">{order.address}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-zinc-300 text-sm">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-white font-bold">{formatPrice(order.total)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[order.status]?.variant || 'outline'}>
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-zinc-400 text-sm">{formatDate(order.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
                      >
                        Ver →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
