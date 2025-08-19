#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'assets', 'images');

function log(message) {
    process.stdout.write(`${message}\n`);
}

function fileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (_err) {
        return false;
    }
}

async function generateWebpVariants() {
    let sharp;
    try {
        sharp = require('sharp');
    } catch (_err) {
        log('[build-images] sharp not installed. Skipping image optimization.');
        return;
    }

    if (!fs.existsSync(imagesDir)) {
        log(`[build-images] images directory not found: ${imagesDir}`);
        return;
    }

    const entries = fs.readdirSync(imagesDir);
    const candidates = entries.filter((name) => /\.(jpe?g|png)$/i.test(name));

    if (candidates.length === 0) {
        log('[build-images] no JPG/PNG images found to optimize.');
        return;
    }

    for (const filename of candidates) {
        const inputPath = path.join(imagesDir, filename);
        const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, '.webp');
        if (fileExists(outputPath)) {
            log(`[build-images] skip existing: ${path.basename(outputPath)}`);
            continue;
        }
        try {
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);
            log(`[build-images] generated: ${path.basename(outputPath)}`);
        } catch (err) {
            log(`[build-images] failed for ${filename}: ${err.message}`);
        }
    }
}

generateWebpVariants().catch((err) => {
    log(`[build-images] unexpected error: ${err.message}`);
    process.exitCode = 0; // do not fail the build
});

