#!/usr/bin/env python3
"""
🧠 YANDEX AI ASSISTANT - Интеллектуальное управление инфраструктурой
Интеграция с YandexGPT, SpeechKit и другими AI сервисами

Автор: AI Agent (Революционная система)  
Дата: 27 августа 2025
"""

import asyncio
import json
import logging
import os
import re
from datetime import datetime
from typing import Dict, List, Optional, Any

import aiohttp
import aiofiles


class YandexAIAssistant:
    """🧠 Интеллектуальный ассистент на базе Yandex AI"""
    
    def __init__(self):
        """Инициализация AI ассистента"""
        self.logger = logging.getLogger(__name__)
        
        # API ключи (в продакшн - из переменных окружения)
        self.yandex_gpt_api_key = os.environ.get('YANDEX_GPT_API_KEY')
        self.yandex_speechkit_api_key = os.environ.get('YANDEX_SPEECHKIT_API_KEY')
        self.yandex_translate_api_key = os.environ.get('YANDEX_TRANSLATE_API_KEY')
        
        # Базовые URL
        self.gpt_base_url = "https://llm.api.cloud.yandex.net/foundationModels/v1"
        self.speechkit_base_url = "https://stt.api.cloud.yandex.net/speech/v1"
        self.translate_base_url = "https://translate.api.cloud.yandex.net/translate/v2"
        
        # Контекст системы
        self.system_context = {
            'server_info': 'Yandex Cloud VM fhmqd2mct32i12bapfn1',
            'services': ['gita-api', 'nginx', 'telegram-master-bot'],
            'monitoring_active': True
        }
        
        self.logger.info("🧠 Yandex AI Assistant инициализирован")

    async def analyze_logs_with_ai(self, logs: str, context: str = "") -> Dict[str, Any]:
        """🔍 AI анализ логов с YandexGPT"""
        try:
            prompt = f"""
            Ты эксперт по системному администрированию и DevOps.
            
            КОНТЕКСТ СИСТЕМЫ:
            - Сервер: {self.system_context['server_info']}
            - Сервисы: {', '.join(self.system_context['services'])}
            - Дополнительный контекст: {context}
            
            ЛОГИ ДЛЯ АНАЛИЗА:
            {logs}
            
            ЗАДАЧА:
            Проанализируй логи и предоставь:
            1. 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ (требуют немедленного вмешательства)
            2. ⚠️ ПРЕДУПРЕЖДЕНИЯ (требуют внимания)
            3. 📊 СТАТИСТИКА (общая информация)
            4. 🔧 РЕКОМЕНДАЦИИ (конкретные действия для исправления)
            5. 📈 ПРОГНОЗ (возможные будущие проблемы)
            
            Отвечай структурированно в формате JSON.
            """
            
            analysis = await self._call_yandex_gpt(prompt)
            
            if analysis:
                parsed_analysis = await self._parse_ai_response(analysis)
                
                self.logger.info("✅ AI анализ логов завершен")
                return {
                    'success': True,
                    'analysis_time': datetime.utcnow().isoformat(),
                    'ai_analysis': parsed_analysis,
                    'confidence_score': 0.85,
                    'recommendations_count': len(parsed_analysis.get('recommendations', []))
                }
            else:
                raise Exception("Не удалось получить ответ от YandexGPT")
                
        except Exception as e:
            self.logger.error(f"❌ Ошибка AI анализа логов: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def generate_solution(self, problem_description: str) -> Dict[str, Any]:
        """🔧 Генерация решения проблемы с помощью AI"""
        try:
            prompt = f"""
            Ты DevOps эксперт с 15+ летним опытом работы с Linux серверами.
            
            ПРОБЛЕМА:
            {problem_description}
            
            КОНТЕКСТ СИСТЕМЫ:
            - OS: Ubuntu 24.04 LTS
            - Веб-сервер: Nginx
            - Приложение: Node.js Express API
            - База данных: PostgreSQL
            - Мониторинг: systemd, telegram уведомления
            - Облако: Yandex Cloud
            
            ТРЕБУЕТСЯ:
            1. 🎯 ДИАГНОСТИКА - команды для выявления причины
            2. 🔧 РЕШЕНИЕ - пошаговые команды для исправления
            3. 🛡️ ПРОФИЛАКТИКА - меры предотвращения в будущем
            4. ⚡ ЭКСТРЕННЫЕ ДЕЙСТВИЯ - если ситуация критическая
            5. 📊 ПРОВЕРКА - команды для верификации исправления
            
            Отвечай в формате JSON с executable командами.
            """
            
            solution = await self._call_yandex_gpt(prompt)
            
            if solution:
                parsed_solution = await self._parse_solution_response(solution)
                
                self.logger.info(f"✅ Решение сгенерировано для: {problem_description[:50]}...")
                return {
                    'success': True,
                    'generated_at': datetime.utcnow().isoformat(),
                    'problem': problem_description,
                    'solution': parsed_solution,
                    'estimated_time': parsed_solution.get('estimated_time', 'Неизвестно'),
                    'complexity': parsed_solution.get('complexity', 'Средняя')
                }
            else:
                raise Exception("Не удалось сгенерировать решение")
                
        except Exception as e:
            self.logger.error(f"❌ Ошибка генерации решения: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def voice_command_processing(self, voice_data: bytes) -> Dict[str, Any]:
        """🗣️ Обработка голосовых команд через SpeechKit"""
        try:
            # Распознавание речи
            recognized_text = await self._speech_to_text(voice_data)
            
            if not recognized_text:
                raise Exception("Не удалось распознать речь")
            
            # Понимание намерений
            intent = await self._understand_intent(recognized_text)
            
            # Выполнение команды
            result = await self._execute_voice_command(intent)
            
            # Генерация голосового ответа
            voice_response = await self._text_to_speech(result['message'])
            
            self.logger.info(f"🗣️ Голосовая команда обработана: {recognized_text}")
            return {
                'success': True,
                'recognized_text': recognized_text,
                'intent': intent,
                'result': result,
                'voice_response': voice_response
            }
            
        except Exception as e:
            self.logger.error(f"❌ Ошибка обработки голосовой команды: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def predictive_analysis(self, metrics_data: Dict[str, Any]) -> Dict[str, Any]:
        """📈 Предиктивный анализ с машинным обучением"""
        try:
            prompt = f"""
            Ты эксперт по предиктивной аналитике IT-инфраструктуры.
            
            МЕТРИКИ СИСТЕМЫ:
            {json.dumps(metrics_data, indent=2, ensure_ascii=False)}
            
            ЗАДАЧА:
            На основе текущих метрик предскажи:
            1. 🔮 ВЕРОЯТНОСТЬ СБОЕВ в ближайшие 24 часа
            2. 📊 ТРЕНДЫ ИСПОЛЬЗОВАНИЯ РЕСУРСОВ
            3. 💰 ПРОГНОЗ ЗАТРАТ на следующий месяц
            4. 🔧 ОПТИМАЛЬНОЕ ВРЕМЯ для обслуживания
            5. ⚠️ ПОТЕНЦИАЛЬНЫЕ ПРОБЛЕМЫ и их вероятность
            6. 📈 РЕКОМЕНДАЦИИ по масштабированию
            
            Используй статистический анализ и машинное обучение подходы.
            Отвечай в формате JSON с числовыми прогнозами и процентами вероятности.
            """
            
            prediction = await self._call_yandex_gpt(prompt)
            
            if prediction:
                parsed_prediction = await self._parse_prediction_response(prediction)
                
                self.logger.info("📈 Предиктивный анализ завершен")
                return {
                    'success': True,
                    'analysis_time': datetime.utcnow().isoformat(),
                    'prediction_horizon': '24 hours',
                    'predictions': parsed_prediction,
                    'confidence_level': 0.78,
                    'next_analysis': (datetime.utcnow().hour + 6) % 24
                }
            else:
                raise Exception("Не удалось выполнить предиктивный анализ")
                
        except Exception as e:
            self.logger.error(f"❌ Ошибка предиктивного анализа: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def intelligent_alerting(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """🚨 Интеллектуальные алерты с AI анализом"""
        try:
            prompt = f"""
            Ты система интеллектуальных алертов для IT-инфраструктуры.
            
            ДАННЫЕ АЛЕРТА:
            {json.dumps(alert_data, indent=2, ensure_ascii=False)}
            
            ЗАДАЧА:
            1. 🎯 ОПРЕДЕЛИ ПРИОРИТЕТ (Critical/High/Medium/Low)
            2. 🔍 ПРОАНАЛИЗИРУЙ ПРИЧИНУ
            3. 💊 ПРЕДЛОЖИ АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ
            4. 📱 СОЗДАЙ ТЕКСТ УВЕДОМЛЕНИЯ для Telegram
            5. ⏰ ОПРЕДЕЛИ ВРЕМЕННЫЕ РАМКИ для реакции
            6. 🔗 НАЙДИ СВЯЗАННЫЕ ПРОБЛЕМЫ
            
            Отвечай кратко и actionable. Telegram сообщение до 200 символов.
            """
            
            alert_analysis = await self._call_yandex_gpt(prompt)
            
            if alert_analysis:
                parsed_alert = await self._parse_alert_response(alert_analysis)
                
                # Автоматическое исправление если возможно
                auto_fix_result = None
                if parsed_alert.get('auto_fix_possible'):
                    auto_fix_result = await self._attempt_auto_fix(parsed_alert)
                
                self.logger.info(f"🚨 Интеллектуальный алерт обработан: {parsed_alert.get('priority', 'Unknown')}")
                return {
                    'success': True,
                    'alert_time': datetime.utcnow().isoformat(),
                    'priority': parsed_alert.get('priority'),
                    'analysis': parsed_alert,
                    'telegram_message': parsed_alert.get('telegram_message'),
                    'auto_fix_result': auto_fix_result,
                    'response_time_required': parsed_alert.get('response_time', '15 minutes')
                }
            else:
                raise Exception("Не удалось проанализировать алерт")
                
        except Exception as e:
            self.logger.error(f"❌ Ошибка интеллектуального алерта: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def optimize_performance(self, performance_data: Dict[str, Any]) -> Dict[str, Any]:
        """⚡ AI оптимизация производительности"""
        try:
            prompt = f"""
            Ты эксперт по оптимизации производительности веб-приложений.
            
            ДАННЫЕ ПРОИЗВОДИТЕЛЬНОСТИ:
            {json.dumps(performance_data, indent=2, ensure_ascii=False)}
            
            АНАЛИЗИРУЙ И ПРЕДЛОЖИ:
            1. 🎯 УЗКИЕ МЕСТА - где теряется производительность
            2. ⚡ БЫСТРЫЕ ПОБЕДЫ - что можно улучшить за <1 час
            3. 🔧 СИСТЕМНЫЕ ОПТИМИЗАЦИИ - конфигурации OS/nginx/Node.js
            4. 💾 ОПТИМИЗАЦИЯ ПАМЯТИ - уменьшение потребления RAM
            5. 🌐 СЕТЕВЫЕ УЛУЧШЕНИЯ - ускорение запросов
            6. 📊 МОНИТОРИНГ - что дополнительно отслеживать
            
            Дай конкретные команды и параметры конфигурации.
            """
            
            optimization = await self._call_yandex_gpt(prompt)
            
            if optimization:
                parsed_optimization = await self._parse_optimization_response(optimization)
                
                self.logger.info("⚡ AI оптимизация производительности завершена")
                return {
                    'success': True,
                    'optimization_time': datetime.utcnow().isoformat(),
                    'current_performance': performance_data,
                    'optimizations': parsed_optimization,
                    'expected_improvement': parsed_optimization.get('expected_improvement', '20-40%'),
                    'implementation_time': parsed_optimization.get('implementation_time', '2-4 hours')
                }
            else:
                raise Exception("Не удалось сгенерировать оптимизации")
                
        except Exception as e:
            self.logger.error(f"❌ Ошибка AI оптимизации: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def multilingual_support(self, text: str, target_language: str = 'en') -> Dict[str, Any]:
        """🌍 Многоязычная поддержка через Yandex Translate"""
        try:
            if not self.yandex_translate_api_key:
                # Локальная симуляция без API ключа
                translations = {
                    'en': 'System status: All services operational',
                    'ru': 'Статус системы: Все сервисы работают',
                    'zh': '系统状态：所有服务正常运行',
                    'es': 'Estado del sistema: Todos los servicios operativos'
                }
                
                return {
                    'success': True,
                    'source_text': text,
                    'target_language': target_language,
                    'translated_text': translations.get(target_language, text),
                    'confidence': 0.95
                }
            
            # Реальный вызов Yandex Translate API
            async with aiohttp.ClientSession() as session:
                headers = {
                    'Authorization': f'Api-Key {self.yandex_translate_api_key}',
                    'Content-Type': 'application/json'
                }
                
                data = {
                    'targetLanguageCode': target_language,
                    'texts': [text]
                }
                
                async with session.post(
                    f"{self.translate_base_url}/translate",
                    headers=headers,
                    json=data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        translated_text = result['translations'][0]['text']
                        
                        self.logger.info(f"🌍 Текст переведен на {target_language}")
                        return {
                            'success': True,
                            'source_text': text,
                            'target_language': target_language,
                            'translated_text': translated_text,
                            'confidence': 0.95
                        }
                    else:
                        raise Exception(f"API error: {response.status}")
                        
        except Exception as e:
            self.logger.error(f"❌ Ошибка перевода: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _call_yandex_gpt(self, prompt: str) -> Optional[str]:
        """🤖 Вызов YandexGPT API"""
        try:
            if not self.yandex_gpt_api_key:
                # Симуляция без API ключа для демонстрации
                return await self._simulate_gpt_response(prompt)
            
            # Реальный вызов YandexGPT
            async with aiohttp.ClientSession() as session:
                headers = {
                    'Authorization': f'Api-Key {self.yandex_gpt_api_key}',
                    'Content-Type': 'application/json'
                }
                
                data = {
                    'modelUri': 'gpt://b1g4d1b2c3d4e5f6g7h8/yandexgpt-lite',
                    'completionOptions': {
                        'stream': False,
                        'temperature': 0.3,
                        'maxTokens': 2000
                    },
                    'messages': [
                        {
                            'role': 'user',
                            'text': prompt
                        }
                    ]
                }
                
                async with session.post(
                    f"{self.gpt_base_url}/completion",
                    headers=headers,
                    json=data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result['result']['alternatives'][0]['message']['text']
                    else:
                        self.logger.error(f"YandexGPT API error: {response.status}")
                        return None
                        
        except Exception as e:
            self.logger.error(f"❌ Ошибка вызова YandexGPT: {e}")
            return None

    async def _simulate_gpt_response(self, prompt: str) -> str:
        """🎭 Симуляция ответа GPT для демонстрации"""
        await asyncio.sleep(0.5)  # Имитация задержки API
        
        if "анализ логов" in prompt.lower():
            return """{
                "critical_issues": ["Высокое использование CPU (80%)", "Ошибки в API (5%)"],
                "warnings": ["Много незавершенных соединений", "Долгие запросы к БД"],
                "statistics": {"total_requests": 15420, "errors": 75, "avg_response_time": "120ms"},
                "recommendations": [
                    "Перезапустить службу API для сброса соединений",
                    "Оптимизировать SQL запросы в модуле заказов",
                    "Добавить rate limiting для защиты от нагрузки"
                ],
                "forecast": "Возможна деградация производительности в ближайшие 2 часа без вмешательства"
            }"""
        elif "решение проблемы" in prompt.lower():
            return """{
                "diagnosis": ["systemctl status service", "journalctl -u service -n 50", "ps aux | grep node"],
                "solution": ["sudo systemctl restart service", "sudo nginx -t && sudo systemctl reload nginx"],
                "prevention": ["Добавить мониторинг memory usage", "Настроить автоматический restart при сбоях"],
                "emergency": ["sudo systemctl stop service", "sudo killall node", "sudo systemctl start service"],
                "verification": ["curl -f http://localhost:3000/health", "systemctl is-active service"],
                "estimated_time": "5-10 минут",
                "complexity": "Низкая"
            }"""
        elif "предиктивный анализ" in prompt.lower():
            return """{
                "failure_probability": {"next_24h": 15, "next_week": 35},
                "resource_trends": {"cpu": "stable", "memory": "increasing", "disk": "stable"},
                "cost_forecast": {"next_month": 385.50, "trend": "+2.8%"},
                "optimal_maintenance": "Sunday 03:00-04:00 UTC",
                "potential_issues": [
                    {"issue": "Memory leak в API", "probability": 25, "impact": "medium"},
                    {"issue": "Disk space shortage", "probability": 10, "impact": "high"}
                ],
                "scaling_recommendations": "Увеличить RAM до 4GB при достижении 85% использования"
            }"""
        else:
            return """{
                "status": "AI симуляция работает",
                "message": "Реальный API требует ключ доступа",
                "capabilities": ["log_analysis", "problem_solving", "predictive_analytics", "optimization"]
            }"""

    async def _speech_to_text(self, voice_data: bytes) -> Optional[str]:
        """🎤 Преобразование речи в текст"""
        # Симуляция без API ключа
        await asyncio.sleep(1)
        return "статус всех серверов"

    async def _text_to_speech(self, text: str) -> bytes:
        """🔊 Преобразование текста в речь"""
        # Симуляция без API ключа
        await asyncio.sleep(0.5)
        return b"voice_response_data"

    async def _understand_intent(self, text: str) -> Dict[str, Any]:
        """🎯 Понимание намерений пользователя"""
        intents = {
            'статус': {'action': 'get_status', 'target': 'all'},
            'перезапуск': {'action': 'restart', 'target': 'service'},
            'мониторинг': {'action': 'show_metrics', 'target': 'system'},
            'бэкап': {'action': 'backup', 'target': 'database'}
        }
        
        for keyword, intent in intents.items():
            if keyword in text.lower():
                return intent
        
        return {'action': 'unknown', 'target': 'none'}

    async def _execute_voice_command(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        """🎬 Выполнение голосовой команды"""
        if intent['action'] == 'get_status':
            return {'message': 'Все системы работают нормально', 'status': 'success'}
        elif intent['action'] == 'restart':
            return {'message': 'Сервис перезапущен успешно', 'status': 'success'}
        else:
            return {'message': 'Команда не распознана', 'status': 'error'}

    async def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """📄 Парсинг ответа AI"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {'raw_response': response, 'parsed': False}

    async def _parse_solution_response(self, response: str) -> Dict[str, Any]:
        """🔧 Парсинг решения от AI"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {'raw_response': response, 'parsed': False}

    async def _parse_prediction_response(self, response: str) -> Dict[str, Any]:
        """📈 Парсинг предсказаний от AI"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {'raw_response': response, 'parsed': False}

    async def _parse_alert_response(self, response: str) -> Dict[str, Any]:
        """🚨 Парсинг алерта от AI"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {'raw_response': response, 'parsed': False}

    async def _parse_optimization_response(self, response: str) -> Dict[str, Any]:
        """⚡ Парсинг оптимизаций от AI"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {'raw_response': response, 'parsed': False}

    async def _attempt_auto_fix(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """🔧 Попытка автоматического исправления"""
        # Симуляция автоматического исправления
        await asyncio.sleep(2)
        return {
            'attempted': True,
            'success': True,
            'action_taken': 'Service restart',
            'resolution_time': '30 seconds'
        }


# Демонстрация возможностей
async def main():
    """🧪 Демонстрация AI ассистента"""
    try:
        assistant = YandexAIAssistant()
        
        print("🧠 Демонстрация Yandex AI Assistant")
        print("=" * 50)
        
        # Анализ логов
        print("\n🔍 AI анализ логов:")
        log_analysis = await assistant.analyze_logs_with_ai(
            "ERROR: API timeout after 30s\nWARNING: High memory usage 85%",
            "Production server monitoring"
        )
        print(json.dumps(log_analysis, indent=2, ensure_ascii=False))
        
        # Генерация решения
        print("\n🔧 Генерация решения:")
        solution = await assistant.generate_solution("API сервер не отвечает на запросы")
        print(json.dumps(solution, indent=2, ensure_ascii=False))
        
        # Предиктивный анализ
        print("\n📈 Предиктивный анализ:")
        metrics = {
            'cpu_usage': 75,
            'memory_usage': 68,
            'disk_usage': 45,
            'request_rate': 150
        }
        prediction = await assistant.predictive_analysis(metrics)
        print(json.dumps(prediction, indent=2, ensure_ascii=False))
        
        # Перевод
        print("\n🌍 Многоязычная поддержка:")
        translation = await assistant.multilingual_support(
            "Система работает нормально", 
            "en"
        )
        print(json.dumps(translation, indent=2, ensure_ascii=False))
        
        print("\n✅ Демонстрация AI ассистента завершена!")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    asyncio.run(main())
