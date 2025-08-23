# MCP Plugins Auto-Installation Guide

## 🔧 Automated Installation System

This guide provides automated scripts and commands for installing MCP plugins efficiently.

### 📋 **Prerequisites Checklist**
- [ ] Cursor IDE version 0.40+ installed
- [ ] Project opened in Cursor
- [ ] Internet connection active
- [ ] GitHub account linked (for GitHub integration)

---

## 🚀 **Quick Installation Script**

### **Option 1: Interactive Installer**
```bash
# Run the interactive installer
curl -fsSL https://raw.githubusercontent.com/cursor-plugins/installer/main/install.sh | bash
```

### **Option 2: Command-Line Installation**
```bash
# Install via Cursor CLI (if available)
cursor --install-plugin github-integration-enhanced
cursor --install-plugin performance-auditor
cursor --install-plugin i18n-translation-manager
cursor --install-plugin seo-assistant-pro
cursor --install-plugin css-variables-manager
```

### **Option 3: Manual via IDE**
```bash
# Open Cursor IDE
# Press Ctrl/Cmd + Shift + P
# Type: "MCP: Install Plugin"
# Search and install each plugin from the list below
```

---

## 📦 **Phase 1: Essential Plugins (Week 1)**

### **1. GitHub Integration Enhanced**
```json
{
  "name": "github-integration-enhanced",
  "priority": "critical",
  "installation": {
    "method": "cursor_marketplace",
    "search_term": "GitHub Integration Enhanced",
    "publisher": "github-official"
  },
  "configuration": {
    "repository": "bhagavad-gita-reprint",
    "default_branch": "main",
    "auto_pr_analysis": true,
    "language_primary": "en"
  },
  "verification": {
    "command": "cursor --list-plugins | grep github-integration",
    "expected": "✅ github-integration-enhanced: active"
  }
}
```

**Installation Commands:**
```bash
# Via Cursor CLI
cursor --install github-integration-enhanced

# Verify installation
cursor --plugin-status github-integration-enhanced

# Configure for project
cursor --configure-plugin github-integration-enhanced \
  --repo "bhagavad-gita-reprint" \
  --language "en"
```

### **2. Performance Auditor**
```json
{
  "name": "performance-auditor",
  "priority": "critical",
  "installation": {
    "method": "cursor_marketplace",
    "search_term": "Performance Auditor",
    "publisher": "cursor-team"
  },
  "configuration": {
    "targets": {
      "lcp": "< 2.5s",
      "fid": "< 100ms",
      "cls": "< 0.1"
    },
    "check_frequency": "weekly",
    "integration": "github_actions"
  },
  "verification": {
    "command": "cursor --audit-performance --dry-run",
    "expected": "✅ Performance auditing ready"
  }
}
```

**Installation Commands:**
```bash
# Install performance auditor
cursor --install performance-auditor

# Configure Core Web Vitals targets
cursor --configure-plugin performance-auditor \
  --lcp "2.5s" \
  --fid "100ms" \
  --cls "0.1"

# Test configuration
cursor --audit-performance --dry-run
```

---

## 📦 **Phase 2: Content Plugins (Week 2)**

### **3. i18n Translation Manager**
```bash
# Installation
cursor --install i18n-translation-manager

# Configuration
cursor --configure-plugin i18n-translation-manager \
  --primary-language "en" \
  --secondary-languages "ru" \
  --translation-files "public/assets/js/translations.js"

# Verification
cursor --validate-translations --dry-run
```

### **4. SEO Assistant Pro**
```bash
# Installation (may require OAuth)
cursor --install seo-assistant-pro --auth

# Configuration
cursor --configure-plugin seo-assistant-pro \
  --keywords "Bhagavad Gita 1972,original edition,Prabhupada" \
  --structured-data "json-ld"

# Test SEO analysis
cursor --analyze-seo index.html --dry-run
```

---

## 📦 **Phase 3: Design Plugins (Week 3)**

### **5. CSS Variables Manager**
```bash
# Installation
cursor --install css-variables-manager

# Configuration
cursor --configure-plugin css-variables-manager \
  --theme-system "dual_mode" \
  --color-schemes "light,dark" \
  --accessibility "wcag_aa"

# Verify CSS variables
cursor --validate-css-variables --dry-run
```

---

## 🤖 **Automated Installation Script**

Create this script for team members:

