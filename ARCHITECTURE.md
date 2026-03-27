# Arquitectura - Pancho Club E-commerce

## Visión General

Sistema de e-commerce para venta de panchos con las siguientes funcionalidades:
- Catálogo de productos
- Carrito de compras
- Checkout con dirección de envío
- Pagos (efectivo + MercadoPago)
- Notificaciones por Telegram
- Panel de administración

---

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| Frontend | Next.js 14 (App Router) | Framework React con SSR |
| UI | NextUI + Tailwind CSS | Componentes y estilos |
| Estado | Zustand | Manejo de estado del carrito |
| Base de Datos | SQLite + Prisma | Persistencia de datos |
| API | Next.js API Routes | Endpoints REST |
| Pagos | MercadoPago SDK | Procesamiento de pagos |
| Notificaciones | Telegram Bot API | Alertas de pedidos |

---

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│   │   Tienda    │    │   Carrito   │    │  Checkout   │         │
│   │   (menú)    │───▶│  (drawer)   │───▶│  (form)     │         │
│   └─────────────┘    └─────────────┘    └──────┬──────┘         │
│                                                 │                 │
│   ┌─────────────────────────────────────────────┼───────────────┐│
│   │                    Zustand Store            │               ││
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐     │               ││
│   │  │ items[] │  │ total   │  │ actions │     │               ││
│   │  └─────────┘  └─────────┘  └─────────┘     │               ││
│   └─────────────────────────────────────────────┼───────────────┘│
│                                                 │                 │
└─────────────────────────────────────────────────┼─────────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVIDOR (Next.js)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────────┐│
│   │                     API Routes (/api)                        ││
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││
│   │  │ /products    │  │ /orders      │  │ /notify      │      ││
│   │  │ GET          │  │ GET, POST    │  │ POST         │      ││
│   │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      ││
│   └─────────┼─────────────────┼─────────────────┼───────────────┘│
│             │                 │                 │                 │
│             ▼                 ▼                 ▼                 │
│   ┌─────────────────────────────────────────────────────────────┐│
│   │                    Prisma Client                             ││
│   │         (ORM - Object Relational Mapping)                    ││
│   └──────────────────────────┬──────────────────────────────────┘│
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                         SQLite                                    │
│   ┌──────────┐    ┌──────────┐    ┌──────────────┐              │
│   │ Product  │    │  Order   │    │  OrderItem   │              │
│   └──────────┘    └──────────┘    └──────────────┘              │
└──────────────────────────────────────────────────────────────────┘

                    SERVICIOS EXTERNOS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  MercadoPago │  │   Telegram   │  │   (futuro)   │
│     API      │  │   Bot API    │  │   Supabase   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Flujo de Usuario

### 1. Flujo de Compra

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Ver    │     │ Agregar │     │   Ver   │     │ Ingresar│     │ Elegir  │
│  Menú   │────▶│   al    │────▶│ Carrito │────▶│Dirección│────▶│  Pago   │
│         │     │ Carrito │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                                      │
                    ┌─────────────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────┴───────────────┐
    │                               │
    ▼                               ▼
┌─────────┐                   ┌─────────┐
│Efectivo │                   │MercadoPago│
│         │                   │         │
└────┬────┘                   └────┬────┘
     │                              │
     │    ┌─────────┐               │
     └───▶│ Crear   │◀──────────────┘
          │ Pedido  │
          └────┬────┘
               │
               ▼
          ┌─────────┐     ┌─────────┐
          │Confirmar│     │ Enviar  │
          │ Pedido  │────▶│Telegram │
          └─────────┘     └─────────┘
