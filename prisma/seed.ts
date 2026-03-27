import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar datos existentes
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Crear productos
  const products = [
    {
      name: 'Combo Simple',
      description: '1 pancho con papas y gaseosa',
      price: 2000,
      image: '/hotdogs.png',
      includes: JSON.stringify(['Lluvia de papas', 'Salsas', 'Gaseosa']),
    },
    {
      name: 'Combo Completo',
      description: '1 pancho full con papas, queso y gaseosa',
      price: 3000,
      image: '/hotdogs.png',
      includes: JSON.stringify(['Lluvia de papas', 'Salsas', 'Gaseosa', 'Cebolla', 'Queso']),
    },
    {
      name: 'Combo Triple',
      description: '3 panchos con todo incluido',
      price: 4500,
      image: '/hotdogs.png',
      includes: JSON.stringify(['3 Panchos', 'Lluvia de papas', 'Salsas', 'Gaseosa']),
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('Seed completado: 3 productos creados')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
