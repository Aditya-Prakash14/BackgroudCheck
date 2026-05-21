#!/bin/bash
set -e

# Build backend
cd backend
npm install
npm run prisma:generate
npm run build

# Start backend
npm start
