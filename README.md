# FiarmConnect - AgriTech Farm-to-Market Marketplace

A comprehensive digital platform connecting Kenyan farmers directly to buyers, providing market intelligence, bulk aggregation tools, and educational resources to transform agricultural commerce in Kenya.

## 🌱 Overview

**FiarmConnect** solves critical problems in Kenya's agricultural sector:
- **Farm-to-Market Marketplace**: Direct connection between farmers and buyers (retailers, restaurants, exporters)
- **Pricing Intelligence**: Real-time commodity prices, weather forecasts, and market analytics
- **Bulk Aggregation**: Pool produce from multiple farmers to meet large buyer orders
- **Farmer Education**: Expert guides on crop management, pest control, and best practices

## 💰 Monetization Model

### Subscription Tiers

| Feature | Free | Premium (KES 500/month) | Enterprise (KES 2,500/month) |
|---------|------|----------|------------|
| Product Listings | 5 | 50 | Unlimited |
| Transaction Commission | 10% | 7% | 5% |
| Market Data | Delayed (24h) | Real-time | Real-time + Analytics |
| Educational Content | Basic articles | Premium content | Full access + API |
| Support | Community | Priority | Dedicated manager |

### Revenue Streams
1. **Transaction Commissions**: 5-10% per sale based on subscription tier
2. **Monthly Subscriptions**: KES 500 (Premium) or KES 2,500 (Enterprise)
3. **Bulk Aggregation Margin**: Revenue from margin per kg sold

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS
- **Payments**: Stripe + M-Pesa integration
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Setup Steps

1. **Clone and Install**
```bash
cd fiarm
npm install
```

2. **Environment Variables**

Update `.env` with your credentials:
```env
# Database
DATABASE_URL="your_postgres_connection_string"

# NextAuth
NEXTAUTH_SECRET="generate-a-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateways
STRIPE_SECRET_KEY="your_stripe_key"
MPESA_CONSUMER_KEY="your_mpesa_key"
MPESA_CONSUMER_SECRET="your_mpesa_secret"

# Optional APIs
WEATHER_API_KEY="your_weather_api_key"
```

3. **Database Setup**

Start Prisma local database:
```bash
npx prisma dev
```

Or use your own PostgreSQL database and migrate:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Seed Sample Data (Optional)**
```bash
npx prisma db seed
```

5. **Run Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
fiarm/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── products/     # Product management
│   │   │   ├── orders/       # Order processing
│   │   │   ├── subscription/ # Subscription management
│   │   │   ├── market-data/  # Pricing intelligence
│   │   │   └── education/    # Educational content
│   │   ├── auth/             # Auth pages (signin/signup)
│   │   ├── dashboard/        # User dashboards
│   │   ├── marketplace/      # Product marketplace
│   │   ├── market-data/      # Market intelligence
│   │   └── education/        # Learning resources
│   ├── lib/
│   │   ├── prisma.ts         # Database client
│   │   └── auth.ts           # NextAuth configuration
│   ├── config/
│   │   └── subscriptions.ts  # Pricing tiers
│   └── types/                # TypeScript definitions
├── prisma/
│   └── schema.prisma         # Database schema
└── .env                      # Environment variables
```

## 🗄️ Database Schema

### Core Models
- **User**: Farmers, Buyers, Aggregators, Admins with role-based access
- **Subscription**: Tiered pricing (Free, Premium, Enterprise)
- **Product**: Farm produce listings with pricing and availability
- **Order**: Transaction management with commission tracking
- **MarketPrice**: Real-time commodity pricing data
- **EducationContent**: Crop guides and farming best practices
- **Aggregation**: Bulk selling coordination
- **Payment**: Transaction and subscription payments

## 🎯 Key Features

### 1. Farm-to-Market Marketplace
- Product listings with images and details
- Search and filter by category, location, price
- Direct messaging between farmers and buyers
- Order management and tracking

### 2. Pricing Intelligence
- Real-time commodity prices across markets
- Historical price trends and charts
- Weather forecasts and alerts
- Demand predictions

### 3. Bulk Aggregation
- Group farmer produce for large orders
- Quality grading and certification
- Logistics coordination
- Better pricing through volume

### 4. Farmer Education
- Crop management guides
- Pest and disease control
- Soil health and fertilization
- Modern farming techniques
- Video tutorials (Premium)

### 5. Subscription Management
- Flexible tier upgrades/downgrades
- M-Pesa and Stripe payment integration
- Automated billing and invoices
- Usage tracking and limits

## 🔐 Authentication & Roles

- **FARMER**: List products, manage inventory, view orders
- **BUYER**: Browse marketplace, place orders, track deliveries
- **AGGREGATOR**: Coordinate bulk purchases, manage quality control
- **ADMIN**: Platform management, analytics, user support

## 🌍 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Environment Variables
Ensure all production environment variables are set in your deployment platform.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/[...nextauth]` - Sign in/out

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (Farmers only)

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order

### Market Data
- `GET /api/market-data` - Get commodity prices
- `POST /api/market-data` - Add price data

### Subscription
- `GET /api/subscription` - Get current subscription
- `POST /api/subscription` - Upgrade/downgrade

### Education
- `GET /api/education` - List educational content

## 🛠️ Development

### Generate Prisma Client
```bash
npx prisma generate
```

### Run Database Migrations
```bash
npx prisma migrate dev
```

### View Database
```bash
npx prisma studio
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Support

For support:
- Email: support@fiarmconnect.co.ke
- Phone: +254 700 000 000
- Visit: [https://fiarmconnect.co.ke](https://fiarmconnect.co.ke)

---

**Built with ❤️ for Kenyan Farmers**

Empowering agriculture through technology. Join us in transforming Kenya's farming sector!