```

### 2. Flujo de Administración

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Ver    │     │   Ver   │     │ Cambiar │     │ Marcar  │
│Dashboard│────▶│ Pedidos │────▶│ Estado  │────▶│Entregado│
│         │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

---

## Estructura de Carpetas

```
hotdog/
├── prisma/
│   ├── schema.prisma          # Definición de modelos
│   ├── seed.ts                # Datos iniciales
│   └── dev.db                 # Base de datos SQLite
│
├── src/
│   ├── app/
│   │   ├── (tienda)/          # Grupo de rutas públicas
│   │   │   ├── page.tsx       # Menú principal
│   │   │   ├── carrito/
│   │   │   │   └── page.tsx   # Página del carrito
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx   # Formulario de checkout
│   │   │   └── pedido/
│   │   │       └── [id]/
│   │   │           └── page.tsx  # Confirmación
│   │   │
│   │   ├── admin/             # Panel de administración
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── pedidos/
│   │   │   │   ├── page.tsx   # Lista de pedidos
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Detalle pedido
│   │   │   └── layout.tsx     # Layout del admin
│   │   │
│   │   ├── api/               # API Routes
│   │   │   ├── products/
│   │   │   │   └── route.ts   # GET productos
│   │   │   ├── orders/
│   │   │   │   ├── route.ts   # GET/POST pedidos
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # PATCH pedido
│   │   │   └── notify/
│   │   │       └── route.ts   # POST telegram
│   │   │
│   │   ├── components/        # Componentes React
│   │   │   ├── ui/            # Componentes base
│   │   │   ├── tienda/        # Componentes de tienda
│   │   │   └── admin/         # Componentes de admin
│   │   │
│   │   ├── layout.tsx         # Layout raíz
│   │   ├── providers.tsx      # Providers (NextUI, etc)
│   │   └── globals.css        # Estilos globales
│   │
│   ├── lib/                   # Utilidades y servicios
│   │   ├── prisma.ts          # Cliente Prisma singleton
│   │   ├── store/
│   │   │   └── cart.ts        # Store Zustand
│   │   ├── telegram.ts        # Servicio Telegram
│   │   └── mercadopago.ts     # Servicio MercadoPago
│   │
│   └── types/                 # Tipos TypeScript
│       └── index.ts
│
├── public/                    # Assets estáticos
├── .env                       # Variables de entorno
└── package.json
```

---

## Modelos de Datos

### Product (Producto)

```typescript
interface Product {
  id: number
  name: string           // "Combo Triple"
  description: string    // "3 panchos con todo"
  price: number          // 1500 (en pesos)
  image: string          // "/hotdogs.png"
  includes: string[]     // ["Papas", "Salsas", "Gaseosa"]
  active: boolean        // true
  createdAt: Date
}
```

### Order (Pedido)

```typescript
interface Order {
  id: number
  status: OrderStatus
  customerName: string   // "Juan Pérez"
  customerPhone: string  // "1123456789"
  address: string        // "Av. Corrientes 1234"
  addressDetail: string  // "Piso 3, Depto B"
  paymentMethod: 'cash' | 'mercadopago'
  paymentStatus: 'pending' | 'paid'
  total: number          // 4500
  notes: string          // "Sin cebolla"
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

type OrderStatus =
  | 'pending'      // Pendiente (recién creado)
  | 'confirmed'    // Confirmado
  | 'preparing'    // En preparación
  | 'on_the_way'   // En camino
  | 'delivered'    // Entregado
  | 'cancelled'    // Cancelado
```

### OrderItem (Item del Pedido)

```typescript
interface OrderItem {
  id: number
  orderId: number
  productId: number
  product: Product
  quantity: number       // 2
  price: number          // Precio al momento de compra
}
```

### CartItem (Item del Carrito - Frontend)

```typescript
interface CartItem {
  productId: number
  product: Product
  quantity: number
}
```

---

## Patrones de Diseño

### 1. Repository Pattern (Capa de Datos)

Abstracción de acceso a datos para facilitar migración futura a Supabase.

```typescript
// src/lib/repositories/orders.ts

export const ordersRepository = {
  async findAll() {
    return prisma.order.findMany({ include: { items: true } })
  },

  async findById(id: number) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    })
  },

  async create(data: CreateOrderData) {
    return prisma.order.create({ data })
  },

  async updateStatus(id: number, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status }
    })
  }
}
```

### 2. Store Pattern (Zustand)

Estado global del carrito con persistencia en localStorage.

```typescript
// src/lib/store/cart.ts

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => { ... },
      removeItem: (productId) => { ... },
      updateQuantity: (productId, quantity) => { ... },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) =>
        sum + item.product.price * item.quantity, 0
      )
    }),
    { name: 'cart-storage' }
  )
)
```

### 3. API Route Pattern

Handlers REST en Next.js App Router.

```typescript
// src/app/api/orders/route.ts

