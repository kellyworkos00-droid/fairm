import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isPremium = searchParams.get('premium') === 'true'

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (isPremium !== null) {
      where.isPremium = isPremium
    }

    const content = await prisma.educationContent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching education content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
