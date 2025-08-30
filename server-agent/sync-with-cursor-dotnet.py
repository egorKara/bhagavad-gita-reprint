#!/usr/bin/env python3
"""
Синхронизация .NET архитектуры между Cursor IDE и Yandex Server Agent
Версия: 2.0.0 (.NET)
Дата: 26 августа 2025
"""

import json
import os
import sys
import logging
import requests
from datetime import datetime
from pathlib import Path

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/gita-landing/sync-cursor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DotNetCursorSync:
    """Синхронизация .NET архитектуры с Cursor IDE"""
    
    def __init__(self):
        self.config_file = 'agent-config-dotnet.json'
        self.cursor_dir = '.cursor'
        self.sync_status_file = '.cursor/sync-status-dotnet.log'
        self.last_sync_file = '.cursor/last-sync-dotnet.json'
        
        # .NET специфичные файлы для мониторинга
        self.dotnet_files = [
            'GitaLanding.sln',
            'GitaLanding.API/GitaLanding.API.csproj',
            'GitaLanding.Data/GitaLanding.Data.csproj',
            'GitaLanding.API/Program.cs',
            'GitaLanding.API/appsettings.json'
        ]
        
        # Файлы конфигурации агентов
        self.agent_files = [
            'server-agent/agent-config-dotnet.json',
            'server-agent/yandex-server-agent.py',
            '.cursor/rules/agent-priorities.mdc'
        ]
        
        # Документация .NET
        self.dotnet_docs = [
            'DOTNET_SETUP_INSTRUCTIONS.md',
            'PROJECT_TODO.md',
            'README.md',
            'CLEANUP_COMPLETE_REPORT.md'
        ]

    def load_config(self):
        """Загрузка конфигурации агента"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Конфигурация {self.config_file} не найдена")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Ошибка парсинга JSON: {e}")
            return None

    def check_dotnet_health(self):
        """Проверка здоровья .NET приложения"""
        try:
            # Проверка health endpoint
            response = requests.get('http://localhost:5000/health', timeout=5)
            if response.status_code == 200:
                logger.info("✅ .NET API здоров")
                return True
            else:
                logger.warning(f"⚠️ .NET API ответил с кодом: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ .NET API недоступен: {e}")
            return False

    def check_dotnet_files(self):
        """Проверка наличия .NET файлов"""
        missing_files = []
        for file_path in self.dotnet_files:
            if not os.path.exists(file_path):
                missing_files.append(file_path)
        
        if missing_files:
            logger.warning(f"⚠️ Отсутствуют .NET файлы: {missing_files}")
            return False
        else:
            logger.info("✅ Все .NET файлы присутствуют")
            return True

    def check_dotnet_runtime(self):
        """Проверка .NET Runtime"""
        try:
            import subprocess
            result = subprocess.run(['dotnet', '--version'], 
                                 capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                version = result.stdout.strip()
                logger.info(f"✅ .NET Runtime: {version}")
                return True
            else:
                logger.error("❌ .NET Runtime не найден")
                return False
        except Exception as e:
            logger.error(f"❌ Ошибка проверки .NET Runtime: {e}")
            return False

    def check_database_connection(self):
        """Проверка подключения к базе данных"""
        try:
            # Проверка PostgreSQL
            import subprocess
            result = subprocess.run(['pg_isready', '-h', 'localhost'], 
                                 capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                logger.info("✅ PostgreSQL доступен")
                return True
            else:
                logger.warning("⚠️ PostgreSQL недоступен")
                return False
        except Exception as e:
            logger.warning(f"⚠️ Не удалось проверить PostgreSQL: {e}")
            return False

    def sync_with_cursor(self):
        """Синхронизация с Cursor IDE"""
        try:
            # Создание статуса синхронизации
            sync_status = {
                'timestamp': datetime.now().isoformat(),
                'dotnet_health': self.check_dotnet_health(),
                'dotnet_files': self.check_dotnet_files(),
                'dotnet_runtime': self.check_dotnet_runtime(),
                'database': self.check_database_connection(),
                'agent_config': self.load_config() is not None
            }
            
            # Запись статуса
            os.makedirs(os.path.dirname(self.sync_status_file), exist_ok=True)
            with open(self.sync_status_file, 'w', encoding='utf-8') as f:
                json.dump(sync_status, f, indent=2, ensure_ascii=False)
            
            # Запись времени последней синхронизации
            with open(self.last_sync_file, 'w', encoding='utf-8') as f:
                json.dump({'last_sync': datetime.now().isoformat()}, f, indent=2)
            
            logger.info("✅ Синхронизация с Cursor IDE завершена")
            return sync_status
            
        except Exception as e:
            logger.error(f"❌ Ошибка синхронизации: {e}")
            return None

    def generate_status_report(self):
        """Генерация отчета о статусе"""
        config = self.load_config()
        if not config:
            return "❌ Не удалось загрузить конфигурацию"
        
        report = f"""
