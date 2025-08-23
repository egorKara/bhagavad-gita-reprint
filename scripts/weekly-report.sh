#!/usr/bin/env bash
# Weekly Cursor Performance Report Generator

set -euo pipefail

REPORT_DATE=$(date -u +%Y-%m-%d)
REPORT_DIR=".cursor/analytics/weekly"
REPORT_FILE="$REPORT_DIR/report_$REPORT_DATE.md"

mkdir -p "$REPORT_DIR"

echo "📊 Generating Weekly Cursor Report for $REPORT_DATE..."
echo "=================================================="

cat > "$REPORT_FILE" << EOF
# Weekly Cursor Performance Report

**Week Ending:** $REPORT_DATE  
**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Project:** Bhagavad Gita Reprint

## 📈 Development Activity

### Git Statistics
- **Commits This Week:** $(git log --since="1 week ago" --oneline | wc -l)
- **Files Changed:** $(git diff --name-only HEAD~7..HEAD 2>/dev/null | sort -u | wc -l || echo "0")
- **Lines Added:** $(git log --since="1 week ago" --numstat --pretty="" | awk '{add+=$1} END {print add+0}')
- **Lines Removed:** $(git log --since="1 week ago" --numstat --pretty="" | awk '{sub+=$2} END {print sub+0}')
- **Active Contributors:** $(git shortlog --since="1 week ago" -sn | wc -l)

### Recent Commits
EOF

# Add recent commits
echo "\`\`\`" >> "$REPORT_FILE"
git log --since="1 week ago" --oneline --no-merges | head -10 >> "$REPORT_FILE" || echo "No commits this week" >> "$REPORT_FILE"
echo "\`\`\`" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF

## 🧠 Memory Bank Status
EOF

# Check Memory Bank health
if [[ -f ".cursor/analytics/memory-bank-simple.json" ]]; then
    health_percentage=$(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "N/A")
    echo "- **Health Score:** ${health_percentage}%" >> "$REPORT_FILE"
    echo "- **Last Updated:** $(stat -c %y .cursor/memory-bank/current-priorities.md 2>/dev/null | cut -d' ' -f1 || echo 'Unknown')" >> "$REPORT_FILE"
else
    echo "- **Status:** Memory Bank monitoring not available" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

## 🎯 Configuration Status
- **Cursor Rules Version:** 2.1
- **Language Policy:** English primary, Russian secondary
- **Memory Bank Files:** $(find .cursor/memory-bank -type f | wc -l)
- **Analytics Files:** $(find .cursor/analytics -type f | wc -l)

## 🔧 Workflow Integration
EOF

# Check GitHub workflows
if [[ -d ".github/workflows" ]]; then
    workflow_count=$(find .github/workflows -name "*.yml" | wc -l)
    echo "- **Active Workflows:** $workflow_count" >> "$REPORT_FILE"
    
    # Check if BugBot workflow exists
    if [[ -f ".github/workflows/bugbot.yml" ]]; then
        echo "- **BugBot Integration:** ✅ Active" >> "$REPORT_FILE"
    else
        echo "- **BugBot Integration:** ❌ Not configured" >> "$REPORT_FILE"
    fi
else
    echo "- **GitHub Workflows:** Not configured" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

## 📊 Quality Metrics

### Code Quality
EOF

# ESLint check if available
if [[ -f "package.json" ]] && grep -q '"lint"' package.json; then
    echo "- **ESLint Status:** Available" >> "$REPORT_FILE"
    # Try to run lint and capture results
    if npm run lint > /dev/null 2>&1; then
        echo "- **Linting Errors:** 0 (Clean)" >> "$REPORT_FILE"
    else
        error_count=$(npm run lint 2>&1 | grep -c "error" || echo "Unknown")
        echo "- **Linting Errors:** $error_count" >> "$REPORT_FILE"
    fi
else
    echo "- **ESLint Status:** Not configured" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

### Project Structure
- **Total Files:** $(find . -type f ! -path "./node_modules/*" ! -path "./.git/*" | wc -l)
- **JavaScript Files:** $(find src public -name "*.js" 2>/dev/null | wc -l || echo "0")
- **HTML Files:** $(find public -name "*.html" 2>/dev/null | wc -l || echo "0")
- **CSS Files:** $(find public -name "*.css" 2>/dev/null | wc -l || echo "0")
- **Documentation Files:** $(find . -name "*.md" | wc -l)

## 🎯 Performance Targets

| Metric | Target | Current Status |
|--------|--------|----------------|
| Development Speed | +35% | 🔄 Monitoring |
| Bug Detection Rate | 85% automated | 🔄 Setting up |
| ESLint Compliance | 98% | $([ -f package.json ] && echo '🔄 Checking' || echo 'N/A') |
| Documentation Coverage | 85% | 🔄 Auditing |
| Memory Bank Health | 95%+ | ${health_percentage:-'N/A'}% |

## 💡 Recommendations

### This Week's Focus:
EOF

# Generate recommendations based on metrics
if [[ -f ".cursor/analytics/memory-bank-simple.json" ]]; then
    health=$(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "0")
    if [[ $health -lt 95 ]]; then
        echo "- 🧠 **Memory Bank:** Update stale files to improve health score" >> "$REPORT_FILE"
    fi
fi

# Check if recent commits indicate heavy activity
commits_count=$(git log --since="1 week ago" --oneline | wc -l)
if [[ $commits_count -gt 20 ]]; then
    echo "- 📈 **High Activity:** Consider increasing automated testing" >> "$REPORT_FILE"
elif [[ $commits_count -eq 0 ]]; then
    echo "- 📉 **Low Activity:** Review current project priorities" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

### Next Week's Goals:
- [ ] Complete MCP plugin installation (if not done)
- [ ] Run comprehensive performance audit
- [ ] Update Memory Bank with any project changes
- [ ] Review and act on BugBot recommendations
- [ ] Conduct team feedback session

## 📋 Action Items

### High Priority:
- Ensure all team members follow new language policy
- Complete any pending Memory Bank updates
- Address any ESLint violations

### Medium Priority:
- Install recommended MCP plugins
- Set up automated performance monitoring
- Create team training materials

### Low Priority:
- Optimize existing documentation
- Plan next quarter's development goals
- Research additional productivity tools

## 📞 Support & Resources

### Team Support:
- **Language Policy Questions:** See \`.cursor/TEAM_LANGUAGE_POLICY.md\`
- **MCP Plugin Help:** Check \`.cursor/MCP_PLUGINS_SETUP.md\`
- **Technical Issues:** Review \`.cursor/README.md\`

### External Resources:
- [Cursor Documentation](https://docs.cursor.com)
- [Project GitHub Repository](https://github.com/your-repo)
- Team chat: #development-help

---

**Next Report:** $(date -d '+1 week' -u +%Y-%m-%d)  
**Report Generated By:** cursor-analytics automated system
EOF

echo "✅ Weekly report generated: $REPORT_FILE"

# Create summary for terminal
echo ""
echo "📋 Report Summary:"
echo "   • Commits this week: $(git log --since='1 week ago' --oneline | wc -l)"
echo "   • Memory Bank health: ${health_percentage:-'N/A'}%"
echo "   • Total project files: $(find . -type f ! -path './node_modules/*' ! -path './.git/*' | wc -l)"
echo "   • Documentation files: $(find . -name '*.md' | wc -l)"
echo ""
echo "📖 View full report: cat $REPORT_FILE"

# Update latest report symlink
ln -sf "$(basename "$REPORT_FILE")" "$REPORT_DIR/latest.md"
echo "🔗 Latest report available at: $REPORT_DIR/latest.md"
