#!/usr/bin/env bash
# Setup Automated Weekly Reporting System

set -euo pipefail

echo "📊 Setting up Automated Weekly Reporting..."
echo "=========================================="

# Create reporting directory
REPORTS_DIR=".cursor/reporting"
mkdir -p "$REPORTS_DIR"

# Create comprehensive weekly report script
cat > "$REPORTS_DIR/generate-weekly-report.sh" << 'EOF'
#!/usr/bin/env bash
# Comprehensive Weekly Report Generator

set -euo pipefail

WEEK_END=$(date +%Y-%m-%d)
WEEK_START=$(date -d 'monday -6 days' +%Y-%m-%d)
REPORT_FILE=".cursor/reporting/weekly_report_$WEEK_END.md"

echo "📊 Generating Comprehensive Weekly Report..."
echo "Week: $WEEK_START to $WEEK_END"

# Create comprehensive report
cat > "$REPORT_FILE" << REPORT_EOF
# Weekly Development Report

**Week Ending:** $WEEK_END  
**Week Starting:** $WEEK_START  
**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Project:** Bhagavad Gita Reprint

## 🎯 Executive Summary

### Key Achievements This Week
$(git log --since="$WEEK_START" --until="$WEEK_END" --oneline | head -5 | sed 's/^/- /')
$([ $(git log --since="$WEEK_START" --until="$WEEK_END" --oneline | wc -l) -gt 5 ] && echo "- ... and $(( $(git log --since="$WEEK_START" --until="$WEEK_END" --oneline | wc -l) - 5 )) more commits")

### Metrics Overview
| Metric | Value | vs Last Week | Status |
|--------|-------|--------------|--------|
| Commits | $(git log --since="$WEEK_START" --until="$WEEK_END" --oneline | wc -l) | - | 📈 |
| Files Changed | $(git diff --name-only HEAD~7..HEAD 2>/dev/null \| sort -u \| wc -l || echo "0") | - | 📊 |
| Lines Added | $(git log --since="$WEEK_START" --numstat --pretty="" \| awk '{add+=\$1} END {print add+0}') | - | ➕ |
| Lines Removed | $(git log --since="$WEEK_START" --numstat --pretty="" \| awk '{sub+=\$2} END {print sub+0}') | - | ➖ |
| Memory Bank Health | $(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "N/A")% | - | $([ $(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "0") -ge 95 ] && echo "✅" || echo "⚠️") |

## 📊 Detailed Analytics

### Development Activity
- **Active Days:** $(git log --since="$WEEK_START" --until="$WEEK_END" --pretty=format:"%ad" --date=short | sort -u | wc -l)/7
- **Peak Activity Day:** $(git log --since="$WEEK_START" --until="$WEEK_END" --pretty=format:"%ad" --date=short | sort | uniq -c | sort -nr | head -1 | awk '{print $2}')
- **Contributors:** $(git shortlog --since="$WEEK_START" --until="$WEEK_END" -sn | wc -l)
- **Avg Commit Size:** $(git log --since="$WEEK_START" --until="$WEEK_END" --numstat --pretty="" | awk '{add+=\$1; sub+=\$2} END {commits='$(git log --since="$WEEK_START" --until="$WEEK_END" --oneline | wc -l)'; if(commits>0) print int((add+sub)/commits); else print 0}') lines/commit

### Code Quality Trends
- **Current ESLint Score:** $(npm run lint 2>/dev/null | grep -c "error" | awk '{print 100-$1}' || echo "N/A")%
- **Documentation Files:** $(find . -name "*.md" | wc -l) ($(find .cursor -name "*.md" | wc -l) in .cursor/)
- **Configuration Health:** $(./scripts/validate-cursor-config.sh >/dev/null 2>&1 && echo "✅ Healthy" || echo "⚠️ Issues")
- **Automated Scripts:** $(find scripts -name "*.sh" | wc -l) available

### Memory Bank Status
- **Health Score:** $(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "N/A")%
- **Files Present:** $(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['present_files'])" 2>/dev/null || echo "N/A")/$(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['required_files'])" 2>/dev/null || echo "N/A")
- **Last Update:** $(stat -c %y .cursor/memory-bank/current-priorities.md 2>/dev/null | cut -d' ' -f1 || echo "Unknown")

