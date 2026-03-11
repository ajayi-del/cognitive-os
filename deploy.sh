#!/bin/bash

# Cognitive OS Deployment Script
# Run: ./deploy.sh

echo "🧠 Deploying Cognitive OS..."

# Check for DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set"
    echo "Set it with: export DATABASE_URL='postgresql://...'"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations
echo "🗄️ Running migrations..."
npx drizzle-kit push:pg

# Build for production
echo "🔨 Building for production..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live"
