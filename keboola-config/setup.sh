#!/bin/bash
set -Eeuo pipefail

cd /app

# Dependencies are installed by Keboola platform (npm ci) before this script runs.
# Build the production bundle into /app/dist.
npm run build
