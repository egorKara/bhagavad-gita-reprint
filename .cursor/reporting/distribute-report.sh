#!/usr/bin/env bash
# Distribute weekly report to team

LATEST_SUMMARY=".cursor/reporting/latest_summary.txt"
LATEST_REPORT=".cursor/reporting/latest_report.md"

if [[ ! -f "$LATEST_SUMMARY" ]]; then
    echo "❌ No recent summary found. Run generate-weekly-report.sh first."
    exit 1
fi

echo "📧 Weekly Report Distribution"
echo "============================"

# Show summary content
cat "$LATEST_SUMMARY"

echo ""
echo "🔧 Distribution Commands:"
echo "========================="

# Slack distribution
echo "📱 Slack:"
echo "curl -X POST -H 'Content-type: application/json' \\"
echo "  --data '{\"text\":\"$(cat $LATEST_SUMMARY)\"}' \\"
echo "  \$SLACK_WEBHOOK_URL"

echo ""
# Email distribution  
echo "📧 Email:"
echo "mail -s \"Weekly Development Report - \$(date +%Y-%m-%d)\" \\"
echo "  team@gita-1972-reprint.ru < $LATEST_SUMMARY"

echo ""
# GitHub issue
echo "🐙 GitHub Issue:"
echo "gh issue create \\"
echo "  --title \"Weekly Report - \$(date +%Y-%m-%d)\" \\"
echo "  --body-file $LATEST_REPORT \\"
echo "  --label \"weekly-report,analytics\""

echo ""
echo "📋 Manual Distribution:"
echo "• Copy summary from: $LATEST_SUMMARY"
echo "• Full report at: $LATEST_REPORT"
echo "• Share in team channels, email, or meetings"
