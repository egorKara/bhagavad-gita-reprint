#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function analyzeAssets() {
    console.log('🔍 Performance Audit Report');
    console.log('=' .repeat(50));
    
    const publicDir = path.join(__dirname, '..', 'public');
    const assetsDir = path.join(publicDir, 'assets');
    
    // Analyze images
    console.log('\n📷 Image Analysis:');
    const imagesDir = path.join(assetsDir, 'images');
    const imageFiles = fs.readdirSync(imagesDir);
    
    let totalImageSize = 0;
    imageFiles.forEach(file => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalImageSize += stats.size;
        
        const status = sizeKB > 50 ? '⚠️ ' : sizeKB > 20 ? '⚡' : '✅';
        console.log(`  ${status} ${file}: ${sizeKB}KB`);
    });
    
    console.log(`  📊 Total image size: ${Math.round(totalImageSize / 1024)}KB`);
    
    // Analyze CSS
    console.log('\n🎨 CSS Analysis:');
    const cssDir = path.join(assetsDir, 'css');
    const cssFiles = fs.readdirSync(cssDir);
    
    let totalCssSize = 0;
    cssFiles.forEach(file => {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalCssSize += stats.size;
        
        const status = sizeKB > 10 ? '⚠️ ' : '✅';
        console.log(`  ${status} ${file}: ${sizeKB}KB`);
    });
    
    console.log(`  📊 Total CSS size: ${Math.round(totalCssSize / 1024)}KB`);
    
    // Analyze HTML
    console.log('\n📄 HTML Analysis:');
    const htmlFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.html'));
    
    let totalHtmlSize = 0;
    htmlFiles.forEach(file => {
        const filePath = path.join(publicDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalHtmlSize += stats.size;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const hasViewport = content.includes('viewport');
        const hasPreload = content.includes('preload');
        const hasLazyLoading = content.includes('loading="lazy"');
        
        console.log(`  📄 ${file}: ${sizeKB}KB`);
        console.log(`    ${hasViewport ? '✅' : '❌'} Viewport meta tag`);
        console.log(`    ${hasPreload ? '✅' : '❌'} Resource preloading`);
        console.log(`    ${hasLazyLoading ? '✅' : '❌'} Lazy loading`);
    });
    
    console.log(`  📊 Total HTML size: ${Math.round(totalHtmlSize / 1024)}KB`);
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    
    const totalSize = totalImageSize + totalCssSize + totalHtmlSize;
    console.log(`  📊 Total bundle size: ${Math.round(totalSize / 1024)}KB`);
    
    if (totalSize > 500 * 1024) {
        console.log('  ⚠️  Bundle size is large (>500KB). Consider further optimization.');
    } else if (totalSize > 250 * 1024) {
        console.log('  ⚡ Bundle size is moderate (>250KB). Good job on optimization!');
    } else {
        console.log('  ✅ Bundle size is excellent (<250KB). Great optimization!');
    }
    
    // Check for WebP support
    const hasWebP = imageFiles.some(file => file.endsWith('.webp'));
    console.log(`  ${hasWebP ? '✅' : '❌'} Modern image formats (WebP)`);
    
    // Check for minified CSS
    const hasMinifiedCss = cssFiles.some(file => file.includes('combined'));
    console.log(`  ${hasMinifiedCss ? '✅' : '❌'} CSS optimization`);
    
    console.log('\n🚀 Performance Score:');
    let score = 0;
    if (totalSize < 250 * 1024) score += 25;
    else if (totalSize < 500 * 1024) score += 15;
    
    if (hasWebP) score += 25;
    if (hasMinifiedCss) score += 25;
    
    const hasOptimizedHtml = htmlFiles.every(file => {
        const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
        return content.includes('viewport') && content.includes('preload');
    });
    if (hasOptimizedHtml) score += 25;
    
    console.log(`  🎯 Overall Score: ${score}/100`);
    
    if (score >= 90) {
        console.log('  🏆 Excellent! Your site is highly optimized.');
    } else if (score >= 70) {
        console.log('  👍 Good! Your site is well optimized.');
    } else if (score >= 50) {
        console.log('  ⚡ Fair. There are opportunities for improvement.');
    } else {
        console.log('  ⚠️  Needs work. Consider implementing more optimizations.');
    }
}

analyzeAssets();