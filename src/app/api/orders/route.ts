import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { COMMISSION_RATES } from '@/config/subscriptions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const where: any = {}

    if (session.user.role === 'BUYER') {
      where.buyerId = session.user.id
    } else if (session.user.role === 'FARMER') {
      where.sellerId = session.user.id
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'BUYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, deliveryAddress, notes } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      )
    }

    // Get seller subscription to calculate commission
    const firstProduct = await prisma.product.findUnique({
      where: { id: items[0].productId },
      include: {
        farmer: {
          include: {
            subscription: true,
          },
        },
      },
    })

    if (!firstProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const sellerId = firstProduct.farmerId
    const subscriptionTier = firstProduct.farmer.subscription?.tier || 'FREE'
    const commissionRate = COMMISSION_RATES[subscriptionTier as keyof typeof COMMISSION_RATES]

    // Calculate totals
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || !product.available) {
        return NextResponse.json(
          { error: `Product ${item.productId} not available` },
          { status: 400 }
        )
      }

      const subtotal = item.quantity * product.pricePerUnit
      totalAmount += subtotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        pricePerUnit: product.pricePerUnit,
        subtotal,
      })
    }

    const commission = totalAmount * commissionRate

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: session.user.id,
        sellerId,
        totalAmount,
        commission,
        deliveryAddress,
        notes,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
        delivery: {
          create: {
            status: 'pending',
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        delivery: true,
      },
    })

    // Create notification for seller
    await prisma.notification.create({
      data: {
        userId: sellerId,
        title: 'New Order Received',
        message: `You have a new order #${order.orderNumber} for KES ${totalAmount}`,
        type: 'order_update',
        link: `/orders/${order.id}`,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
