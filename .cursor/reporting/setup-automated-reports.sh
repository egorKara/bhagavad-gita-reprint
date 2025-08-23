#!/usr/bin/env bash
# Setup automated weekly report generation

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/generate-weekly-report.sh"
PROJECT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Add cron job for Friday afternoon reports
CRON_ENTRY="0 17 * * 5 cd '$PROJECT_PATH' && '$SCRIPT_PATH' >> '$PROJECT_PATH/.cursor/reporting/cron.log' 2>&1"

# Check if cron job already exists
if ! crontab -l 2>/dev/null | grep -q "$SCRIPT_PATH"; then
    echo "📅 Adding weekly report generation to cron (Fridays at 5 PM)..."
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
    echo "✅ Automated weekly reports configured"
else
    echo "✅ Weekly reports already automated"
fi

echo "📊 Reports will be generated every Friday at 5 PM"
echo "📁 Reports saved to: $PROJECT_PATH/.cursor/reporting/"
echo "📧 Summary files ready for email/Slack distribution"
