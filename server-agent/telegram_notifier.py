#!/usr/bin/env python3
"""
📱 Telegram Notifier - система уведомлений и управления через Telegram
Мгновенные алерты, ежедневные отчеты, интерактивные команды
"""

import json
import logging
import requests
import subprocess
import os
from datetime import datetime
from typing import Dict, List, Optional
import time

class TelegramNotifier:
    def __init__(self, config_path="agent-config.json"):
        """Инициализация Telegram уведомлений"""
        self.config = self.load_config(config_path)
        self.setup_logging()
        
    def load_config(self, config_path):
        """Загрузка конфигурации"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
                
            # Добавляем конфигурацию Telegram если её нет
            if 'telegram' not in config:
                config['telegram'] = {
                    "enabled": True,
                    "bot_token": "YOUR_BOT_TOKEN_HERE",
                    "chat_ids": {
                        "admin": "YOUR_ADMIN_CHAT_ID",
                        "alerts": "YOUR_ALERTS_CHAT_ID",
                        "reports": "YOUR_REPORTS_CHAT_ID"
                    },
                    "notifications": {
                        "critical_alerts": True,
                        "daily_reports": True,
                        "weekly_summaries": True,
                        "maintenance_notifications": True
                    },
                    "interactive_commands": True,
                    "rate_limit": {
                        "max_messages_per_minute": 10,
                        "critical_override": True
                    }
                }
                self.save_config(config, config_path)
                
            return config
        except Exception as e:
            logging.error(f"❌ Ошибка загрузки конфигурации: {e}")
            return {}
    
    def save_config(self, config, config_path):
        """Сохранение обновленной конфигурации"""
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logging.error(f"❌ Ошибка сохранения конфигурации: {e}")
    
    def setup_logging(self):
        """Настройка логирования"""
        # Создаем директорию логов если её нет
        log_dir = os.path.expanduser('~/logs') if os.path.exists(os.path.expanduser('~/gita-1972')) else './logs'
        os.makedirs(log_dir, exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(os.path.join(log_dir, 'telegram-notifier.log')),
                logging.StreamHandler()
            ]
        )
    
    def send_message(self, text: str, chat_type: str = "admin", parse_mode: str = "Markdown") -> bool:
        """Отправка сообщения в Telegram"""
        if not self.config.get('telegram', {}).get('enabled', False):
            self.log_info("📱 Telegram уведомления отключены")
            return False
            
        try:
            bot_token = self.config['telegram']['bot_token']
            chat_id = self.config['telegram']['chat_ids'].get(chat_type)
            
            if not bot_token or bot_token == "YOUR_BOT_TOKEN_HERE":
                self.log_error("❌ Не настроен токен Telegram бота")
                return False
                
            if not chat_id:
                self.log_error(f"❌ Не настроен chat_id для типа: {chat_type}")
                return False
            
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": text,
                "parse_mode": parse_mode,
                "disable_web_page_preview": True
            }
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                self.log_info(f"✅ Сообщение отправлено в {chat_type}")
                return True
            else:
                self.log_error(f"❌ Ошибка отправки в Telegram: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_error(f"❌ Ошибка отправки в Telegram: {e}")
            return False
    
    def send_critical_alert(self, alert_type: str, message: str, details: Dict = None):
        """Отправка критического алерта"""
        emoji_map = {
            "api_down": "🚨",
            "service_failed": "⚡",
            "ssl_expired": "🔒",
            "disk_full": "💾",
            "high_cpu": "🔥",
            "memory_leak": "📈"
        }
        
        emoji = emoji_map.get(alert_type, "⚠️")
        
        alert_text = f"""
{emoji} *КРИТИЧЕСКИЙ АЛЕРТ*

