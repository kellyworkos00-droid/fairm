# FiarmConnect - AgriTech Marketplace

## Project Context
This is an **AgriTech Farm-to-Market Marketplace** for Kenya that connects farmers directly to buyers, eliminating middlemen and providing market intelligence, bulk aggregation tools, and educational resources.

## Tech Stack
- **Framework**: Next.js 14 with App Router and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with role-based access
- **Styling**: Tailwind CSS
- **Payments**: Stripe + M-Pesa integration

## Project Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/app/api/` - REST API endpoints
- `src/lib/` - Shared utilities (Prisma, auth)
- `src/config/` - Configuration files
- `prisma/` - Database schema and migrations

## Key Features
1. **Farm-to-Market Marketplace** - Product listings, search, orders
2. **Pricing Intelligence** - Real-time market prices, weather data
3. **Bulk Aggregation** - Pool produce from multiple farmers
4. **Farmer Education** - Crop guides, best practices
5. **Subscription Tiers** - Free, Premium (KES 500/mo), Enterprise (KES 2,500/mo)

## Database Models
- User (Farmers, Buyers, Aggregators, Admins)
- Subscription (tiered pricing)
- Product (marketplace items)
- Order (with commission tracking)
- MarketPrice (pricing intelligence)
- EducationContent (learning resources)
- Aggregation (bulk selling)
- Payment (transactions)

## Coding Guidelines
- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Use Prisma for all database operations
- Implement proper error handling
- Add role-based access control to protected routes
- Use Tailwind CSS for styling
- Keep API responses consistent (JSON format)

## Common Tasks

### Adding New API Endpoints
```typescript
// src/app/api/[feature]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  // Implementation
}
```

### Creating New Pages
```typescript
// src/app/[page]/page.tsx
'use client'

export default function PageName() {
  // Implementation
}
```

### Database Operations
```typescript
// Always use Prisma client
import { prisma } from '@/lib/prisma'

const users = await prisma.user.findMany()
```

## Important Notes
- Subscription limits are enforced in `/api/products` route
- Commission rates vary by subscription tier (10%, 7%, 5%)
- All authenticated routes should check user role
- Use `getServerSession` in API routes for authentication

## Development Workflow
1. Start database: `npx prisma dev`
2. Start dev server: `npm run dev`
3. View database: `npx prisma studio`
4. Apply migrations: `npx prisma migrate dev`

## Monetization
- Transaction commissions: 5-10% based on tier
- Subscriptions: KES 500-2,500/month
- Bulk aggregation margins

When suggesting code changes, always consider:
- Subscription tier limitations
- Role-based permissions
- Commission calculations
- Database relationships
- API error handling
