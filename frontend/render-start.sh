#!/bin/bash
set -e

# Build frontend
cd frontend
npm install
npm run build

# Start frontend
npm start
