# BugBot Test Scenarios

## 🧪 Test Suite for Automated Bug Detection

### Overview
This document contains test scenarios to validate BugBot functionality for the Bhagavad Gita Reprint project.

### Test Categories
1. **Security Issues**
2. **Code Quality**
3. **Performance Problems**
4. **Language Policy Violations**
5. **Documentation Issues**

---

## 🔒 Security Test Scenarios

### Test 1: Hardcoded Secrets Detection
**Objective:** Verify BugBot detects hardcoded secrets

**Test Code:**
```javascript
// This should trigger BugBot warning
const apiKey = "sk_test_123456789abcdef";
const password = "admin123";
const secret = "my-secret-token";

// Good practice (should pass)
const apiKey = process.env.API_KEY;
```

**Expected Result:** ⚠️ BugBot should flag hardcoded secrets

**Test Steps:**
1. Create PR with hardcoded secrets
2. Wait for BugBot analysis
3. Verify warning appears in PR comments

---

### Test 2: Environment Variable Usage
**Objective:** Ensure proper environment variable usage

**Test Code:**
```javascript
// Bad practice
const config = {
    dbPassword: "password123",
    jwtSecret: "supersecret"
};

// Good practice
const config = {
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET
};
```

**Expected Result:** ⚠️ BugBot should suggest environment variables

---

## 🎯 Code Quality Test Scenarios

### Test 3: Console Statement Detection
**Objective:** Flag console statements in production code

**Test Code:**
```javascript
function processUser(user) {
    console.log("Processing user:", user.id); // Should be flagged
    console.error("Error occurred"); // Should be flagged
    
    // Proper logging
    logger.info("Processing user:", user.id); // Should pass
    return user;
}
```

**Expected Result:** ⚠️ BugBot should suggest removing console statements

---

### Test 4: TODO/FIXME Comments
**Objective:** Track technical debt markers

**Test Code:**
```javascript
// TODO: Implement caching mechanism
function fetchData() {
    // FIXME: This is inefficient
    return database.query("SELECT * FROM users");
    
    // HACK: Temporary workaround
    return mockData;
}
```

**Expected Result:** 📝 BugBot should note TODO/FIXME comments

---

### Test 5: ESLint Rule Violations
**Objective:** Catch common ESLint violations

**Test Code:**
```javascript
// Multiple violations
var unused_variable = 123;
function duplicateFunction() {}
function duplicateFunction() {} // Duplicate declaration

// Missing semicolon
const user = { name: "test" }
```

**Expected Result:** ❌ BugBot should list ESLint violations

---

## ⚡ Performance Test Scenarios

### Test 6: Inefficient Database Queries
**Objective:** Identify performance bottlenecks

**Test Code:**
```javascript
// Inefficient - N+1 query problem
async function getUsersWithPosts() {
    const users = await User.findAll();
    
    for (let user of users) {
        user.posts = await Post.findByUserId(user.id); // N+1 problem
    }
    
    return users;
}

// Efficient version
async function getUsersWithPostsOptimized() {
    return await User.findAll({
        include: [Post] // Single query with join
    });
}
```

**Expected Result:** 🐌 BugBot should suggest query optimization

---

### Test 7: Memory Leaks
**Objective:** Detect potential memory leaks

**Test Code:**
```javascript
// Potential memory leak
let globalCache = {};

function addToCache(key, value) {
    globalCache[key] = value; // Never cleaned up
}

// Better approach
const LRU = require('lru-cache');
const cache = new LRU({ max: 1000, ttl: 1000 * 60 * 5 });
```

**Expected Result:** 🧠 BugBot should warn about unbounded cache

---

## 🌐 Language Policy Test Scenarios

### Test 8: Non-English Comments
**Objective:** Enforce English-only code policy

**Test Code:**
```javascript
// Вычисляем сумму заказа - Should be flagged
function calculateTotal(items) {
    let sum = 0;
    
    // Проходим по всем элементам - Should be flagged  
    for (let item of items) {
        sum += item.price;
    }
    
    return sum;
}

// Calculate order total - Should pass
function calculateTotalCorrect(items) {
    let sum = 0;
    
    // Iterate through all items - Should pass
    for (let item of items) {
        sum += item.price;
    }
    
    return sum;
}
```

**Expected Result:** 🌐 BugBot should flag non-English comments

---

### Test 9: Mixed Language Variables
**Objective:** Ensure English variable naming

**Test Code:**
```javascript
// Mixed languages - Should be flagged
function processZakaz(заказ) {
    const общаяСумма = заказ.calculateSum();
    const статус = "обработан";
    
    return {
        сумма: общаяСумма,
        статус: статус
    };
}

// English only - Should pass
function processOrder(order) {
    const totalSum = order.calculateSum();
    const status = "processed";
    
    return {
        sum: totalSum,
        status: status
    };
}
```

