import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const region = url.searchParams.get('region')
    const category = url.searchParams.get('category')
    const take = parseInt(url.searchParams.get('take') || '20')

    const where: any = {}
    if (region) where.region = { contains: region, mode: 'insensitive' }
    if (category) where.categories = { has: category }

    const agrovets = await prisma.agrovet.findMany({
      where,
      orderBy: { rating: 'desc' },
      take,
    })

    return NextResponse.json(agrovets)
  } catch (error) {
    console.error('Agrovets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
