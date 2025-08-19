#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

async function buildProject() {
    console.log('Starting build process...');
    
    // Create dist directory
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Copy assets directory
    const assetsDir = path.join(publicDir, 'assets');
    const distAssetsDir = path.join(distDir, 'assets');
    if (!fs.existsSync(distAssetsDir)) {
        fs.mkdirSync(distAssetsDir, { recursive: true });
    }
    
    // Copy CSS files
    const cssDir = path.join(assetsDir, 'css');
    const distCssDir = path.join(distAssetsDir, 'css');
    if (!fs.existsSync(distCssDir)) {
        fs.mkdirSync(distCssDir, { recursive: true });
    }
    
    const cssFiles = fs.readdirSync(cssDir);
    cssFiles.forEach(file => {
        fs.copyFileSync(path.join(cssDir, file), path.join(distCssDir, file));
    });
    
    // Copy image files
    const imagesDir = path.join(assetsDir, 'images');
    const distImagesDir = path.join(distAssetsDir, 'images');
    if (!fs.existsSync(distImagesDir)) {
        fs.mkdirSync(distImagesDir, { recursive: true });
    }
    
    const imageFiles = fs.readdirSync(imagesDir);
    imageFiles.forEach(file => {
        fs.copyFileSync(path.join(imagesDir, file), path.join(distImagesDir, file));
    });
    
    // Minify HTML files
    const htmlFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.html'));
    
    for (const htmlFile of htmlFiles) {
        const htmlPath = path.join(publicDir, htmlFile);
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        const minifiedHtml = await minify(htmlContent, {
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        });
        
        fs.writeFileSync(path.join(distDir, htmlFile), minifiedHtml);
        console.log(`✓ Minified ${htmlFile}`);
    }
    
    // Copy other files
    const otherFiles = ['favicon.ico', 'README.md', 'LICENSE', 'DEPLOYMENT_NOTES.md'];
    otherFiles.forEach(file => {
        const filePath = path.join(publicDir, file);
        if (fs.existsSync(filePath)) {
            fs.copyFileSync(filePath, path.join(distDir, file));
        }
    });
    
    console.log('Build process completed! Files are in the dist directory.');
}

buildProject().catch(console.error);