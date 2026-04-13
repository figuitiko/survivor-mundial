#!/usr/bin/env bash

set -euo pipefail

echo "==> Running GGA review on staged files"
gga run

echo
echo "==> Running lint"
npm run lint

echo
echo "==> Running typecheck"
npm run typecheck

echo
echo "==> Running production build"
npm run build

echo
echo "All review and verification checks passed."
