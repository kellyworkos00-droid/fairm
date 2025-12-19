export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    currency: 'KES',
    features: [
      'List up to 5 products',
      'Basic market price data (delayed)',
      'Access to educational articles',
      '10% transaction commission',
      'Community support',
    ],
    limits: {
      maxProducts: 5,
      maxOrders: 10,
      marketDataDelay: 24, // hours
      premiumContent: false,
      priceAlerts: false,
    },
  },
  PREMIUM: {
    name: 'Premium',
    price: 500, // KES per month
    currency: 'KES',
    features: [
      'List up to 50 products',
      'Real-time market prices',
      'Weather alerts & forecasts',
      'Premium educational content',
      '7% transaction commission',
      'Price alerts (SMS/Email)',
      'Priority support',
    ],
    limits: {
      maxProducts: 50,
      maxOrders: 100,
      marketDataDelay: 0,
      premiumContent: true,
      priceAlerts: true,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 2500, // KES per month
    currency: 'KES',
    features: [
      'Unlimited product listings',
      'Real-time market intelligence',
      'Advanced analytics & reporting',
      'Bulk selling tools',
      'Quality grading services',
      '5% transaction commission',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
    ],
    limits: {
      maxProducts: Infinity,
      maxOrders: Infinity,
      marketDataDelay: 0,
      premiumContent: true,
      priceAlerts: true,
      bulkSelling: true,
      apiAccess: true,
    },
  },
}

export const COMMISSION_RATES = {
  FREE: 0.10, // 10%
  PREMIUM: 0.07, // 7%
  ENTERPRISE: 0.05, // 5%
}

export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  STRIPE: 'stripe',
  CASH: 'cash',
}
