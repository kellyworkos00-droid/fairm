require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@example.com' },
    update: {},
    create: {
      email: 'farmer@example.com',
      name: 'John Farmer',
      password,
      role: 'FARMER',
      location: 'Nakuru',
    },
  })

  await prisma.subscription.upsert({
    where: { userId: farmer.id },
    update: {},
    create: {
      userId: farmer.id,
      tier: 'PREMIUM',
      status: 'active',
      monthlyPrice: 500,
    },
  })

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Mary Buyer',
      password,
      role: 'BUYER',
      location: 'Nairobi',
    },
  })

  await prisma.subscription.upsert({
    where: { userId: buyer.id },
    update: {},
    create: {
      userId: buyer.id,
      tier: 'FREE',
      status: 'active',
      monthlyPrice: 0,
    },
  })

  const productsData = [
    { name: 'Tomatoes', category: 'VEGETABLES', unit: 'KG', quantity: 200, pricePerUnit: 80, location: 'Nakuru' },
    { name: 'Onions', category: 'VEGETABLES', unit: 'KG', quantity: 300, pricePerUnit: 70, location: 'Nyeri' },
    { name: 'Maize', category: 'GRAINS', unit: 'BAG', quantity: 100, pricePerUnit: 2500, location: 'Trans Nzoia' },
    { name: 'Milk', category: 'DAIRY', unit: 'LITRE', quantity: 500, pricePerUnit: 60, location: 'Kiambu' },
  ]

  for (const p of productsData) {
    await prisma.product.create({
      data: { ...p, farmerId: farmer.id, available: true },
    })
  }

  const agrovets = [
    { name: 'Green Seeds Agrovet', region: 'Central', rating: 4.5, categories: ['seeds', 'fertilizer'], services: ['delivery'] },
    { name: 'Harvest Hub Agrovet', region: 'Rift Valley', rating: 4.2, categories: ['tools', 'fertilizer'], services: ['soil testing'] },
  ]
  for (const a of agrovets) {
    await prisma.agrovet.create({ data: a })
  }

  const events = [
    { title: 'Nakuru Farmers Expo', description: 'Exhibition and training', region: 'Rift Valley', category: 'expo', startDate: new Date(Date.now() + 7*24*60*60*1000) },
    { title: 'Seed Selection Workshop', description: 'Choosing best seeds', region: 'Central', category: 'training', startDate: new Date(Date.now() + 14*24*60*60*1000) },
  ]
  for (const e of events) {
    await prisma.event.create({ data: e })
  }

  const prices = [
    { product: 'Tomatoes', market: 'Wakulima Market', region: 'Nairobi', price: 85, unit: 'KG' },
    { product: 'Onions', market: 'Kongowea Market', region: 'Mombasa', price: 75, unit: 'KG' },
  ]
  for (const mp of prices) {
    await prisma.marketPrice.create({ data: mp })
  }

  console.log('Seed data created')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
