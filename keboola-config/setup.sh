#!/bin/bash
set -euo pipefail

echo "Installing dependencies..."
cd /app
npm ci
echo "Building production bundle..."
npm run build
echo "Setup complete."
