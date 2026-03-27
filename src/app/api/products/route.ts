import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    })

    // Parsear el campo includes de JSON string a array
    const productsWithParsedIncludes = products.map((product) => ({
      ...product,
      includes: JSON.parse(product.includes),
    }))

    return NextResponse.json(productsWithParsedIncludes)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al cargar productos' },
      { status: 500 }
    )
  }
}
