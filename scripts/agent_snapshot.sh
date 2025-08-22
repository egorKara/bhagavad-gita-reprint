#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(pwd)
SNAPSHOT_FILE="snapshot-$(date -u +%Y%m%dT%H%M%SZ).tar.gz"

INCLUDE=(
  public
  src
  docs
  .github
  package.json
  README.md
)
EXCLUDE=(
  node_modules
  .git
  tests
  package-lock.json
)

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

# Copy included paths
for p in "${INCLUDE[@]}"; do
  if [ -e "$p" ]; then
    mkdir -p "$tmpdir/$(dirname "$p")"
    cp -r "$p" "$tmpdir/$(dirname "$p")" 2>/dev/null || true
  fi
done

# Remove excluded paths
for p in "${EXCLUDE[@]}"; do
  rm -rf "$tmpdir/$p" 2>/dev/null || true
done

# Make archive
( cd "$tmpdir" && tar -czf "$ROOT_DIR/$SNAPSHOT_FILE" . )

# Report
SIZE=$(du -h "$SNAPSHOT_FILE" | awk '{print $1}')
echo "Snapshot created: $SNAPSHOT_FILE ($SIZE)"