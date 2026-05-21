#!/bin/bash

# Quick setup script for BGV Platform local development

echo "🚀 BGV Platform - Local Development Setup"
echo "=========================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "  Found: $NODE_VERSION"

# Clone or pull
if [ -d ".git" ]; then
    echo ""
    echo "✓ Pulling latest changes..."
    git pull origin main
else
    echo "❌ Not a git repository. Please clone the repository first."
    exit 1
fi

# Backend setup
echo ""
echo "✓ Setting up backend..."
cd backend
cp .env.example .env 2>/dev/null || true
echo "  Please edit backend/.env with your credentials"

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
fi

echo "  Generating Prisma client..."
npm run prisma:generate

echo "  Running migrations..."
npm run prisma:migrate

echo "  Seeding database (optional)..."
npm run prisma:seed 2>/dev/null || true

cd ..

# Frontend setup
echo ""
echo "✓ Setting up frontend..."
cd frontend
cp .env.example .env.local 2>/dev/null || true
echo "  Please edit frontend/.env.local with your API URL"

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
fi

cd ..

# Summary
echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Update environment variables:"
echo "   - backend/.env"
echo "   - frontend/.env.local"
echo ""
echo "2. Start development servers in separate terminals:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For database GUI:"
echo "   $ cd backend && npx prisma studio"
echo ""
echo "Happy coding! 🎉"
