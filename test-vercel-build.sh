#!/bin/bash
set -e

echo "🔨 Simulating Vercel Build Process"
echo "=================================="

echo ""
echo "1️⃣  Installing dependencies (frontend)..."
cd frontend
npm install --production=false
echo "✅ Frontend dependencies installed"

echo ""
echo "2️⃣  Building frontend..."
npm run build
echo "✅ Frontend built successfully"

echo ""
echo "3️⃣  Installing dependencies (backend)..."
cd ../backend
npm install --production=false
echo "✅ Backend dependencies installed"

echo ""
echo "4️⃣  Generating Prisma client..."
npm run prisma:generate
echo "✅ Prisma client generated"

echo ""
echo "5️⃣  Building backend..."
npm run build
echo "✅ Backend built successfully"

echo ""
echo "=================================="
echo "🎉 Build simulation complete!"
echo "✅ All checks passed"
