import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const product = searchParams.get('product')
    const market = searchParams.get('market')
    const days = parseInt(searchParams.get('days') || '7')

    const where: any = {}

    if (product) {
      where.product = { contains: product, mode: 'insensitive' }
    }

    if (market) {
      where.market = { contains: market, mode: 'insensitive' }
    }

    // Get prices from the last N days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    where.date = { gte: startDate }

    const prices = await prisma.marketPrice.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 100,
    })

    return NextResponse.json(prices)
  } catch (error) {
    console.error('Error fetching market prices:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const price = await prisma.marketPrice.create({
      data: {
        product: data.product,
        market: data.market,
        region: data.region,
        price: data.price,
        unit: data.unit,
        source: data.source || 'manual',
        date: new Date(),
      },
    })

    return NextResponse.json(price)
  } catch (error) {
    console.error('Error creating market price:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
