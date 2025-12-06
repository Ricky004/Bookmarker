# Deployment Setup Instructions

## Fix Email Confirmation Redirect Issue

Your email confirmation links are redirecting to localhost instead of your production URL. Here's how to fix it:

### Step 1: Update Supabase Redirect URLs

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Update the following settings:

   **Site URL:**
   ```
   https://bookmarker-green-five.vercel.app
   ```

   **Redirect URLs (add both):**
   ```
   https://bookmarker-green-five.vercel.app/**
   http://localhost:3000/**
   ```

5. Click **Save**

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `bookmarker-green-five`
3. Go to **Settings** → **Environment Variables**
4. Add these variables (if not already added):

   ```
   DATABASE_URL=postgresql://postgres.mgqzesjhydmhwqfhvsrk:Tridip@5844@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
   
   DIRECT_URL=postgresql://postgres.mgqzesjhydmhwqfhvsrk:Tridip@5844@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
   
   NEXT_PUBLIC_SUPABASE_URL=https://mgqzesjhydmhwqfhvsrk.supabase.co
   
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_GPjnLkXoioNNn9ttWtiPnw_40RRHxA8
   
   SECRET_KEY=sb_secret_iLE2uQYKBT58L3s96rK0tQ_m7Fm9Pbd
   ```

5. **Important:** Remove `NEXT_PUBLIC_API_URL` if it exists (we're now using relative URLs)

### Step 3: Redeploy

After making these changes:
1. Commit and push your code changes
2. Vercel will automatically redeploy
3. Or manually redeploy from Vercel dashboard

### Testing

1. Sign up with a new email
2. Check your email for the confirmation link
3. Click the link - it should now redirect to `https://bookmarker-green-five.vercel.app` instead of localhost
4. Test creating collections and bookmarks

## What Was Fixed

1. **API calls**: Changed from hardcoded `localhost:3000` to relative URLs (`/api/...`) so they work on any domain
2. **Email redirects**: Need to configure Supabase to use your production URL instead of localhost

## Notes

- Keep your `.env.local` file for local development
- Never commit `.env.local` to git (it's already in .gitignore)
- The app will now work on both localhost and production without code changes
