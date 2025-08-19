#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.resolve(__dirname, '..', 'public', 'assets', 'images');

async function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

async function optimizeImage(inputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    const base = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);

    const outputWebp = path.join(dir, `${base}.webp`);
    const outputAvif = path.join(dir, `${base}.avif`);

    const pipeline = sharp(inputPath).rotate();

    // Generate WebP
    await pipeline.clone().webp({ quality: 78 }).toFile(outputWebp);

    // Generate AVIF
    await pipeline.clone().avif({ quality: 55 }).toFile(outputAvif);
}

async function walkAndOptimize(directoryPath) {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
            await walkAndOptimize(fullPath);
        } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
            try {
                console.log(`Optimizing: ${fullPath}`);
                await optimizeImage(fullPath);
            } catch (error) {
                console.error(`Failed to optimize ${fullPath}:`, error.message);
            }
        }
    }
}

(async () => {
    await ensureDirectoryExists(imagesDir);
    await walkAndOptimize(imagesDir);
    console.log('Image optimization complete.');
})();