🎯 *Тип:* {alert_type.replace('_', ' ').title()}
⏰ *Время:* {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
📝 *Сообщение:* {message}

🔗 *Сервер:* Gita 1972 Reprint
🌐 *IP:* 46.21.247.218
"""
        
        if details:
            alert_text += "\n📊 *Детали:*\n"
            for key, value in details.items():
                alert_text += f"• {key}: {value}\n"
        
        alert_text += "\n🔧 *Действия:* Проверьте сервер немедленно!"
        
        return self.send_message(alert_text, "alerts")
    
    def send_daily_report(self, system_stats: Dict, service_status: Dict, recent_issues: List):
        """Отправка ежедневного отчета"""
        report_text = f"""
📊 *ЕЖЕДНЕВНЫЙ ОТЧЕТ*
📅 {datetime.now().strftime('%Y-%m-%d')}

🖥️ *СИСТЕМНЫЕ РЕСУРСЫ:*
• CPU: {system_stats.get('cpu', 'N/A')}%
• RAM: {system_stats.get('memory', 'N/A')}%
• Диск: {system_stats.get('disk', 'N/A')}%
• Uptime: {system_stats.get('uptime', 'N/A')}

🔧 *СТАТУС СЕРВИСОВ:*
"""
        
        for service, status in service_status.items():
            status_emoji = "✅" if status == "active" else "❌"
            report_text += f"• {service}: {status_emoji} {status}\n"
        
        if recent_issues:
            report_text += "\n⚠️ *ПРОБЛЕМЫ ЗА 24 ЧАСА:*\n"
            for issue in recent_issues[-5:]:  # Последние 5 проблем
                report_text += f"• {issue.get('time', 'N/A')}: {issue.get('description', 'N/A')}\n"
        else:
            report_text += "\n✅ *Проблем за последние 24 часа не выявлено*"
        
        report_text += f"""

🌐 *ДОСТУПНОСТЬ:*
• API: https://api.gita-1972-reprint.ru/api/status
• Сайт: https://gita-1972-reprint.ru/

🤖 *Yandex Server Agent работает нормально*
"""
        
        return self.send_message(report_text, "reports")
    
    def send_maintenance_notification(self, maintenance_type: str, description: str, duration: str = "неизвестно"):
        """Уведомление о техническом обслуживании"""
        notification_text = f"""
🔧 *ТЕХНИЧЕСКОЕ ОБСЛУЖИВАНИЕ*

🎯 *Тип:* {maintenance_type}
📝 *Описание:* {description}
⏱️ *Продолжительность:* {duration}
⏰ *Начало:* {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

🤖 Автоматическое обслуживание Yandex Server Agent
🔄 Все операции будут выполнены автоматически
"""
        
        return self.send_message(notification_text, "admin")
    
    def process_command(self, command: str) -> str:
        """Обработка интерактивных команд"""
        if not self.config.get('telegram', {}).get('interactive_commands', False):
            return "❌ Интерактивные команды отключены"
        
        command = command.lower().strip()
        
        if command == "/status":
            return self.get_system_status()
        elif command == "/services":
            return self.get_services_status()
        elif command == "/logs":
            return self.get_recent_logs()
        elif command == "/restart_api":
            return self.restart_api_service()
        elif command == "/check_ssl":
            return self.check_ssl_status()
        elif command == "/help":
            return self.get_help_message()
        else:
            return f"❌ Неизвестная команда: {command}\nИспользуйте /help для списка команд"
    
    def get_system_status(self) -> str:
        """Получение статуса системы"""
        try:
            # CPU
            cpu_cmd = "top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1"
            cpu_result = subprocess.run(cpu_cmd, shell=True, capture_output=True, text=True)
            cpu = cpu_result.stdout.strip() if cpu_result.returncode == 0 else "N/A"
            
            # Memory
            mem_cmd = "free | grep Mem | awk '{printf \"%.1f\", $3/$2 * 100.0}'"
            mem_result = subprocess.run(mem_cmd, shell=True, capture_output=True, text=True)
            memory = mem_result.stdout.strip() if mem_result.returncode == 0 else "N/A"
            
            # Disk
            disk_cmd = "df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1"
            disk_result = subprocess.run(disk_cmd, shell=True, capture_output=True, text=True)
            disk = disk_result.stdout.strip() if disk_result.returncode == 0 else "N/A"
            
            return f"""
📊 *СТАТУС СИСТЕМЫ*

🖥️ *Ресурсы:*
• CPU: {cpu}%
• RAM: {memory}%
• Диск: {disk}%

⏰ *Время:* {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🤖 *Агент:* Активен
"""
            
        except Exception as e:
            return f"❌ Ошибка получения статуса: {e}"
    
    def get_services_status(self) -> str:
        """Получение статуса сервисов"""
        try:
            services = ["gita-api", "nginx", "yandex-server-agent"]
            status_text = "🔧 *СТАТУС СЕРВИСОВ*\n\n"
            
            for service in services:
                cmd = f"systemctl is-active {service}"
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                status = result.stdout.strip()
                
                if status == "active":
                    emoji = "✅"
                elif status == "inactive":
                    emoji = "⏸️"
                else:
                    emoji = "❌"
                
                status_text += f"• {service}: {emoji} {status}\n"
            
            return status_text
            
        except Exception as e:
            return f"❌ Ошибка получения статуса сервисов: {e}"
    
    def get_recent_logs(self) -> str:
        """Получение последних логов"""
        try:
            cmd = "journalctl -u gita-api -n 5 --no-pager | tail -5"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0 and result.stdout:
                logs = result.stdout.strip()
                return f"📋 *ПОСЛЕДНИЕ ЛОГИ:*\n\n```\n{logs}\n```"
            else:
                return "📋 Логи недоступны"
                
        except Exception as e:
            return f"❌ Ошибка получения логов: {e}"
    
    def restart_api_service(self) -> str:
        """Перезапуск API сервиса"""
        try:
            cmd = "sudo systemctl restart gita-api"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                # Проверяем статус после перезапуска
                time.sleep(2)
                status_cmd = "systemctl is-active gita-api"
                status_result = subprocess.run(status_cmd, shell=True, capture_output=True, text=True)
                status = status_result.stdout.strip()
                
                if status == "active":
                    return "✅ API сервис успешно перезапущен"
                else:
                    return f"⚠️ API сервис перезапущен, но статус: {status}"
            else:
                return f"❌ Ошибка перезапуска API: {result.stderr}"
                
        except Exception as e:
            return f"❌ Ошибка выполнения команды: {e}"
    
    def check_ssl_status(self) -> str:
        """Проверка статуса SSL"""
        try:
            cmd = "sudo certbot certificates | grep -A 2 'gita-1972-reprint.ru'"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0 and result.stdout:
                return f"🔒 *SSL СЕРТИФИКАТ:*\n\n```\n{result.stdout.strip()}\n```"
            else:
                return "🔒 Информация о SSL недоступна"
                
        except Exception as e:
            return f"❌ Ошибка проверки SSL: {e}"
    
    def get_help_message(self) -> str:
        """Справочное сообщение"""
        return """
🤖 *КОМАНДЫ YANDEX SERVER AGENT*

📊 *Мониторинг:*
• `/status` - статус системы
• `/services` - статус сервисов
• `/logs` - последние логи
• `/check_ssl` - статус SSL

🔧 *Управление:*
• `/restart_api` - перезапуск API

ℹ️ *Справка:*
• `/help` - это сообщение

⚠️ *Внимание:* Команды управления требуют прав администратора
"""
    
    def log_info(self, message):
        """Логирование информации"""
        logging.info(message)
        
    def log_error(self, message):
        """Логирование ошибок"""
        logging.error(message)

def main():
    """Тестирование Telegram уведомлений"""
    notifier = TelegramNotifier()
    
    # Тест отправки сообщения
    test_message = f"""
🧪 *ТЕСТ УВЕДОМЛЕНИЙ*

⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🤖 Yandex Server Agent Telegram интеграция работает!

✅ Система готова к отправке уведомлений
"""
    
    success = notifier.send_message(test_message, "admin")
    print(f"📱 Тест отправки: {'✅ Успешно' if success else '❌ Ошибка'}")

if __name__ == "__main__":
    main()