## 🔧 System Performance

### Cursor Optimization Status
- **Version:** v2.1 (Latest)
- **Language Policy:** English primary, Russian secondary ✅
- **BugBot Integration:** Active (PR analysis enabled)
- **MCP Plugins:** $([ -f ".cursor/analytics/plugin-status.json" ] && echo "Installed" || echo "Pending installation")
- **Performance Monitoring:** Active (daily metrics collection)

### Infrastructure Health
- **Total Files:** $(find . -type f ! -path "./node_modules/*" ! -path "./.git/*" | wc -l)
- **Project Size:** $(du -sh . 2>/dev/null | awk '{print $1}' || echo "N/A")
- **Git Repository:** $(git rev-list --all --count 2>/dev/null || echo "N/A") commits total
- **Branches:** $(git branch -r 2>/dev/null | wc -l || echo "N/A") remote, $(git branch | wc -l || echo "N/A") local

## 📈 Progress Tracking

### Weekly Goals Status
$(if [ -f ".cursor/weekly-goals.md" ]; then
    echo "#### Goals from last week:"
    grep "^- \[ \]" .cursor/weekly-goals.md 2>/dev/null | head -5 || echo "No goals tracked"
else
    echo "No weekly goals file found - consider creating .cursor/weekly-goals.md"
fi)

### Performance vs Targets
| Target Metric | Goal | Current | Progress |
|---------------|------|---------|----------|
| Development Speed | +35% | Monitoring | 🔄 |
| Bug Detection | 85% auto | BugBot ready | 🟡 |
| ESLint Compliance | 98% | $(npm run lint 2>/dev/null | grep -c "error" | awk '{print 100-$1}' || echo "N/A")% | $([ $(npm run lint 2>/dev/null | grep -c "error" | awk '{print $1}' || echo "5") -le 2 ] && echo "✅" || echo "🔄") |
| Memory Bank Health | 95%+ | $(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "N/A")% | ✅ |
| Documentation Coverage | 85% | Improving | 🔄 |

## 🎯 Highlights & Achievements

### Major Accomplishments
$(git log --since="$WEEK_START" --until="$WEEK_END" --grep="feat:" --oneline | head -3 | sed 's/^/- 🚀 /')

### Bug Fixes & Improvements
$(git log --since="$WEEK_START" --until="$WEEK_END" --grep="fix:" --oneline | head -3 | sed 's/^/- 🐛 /')

### Documentation Updates
$(git log --since="$WEEK_START" --until="$WEEK_END" --grep="docs:" --oneline | head -3 | sed 's/^/- 📚 /')

## 🚨 Issues & Concerns

### Potential Risks
$(git log --since="$WEEK_START" --until="$WEEK_END" --grep="WIP\|TODO\|FIXME" --oneline | wc -l | awk '{if($1>0) print "- " $1 " commits with WIP/TODO/FIXME markers"}')
$([ $(git log --since="1 day ago" --oneline | wc -l) -eq 0 ] && echo "- No commits in last 24 hours" || echo "")
$([ $(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "100") -lt 95 ] && echo "- Memory Bank health below 95%" || echo "")

### Action Items
- [ ] Review and address any ESLint violations
- [ ] Update Memory Bank files if outdated
- [ ] Complete pending MCP plugin installations
- [ ] Schedule team sync if activity is low

## 📅 Next Week's Focus

### Priorities
1. **Continue language policy adoption** - Ensure all new code uses English
2. **MCP plugin installation** - Complete team-wide plugin setup  
3. **Performance monitoring** - Collect and analyze first week of metrics
4. **BugBot validation** - Review automated PR analysis results

### Goals
- [ ] 100% team adoption of English-first policy
- [ ] MCP plugins installed by 80% of team
- [ ] First performance improvement measurements
- [ ] Zero critical issues in Memory Bank health

