# Vercel Deployment Guide

This monorepo deploys the **admin app** to Vercel. Follow these steps:

## Setup in Vercel Dashboard

### 1. Root Directory
When connecting your repository in Vercel:
- Go to **Settings** → **Root Directory**
- Set root directory to: `apps/admin`
- This tells Vercel where the Next.js app is located

### 2. Build Settings
Vercel will automatically detect:
- Framework: **Next.js**
- Build Command: `npm run build` (from apps/admin)
- Output Directory: `.next` (from apps/admin)

### 3. Environment Variables
Add these in **Settings** → **Environment Variables**:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Deploy Citizen App (Future)

When ready to deploy the citizen app:
1. Create a separate Vercel project
2. Set root directory to `apps/citizen`
3. Configure the same environment variables

## Local Development

```bash
# Install all dependencies
npm run install:all

# Run both apps
npm run dev

# Run only admin
npm run dev:admin

# Run only citizen
npm run dev:citizen
```