export async function GET(request: Request) {
  const orders = await ordersRepository.findAll()
  return Response.json(orders)
}

export async function POST(request: Request) {
  const data = await request.json()
  const order = await ordersRepository.create(data)
  await sendTelegramNotification(order)
  return Response.json(order, { status: 201 })
}
```

### 4. Service Pattern (Servicios Externos)

```typescript
// src/lib/telegram.ts

export async function sendTelegramNotification(order: Order) {
  const message = formatOrderMessage(order)

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  })
}

function formatOrderMessage(order: Order): string {
  return `
🆕 <b>Nuevo Pedido #${order.id}</b>

👤 ${order.customerName}
📱 ${order.customerPhone}
📍 ${order.address}

📦 Items:
${order.items.map(i => `  • ${i.quantity}x ${i.product.name}`).join('\n')}

💰 Total: $${order.total}
💳 Pago: ${order.paymentMethod === 'cash' ? 'Efectivo' : 'MercadoPago'}
  `
}
```

---

## Estados del Pedido

```
┌─────────┐
│ pending │ ──────────────────────────────────┐
└────┬────┘                                   │
     │ confirmar                              │ cancelar
     ▼                                        │
┌─────────┐                                   │
│confirmed│ ──────────────────────────────────┤
└────┬────┘                                   │
     │ preparar                               │
     ▼                                        │
┌─────────┐                                   │
│preparing│ ──────────────────────────────────┤
└────┬────┘                                   │
     │ enviar                                 │
     ▼                                        │
┌─────────┐                                   │
│on_the_way│                                  │
└────┬────┘                                   │
     │ entregar                               │
     ▼                                        ▼
┌─────────┐                             ┌─────────┐
│delivered│                             │cancelled│
└─────────┘                             └─────────┘
```

---

## Variables de Entorno

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Telegram
TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
TELEGRAM_CHAT_ID="-100123456789"

# MercadoPago (Fase 2)
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
MERCADOPAGO_PUBLIC_KEY="APP_USR-..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-..."
```

---

## Migración Futura a Supabase

Cuando se migre a Supabase, solo se necesita:

1. Cambiar `DATABASE_URL` en `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

2. Cambiar provider en `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // antes: sqlite
  url      = env("DATABASE_URL")
}
```

3. Ejecutar migración:
```bash
npx prisma migrate deploy
```

El código de la aplicación **no cambia** gracias a la abstracción de Prisma.

---

## Orden de Implementación

| # | Tarea | Dependencias |
|---|-------|--------------|
| 1 | Setup Prisma + SQLite | - |
| 2 | Modelos de datos | 1 |
| 3 | Seed de productos | 2 |
| 4 | API de productos | 2 |
| 5 | Página de menú | 4 |
| 6 | Store del carrito (Zustand) | - |
| 7 | Componente CartDrawer | 6 |
| 8 | Header con carrito | 7 |
| 9 | Página de carrito | 6, 7 |
| 10 | API de pedidos | 2 |
| 11 | Página de checkout | 9, 10 |
| 12 | Servicio Telegram | - |
| 13 | Notificación al crear pedido | 10, 12 |
| 14 | Página de confirmación | 10 |
| 15 | Layout de admin | - |
| 16 | Dashboard admin | 10 |
| 17 | Lista de pedidos admin | 10 |
| 18 | Detalle de pedido admin | 17 |
| 19 | MercadoPago (opcional) | 11 |

---

## Comandos de Desarrollo

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Base de datos
npx prisma studio        # UI visual para ver/editar datos
npx prisma migrate dev   # Crear/aplicar migraciones
npx prisma db seed       # Cargar datos iniciales
npx prisma generate      # Regenerar cliente Prisma

# Producción
npm run build            # Compilar
npm start                # Ejecutar producción

# Calidad
npm run lint             # Verificar código
```