**Expected Result:** 🔤 BugBot should suggest English variable names

---

## 📚 Documentation Test Scenarios

### Test 10: Missing Documentation
**Objective:** Flag undocumented functions

**Test Code:**
```javascript
// Missing documentation - Should be flagged
function complexCalculation(a, b, c, options) {
    if (!options) options = {};
    
    const result = (a * b) + (c / (options.divisor || 1));
    return Math.round(result * 100) / 100;
}

/**
 * Calculates weighted average with rounding
 * @param {number} a - First value
 * @param {number} b - Weight for first value  
 * @param {number} c - Second value
 * @param {object} options - Configuration options
 * @param {number} options.divisor - Divisor for second value
 * @returns {number} Calculated result rounded to 2 decimals
 */
function complexCalculationDocumented(a, b, c, options) {
    if (!options) options = {};
    
    const result = (a * b) + (c / (options.divisor || 1));
    return Math.round(result * 100) / 100;
}
```

**Expected Result:** 📝 BugBot should suggest adding documentation

---

## 🚀 Test Execution Plan

### Phase 1: Basic Functionality (Week 1)
1. **Setup Test Environment**
   ```bash
   git checkout -b test/bugbot-validation
   ```

2. **Create Test PRs**
   - One PR per test scenario
   - Small, focused changes
   - Clear test objectives in PR description

3. **Validate Detection**
   - Check BugBot comments appear
   - Verify accuracy of detections
   - Document any false positives/negatives

### Phase 2: Advanced Scenarios (Week 2)  
1. **Complex Code Patterns**
   - Mix multiple issues in single PR
   - Test edge cases
   - Validate prioritization

2. **Integration Testing**
   - Test with existing CI/CD pipeline
   - Verify no workflow conflicts
   - Check performance impact

### Phase 3: Fine-tuning (Week 3)
1. **Configuration Optimization**
   - Adjust detection sensitivity
   - Customize rules for project needs
   - Update workflow if needed

2. **Team Training**
   - Share test results with team
   - Document best practices
   - Create workflow guidelines

## 📊 Success Metrics

### Detection Accuracy:
- **True Positives:** Issues correctly identified
- **False Positives:** Non-issues flagged as problems
- **False Negatives:** Real issues missed
- **Target Accuracy:** 90%+ true positive rate

### Coverage:
- **Security Issues:** 95% detection rate
- **Code Quality:** 85% detection rate
- **Performance:** 70% detection rate  
- **Documentation:** 80% detection rate

### Team Adoption:
- **PR Comments Acted On:** Target 90%
- **Team Satisfaction:** Survey after 1 month
- **Workflow Integration:** Seamless operation

## 🔧 Test Automation

### Automated Test Creation:
```bash
#!/bin/bash
# Create test PR with known issues

git checkout -b test/security-$(date +%s)

# Add test file with security issue
cat > test-security.js << EOF
const apiKey = "hardcoded-secret-123";
console.log("Debug info:", apiKey);
EOF

git add test-security.js
git commit -m "test: add security test case"
git push origin HEAD

# Create PR via GitHub CLI
gh pr create --title "Test: Security Issue Detection" \
             --body "Testing BugBot security detection capabilities"
```

### Validation Scripts:
```bash
#!/bin/bash
# Validate BugBot responses

PR_NUMBER=$1
EXPECTED_ISSUES=$2

# Wait for BugBot analysis
sleep 30

# Check if BugBot commented
COMMENTS=$(gh pr view $PR_NUMBER --json comments --jq '.comments | length')

if [ $COMMENTS -gt 0 ]; then
    echo "✅ BugBot responded to PR #$PR_NUMBER"
    
    # Check if expected issues were found
    gh pr view $PR_NUMBER --json comments --jq '.comments[].body' | \
        grep -i "$EXPECTED_ISSUES" && echo "✅ Expected issue detected"
else
    echo "❌ BugBot did not respond to PR #$PR_NUMBER"
fi
```

## 📝 Reporting

### Test Results Format:
```markdown
# BugBot Test Results - [Date]

## Summary
- **Tests Executed:** X/Y
- **Detection Rate:** XX%
- **False Positives:** X
- **Performance Impact:** <1s per PR

## Detailed Results
| Test | Expected | Actual | Status |
|------|----------|---------|---------|
| Security #1 | ⚠️ Secret detected | ⚠️ Secret detected | ✅ Pass |
| Quality #1 | ⚠️ Console found | ❌ Not detected | ❌ Fail |

## Recommendations
- Adjust security detection sensitivity
- Add custom rules for console statements
- Update team guidelines
```

### Weekly Reports:
- Test execution summary
- Detection accuracy trends  
- Team feedback compilation
- Configuration recommendations

---

**Next Steps:**
1. Execute Phase 1 tests this week
2. Document all findings
3. Share results with development team
4. Refine BugBot configuration based on results
