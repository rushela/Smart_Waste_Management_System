w#!/bin/bash

# Quick Setup Script for Local MongoDB Development
# Run with: bash setup-local-mongodb.sh

echo "🔧 Smart Waste Management System - Local MongoDB Setup"
echo "======================================================"
echo ""

# Check if MongoDB is installed
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB is already installed"
else
    echo "⚠️  MongoDB not found. Installing..."
    
    # Check if Homebrew is installed (macOS)
    if command -v brew &> /dev/null; then
        echo "   Installing MongoDB via Homebrew..."
        brew tap mongodb/brew
        brew install mongodb-community@7.0
        echo "✓ MongoDB installed"
    else
        echo "❌ Homebrew not found. Please install MongoDB manually:"
        echo "   Visit: https://www.mongodb.com/docs/manual/installation/"
        exit 1
    fi
fi

# Start MongoDB service
echo ""
echo "🚀 Starting MongoDB service..."
if command -v brew &> /dev/null; then
    brew services start mongodb-community@7.0
    echo "✓ MongoDB service started"
else
    echo "⚠️  Please start MongoDB manually: mongod"
fi

# Create/update .env file
echo ""
echo "📝 Updating .env file..."

if [ -f .env ]; then
    # Backup existing .env
    cp .env .env.backup
    echo "   (Backup created: .env.backup)"
fi

# Update or create .env
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/waste_management
PORT=5000
NODE_ENV=development
EOF

echo "✓ .env file updated with local MongoDB connection"

# Test MongoDB connection
echo ""
echo "🔍 Testing MongoDB connection..."
sleep 2

if mongosh --quiet --eval "db.version()" mongodb://localhost:27017/waste_management &> /dev/null; then
    echo "✓ MongoDB connection successful!"
else
    echo "⚠️  Could not connect to MongoDB. It may still be starting up."
    echo "   Wait a few seconds and try: npm start"
fi

# Install npm dependencies if needed
echo ""
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ npm dependencies already installed"
fi

# Summary
echo ""
echo "======================================================"
echo "✅ Setup Complete!"
echo "======================================================"
echo ""
echo "Next steps:"
echo "  1. Start the server:    npm start"
echo "  2. Seed the database:   node seed/collectionSeed.js"
echo "  3. Test the API:        curl http://localhost:5000/health"
echo ""
echo "MongoDB connection string: mongodb://localhost:27017/waste_management"
echo ""
