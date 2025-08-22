#!/usr/bin/env bash
set -euo pipefail

# Non-interactive defaults for agents
git config pull.rebase true || true
git config rebase.autoStash true || true
git config fetch.prune true || true

# Sync repository
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git fetch --all --prune
  # Try fast-forward first
  if ! git pull --ff-only; then
    git pull --rebase --autostash
  fi
fi

# Install deps if needed (skip dev-heavy install in agents)
if [ -f package.json ]; then
  if command -v npm >/dev/null 2>&1; then
    npm ci --omit=optional --no-audit --no-fund || npm install --no-audit --no-fund
  fi
fi

echo "Setup complete."