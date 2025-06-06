#!/bin/bash

# Deployment script for Plant Disease Detection Dashboard
echo "🚀 Deploying Plant Disease Detection Dashboard to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Environment check
ENVIRONMENT=${1:-preview}

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🏭 Deploying to PRODUCTION..."
    DEPLOY_FLAG="--prod"
else
    echo "🔧 Deploying to PREVIEW..."
    DEPLOY_FLAG=""
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Lint check
echo "  📝 Checking code quality..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues before deploying."
    exit 1
fi

# Test check
echo "  🧪 Running tests..."
npm run test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues before deploying."
    exit 1
fi

# Build check
echo "  🏗️ Testing production build..."
npm run build:prod
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the issues before deploying."
    exit 1
fi

# Deploy to Vercel
echo "📡 Deploying to Vercel..."
vercel $DEPLOY_FLAG

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "🌍 Your app is now live in production!"
        echo "🔗 Visit: https://your-domain.vercel.app"
    else
        echo "🔍 Preview deployment completed!"
        echo "🔗 Check the preview URL above"
    fi
    
    echo ""
    echo "📊 Don't forget to:"
    echo "  1. Test the deployed application"
    echo "  2. Monitor performance with Vercel Analytics"
    echo "  3. Check Lighthouse scores"
    echo "  4. Verify all features work correctly"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi