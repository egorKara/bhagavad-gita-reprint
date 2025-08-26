#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
🔄 Cursor IDE Sync Module
Модуль для синхронизации серверного агента с Cursor IDE
Версия: 1.0.0
"""

import json
import os
import requests
import subprocess
from datetime import datetime
from pathlib import Path

class CursorSync:
    def __init__(self, config):
        self.config = config
        self.cursor_config = config['sync']['cursor_ide']
        self.project_path = config['server']['project_path']
        
    def read_cursor_priorities(self):
        """Чтение приоритетов из Cursor IDE"""
        priority_file = os.path.join(self.project_path, self.cursor_config['priority_file'])
        
        try:
            if os.path.exists(priority_file):
                with open(priority_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Извлекаем критические приоритеты
                priorities = self.parse_priorities(content)
                return priorities
            else:
                print(f"⚠️ Файл приоритетов не найден: {priority_file}")
                return {}
                
        except Exception as e:
            print(f"❌ Ошибка чтения приоритетов: {e}")
            return {}
            
    def parse_priorities(self, content):
        """Парсинг приоритетов из markdown"""
        priorities = {
            'critical': [],
            'security': [],
            'performance': []
        }
        
        current_section = None
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            
            if 'КРИТИЧЕСКИЙ ПРИОРИТЕТ' in line:
                current_section = 'critical'
            elif 'БЕЗОПАСНОСТЬ' in line:
                current_section = 'security'
            elif 'ПРОИЗВОДИТЕЛЬНОСТЬ' in line:
                current_section = 'performance'
            elif line.startswith('-') and current_section:
                # Извлекаем задачу
                task = line.lstrip('- ').strip()
                if task and not task.startswith('#'):
                    priorities[current_section].append(task)
                    
        return priorities
        
    def update_server_priorities(self, cursor_priorities):
        """Обновление приоритетов серверного агента"""
        try:
            # Читаем текущую конфигурацию агента
            config_file = os.path.join(
                os.path.dirname(__file__), 
                'agent-config.json'
            )
            
            if os.path.exists(config_file):
                with open(config_file, 'r', encoding='utf-8') as f:
                    agent_config = json.load(f)
                    
                # Обновляем приоритеты из Cursor
                if cursor_priorities.get('critical'):
                    # Добавляем новые критические задачи
                    existing_critical = set(agent_config['priorities']['critical'])
                    
                    for priority in cursor_priorities['critical']:
                        if 'api' in priority.lower():
                            existing_critical.add('api_availability')
                        elif 'systemd' in priority.lower() or 'сервис' in priority.lower():
                            existing_critical.add('systemd_services')
                        elif 'ssl' in priority.lower():
                            existing_critical.add('ssl_certificates')
                        elif 'диск' in priority.lower() or 'disk' in priority.lower():
                            existing_critical.add('disk_space')
                            
                    agent_config['priorities']['critical'] = list(existing_critical)
                
                # Сохраняем обновленную конфигурацию
                with open(config_file, 'w', encoding='utf-8') as f:
                    json.dump(agent_config, f, indent=2, ensure_ascii=False)
                    
                print("✅ Приоритеты агента обновлены из Cursor")
                return True
            else:
                print(f"⚠️ Конфигурация агента не найдена: {config_file}")
                return False
                
        except Exception as e:
            print(f"❌ Ошибка обновления приоритетов: {e}")
            return False
            
    def update_cursor_status(self, agent_status):
        """Обновление статуса в Cursor IDE"""
        try:
            status_file = os.path.join(self.project_path, self.cursor_config['status_file'])
            
            # Создаем директорию если не существует
            os.makedirs(os.path.dirname(status_file), exist_ok=True)
            
            # Добавляем статус агента
            status_message = f"Yandex Server Agent status: {agent_status} at {datetime.now()}\n"
            
            with open(status_file, 'a', encoding='utf-8') as f:
                f.write(status_message)
                
            print("✅ Статус обновлен в Cursor")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка обновления статуса: {e}")
            return False
            
    def sync_memory_bank(self, server_metrics):
        """Синхронизация с Memory Bank"""
        try:
            memory_bank_dir = os.path.join(self.project_path, '.cursor', 'memory-bank')
            
            if os.path.exists(memory_bank_dir):
                # Обновляем файл с метриками сервера
                server_status_file = os.path.join(memory_bank_dir, 'server-status.md')
                
                status_content = f"""# Server Status Report

## Last Update
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## System Metrics
- **CPU Usage:** {server_metrics.get('cpu', 'N/A')}%
- **Memory Usage:** {server_metrics.get('memory', 'N/A')}%
- **Disk Usage:** {server_metrics.get('disk', 'N/A')}%

## Services Status
"""
                
                for service, status in server_metrics.get('services', {}).items():
                    status_icon = "✅" if status == "active" else "❌"
                    status_content += f"- **{service}:** {status_icon} {status}\n"
                    
                status_content += f"""
