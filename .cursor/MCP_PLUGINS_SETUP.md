# MCP Plugins Installation Guide

## 🔧 Step-by-Step Installation

### Prerequisites
1. **Cursor IDE** version 0.40+ installed
2. **Project access** to Bhagavad Gita Reprint repository
3. **GitHub access** for enhanced integrations

### Phase 1: Essential Plugins (Week 1)

#### 1. GitHub Integration Enhanced
**Installation:**
```bash
# In Cursor IDE:
1. Open Command Palette (Ctrl/Cmd + Shift + P)
2. Type "MCP: Install Plugin"
3. Search for "GitHub Integration Enhanced"
4. Click "Install"
```

**Configuration:**
```json
{
  "github_integration": {
    "repository": "bhagavad-gita-reprint",
    "default_branch": "main",
    "auto_pr_analysis": true,
    "issue_tracking": true,
    "workflow_integration": true,
    "language_primary": "en",
    "language_secondary": "ru"
  }
}
```

**Expected Benefits:**
- ⚡ 25% faster GitHub workflow management
- 🤖 Automated PR analysis and suggestions
- 📊 Enhanced issue tracking integration

#### 2. Performance Auditor
**Installation:**
```bash
# In Cursor IDE:
1. Settings → Extensions → MCP Plugins
2. Search "Performance Auditor"
3. Install and Enable
```

**Configuration:**
```json
{
  "performance_auditor": {
    "targets": {
      "lcp": "< 2.5s",
      "fid": "< 100ms", 
      "cls": "< 0.1"
    },
    "check_frequency": "weekly",
    "report_format": "markdown",
    "integration": "github_actions"
  }
}
```

**Expected Benefits:**
- 📈 30% improvement in performance optimization time
- 🚨 Automatic performance regression detection
- 📊 Core Web Vitals monitoring

### Phase 2: Content Plugins (Week 2)

#### 3. i18n Translation Manager
**Installation:**
```bash
# In Cursor:
1. Command Palette → "MCP: Browse Catalog"
2. Filter by "Internationalization"
3. Select "i18n Translation Manager"
4. Install
```

**Configuration:**
```json
{
  "i18n_manager": {
    "primary_language": "en",
    "secondary_languages": ["ru"],
    "translation_files": [
      "public/assets/js/translations.js"
    ],
    "validation_rules": {
      "require_all_keys": true,
      "check_formatting": true,
      "validate_html_entities": true
    },
    "auto_translate": false,
    "consistency_check": true
  }
}
```

**Expected Benefits:**
- 🌐 40% reduction in translation errors
- ✅ Automated translation completeness validation
- 🔄 Consistent multilingual content management

#### 4. SEO Assistant Pro
**Installation:**
```bash
# In Cursor:
1. MCP Plugin Catalog
2. Search "SEO Assistant Pro"
3. Install with OAuth authentication
```

**Configuration:**
```json
{
  "seo_assistant": {
    "target_keywords": [
      "Bhagavad Gita 1972",
      "original edition",
      "Prabhupada"
    ],
    "analysis_depth": "comprehensive",
    "structured_data": "json-ld",
    "meta_optimization": true,
    "content_analysis": true
  }
}
```

**Expected Benefits:**
- 🔍 50% automation of SEO tasks
- 📊 Automated meta tag optimization
- 🎯 Structured data validation

### Phase 3: Design Plugins (Week 3)

#### 5. CSS Variables Manager
**Installation:**
```bash
# In Cursor:
1. Extensions → MCP Plugins
2. Search "CSS Variables Manager"
3. Install and configure
```

**Configuration:**
```json
{
  "css_variables": {
    "theme_system": "dual_mode",
    "color_schemes": ["light", "dark"],
    "consistency_check": true,
    "auto_generate_docs": true,
    "validation": {
      "contrast_ratios": true,
      "accessibility": "wcag_aa"
    }
  }
}
```

**Expected Benefits:**
- 🎨 Design consistency enforcement  
- ♿ Automated accessibility validation
- 📚 Auto-generated design system docs

## 🔄 Verification Steps

### After Each Plugin Installation:

1. **Test Basic Functionality:**
   ```bash
   # Check plugin is loaded
   Cursor → View → Command Palette → "MCP: List Installed"
   ```

2. **Verify Configuration:**
   ```bash
   # Check plugin settings
   Settings → Extensions → [Plugin Name] → Configuration
   ```

3. **Run Initial Scan:**
   ```bash
   # Most plugins have "Analyze Project" command
   Command Palette → "[Plugin Name]: Analyze Project"
   ```

### Integration Testing:

1. **GitHub Plugin:** Create test PR and verify auto-analysis
2. **Performance Plugin:** Run audit on main pages
3. **i18n Plugin:** Validate translation completeness
4. **SEO Plugin:** Analyze current SEO status
5. **CSS Plugin:** Check theme consistency

## 📊 Expected Timeline & Results

### Week 1 (Essential Plugins):
- ✅ GitHub integration active
- ✅ Performance monitoring enabled  
- 📈 **20% productivity increase**

### Week 2 (Content Plugins):
- ✅ Translation validation automated
- ✅ SEO optimization running
- 📈 **35% content quality improvement**

### Week 3 (Design Plugins):
- ✅ CSS consistency enforced
- ✅ Design system documented
- 📈 **50% design workflow improvement**

### Month 1 (Full Integration):
- 📊 **Overall 40% development efficiency gain**
- 🐛 **70% reduction in manual QA time**
- 📈 **95% automated quality checks**

## 🚨 Troubleshooting

### Common Issues:

#### Plugin Not Loading:
```bash
Solution:
1. Restart Cursor IDE
2. Check plugin compatibility
3. Verify MCP service is running
4. Check logs: View → Output → MCP
```

#### Configuration Errors:
```bash
Solution:
1. Validate JSON syntax in config
2. Check required permissions
3. Verify file paths are correct
4. Reset to default configuration
```

#### Performance Issues:
```bash
Solution:
1. Disable non-essential plugins temporarily
2. Check plugin resource usage
3. Update to latest plugin versions
4. Contact plugin support
```

### Getting Help:
- 📚 **Documentation:** Each plugin includes detailed docs
- 🌐 **Community:** Cursor Discord/Forums
- 📧 **Support:** Plugin-specific support channels
- 🔧 **Project Team:** Internal knowledge sharing

## ✅ Success Metrics

Track these metrics to measure plugin effectiveness:

- **Development Speed:** Time to complete common tasks
- **Error Reduction:** Automated vs manual error detection  
- **Code Quality:** Linting scores, test coverage
- **Content Quality:** Translation completeness, SEO scores
- **Design Consistency:** Theme compliance, accessibility scores

Update `.cursor/analytics.md` with plugin performance data weekly.
