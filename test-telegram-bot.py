#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Тестовый скрипт для проверки Telegram бота
Yandex Server Agent
"""

import requests
import json
import sys
from datetime import datetime

# Конфигурация
BOT_TOKEN = "8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s"
CHAT_ID = "6878699213"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

def test_bot_info():
    """Проверить информацию о боте"""
    print("🤖 Проверяю информацию о боте...")
    
    try:
        response = requests.get(f"{TELEGRAM_API_URL}/getMe", timeout=10)
        data = response.json()
        
        if data.get("ok"):
            bot_info = data["result"]
            print(f"✅ Бот активен:")
            print(f"   - Имя: {bot_info.get('first_name')}")
            print(f"   - Username: @{bot_info.get('username')}")
            print(f"   - ID: {bot_info.get('id')}")
            return True
        else:
            print(f"❌ Ошибка API: {data.get('description')}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        return False

def test_send_message():
    """Отправить тестовое сообщение"""
    print("\n📱 Отправляю тестовое сообщение...")
    
    timestamp = datetime.now().strftime("%H:%M:%S")
    message = f"""🎉 ТЕСТ TELEGRAM БОТА

⏰ Время: {timestamp}
🤖 Бот: @Gita_server_monitor_bot
🔗 Проект: Yandex Server Agent

✅ Конфигурация обновлена
✅ Связь с Telegram API работает
✅ Готов к приему команд

Доступные команды:
• /status - статус сервера
• /services - состояние сервисов  
• /logs - последние логи
• /restart_api - перезапуск API
• /check_ssl - проверка SSL
• /help - помощь

🚀 СИСТЕМА ГОТОВА К РАБОТЕ!"""

    try:
        payload = {
            "chat_id": CHAT_ID,
            "text": message
        }
        
        response = requests.post(
            f"{TELEGRAM_API_URL}/sendMessage", 
            json=payload,
            timeout=10
        )
        data = response.json()
        
        if data.get("ok"):
            print("✅ Тестовое сообщение отправлено успешно!")
            print(f"   - Message ID: {data['result']['message_id']}")
            return True
        else:
            print(f"❌ Ошибка отправки: {data.get('description')}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка отправки: {e}")
        return False

def get_chat_updates():
    """Получить последние обновления чата"""
    print("\n📨 Проверяю последние сообщения...")
    
    try:
        response = requests.get(f"{TELEGRAM_API_URL}/getUpdates", timeout=10)
        data = response.json()
        
        if data.get("ok"):
            updates = data["result"]
            print(f"✅ Получено {len(updates)} обновлений")
            
            if updates:
                latest = updates[-1]
                print(f"   - Последнее сообщение от: {latest.get('message', {}).get('from', {}).get('first_name', 'Unknown')}")
                print(f"   - Chat ID: {latest.get('message', {}).get('chat', {}).get('id')}")
            
            return True
        else:
            print(f"❌ Ошибка получения обновлений: {data.get('description')}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка получения обновлений: {e}")
        return False

def main():
    print("="*60)
    print("🎯 ТЕСТИРОВАНИЕ TELEGRAM БОТА")
    print("="*60)
    
    # Тестируем все функции
    tests = [
        ("Информация о боте", test_bot_info),
        ("Отправка сообщения", test_send_message),
        ("Получение обновлений", get_chat_updates)
    ]
    
    results = []
    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))
    
    # Итоговый отчет
    print("\n" + "="*60)
    print("📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:")
    print("="*60)
    
    success_count = 0
    for test_name, result in results:
        status = "✅ УСПЕХ" if result else "❌ ОШИБКА"
        print(f"{status:12} | {test_name}")
        if result:
            success_count += 1
    
    print(f"\n🎯 Результат: {success_count}/{len(tests)} тестов прошли успешно")
    
    if success_count == len(tests):
        print("🎉 ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО! TELEGRAM БОТ ГОТОВ К РАБОТЕ!")
        return 0
    else:
        print("⚠️ Обнаружены проблемы. Требуется дополнительная настройка.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
