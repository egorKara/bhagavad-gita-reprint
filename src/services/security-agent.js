const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

class SecurityAgent {
  constructor() {
    this.secretsPatterns = [
      // API ключи
      /api[_-]?key[_-]?[a-zA-Z0-9]*\s*[:=]\s*['"`]?[a-zA-Z0-9]{32,}['"`]?/gi,
      /[a-zA-Z0-9]{32,}/g,
      
      // Пароли
      /password\s*[:=]\s*['"`]?[^'"`\s]+['"`]?/gi,
      /passwd\s*[:=]\s*['"`]?[^'"`\s]+['"`]?/gi,
      /pwd\s*[:=]\s*['"`]?[^'"`\s]+['"`]?/gi,
      
      // Токены
      /token\s*[:=]\s*['"`]?[a-zA-Z0-9]{32,}['"`]?/gi,
      /access[_-]?token\s*[:=]\s*['"`]?[a-zA-Z0-9]{32,}['"`]?/gi,
      /bearer\s*[:=]\s*['"`]?[a-zA-Z0-9]{32,}['"`]?/gi,
      
      // SSH ключи
      /-----BEGIN\s+(RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY-----/gi,
      /ssh-rsa\s+[a-zA-Z0-9+/]+[=]{0,3}\s+[^@\s]+@[^@\s]+/gi,
      
      // Базы данных
      /mongodb:\/\/[^:\s]+:[^@\s]+@[^:\s]+/gi,
      /postgresql:\/\/[^:\s]+:[^@\s]+@[^:\s]+/gi,
      /mysql:\/\/[^:\s]+:[^@\s]+@[^:\s]+/gi,
      
      // AWS
      /AKIA[0-9A-Z]{16}/gi,
      /aws_access_key_id\s*[:=]\s*['"`]?[A-Z0-9]{20}['"`]?/gi,
      /aws_secret_access_key\s*[:=]\s*['"`]?[A-Za-z0-9/+=]{40}['"`]?/gi,
      
      // Google Cloud
      /AIza[0-9A-Za-z\-_]{35}/gi,
      
      // GitHub
      /ghp_[a-zA-Z0-9]{36}/gi,
      /gho_[a-zA-Z0-9]{36}/gi,
      /ghu_[a-zA-Z0-9]{36}/gi,
      /ghs_[a-zA-Z0-9]{36}/gi,
      /ghr_[a-zA-Z0-9]{36}/gi,
      
      // Slack
      /xoxb-[a-zA-Z0-9-]+/gi,
      /xoxp-[a-zA-Z0-9-]+/gi,
      
      // Discord
      /[MN][a-zA-Z0-9]{23}\.[\w-]{6}\.[\w-]{27}/gi,
      
      // Telegram
      /[0-9]+:[AA-Za-z0-9_-]{35}/gi,
      
      // JWT токены
      /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/gi
    ];
    
    this.excludePatterns = [
      /node_modules/,
      /\.git/,
      /\.env\.example/,
      /package-lock\.json/,
      /yarn\.lock/,
      /\.min\.js/,
      /\.min\.css/,
      /\.map$/,
      /coverage/,
      /dist/,
      /build/,
      /\.log$/,
      /\.tmp$/,
      /\.cache$/
    ];
    
    this.scanResults = [];
    this.lastScanTime = null;
    this.scanInterval = 5 * 60 * 1000; // 5 минут
    this.isRunning = false;
  }

  // Проверка файла на секреты
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const findings = [];
      
      this.secretsPatterns.forEach((pattern, index) => {
        const matches = content.match(pattern);
        if (matches) {
          findings.push({
            pattern: pattern.toString(),
            matches: matches.slice(0, 5), // Ограничиваем количество совпадений
            lineNumbers: this.findLineNumbers(content, matches),
            severity: this.calculateSeverity(pattern, matches)
          });
        }
      });
      
      if (findings.length > 0) {
        return {
          file: filePath,
          findings,
          timestamp: new Date().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Ошибка сканирования файла ${filePath}:`, error.message);
      return null;
    }
  }

  // Поиск номеров строк с совпадениями
  findLineNumbers(content, matches) {
    const lines = content.split('\n');
    const lineNumbers = [];
    
    matches.forEach(match => {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(match)) {
          lineNumbers.push(i + 1);
          break;
        }
      }
    });
    
    return [...new Set(lineNumbers)];
  }

  // Расчет критичности находки
  calculateSeverity(pattern, matches) {
    const patternStr = pattern.toString().toLowerCase();
    
    if (patternStr.includes('private key') || patternStr.includes('ssh')) {
      return 'CRITICAL';
    } else if (patternStr.includes('api') || patternStr.includes('token')) {
      return 'HIGH';
    } else if (patternStr.includes('password')) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  // Рекурсивное сканирование директории
  async scanDirectory(dirPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth > maxDepth) return [];
    
    const results = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        
        // Пропускаем исключенные директории
        if (this.excludePatterns.some(pattern => pattern.test(fullPath))) {
          continue;
        }
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          const subResults = await this.scanDirectory(fullPath, maxDepth, currentDepth + 1);
          results.push(...subResults);
        } else if (stat.isFile()) {
          const fileResult = await this.scanFile(fullPath);
          if (fileResult) {
            results.push(fileResult);
          }
        }
      }
    } catch (error) {
      console.error(`Ошибка сканирования директории ${dirPath}:`, error.message);
    }
    
    return results;
  }

  // Основное сканирование
  async performScan(workspacePath = process.cwd()) {
    if (this.isRunning) {
      console.log('Сканирование уже выполняется...');
      return;
    }
    
    this.isRunning = true;
    console.log(`🚀 Начинаю сканирование безопасности в: ${workspacePath}`);
    
    try {
      const startTime = Date.now();
      const results = await this.scanDirectory(workspacePath);
      const scanTime = Date.now() - startTime;
      
      this.scanResults = results;
      this.lastScanTime = new Date();
      
      console.log(`✅ Сканирование завершено за ${scanTime}ms`);
      console.log(`🔍 Найдено файлов с потенциальными секретами: ${results.length}`);
      
      if (results.length > 0) {
        await this.generateReport();
        await this.createGitHubSecrets(results);
      }
      
      return results;
    } catch (error) {
      console.error('❌ Ошибка во время сканирования:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  // Генерация отчета
  async generateReport() {
    const report = {
      timestamp: this.lastScanTime.toISOString(),
      totalFiles: this.scanResults.length,
      criticalFindings: 0,
      highFindings: 0,
      mediumFindings: 0,
      lowFindings: 0,
      details: this.scanResults
    };
    
    this.scanResults.forEach(result => {
      result.findings.forEach(finding => {
        switch (finding.severity) {
          case 'CRITICAL': report.criticalFindings++; break;
          case 'HIGH': report.highFindings++; break;
          case 'MEDIUM': report.mediumFindings++; break;
          case 'LOW': report.lowFindings++; break;
        }
      });
    });
    
    const reportPath = path.join(process.cwd(), 'security-scan-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Отчет сохранен в: ${reportPath}`);
    console.log(`🚨 Критические: ${report.criticalFindings}, Высокие: ${report.highFindings}`);
    
    return report;
  }

  // Создание GitHub Secrets для найденных секретов
  async createGitHubSecrets(scanResults) {
    console.log('🔐 Создаю GitHub Secrets для найденных секретов...');
    
    const secrets = new Set();
    
    scanResults.forEach(result => {
      result.findings.forEach(finding => {
        finding.matches.forEach(match => {
          // Очищаем и нормализуем секрет
          const cleanSecret = match.replace(/['"`]/g, '').trim();
          if (cleanSecret.length > 10) {
            secrets.add(cleanSecret);
          }
        });
      });
    });
    
    if (secrets.size > 0) {
      const secretsFile = path.join(process.cwd(), 'github-secrets-to-create.md');
      const content = `# GitHub Secrets для создания

## Автоматически обнаруженные секреты

**ВНИМАНИЕ:** Эти секреты были обнаружены в коде и должны быть перемещены в GitHub Secrets!

### Список секретов для создания:

${Array.from(secrets).map((secret, index) => {
  const truncated = secret.length > 20 ? secret.substring(0, 20) + '...' : secret;
  return `${index + 1}. **SECRET_${index + 1}** = \`${truncated}\``;
}).join('\n')}

### Инструкции по созданию:

1. Перейдите в ваш GitHub репозиторий
2. Нажмите Settings → Secrets and variables → Actions
3. Создайте новые repository secrets с именами SECRET_1, SECRET_2, etc.
4. Замените в коде все найденные секреты на переменные окружения
5. Используйте в GitHub Actions: \`\${{ secrets.SECRET_1 }}\`

### Пример замены в коде:

\`\`\`javascript
// БЫЛО (НЕБЕЗОПАСНО):
const apiKey = "sk-1234567890abcdef";

// СТАЛО (БЕЗОПАСНО):
const apiKey = process.env.API_KEY;
\`\`\`

**Дата обнаружения:** ${new Date().toLocaleString('ru-RU')}
**Агент безопасности:** Cursor Security Agent v1.0
`;

      fs.writeFileSync(secretsFile, content);
      console.log(`📝 Файл с инструкциями создан: ${secretsFile}`);
    }
  }

  // Запуск непрерывного мониторинга
  startContinuousMonitoring(workspacePath = process.cwd()) {
    console.log('🔄 Запускаю непрерывный мониторинг безопасности...');
    
    // Первое сканирование
    this.performScan(workspacePath);
    
    // Установка интервала
    this.monitoringInterval = setInterval(() => {
      console.log('⏰ Выполняю плановое сканирование...');
      this.performScan(workspacePath);
    }, this.scanInterval);
    
    console.log(`⏱️  Интервал сканирования: ${this.scanInterval / 1000} секунд`);
  }

  // Остановка мониторинга
  stopContinuousMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛑 Непрерывный мониторинг остановлен');
    }
  }

  // Получение статистики
  getStats() {
    return {
      lastScanTime: this.lastScanTime,
      totalScans: this.scanResults.length,
      isRunning: this.isRunning,
      isMonitoring: !!this.monitoringInterval
    };
  }
}

module.exports = SecurityAgent;