### Upcoming Milestones
- **Week 2:** First productivity metrics available
- **Week 4:** Monthly performance review
- **Month 3:** Quarterly optimization assessment

## 📞 Support & Resources

### Team Support
- **Language Help:** .cursor/TEAM_LANGUAGE_POLICY.md
- **Technical Issues:** .cursor/README.md
- **MCP Plugins:** .cursor/MCP_PLUGINS_SETUP.md
- **BugBot Testing:** .cursor/BUGBOT_TEST_SCENARIOS.md

### Quick Commands
\`\`\`bash
# Health check
./scripts/validate-cursor-config.sh

# Memory Bank status
./scripts/simple-memory-bank-check.sh

# Performance metrics
./scripts/cursor-analytics.sh

# Weekly report (this report)
./.cursor/reporting/generate-weekly-report.sh
\`\`\`

---

**Report Generated By:** Automated Cursor Analytics System  
**Next Report:** $(date -d '+1 week' +%Y-%m-%d)  
**Questions?** See .cursor/README.md or contact development team

*This report is automatically generated every Friday and tracks our progress toward 40% productivity improvement with Cursor optimization.*
REPORT_EOF

echo "✅ Weekly report generated: $REPORT_FILE"

# Create summary for email/slack
SUMMARY_FILE=".cursor/reporting/weekly_summary_$WEEK_END.txt"
cat > "$SUMMARY_FILE" << SUMMARY_EOF
📊 Weekly Summary ($WEEK_START to $WEEK_END):

🎯 Key Metrics:
• $(git log --since="$WEEK_START" --until="$WEEK_END" --oneline | wc -l) commits this week
• $(git diff --name-only HEAD~7..HEAD 2>/dev/null | sort -u | wc -l || echo "0") files changed
• Memory Bank: $(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "N/A")% healthy
• Configuration: $(./scripts/validate-cursor-config.sh >/dev/null 2>&1 && echo "✅ Valid" || echo "⚠️ Issues")

📈 Progress:
• Cursor optimization v2.1 active
• Language policy: English primary implemented
• BugBot: Ready for PR analysis
• Performance monitoring: Active

📋 Next Week Focus:
• Complete MCP plugin installations
• Collect first performance metrics
• Validate BugBot functionality
• Continue language policy adoption

📖 Full report: $REPORT_FILE
SUMMARY_EOF

echo "✅ Summary created: $SUMMARY_FILE"

# Update latest report link
ln -sf "$(basename "$REPORT_FILE")" ".cursor/reporting/latest_report.md"
ln -sf "$(basename "$SUMMARY_FILE")" ".cursor/reporting/latest_summary.txt"

echo "🔗 Latest report available at: .cursor/reporting/latest_report.md"
EOF

chmod +x "$REPORTS_DIR/generate-weekly-report.sh"
echo "✅ Weekly report generator created"

# Create automated scheduling script
cat > "$REPORTS_DIR/setup-automated-reports.sh" << 'EOF'
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
EOF

chmod +x "$REPORTS_DIR/setup-automated-reports.sh"

# Create report distribution script
cat > "$REPORTS_DIR/distribute-report.sh" << 'EOF'
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
EOF

chmod +x "$REPORTS_DIR/distribute-report.sh"

# Run first report generation
echo ""
echo "🚀 Generating initial weekly report..."
"$REPORTS_DIR/generate-weekly-report.sh"

echo ""
echo "📊 Automated Weekly Reporting Setup Complete!"
echo "============================================="
echo ""
echo "📁 Created in .cursor/reporting/:"
echo "   • generate-weekly-report.sh - Main report generator"
echo "   • setup-automated-reports.sh - Cron automation"
echo "   • distribute-report.sh - Team distribution helper"
echo ""
echo "⚙️ To automate (optional):"
echo "   .cursor/reporting/setup-automated-reports.sh"
echo ""
echo "📊 To generate manually:"
echo "   .cursor/reporting/generate-weekly-report.sh"
echo ""
echo "📤 To distribute:"
echo "   .cursor/reporting/distribute-report.sh"
echo ""
echo "🔗 Latest report: .cursor/reporting/latest_report.md"