# 📊 ОТЧЕТ О СИНХРОНИЗАЦИИ .NET АРХИТЕКТУРЫ

**Время:** {datetime.now().strftime('%d.%m.%Y %H:%M:%S')} MSK
**Агент:** {config.get('agent', {}).get('name', 'Unknown')}
**Версия:** {config.get('agent', {}).get('version', 'Unknown')}

## 🏗️ .NET АРХИТЕКТУРА
- **Runtime:** {config.get('dotnet', {}).get('runtime_version', 'Unknown')}
- **API Проект:** {config.get('dotnet', {}).get('api_project', 'Unknown')}
- **Data Проект:** {config.get('dotnet', {}).get('data_project', 'Unknown')}
- **Порт:** {config.get('dotnet', {}).get('port', 'Unknown')}

## 🗄️ БАЗА ДАННЫХ
- **Тип:** {config.get('database', {}).get('type', 'Unknown')}
- **Миграции:** {'✅' if config.get('database', {}).get('migrations_enabled') else '❌'}
- **Backup:** {'✅' if config.get('database', {}).get('backup_enabled') else '❌'}

## 📁 ФАЙЛЫ ДЛЯ МОНИТОРИНГА
- **Solution:** {config.get('dotnet', {}).get('solution_file', 'Unknown')}
- **Publish Path:** {config.get('dotnet', {}).get('publish_path', 'Unknown')}

## 🔄 СИНХРОНИЗАЦИЯ
- **Cursor IDE:** {'✅' if config.get('sync', {}).get('cursor_ide', {}).get('enabled') else '❌'}
- **GitHub:** {'✅' if config.get('sync', {}).get('github', {}).get('enabled') else '❌'}
- **Интервал:** {config.get('sync', {}).get('cursor_ide', {}).get('sync_interval', 'Unknown')}

---
*Отчет сгенерирован автоматически*
"""
        return report

def main():
    """Основная функция"""
    logger.info("🚀 Запуск синхронизации .NET архитектуры с Cursor IDE")
    
    syncer = DotNetCursorSync()
    
    # Проверка конфигурации
    config = syncer.load_config()
    if not config:
        logger.error("❌ Не удалось загрузить конфигурацию агента")
        sys.exit(1)
    
    # Синхронизация
    sync_status = syncer.sync_with_cursor()
    if sync_status:
        logger.info("✅ Синхронизация успешно завершена")
        
        # Генерация отчета
        report = syncer.generate_status_report()
        print(report)
        
        # Сохранение отчета
        report_file = '.cursor/sync-report-dotnet.md'
        os.makedirs(os.path.dirname(report_file), exist_ok=True)
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"📄 Отчет сохранен в {report_file}")
    else:
        logger.error("❌ Синхронизация не удалась")
        sys.exit(1)

if __name__ == "__main__":
    main()