## API Status
- **URL:** https://api.gita-1972-reprint.ru/api/status
- **Status:** {"✅ Available" if server_metrics.get('api_available') else "❌ Unavailable"}

## SSL Certificate
- **Status:** {"✅ Valid" if server_metrics.get('ssl_valid') else "⚠️ Issues"}

## Last Agent Check
{datetime.now().isoformat()}
"""

                with open(server_status_file, 'w', encoding='utf-8') as f:
                    f.write(status_content)
                    
                print("✅ Memory Bank обновлен")
                return True
            else:
                print("⚠️ Memory Bank директория не найдена")
                return False
                
        except Exception as e:
            print(f"❌ Ошибка синхронизации Memory Bank: {e}")
            return False
            
    def sync_with_github(self):
        """Синхронизация с GitHub через git"""
        try:
            os.chdir(self.project_path)
            
            # Проверяем есть ли изменения
            result = subprocess.run(['git', 'status', '--porcelain'], 
                                 capture_output=True, text=True)
            
            if result.stdout.strip():
                print("📝 Обнаружены локальные изменения")
                
                # Добавляем изменения в .cursor/ и server-agent/
                subprocess.run(['git', 'add', '.cursor/', 'server-agent/'], check=True)
                
                # Коммитим
                commit_message = f"chore(agent): server agent sync at {datetime.now().strftime('%Y-%m-%d %H:%M')}"
                subprocess.run(['git', 'commit', '-m', commit_message], check=True)
                
                print("✅ Изменения закоммичены")
            else:
                print("ℹ️ Нет изменений для коммита")
                
            # Пушим изменения
            result = subprocess.run(['git', 'push'], capture_output=True, text=True)
            if result.returncode == 0:
                print("✅ Изменения отправлены в GitHub")
            else:
                print(f"⚠️ Ошибка push: {result.stderr}")
                
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Ошибка git операции: {e}")
            return False
        except Exception as e:
            print(f"❌ Ошибка синхронизации с GitHub: {e}")
            return False
            
    def create_sync_report(self, sync_results):
        """Создание отчета о синхронизации"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "sync_results": sync_results,
            "cursor_priorities_read": sync_results.get('cursor_priorities_read', False),
            "server_priorities_updated": sync_results.get('server_priorities_updated', False),
            "cursor_status_updated": sync_results.get('cursor_status_updated', False),
            "memory_bank_synced": sync_results.get('memory_bank_synced', False),
            "github_synced": sync_results.get('github_synced', False)
        }
        
        # Сохраняем отчет
        report_file = os.path.join(self.project_path, 'logs', 'sync-report.json')
        os.makedirs(os.path.dirname(report_file), exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
            
        return report
        
    def full_sync(self, server_metrics):
        """Полная синхронизация со всеми системами"""
        print("🔄 Запуск полной синхронизации с Cursor IDE")
        
        sync_results = {}
        
        # 1. Читаем приоритеты из Cursor
        cursor_priorities = self.read_cursor_priorities()
        sync_results['cursor_priorities_read'] = bool(cursor_priorities)
        
        # 2. Обновляем приоритеты агента
        if cursor_priorities:
            sync_results['server_priorities_updated'] = self.update_server_priorities(cursor_priorities)
        
        # 3. Обновляем статус в Cursor
        agent_status = "running" if server_metrics.get('all_ok', False) else "issues_detected"
        sync_results['cursor_status_updated'] = self.update_cursor_status(agent_status)
        
        # 4. Синхронизируем Memory Bank
        sync_results['memory_bank_synced'] = self.sync_memory_bank(server_metrics)
        
        # 5. Синхронизируем с GitHub
        if self.config['sync']['github']['enabled']:
            sync_results['github_synced'] = self.sync_with_github()
            
        # 6. Создаем отчет
        report = self.create_sync_report(sync_results)
        
        success_count = sum(1 for result in sync_results.values() if result)
        total_count = len(sync_results)
        
        if success_count == total_count:
            print(f"✅ Полная синхронизация завершена успешно ({success_count}/{total_count})")
        else:
            print(f"⚠️ Синхронизация завершена с предупреждениями ({success_count}/{total_count})")
            
        return report

def main():
    """Тестирование модуля синхронизации"""
    # Загружаем конфигурацию
    config_file = os.path.join(os.path.dirname(__file__), 'agent-config.json')
    
    if not os.path.exists(config_file):
        print(f"❌ Конфигурация не найдена: {config_file}")
        return
        
    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
        
    # Создаем экземпляр синхронизатора
    sync = CursorSync(config)
    
    # Тестовые метрики
    test_metrics = {
        'cpu': 25.5,
        'memory': 45.2,
        'disk': 35.8,
        'services': {
            'gita-api': 'active',
            'nginx': 'active'
        },
        'api_available': True,
        'ssl_valid': True,
        'all_ok': True
    }
    
    # Выполняем синхронизацию
    report = sync.full_sync(test_metrics)
    
    print("\n📊 Отчет о синхронизации:")
    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
