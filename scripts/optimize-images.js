#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '..', 'public', 'assets', 'images');
const outputDir = inputDir;

async function optimizeImages() {
    console.log('Starting image optimization...');
    
    // Optimize cover.jpg
    const coverPath = path.join(inputDir, 'cover.jpg');
    if (fs.existsSync(coverPath)) {
        // Create WebP version
        await sharp(coverPath)
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, 'cover.webp'));
        
        // Create optimized JPEG version
        await sharp(coverPath)
            .jpeg({ quality: 85, progressive: true })
            .toFile(path.join(outputDir, 'cover-optimized.jpg'));
        
        // Create responsive versions
        await sharp(coverPath)
            .resize(600, 800)
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, 'cover-600w.webp'));
            
        await sharp(coverPath)
            .resize(600, 800)
            .jpeg({ quality: 85, progressive: true })
            .toFile(path.join(outputDir, 'cover-600w.jpg'));
            
        await sharp(coverPath)
            .resize(300, 400)
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, 'cover-300w.webp'));
            
        await sharp(coverPath)
            .resize(300, 400)
            .jpeg({ quality: 85, progressive: true })
            .toFile(path.join(outputDir, 'cover-300w.jpg'));
        
        console.log('✓ Cover image optimized');
    }
    
    // Optimize logo.png
    const logoPath = path.join(inputDir, 'logo.png');
    if (fs.existsSync(logoPath)) {
        // Create WebP version
        await sharp(logoPath)
            .webp({ quality: 90 })
            .toFile(path.join(outputDir, 'logo.webp'));
        
        // Create optimized PNG version
        await sharp(logoPath)
            .png({ compressionLevel: 9, progressive: true })
            .toFile(path.join(outputDir, 'logo-optimized.png'));
        
        console.log('✓ Logo optimized');
    }
    
    console.log('Image optimization completed!');
}

optimizeImages().catch(console.error);