#!/usr/bin/env python3
"""
Простой обработчик команд Telegram
Работает независимо от основного агента
"""

import requests
import time
import subprocess
import json
from datetime import datetime

# Конфигурация
BOT_TOKEN = "8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s"
CHAT_ID = "6878699213"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

class SimpleTelegramHandler:
    def __init__(self):
        self.last_update_id = 0
        print(f"🤖 Простой Telegram Handler запущен")
        print(f"⏰ Время: {datetime.now().strftime('%H:%M:%S')}")
        
    def send_message(self, text):
        """Отправка сообщения"""
        try:
            url = f"{TELEGRAM_API_URL}/sendMessage"
            response = requests.post(url, json={
                'chat_id': CHAT_ID,
                'text': text
            }, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"❌ Ошибка отправки: {e}")
            return False
    
    def get_system_status(self):
        """Получение статуса системы"""
        try:
            # CPU
            cpu_cmd = "top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1"
            cpu = subprocess.run(cpu_cmd, shell=True, capture_output=True, text=True)
            cpu_usage = cpu.stdout.strip() if cpu.returncode == 0 else "N/A"
            
            # Memory
            mem_cmd = "free | grep Mem | awk '{printf \"%.1f\", $3/$2 * 100.0}'"
            mem = subprocess.run(mem_cmd, shell=True, capture_output=True, text=True)
            mem_usage = mem.stdout.strip() if mem.returncode == 0 else "N/A"
            
            # Disk
            disk_cmd = "df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1"
            disk = subprocess.run(disk_cmd, shell=True, capture_output=True, text=True)
            disk_usage = disk.stdout.strip() if disk.returncode == 0 else "N/A"
            
            # Uptime
            uptime_cmd = "uptime -p"
            uptime = subprocess.run(uptime_cmd, shell=True, capture_output=True, text=True)
            uptime_str = uptime.stdout.strip() if uptime.returncode == 0 else "N/A"
            
            return f"""📊 СТАТУС СИСТЕМЫ

🖥️ Ресурсы:
• CPU: {cpu_usage}%
• Memory: {mem_usage}%  
• Disk: {disk_usage}%
• Uptime: {uptime_str}

⏰ Время: {datetime.now().strftime('%H:%M:%S')}
🤖 Handler: Работает автономно
✅ Telegram: Команды обрабатываются"""
            
        except Exception as e:
            return f"❌ Ошибка получения статуса: {e}"
    
    def get_services_status(self):
        """Статус сервисов"""
        try:
            services = ['yandex-server-agent', 'nginx', 'gita-api']
            status_text = "🔧 СТАТУС СЕРВИСОВ\n\n"
            
            for service in services:
                cmd = f"systemctl is-active {service}"
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                status = "✅ Активен" if result.stdout.strip() == "active" else "❌ Неактивен"
                status_text += f"• {service}: {status}\n"
            
            status_text += f"\n⏰ Проверено: {datetime.now().strftime('%H:%M:%S')}"
            return status_text
            
        except Exception as e:
            return f"❌ Ошибка проверки сервисов: {e}"
    
    def get_help(self):
        """Список команд"""
        return """🤖 ДОСТУПНЫЕ КОМАНДЫ:

/status - Статус системы (CPU, RAM, диск)
/services - Состояние сервисов
/help - Этот список команд
/ping - Проверка связи

🔧 Простой Handler:
• Работает независимо от основного агента
• Обрабатывает команды каждые 10 секунд
• Прямое подключение к Telegram API

⏰ Время ответа: обычно 10-20 секунд"""
    
    def process_command(self, command):
        """Обработка команды"""
        command = command.lower().strip()
        
        if command == "/status":
            return self.get_system_status()
        elif command == "/services":
            return self.get_services_status()
        elif command == "/help":
            return self.get_help()
        elif command == "/ping":
            return f"🏓 Pong! Время: {datetime.now().strftime('%H:%M:%S')}"
        else:
            return f"❌ Неизвестная команда: {command}\n\nИспользуйте /help для списка команд"
    
    def check_updates(self):
        """Проверка обновлений"""
        try:
            url = f"{TELEGRAM_API_URL}/getUpdates"
            params = {
                'offset': self.last_update_id + 1,
                'timeout': 1,
                'limit': 10
            }
            
            response = requests.get(url, params=params, timeout=5)
            
            if response.status_code != 200:
                return False
                
            data = response.json()
            
            if not data.get('ok', False):
                return False
                
            updates = data.get('result', [])
            
            if not updates:
                return False
            
            print(f"📨 Получено {len(updates)} обновлений")
            
            for update in updates:
                self.last_update_id = update['update_id']
                
                if 'message' not in update:
                    continue
                    
                message = update['message']
                chat_id = str(message['chat']['id'])
                
                if chat_id != CHAT_ID:
                    continue
                    
                if 'text' not in message:
                    continue
                    
                command_text = message['text'].strip()
                
                # Игнорируем старые сообщения
                message_date = message.get('date', 0)
                current_time = int(time.time())
                if current_time - message_date > 300:  # 5 минут
                    continue
                
                if command_text.startswith('/'):
                    print(f"📱 Команда: {command_text} от {chat_id}")
                    response_text = self.process_command(command_text)
                    
                    if self.send_message(response_text):
                        print(f"✅ Ответ отправлен")
                    else:
                        print(f"❌ Ошибка отправки ответа")
                        
            return True
            
        except Exception as e:
            print(f"❌ Ошибка проверки обновлений: {e}")
            return False
    
    def run(self):
        """Основной цикл"""
        print("🚀 Запуск основного цикла...")
        
        # Отправляем стартовое сообщение
        start_msg = f"""🤖 ПРОСТОЙ TELEGRAM HANDLER ЗАПУЩЕН!

⏰ Время: {datetime.now().strftime('%H:%M:%S')}
🔄 Проверка команд: каждые 10 секунд
📱 Доступные команды: /status, /services, /help, /ping

Этот handler работает независимо от основного агента и должен отвечать на команды!"""
        
        self.send_message(start_msg)
        
        # Основной цикл
        try:
            while True:
                print(f"🔄 Проверка в {datetime.now().strftime('%H:%M:%S')}")
                self.check_updates()
                time.sleep(10)
                
        except KeyboardInterrupt:
            print("🛑 Handler остановлен")
        except Exception as e:
            print(f"❌ Критическая ошибка: {e}")

if __name__ == "__main__":
    handler = SimpleTelegramHandler()
    handler.run()
