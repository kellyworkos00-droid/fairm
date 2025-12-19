import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'FARMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const farmerId = session.user.id

    // Orders for farmer
    const orders = await prisma.order.findMany({
      where: { sellerId: farmerId },
      include: { items: { include: { product: true } } },
    })

    const totalOrders = orders.length
    const totalRevenue = orders.reduce(
      (acc: number, o: { totalAmount: number; commission: number }) => acc + (o.totalAmount - o.commission),
      0
    )
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const statusCounts: Record<string, number> = {}
    for (const o of orders) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    }

    const productTotals: Record<string, { name: string; quantity: number; revenue: number }> = {}
    for (const o of orders) {
      for (const item of o.items) {
        if (!productTotals[item.productId]) {
          productTotals[item.productId] = {
            name: item.product.name,
            quantity: 0,
            revenue: 0,
          }
        }
        productTotals[item.productId].quantity += item.quantity
        productTotals[item.productId].revenue += item.subtotal
      }
    }

    const topProducts = Object.entries(productTotals)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      avgOrderValue,
      statusCounts,
      topProducts,
    })
  } catch (error) {
    console.error('Farmer performance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
