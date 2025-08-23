#!/usr/bin/env bash
# Simple Memory Bank Health Check

echo "🧠 Memory Bank Quick Check..."
echo "============================="

# Check directory exists
if [[ -d ".cursor/memory-bank" ]]; then
    echo "✅ Memory Bank directory exists"
else
    echo "❌ Memory Bank directory missing"
    exit 1
fi

# Count files
total_files=$(find .cursor/memory-bank -type f | wc -l)
echo "📂 Memory Bank files: $total_files"

# Check each required file
required_files=(
    "project-context.md"
    "technical-stack.md" 
    "coding-standards.md"
    "deployment-process.md"
    "current-priorities.md"
    "rules.json"
)

present_files=0
for file in "${required_files[@]}"; do
    if [[ -f ".cursor/memory-bank/$file" ]]; then
        echo "✅ $file"
        ((present_files++))
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "📊 Health: $present_files/${#required_files[@]} files present"

# Create simple status
mkdir -p .cursor/analytics
cat > .cursor/analytics/memory-bank-simple.json << EOF
{
    "check_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "total_files": $total_files,
    "required_files": ${#required_files[@]},
    "present_files": $present_files,
    "health_percentage": $(( present_files * 100 / ${#required_files[@]} ))
}
EOF

echo "✅ Status saved to .cursor/analytics/memory-bank-simple.json"

if [[ $present_files -eq ${#required_files[@]} ]]; then
    echo "🎉 Memory Bank is healthy!"
    exit 0
else
    echo "⚠️  Memory Bank needs attention"
    exit 1
fi
