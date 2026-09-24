#!/usr/bin/env bash
set -euo pipefail
cd /home/leco/ngochoang/repos/Ngoc-Hoang-App
export $(grep -v '^#' .env.local | xargs)
export NODE_OPTIONS=--openssl-legacy-provider
exec ./node_modules/.bin/nuxt
