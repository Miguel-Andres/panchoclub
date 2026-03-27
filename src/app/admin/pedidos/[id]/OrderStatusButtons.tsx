'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500', emoji: '⏳' },
  { value: 'confirmed', label: 'Confirmado', color: 'bg-blue-500', emoji: '✅' },
  { value: 'preparing', label: 'Preparando', color: 'bg-orange-500', emoji: '👨‍🍳' },
  { value: 'delivered', label: 'Entregado', color: 'bg-green-500', emoji: '🛵' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-500', emoji: '❌' },
]

interface OrderStatusButtonsProps {
  orderId: number
  currentStatus: string
}

export default function OrderStatusButtons({ orderId, currentStatus }: OrderStatusButtonsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setLoading(newStatus)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Error updating status')

      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el estado')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const isActive = currentStatus === status.value
        const isLoading = loading === status.value

        return (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            disabled={isLoading || isActive}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              isActive
                ? `${status.color} text-white`
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            } ${isLoading ? 'opacity-50 cursor-wait' : ''} ${isActive ? 'ring-2 ring-white/30' : ''}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <span>{status.emoji}</span>
            )}
            {status.label}
          </button>
        )
      })}
    </div>
  )
}
