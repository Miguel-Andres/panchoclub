export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image: string | null
  includes: string[]
  active: boolean
  createdAt: Date
}

export interface CartItem {
  productId: number
  product: Product
  quantity: number
}

export interface Order {
  id: number
  status: string
  customerName: string
  customerPhone: string
  address: string
  addressDetail: string | null
  paymentMethod: 'cash' | 'mercadopago'
  paymentStatus: string
  total: number
  notes: string | null
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  quantity: number
  price: number
  productId: number
  product: Product
}
