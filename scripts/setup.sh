#!/bin/bash

# Plant Disease Detection Dashboard Setup Script
echo "🌱 Setting up Plant Disease Detection Dashboard..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js >= $REQUIRED_VERSION"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "✅ Created .env file. Please configure your environment variables."
else
    echo "✅ Environment file already exists"
fi

# Setup Husky
echo "🐶 Setting up Husky git hooks..."
npx husky install

# Create necessary directories
mkdir -p public/icons
mkdir -p public/screenshots
mkdir -p src/tests

# Check if build works
echo "🏗️ Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with the correct API_URL"
echo "2. Add your app icons to public/icons/"
echo "3. Add screenshots to public/screenshots/"
echo "4. Run 'npm run dev' to start development"
echo "5. Run 'npm run build:prod' before deploying"
echo ""
echo "Happy coding! 🚀"