```bash
#!/usr/bin/env bash
# MCP Plugin Auto-Installer for Bhagavad Gita Project

set -euo pipefail

PLUGINS=(
    "github-integration-enhanced"
    "performance-auditor"
    "i18n-translation-manager"
    "seo-assistant-pro"
    "css-variables-manager"
)

echo "🔧 Installing MCP Plugins for Cursor..."
echo "====================================="

# Check Cursor availability
if ! command -v cursor >/dev/null 2>&1; then
    echo "❌ Cursor CLI not found. Please install Cursor IDE first."
    exit 1
fi

echo "✅ Cursor CLI detected"

# Install each plugin
for plugin in "${PLUGINS[@]}"; do
    echo ""
    echo "📦 Installing $plugin..."
    
    if cursor --install "$plugin" --yes; then
        echo "✅ $plugin installed successfully"
    else
        echo "⚠️  Failed to install $plugin - may need manual installation"
    fi
done

# Project-specific configurations
echo ""
echo "⚙️ Configuring plugins for project..."

# GitHub Integration
cursor --configure-plugin github-integration-enhanced \
    --repo "bhagavad-gita-reprint" \
    --language "en" \
    --auto-pr-analysis true

# Performance Auditor
cursor --configure-plugin performance-auditor \
    --lcp "2.5s" \
    --fid "100ms" \
    --cls "0.1"

# i18n Manager
cursor --configure-plugin i18n-translation-manager \
    --primary-language "en" \
    --secondary-languages "ru"

echo ""
echo "🎉 Plugin installation complete!"
echo "==============================="
echo ""
echo "📋 Verification commands:"
echo "   cursor --list-plugins"
echo "   cursor --plugin-status --all"
echo ""
echo "📚 Next steps:"
echo "   1. Restart Cursor IDE"
echo "   2. Verify plugin functionality"
echo "   3. Run project analysis: cursor --analyze-project"
```

Save as `scripts/install-mcp-plugins.sh`:
```bash
chmod +x scripts/install-mcp-plugins.sh
./scripts/install-mcp-plugins.sh
```

---

## 🔍 **Verification & Testing**

### **Installation Verification**
```bash
# Check all installed plugins
cursor --list-plugins

# Check specific plugin status
cursor --plugin-status github-integration-enhanced

# Test plugin functionality
cursor --test-plugins --project-root .
```

### **Project Analysis**
```bash
# Run comprehensive project analysis
cursor --analyze-project \
    --github-integration \
    --performance-audit \
    --translation-check \
    --seo-analysis \
    --css-validation

# Generate plugin performance report
cursor --plugin-report --output .cursor/analytics/plugin-report.json
```

---

## 📊 **Success Metrics**

Track plugin installation and usage:

```bash
# Create plugin metrics script
cat > scripts/track-plugin-usage.sh << 'EOF'
#!/usr/bin/env bash

echo "📊 Plugin Usage Metrics"
echo "======================"

# Count installed plugins
INSTALLED_PLUGINS=$(cursor --list-plugins --count)
echo "Installed plugins: $INSTALLED_PLUGINS/5"

# Check activity in last 7 days
echo ""
echo "Plugin Activity (Last 7 days):"
cursor --plugin-activity --since "7 days ago" --format table

# Performance impact
echo ""
echo "Performance Impact:"
cursor --plugin-performance --format json > .cursor/analytics/plugin-performance.json
cat .cursor/analytics/plugin-performance.json | jq .summary
EOF

chmod +x scripts/track-plugin-usage.sh
```

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### Plugin Installation Failed
```bash
# Clear plugin cache
cursor --clear-plugin-cache

# Retry installation with verbose logging
cursor --install plugin-name --verbose --force

# Manual installation fallback
cursor --install-from-file plugin-package.vsix
```

#### Configuration Not Applied
```bash
# Reset plugin configuration
cursor --reset-plugin-config plugin-name

# Apply configuration manually
cursor --configure-plugin plugin-name --config-file plugin-config.json
```

#### Performance Issues
```bash
# Check plugin resource usage
cursor --plugin-diagnostics

# Disable resource-heavy plugins temporarily
cursor --disable-plugin plugin-name --temporary

# Optimize plugin settings
cursor --optimize-plugins --project-root .
```

### **Support Resources:**
- **Plugin Documentation:** Available in Cursor → Help → Plugin Docs
- **Community Forums:** Cursor Discord/GitHub Discussions
- **Project Support:** `.cursor/README.md`
- **Team Help:** #cursor-plugins channel

---

## 📅 **Installation Timeline**

### **Day 1:**
- [ ] Install essential plugins (GitHub, Performance)
- [ ] Configure basic settings
- [ ] Verify functionality

### **Week 1:**
- [ ] Install content plugins (i18n, SEO)
- [ ] Run initial project analysis
- [ ] Collect baseline metrics

### **Week 2:**
- [ ] Install design plugins (CSS Variables)
- [ ] Complete all configurations
- [ ] Generate performance report

### **Month 1:**
- [ ] Full plugin ecosystem active
- [ ] Performance benefits measured
- [ ] Team proficiency achieved

---

**🎯 Goal:** 100% plugin installation success rate with measurable productivity improvements within 2 weeks.
