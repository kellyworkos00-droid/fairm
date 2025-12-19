import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')

    if (session.user.role === 'BUYER') {
      // Get recent order items for this buyer
      const orders = await prisma.order.findMany({
        where: { buyerId: session.user.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })

      const categoryCounts: Record<string, number> = {}
      const productCounts: Record<string, number> = {}

      for (const order of orders) {
        for (const item of order.items) {
          const cat = item.product.category
          categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity
          productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity
        }
      }

      const topCategory = (Object.entries(categoryCounts) as Array<[string, number]>)
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0]
      const topProducts = (Object.entries(productCounts) as Array<[string, number]>)
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
        .slice(0, limit)
        .map(([productId]: [string, number]) => productId)

      const recommended = await prisma.product.findMany({
        where: {
          available: true,
          ...(topCategory ? { category: topCategory as any } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      return NextResponse.json({
        topCategory,
        topProducts,
        recommended,
      })
    }

    // Default: recommend recent popular products overall
    const popular = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    })

    const products = await prisma.product.findMany({
      where: {
        id: { in: popular.map((p: { productId: string }) => p.productId) },
        available: true,
      },
    })

    return NextResponse.json({ recommended: products })
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
