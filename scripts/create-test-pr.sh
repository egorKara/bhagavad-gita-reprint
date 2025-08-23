#!/usr/bin/env bash
# Script to create test PR for BugBot validation

set -euo pipefail

BRANCH_NAME="test/bugbot-validation-$(date +%s)"
PR_TITLE="Test: BugBot Security and Quality Analysis"

echo "🧪 Creating BugBot Test PR..."
echo "=============================="

# Check if we're on a test branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ ! "$CURRENT_BRANCH" =~ ^test/bugbot-validation ]]; then
    echo "❌ Not on a BugBot test branch. Current branch: $CURRENT_BRANCH"
    exit 1
fi

echo "✅ On test branch: $CURRENT_BRANCH"

# Create PR description
PR_BODY="## BugBot Validation Test

This PR contains intentional code issues to validate BugBot detection capabilities.

### Expected Detections:

#### 🔒 Security Issues (2)
- [ ] Hardcoded API key detection
- [ ] Hardcoded password detection

#### 🎯 Code Quality Issues (2)  
- [ ] Console.log statements in production code
- [ ] Console.error statements for debugging

#### 📝 Documentation Issues (2)
- [ ] TODO comment tracking
- [ ] FIXME comment tracking

#### 🌐 Language Policy Issues (1)
- [ ] Non-English comments (Russian)

#### ⚡ Performance Issues (1)
- [ ] Memory leak potential (unbounded cache)

### Total Expected: 8 Issues

### Test File: \`test-bugbot-security.js\`

This file should trigger multiple BugBot warnings to validate the automated analysis system.

### Validation Checklist:
- [ ] BugBot comments appear on this PR
- [ ] All 8 expected issues are detected
- [ ] No false positives reported
- [ ] Suggestions are actionable and helpful

### Next Steps:
1. Wait for BugBot analysis (usually < 2 minutes)
2. Verify detection accuracy
3. Document any false positives/negatives
4. Update BugBot configuration if needed

---
**Note:** This is a test PR and should NOT be merged."

# Check if GitHub CLI is available
if command -v gh >/dev/null 2>&1; then
    echo "📝 Creating PR with GitHub CLI..."
    
    gh pr create \
        --title "$PR_TITLE" \
        --body "$PR_BODY" \
        --label "test,bugbot-validation" \
        --draft
        
    echo "✅ Test PR created successfully!"
    echo "🔗 View PR: $(gh pr view --json url --jq '.url')"
    
else
    echo "⚠️  GitHub CLI not available. Please create PR manually:"
    echo ""
    echo "Title: $PR_TITLE"
    echo ""
    echo "Body:"
    echo "$PR_BODY"
    echo ""
    echo "Labels: test, bugbot-validation"
    echo "Status: Draft PR"
fi

echo ""
echo "🕐 BugBot Analysis Timeline:"
echo "   • Analysis starts: Immediately after PR creation"
echo "   • Expected completion: 2-5 minutes"
echo "   • Results appear: As PR comments"
echo ""
echo "📊 Monitoring Commands:"
echo "   • Check PR status: gh pr status"
echo "   • View PR comments: gh pr view --comments"
echo "   • Get PR URL: gh pr view --json url --jq '.url'"
