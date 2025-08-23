#!/usr/bin/env bash
# Validation script for Cursor configuration

set -euo pipefail

echo "🔍 Validating Cursor Configuration..."
echo "=================================="

# Check if .cursor directory exists
if [[ ! -d ".cursor" ]]; then
    echo "❌ .cursor directory not found"
    exit 1
fi

echo "✅ .cursor directory exists"

# Validate JSON files
echo ""
echo "📄 Validating JSON files..."

json_files=(
    ".cursor/settings.json"
    ".cursor/memory-bank/rules.json"
)

for file in "${json_files[@]}"; do
    if [[ -f "$file" ]]; then
        if python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
            echo "✅ $file: Valid JSON"
        else
            echo "❌ $file: Invalid JSON"
            exit 1
        fi
    else
        echo "❌ $file: File not found"
        exit 1
    fi
done

# Validate YAML files
echo ""
echo "📄 Validating YAML files..."

if [[ -f ".cursorrules" ]]; then
    if python3 -c "import yaml; yaml.safe_load(open('.cursorrules'))" 2>/dev/null; then
        echo "✅ .cursorrules: Valid YAML"
    else
        echo "❌ .cursorrules: Invalid YAML"
        exit 1
    fi
else
    echo "❌ .cursorrules: File not found"
    exit 1
fi

# Check Memory Bank structure
echo ""
echo "🧠 Validating Memory Bank structure..."

memory_bank_files=(
    ".cursor/memory-bank/project-context.md"
    ".cursor/memory-bank/technical-stack.md"
    ".cursor/memory-bank/coding-standards.md"
    ".cursor/memory-bank/deployment-process.md"
    ".cursor/memory-bank/current-priorities.md"
    ".cursor/memory-bank/rules.json"
)

for file in "${memory_bank_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file: Exists"
    else
        echo "❌ $file: Missing"
        exit 1
    fi
done

# Check GitHub workflows
echo ""
echo "⚙️ Validating GitHub workflows..."

if [[ -f ".github/workflows/bugbot.yml" ]]; then
    echo "✅ BugBot workflow exists"
    # Basic YAML validation
    if python3 -c "import yaml; yaml.safe_load(open('.github/workflows/bugbot.yml'))" 2>/dev/null; then
        echo "✅ BugBot workflow: Valid YAML"
    else
        echo "❌ BugBot workflow: Invalid YAML"
        exit 1
    fi
else
    echo "❌ BugBot workflow: Missing"
    exit 1
fi

# Count total files
echo ""
echo "📊 Configuration Summary:"
cursor_files=$(find .cursor -type f | wc -l)
memory_bank_files=$(find .cursor/memory-bank -type f | wc -l)
echo "   • Total .cursor files: $cursor_files"
echo "   • Memory Bank files: $memory_bank_files"
echo "   • GitHub workflows: $(find .github/workflows -name "*.yml" | wc -l)"

# Language policy check
echo ""
echo "🌐 Language Policy Verification:"
if grep -q "language: en" .cursorrules; then
    echo "✅ Primary language: English (correct)"
else
    echo "❌ Primary language setting not found or incorrect"
    exit 1
fi

if grep -q "secondary_language: ru" .cursorrules; then
    echo "✅ Secondary language: Russian (correct)"
else
    echo "❌ Secondary language setting not found or incorrect"
    exit 1
fi

echo ""
echo "🎉 All validations passed successfully!"
echo "Cursor configuration is ready for use."
