#!/usr/bin/env node

const SecurityAgent = require('../services/security-agent');
const path = require('path');
const fs = require('fs');

class SecurityCLI {
  constructor() {
    this.agent = new SecurityAgent();
    this.workspacePath = process.cwd();
  }

  // Показать справку
  showHelp() {
    console.log(`
🔒 Cursor Security Agent CLI v1.0

Использование:
  node security-cli.js [команда] [опции]

Команды:
  scan                    - Выполнить разовое сканирование
  monitor                - Запустить непрерывный мониторинг
  stop                   - Остановить мониторинг
  report                 - Показать последний отчет
  stats                  - Показать статистику
  help                   - Показать эту справку

Опции:
  --path <путь>          - Путь для сканирования (по умолчанию: текущая директория)
  --interval <минуты>    - Интервал мониторинга в минутах (по умолчанию: 5)
  --depth <уровень>      - Максимальная глубина сканирования (по умолчанию: 3)

Примеры:
  node security-cli.js scan
  node security-cli.js monitor --interval 10
  node security-cli.js scan --path /path/to/project
  node security-cli.js stop
`);
  }

  // Парсинг аргументов командной строки
  parseArgs() {
    const args = process.argv.slice(2);
    const command = args[0];
    const options = {};

    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--path' && args[i + 1]) {
        options.path = args[i + 1];
        i++;
      } else if (args[i] === '--interval' && args[i + 1]) {
        options.interval = parseInt(args[i + 1]);
        i++;
      } else if (args[i] === '--depth' && args[i + 1]) {
        options.depth = parseInt(args[i + 1]);
        i++;
      }
    }

    return { command, options };
  }

  // Выполнить сканирование
  async runScan(options) {
    const scanPath = options.path || this.workspacePath;
    
    console.log(`🔍 Запускаю сканирование в: ${scanPath}`);
    
    try {
      const results = await this.agent.performScan(scanPath);
      
      if (results && results.length > 0) {
        console.log(`\n🚨 Обнаружено ${results.length} файлов с потенциальными секретами!`);
        console.log('📊 Подробный отчет сохранен в security-scan-report.json');
        console.log('🔐 Инструкции по созданию GitHub Secrets в github-secrets-to-create.md');
      } else {
        console.log('✅ Секреты не обнаружены!');
      }
      
      return results;
    } catch (error) {
      console.error('❌ Ошибка сканирования:', error.message);
      process.exit(1);
    }
  }

  // Запустить мониторинг
  async startMonitoring(options) {
    const scanPath = options.path || this.workspacePath;
    
    if (options.interval) {
      this.agent.scanInterval = options.interval * 60 * 1000;
    }
    
    console.log(`🔄 Запускаю непрерывный мониторинг в: ${scanPath}`);
    console.log(`⏱️  Интервал сканирования: ${this.agent.scanInterval / 1000} секунд`);
    
    // Обработка сигналов для корректного завершения
    process.on('SIGINT', () => {
      console.log('\n🛑 Получен сигнал завершения...');
      this.agent.stopContinuousMonitoring();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Получен сигнал завершения...');
      this.agent.stopContinuousMonitoring();
      process.exit(0);
    });
    
    this.agent.startContinuousMonitoring(scanPath);
    
    // Держим процесс активным
    console.log('💡 Нажмите Ctrl+C для остановки мониторинга');
  }

  // Остановить мониторинг
  stopMonitoring() {
    this.agent.stopContinuousMonitoring();
    console.log('✅ Мониторинг остановлен');
  }

  // Показать отчет
  showReport() {
    const reportPath = path.join(this.workspacePath, 'security-scan-report.json');
    
    if (!fs.existsSync(reportPath)) {
      console.log('📊 Отчет не найден. Сначала выполните сканирование.');
      return;
    }
    
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      
      console.log('\n📊 ОТЧЕТ ПО БЕЗОПАСНОСТИ');
      console.log('=' .repeat(50));
      console.log(`📅 Дата: ${new Date(report.timestamp).toLocaleString('ru-RU')}`);
      console.log(`📁 Всего файлов: ${report.totalFiles}`);
      console.log(`🚨 Критические: ${report.criticalFindings}`);
      console.log(`⚠️  Высокие: ${report.highFindings}`);
      console.log(`🔶 Средние: ${report.mediumFindings}`);
      console.log(`🔵 Низкие: ${report.lowFindings}`);
      
      if (report.details && report.details.length > 0) {
        console.log('\n📋 Детали по файлам:');
        report.details.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.file}`);
          result.findings.forEach((finding, fIndex) => {
            console.log(`   ${fIndex + 1}. [${finding.severity}] Строки: ${finding.lineNumbers.join(', ')}`);
          });
        });
      }
      
    } catch (error) {
      console.error('❌ Ошибка чтения отчета:', error.message);
    }
  }

  // Показать статистику
  showStats() {
    const stats = this.agent.getStats();
    
    console.log('\n📈 СТАТИСТИКА АГЕНТА БЕЗОПАСНОСТИ');
    console.log('=' .repeat(50));
    console.log(`🔄 Статус мониторинга: ${stats.isMonitoring ? 'Активен' : 'Остановлен'}`);
    console.log(`⚡ Статус сканирования: ${stats.isRunning ? 'Выполняется' : 'Ожидает'}`);
    console.log(`📅 Последнее сканирование: ${stats.lastScanTime ? new Date(stats.lastScanTime).toLocaleString('ru-RU') : 'Не выполнялось'}`);
    console.log(`📊 Всего находок: ${stats.totalScans}`);
  }

  // Главный метод CLI
  async run() {
    const { command, options } = this.parseArgs();
    
    if (!command || command === 'help') {
      this.showHelp();
      return;
    }
    
    try {
      switch (command) {
        case 'scan':
          await this.runScan(options);
          break;
          
        case 'monitor':
          await this.startMonitoring(options);
          break;
          
        case 'stop':
          this.stopMonitoring();
          break;
          
        case 'report':
          this.showReport();
          break;
          
        case 'stats':
          this.showStats();
          break;
          
        default:
          console.error(`❌ Неизвестная команда: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Ошибка выполнения команды:', error.message);
      process.exit(1);
    }
  }
}

// Запуск CLI если файл вызван напрямую
if (require.main === module) {
  const cli = new SecurityCLI();
  cli.run().catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
}

module.exports = SecurityCLI;