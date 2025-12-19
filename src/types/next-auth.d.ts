import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    subscriptionTier?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      subscriptionTier: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    subscriptionTier?: string
  }
}
