import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const location = searchParams.get('location')

    const where: any = { available: true }

    if (category) {
      where.category = category
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            location: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'FARMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    const productCount = await prisma.product.count({
      where: { farmerId: session.user.id },
    })

    const limits = {
      FREE: 5,
      PREMIUM: 50,
      ENTERPRISE: Infinity,
    }

    const maxProducts = limits[subscription?.tier as keyof typeof limits] || 5

    if (productCount >= maxProducts) {
      return NextResponse.json(
        { error: `Product limit reached. Upgrade to list more products.` },
        { status: 403 }
      )
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        farmerId: session.user.id,
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
