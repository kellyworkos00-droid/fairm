import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const region = url.searchParams.get('region')
    const category = url.searchParams.get('category')
    const afterDays = parseInt(url.searchParams.get('afterDays') || '0')

    const where: any = {}
    if (region) where.region = { contains: region, mode: 'insensitive' }
    if (category) where.category = category

    const now = new Date()
    if (!isNaN(afterDays) && afterDays > 0) {
      const start = new Date()
      start.setDate(start.getDate() + afterDays)
      where.startDate = { gte: start }
    } else {
      where.startDate = { gte: now }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
      take: 50,
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Events error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
