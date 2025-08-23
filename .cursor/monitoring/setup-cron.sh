#!/usr/bin/env bash
# Setup automated performance tracking

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/track-performance.sh"
PROJECT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Add cron job for daily metrics (run at 6 PM)
CRON_ENTRY="0 18 * * * cd '$PROJECT_PATH' && '$SCRIPT_PATH' >> '$PROJECT_PATH/.cursor/monitoring/cron.log' 2>&1"

# Check if cron job already exists
if ! crontab -l 2>/dev/null | grep -q "$SCRIPT_PATH"; then
    echo "Adding daily performance tracking to cron..."
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
    echo "✅ Cron job added successfully"
else
    echo "✅ Cron job already exists"
fi

echo "📅 Performance metrics will be collected daily at 6 PM"
echo "📊 View logs: tail -f '$PROJECT_PATH/.cursor/monitoring/cron.log'"
