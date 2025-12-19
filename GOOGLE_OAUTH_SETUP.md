# Google OAuth Setup Guide for FiarmConnect

## Overview
FiarmConnect now supports Google Sign-In and Sign-Up. Users can authenticate using their Google accounts instead of creating separate credentials.

## Prerequisites
- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **NEW PROJECT**
4. Enter project name: `FiarmConnect` (or your preferred name)
5. Click **CREATE**

## Step 2: Enable Google+ API

1. In the Cloud Console, search for **Google+ API** in the search bar
2. Click on **Google+ API** in the results
3. Click **ENABLE**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **Credentials** in the left sidebar
2. Click **+ CREATE CREDENTIALS**
3. Select **OAuth client ID**
4. If prompted, click **CONFIGURE CONSENT SCREEN** first:
   - Choose **External** for User Type
   - Fill in App name: `FiarmConnect`
   - Add your email
   - Click **SAVE AND CONTINUE**
   - In Scopes, click **ADD OR REMOVE SCOPES**
   - Search for and add: `email`, `profile`, `openid`
   - Click **SAVE AND CONTINUE**
   - Add yourself as a test user
   - Click **SAVE AND CONTINUE**

## Step 4: Configure OAuth Credentials

1. Back on Credentials page, click **+ CREATE CREDENTIALS** again
2. Select **OAuth client ID**
3. Choose **Web application**
4. Under Authorized redirect URIs, add:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Click **CREATE**
6. A popup will show your credentials:
   - **Client ID** - Copy this
   - **Client Secret** - Copy this
7. Click **OK**

## Step 5: Add Credentials to .env

Open `.env` file and update:

```env
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

Replace the placeholders with your actual credentials from Step 4.

## Step 6: Restart Dev Server

```bash
npm run dev
```

## Step 7: Test Google Sign-In

1. Open http://localhost:3000
2. Click **Sign In** or **Sign Up**
3. You'll see a **Google** button below the form
4. Click it to sign in with your Google account

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in Google Cloud Console matches your app URL exactly
- For local development: `http://localhost:3000/api/auth/callback/google`
- Include the protocol (`http://` or `https://`)

### "Client ID not found" error
- Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly in `.env`
- Restart the dev server after updating `.env`

### Sign-in button not working
- Check browser console for errors (F12 → Console tab)
- Ensure NextAuth is properly configured in `src/lib/auth.ts`
- Verify the page loads without JavaScript errors

## Production Deployment

When deploying to production:

1. Add your production domain to Google Cloud Console:
   - Go to Credentials → Your OAuth client
   - Add `https://yourdomain.com/api/auth/callback/google` to Authorized redirect URIs

2. Update environment variables:
   ```env
   GOOGLE_CLIENT_ID="your-production-client-id"
   GOOGLE_CLIENT_SECRET="your-production-client-secret"
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. Set `NEXTAUTH_SECRET` to a secure random string (NOT "your-secret-key-change-this-in-production")

## User Role Assignment

When users sign in with Google for the first time:
- They'll need to complete their profile (location, phone)
- They can choose their role: Farmer, Buyer, or Aggregator
- A free subscription is automatically created

## Features

### Sign-In Page
- Email/password login (existing credentials)
- Google Sign-In button
- Link to sign-up page

### Sign-Up Page  
- Email/password registration
- Google Sign-Up button (auto-fills name and email)
- Role selection (Farmer, Buyer, Aggregator)
- Phone and location fields

## Security Notes

- Google OAuth securely handles authentication
- Never commit `.env` with real credentials to version control
- Use strong, unique `NEXTAUTH_SECRET` in production
- Keep Google OAuth credentials confidential

## References

- [NextAuth Google Provider Docs](https://next-auth.js.org/providers/google)
- [Google Cloud OAuth Documentation](https://cloud.google.com/docs/authentication)
- [Google OAuth 2.0 Overview](https://developers.google.com/identity/protocols/oauth2)
