import { prisma } from '@/lib/prisma'
import ProductList from './components/ProductList'
import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import FloatingCartBar from './components/FloatingCartBar'
import Image from 'next/image'

async function getProducts() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { price: 'asc' },
  })

  return products.map((product) => ({
    ...product,
    includes: JSON.parse(product.includes) as string[],
  }))
}

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
              <Image
                src="/panchoLogo.png"
                alt="Pancho Club"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Pancho Club</h1>
              <p className="text-xs text-zinc-500">Delivery de panchos</p>
            </div>
          </div>

          {/* Carrito */}
          <CartButton />
        </div>
      </header>

      {/* Hero compacto */}
      <section className="container mx-auto px-4 pt-6 pb-4">
        <h2 className="text-2xl font-black text-white">
          ¿Qué vas a pedir hoy? 🌭
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Combos frescos, envío rápido
        </p>
      </section>

      {/* Categorías (opcional para futuro) */}
      <section className="container mx-auto px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-full whitespace-nowrap">
            Todos
          </button>
          <button className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-full whitespace-nowrap hover:bg-zinc-700 transition-colors">
            Combos
          </button>
          <button className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-full whitespace-nowrap hover:bg-zinc-700 transition-colors">
            Individuales
          </button>
          <button className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-full whitespace-nowrap hover:bg-zinc-700 transition-colors">
            Bebidas
          </button>
        </div>
      </section>

      {/* Productos */}
      <section className="container mx-auto px-4 pb-24">
        <ProductList products={products} />
      </section>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Floating Cart Bar */}
      <FloatingCartBar />
    </main>
  )
}
