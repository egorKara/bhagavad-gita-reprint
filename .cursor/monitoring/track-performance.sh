#!/usr/bin/env bash
# Daily performance tracking

set -euo pipefail

MONITOR_DIR=".cursor/monitoring"
TODAY=$(date -u +%Y-%m-%d)
METRICS_FILE="$MONITOR_DIR/daily_metrics_$TODAY.json"

# Check if already run today
if [[ -f "$METRICS_FILE" ]]; then
    echo "✅ Metrics already collected today: $METRICS_FILE"
    exit 0
fi

echo "📊 Collecting daily performance metrics..."

# Collect git activity
COMMITS_TODAY=$(git log --since="1 day ago" --oneline | wc -l)
FILES_CHANGED=$(git diff --name-only HEAD~1..HEAD 2>/dev/null | wc -l || echo "0")

# Collect project metrics
TOTAL_FILES=$(find . -type f ! -path "./node_modules/*" ! -path "./.git/*" | wc -l)
MEMORY_BANK_HEALTH=$(python3 -c "import json; print(json.load(open('.cursor/analytics/memory-bank-simple.json'))['health_percentage'])" 2>/dev/null || echo "0")

# Check ESLint score
ESLINT_ERRORS=0
if [[ -f "package.json" ]] && grep -q '"lint"' package.json; then
    ESLINT_ERRORS=$(npm run lint 2>&1 | grep -c "error" || echo "0")
fi

# Ensure ESLINT_ERRORS is numeric
ESLINT_ERRORS=${ESLINT_ERRORS:-0}
ESLINT_SCORE=$(( 100 - ESLINT_ERRORS ))

# Create daily metrics
cat > "$METRICS_FILE" << METRICS_EOF
{
    "date": "$TODAY",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "metrics": {
        "git_activity": {
            "commits": $COMMITS_TODAY,
            "files_changed": $FILES_CHANGED
        },
        "code_quality": {
            "eslint_score": $ESLINT_SCORE,
            "eslint_errors": $ESLINT_ERRORS
        },
        "project_health": {
            "total_files": $TOTAL_FILES,
            "memory_bank_health": $MEMORY_BANK_HEALTH
        }
    },
    "automated": true
}
METRICS_EOF

echo "✅ Daily metrics collected: $METRICS_FILE"

# Update weekly summary if it's Friday
if [[ $(date +%u) -eq 5 ]]; then
    echo "📈 Generating weekly summary (Friday)..."
    
    WEEK_START=$(date -d 'monday' +%Y-%m-%d)
    WEEK_METRICS=()
    
    for file in "$MONITOR_DIR"/daily_metrics_*.json; do
        if [[ -f "$file" ]]; then
            FILE_DATE=$(basename "$file" | sed 's/daily_metrics_\(.*\)\.json/\1/')
            if [[ "$FILE_DATE" >= "$WEEK_START" ]]; then
                WEEK_METRICS+=("$file")
            fi
        fi
    done
    
    if [[ ${#WEEK_METRICS[@]} -gt 0 ]]; then
        WEEKLY_FILE="$MONITOR_DIR/weekly_summary_$(date -d 'monday' +%Y-%m-%d).json"
        
        cat > "$WEEKLY_FILE" << WEEKLY_EOF
{
    "week_start": "$WEEK_START",
    "week_end": "$(date +%Y-%m-%d)",
    "days_tracked": ${#WEEK_METRICS[@]},
    "summary": {
        "total_commits": $(cat "${WEEK_METRICS[@]}" | jq -s 'map(.metrics.git_activity.commits) | add' 2>/dev/null || echo "0"),
        "avg_eslint_score": $(cat "${WEEK_METRICS[@]}" | jq -s 'map(.metrics.code_quality.eslint_score) | add / length' 2>/dev/null || echo "0"),
        "memory_bank_stability": "stable"
    },
    "files": [$(printf '"%s",' "${WEEK_METRICS[@]}" | sed 's/,$//')],
    "generated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
WEEKLY_EOF
        echo "✅ Weekly summary created: $WEEKLY_FILE"
    fi
fi
