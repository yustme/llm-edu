#!/bin/bash
set -Eeuo pipefail

cd /app

# Install pnpm (not included in base image, project uses pnpm-lock.yaml)
npm install -g pnpm

# Install dependencies
pnpm install --frozen-lockfile

# Build the production bundle into /app/dist
pnpm build
