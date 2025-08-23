#!/usr/bin/env bash
# Memory Bank Monitoring Script

set -euo pipefail

MEMORY_BANK_DIR=".cursor/memory-bank"
LOG_FILE=".cursor/analytics/memory-bank.log"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

# Create analytics directory if it doesn't exist
mkdir -p ".cursor/analytics"

echo "🧠 Memory Bank Health Check..."
echo "=============================="

# Function to check file freshness
check_file_age() {
    local file="$1"
    local max_age_days="$2"
    
    if [[ -f "$file" ]]; then
        local age_seconds=$(( $(date +%s) - $(stat -c %Y "$file") ))
        local age_days=$(( age_seconds / 86400 ))
        
        if [[ $age_days -lt $max_age_days ]]; then
            echo "✅ $file: Fresh (${age_days}d old)"
            return 0
        else
            echo "⚠️  $file: Stale (${age_days}d old, max ${max_age_days}d)"
            return 1
        fi
    else
        echo "❌ $file: Missing"
        return 1
    fi
}

# Function to validate content
validate_content() {
    local file="$1"
    local min_lines="$2"
    
    if [[ -f "$file" ]]; then
        local line_count=$(wc -l < "$file")
        if [[ $line_count -ge $min_lines ]]; then
            echo "✅ $file: Content valid (${line_count} lines)"
            return 0
        else
            echo "⚠️  $file: Content too short (${line_count} lines, min ${min_lines})"
            return 1
        fi
    else
        echo "❌ $file: File missing"
        return 1
    fi
}

# Start logging
echo "[$TIMESTAMP] Memory Bank health check started" >> "$LOG_FILE"

# Check Memory Bank directory
if [[ ! -d "$MEMORY_BANK_DIR" ]]; then
    echo "❌ Memory Bank directory missing: $MEMORY_BANK_DIR"
    echo "[$TIMESTAMP] ERROR: Memory Bank directory missing" >> "$LOG_FILE"
    exit 1
fi

echo "✅ Memory Bank directory exists"

# Check required files and their freshness (30 days max)
echo ""
echo "📂 File Freshness Check:"
files_fresh=0
total_files=0

memory_bank_files=(
    "project-context.md:20"      # 20 lines minimum
    "technical-stack.md:30"      # 30 lines minimum  
    "coding-standards.md:25"     # 25 lines minimum
    "deployment-process.md:30"   # 30 lines minimum
    "current-priorities.md:15"   # 15 lines minimum (most dynamic)
    "rules.json:5"              # 5 lines minimum
)

for file_spec in "${memory_bank_files[@]}"; do
    filename=$(echo "$file_spec" | cut -d':' -f1)
    min_lines=$(echo "$file_spec" | cut -d':' -f2)
    filepath="$MEMORY_BANK_DIR/$filename"
    
    ((total_files++))
    
    # Check age (30 days max for most files, 7 days for priorities)
    max_age=30
    [[ "$filename" == "current-priorities.md" ]] && max_age=7
    
    if check_file_age "$filepath" "$max_age" && validate_content "$filepath" "$min_lines"; then
        ((files_fresh++))
    fi
done

# Check language policy consistency
echo ""
echo "🌐 Language Policy Check:"
policy_consistent=true

# Check if English is primary in rules.json
if grep -q '"primary_language": "en"' "$MEMORY_BANK_DIR/rules.json"; then
    echo "✅ Primary language: English (correct)"
else
    echo "❌ Primary language: Not set to English"
    policy_consistent=false
fi

# Check if Russian is secondary
if grep -q '"secondary_language": "ru"' "$MEMORY_BANK_DIR/rules.json"; then
    echo "✅ Secondary language: Russian (correct)"
else
    echo "❌ Secondary language: Not set to Russian"
    policy_consistent=false
fi

# Generate health score
health_score=$(( (files_fresh * 100) / total_files ))
echo ""
echo "📊 Health Score: $health_score% ($files_fresh/$total_files files healthy)"

# Log results
echo "[$TIMESTAMP] Health score: $health_score%" >> "$LOG_FILE"
echo "[$TIMESTAMP] Files healthy: $files_fresh/$total_files" >> "$LOG_FILE"

# Check for outdated content
echo ""
echo "🔄 Content Freshness Analysis:"

# Check if current-priorities.md is older than 7 days
priorities_file="$MEMORY_BANK_DIR/current-priorities.md"
if [[ -f "$priorities_file" ]]; then
    age_seconds=$(( $(date +%s) - $(stat -c %Y "$priorities_file") ))
    age_days=$(( age_seconds / 86400 ))
    
    if [[ $age_days -gt 7 ]]; then
        echo "⚠️  current-priorities.md is ${age_days} days old - consider updating"
        echo "[$TIMESTAMP] WARNING: Priorities file is ${age_days} days old" >> "$LOG_FILE"
    else
        echo "✅ current-priorities.md is current (${age_days} days old)"
    fi
fi

# Generate recommendations
echo ""
echo "💡 Recommendations:"

if [[ $health_score -lt 80 ]]; then
    echo "🔴 CRITICAL: Memory Bank health below 80% - immediate attention required"
    echo "   • Update stale files"
    echo "   • Verify content completeness"
    echo "   • Check language policy consistency"
elif [[ $health_score -lt 95 ]]; then
    echo "🟡 WARNING: Memory Bank health below 95% - maintenance recommended"
    echo "   • Review outdated files"
    echo "   • Update current priorities"
else
    echo "🟢 EXCELLENT: Memory Bank health is optimal"
    echo "   • All files are current and complete"
    echo "   • Language policy is consistent"
fi

# Create health status file
cat > ".cursor/analytics/memory-bank-status.json" << EOF
{
    "last_check": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "health_score": $health_score,
    "files_healthy": $files_fresh,
    "total_files": $total_files,
    "language_policy_consistent": $policy_consistent,
    "recommendations": [
        $([ $health_score -lt 80 ] && echo '"Update stale files", "Verify content completeness"' || echo '"Continue regular maintenance"')
    ]
}
EOF

echo ""
echo "✅ Health check complete - status saved to .cursor/analytics/memory-bank-status.json"
echo "📝 Full log available at: $LOG_FILE"

# Return appropriate exit code
if [[ $health_score -ge 80 && $policy_consistent == true ]]; then
    exit 0
else
    exit 1
fi
