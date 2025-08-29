#!/usr/bin/env node

/**
 * 🎨 Figma-Cursor Integration
 * Прямая интеграция Figma API с Cursor IDE для проекта Bhagavad Gita Reprint
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class FigmaCursorIntegration {
    constructor() {
        this.apiToken = this.loadFigmaToken();
        this.baseUrl = 'https://api.figma.com/v1';
        
        console.log('🎨 Figma-Cursor Integration initialized');
        console.log('🔑 Token loaded:', this.apiToken ? 'YES' : 'NO');
    }
    
    loadFigmaToken() {
        try {
            const tokenPath = path.join(process.env.HOME, '.config/secrets/figma-token');
            return fs.readFileSync(tokenPath, 'utf8').trim();
        } catch (error) {
            console.error('❌ Error loading Figma token:', error.message);
            return null;
        }
    }
    
    async makeRequest(endpoint) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.figma.com',
                path: `/v1${endpoint}`,
                method: 'GET',
                headers: {
                    'X-Figma-Token': this.apiToken,
                    'Content-Type': 'application/json'
                }
            };
            
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                });
            });
            
            req.on('error', reject);
            req.end();
        });
    }
    
    async getUserInfo() {
        try {
            console.log('👤 Getting user info...');
            const userInfo = await this.makeRequest('/me');
            console.log('✅ User:', userInfo.handle, `(${userInfo.email})`);
            return userInfo;
        } catch (error) {
            console.error('❌ Error getting user info:', error.message);
            return null;
        }
    }
    
    async getTeamProjects(teamId) {
        try {
            console.log(`📁 Getting projects for team: ${teamId}`);
            const projects = await this.makeRequest(`/teams/${teamId}/projects`);
            return projects;
        } catch (error) {
            console.error('❌ Error getting team projects:', error.message);
            return null;
        }
    }
    
    async getFileInfo(fileKey) {
        try {
            console.log(`📄 Getting file info: ${fileKey}`);
            const fileInfo = await this.makeRequest(`/files/${fileKey}`);
            return fileInfo;
        } catch (error) {
            console.error('❌ Error getting file info:', error.message);
            return null;
        }
    }
    
    async exportFileAsCSS(fileKey, options = {}) {
        try {
            console.log(`🎨 Exporting CSS for file: ${fileKey}`);
            
            // Получаем информацию о файле
            const fileInfo = await this.getFileInfo(fileKey);
            if (!fileInfo || fileInfo.error) {
                throw new Error('File not found or access denied');
            }
            
            // Извлекаем стили из файла
            const css = this.generateCSSFromFigmaFile(fileInfo);
            
            // Сохраняем CSS файл
            const outputPath = options.outputPath || 'figma-exported-styles.css';
            fs.writeFileSync(outputPath, css);
            
            console.log(`✅ CSS exported to: ${outputPath}`);
            return { success: true, path: outputPath, css };
            
        } catch (error) {
            console.error('❌ Error exporting CSS:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    generateCSSFromFigmaFile(fileInfo) {
        let css = '/* 🎨 Exported from Figma */\n';
        css += '/* File: ' + fileInfo.name + ' */\n';
        css += '/* Generated: ' + new Date().toISOString() + ' */\n\n';
        
        // Извлекаем цвета из стилей
        if (fileInfo.styles) {
            css += '/* 🎨 Colors from Figma */\n:root {\n';
            
            Object.values(fileInfo.styles).forEach(style => {
                if (style.styleType === 'FILL') {
                    const colorName = style.name.toLowerCase().replace(/\s+/g, '-');
                    css += `  --figma-${colorName}: /* ${style.name} */;\n`;
                }
            });
            
            css += '}\n\n';
        }
        
        // Базовые стили
        css += '/* 📱 Responsive base styles */\n';
        css += '.figma-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }\n';
        css += '.figma-section { padding: 4rem 0; text-align: center; }\n';
        css += '.figma-grid { display: grid; gap: 2rem; }\n';
        css += '.figma-grid-3 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }\n\n';
        
        css += '/* 📱 Mobile adaptivity */\n';
        css += '@media (max-width: 768px) {\n';
        css += '  .figma-container { padding: 0 1rem; }\n';
        css += '  .figma-section { padding: 3rem 0; }\n';
        css += '}\n';
        
        return css;
    }
    
    async createLandingPageProject() {
        try {
            console.log('🚀 Creating Landing Page project integration...');
            
            // Тестируем подключение
            const userInfo = await this.getUserInfo();
            if (!userInfo) {
                throw new Error('Failed to connect to Figma API');
            }
            
            console.log('✅ Figma API connection successful!');
            console.log('🎯 Ready to work with Figma files');
            
            return {
                success: true,
                user: userInfo,
                message: 'Figma integration ready!'
            };
            
        } catch (error) {
            console.error('❌ Error creating project integration:', error.message);
            return { success: false, error: error.message };
        }
    }
}

// Демонстрация работы
async function main() {
    console.log('🎨 Figma-Cursor Integration Demo');
    console.log('=================================');
    
    const figma = new FigmaCursorIntegration();
    
    if (!figma.apiToken) {
        console.log('❌ Figma token not found. Please set up token first.');
        return;
    }
    
    // Тестируем интеграцию
    const result = await figma.createLandingPageProject();
    
    if (result.success) {
        console.log('🎉 Figma integration successful!');
        console.log('🎯 Ready to export designs to Landing Page');
    } else {
        console.log('❌ Integration failed:', result.error);
    }
}

module.exports = FigmaCursorIntegration;

// Запуск если файл вызван напрямую
if (require.main === module) {
    main().catch(console.error);
}
