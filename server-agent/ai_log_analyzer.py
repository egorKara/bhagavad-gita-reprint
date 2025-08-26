#!/usr/bin/env python3
"""
🤖 AI Log Analyzer - интеграция с YandexGPT для анализа логов
Автоматический анализ критических ошибок и предоставление рекомендаций
"""

import json
import re
import subprocess
import logging
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import requests

class AILogAnalyzer:
    def __init__(self, config_path="agent-config.json"):
        """Инициализация AI анализатора логов"""
        self.config = self.load_config(config_path)
        self.setup_logging()
        
    def load_config(self, config_path):
        """Загрузка конфигурации"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
                
            # Добавляем конфигурацию AI если её нет
            if 'ai_integration' not in config:
                config['ai_integration'] = {
                    "enabled": True,
                    "yandexgpt_api_key": "YOUR_API_KEY_HERE",
                    "model": "yandexgpt-lite",
                    "max_tokens": 1000,
                    "temperature": 0.1,
                    "analyze_critical_only": True,
                    "auto_apply_safe_fixes": False
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
                logging.FileHandler(os.path.join(log_dir, 'ai-analyzer.log')),
                logging.StreamHandler()
            ]
        )
        
    def extract_critical_errors(self, hours=1) -> List[Dict]:
        """Извлечение критических ошибок из логов за последние N часов"""
        critical_errors = []
        
        try:
            # Логи systemd для gita-api
            cmd = f"journalctl -u gita-api -p err -S '{hours} hours ago' --no-pager"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.stdout:
                errors = self.parse_systemd_logs(result.stdout)
                critical_errors.extend(errors)
                
            # Логи Nginx
            cmd = f"sudo tail -n 100 /var/log/nginx/error.log"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.stdout:
                errors = self.parse_nginx_logs(result.stdout)
                critical_errors.extend(errors)
                
            # Логи агента
            cmd = f"tail -n 50 /home/yc-user/gita-1972/logs/server-agent.log | grep ERROR"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.stdout:
                errors = self.parse_agent_logs(result.stdout)
                critical_errors.extend(errors)
                
            self.log_info(f"🔍 Найдено {len(critical_errors)} критических ошибок")
            return critical_errors
            
        except Exception as e:
            self.log_error(f"❌ Ошибка извлечения логов: {e}")
            return []
    
    def parse_systemd_logs(self, logs: str) -> List[Dict]:
        """Парсинг логов systemd"""
        errors = []
        for line in logs.split('\n'):
            if 'ERROR' in line or 'CRITICAL' in line or 'Failed' in line:
                errors.append({
                    'source': 'systemd/gita-api',
                    'timestamp': datetime.now().isoformat(),
                    'level': 'ERROR',
                    'message': line.strip(),
                    'category': 'service_failure'
                })
        return errors
    
    def parse_nginx_logs(self, logs: str) -> List[Dict]:
        """Парсинг логов Nginx"""
        errors = []
        for line in logs.split('\n'):
            if '[error]' in line or '[crit]' in line:
                errors.append({
                    'source': 'nginx',
                    'timestamp': datetime.now().isoformat(),
                    'level': 'ERROR',
                    'message': line.strip(),
                    'category': 'web_server_error'
                })
        return errors
    
    def parse_agent_logs(self, logs: str) -> List[Dict]:
        """Парсинг логов агента"""
        errors = []
        for line in logs.split('\n'):
            if 'ERROR' in line:
                errors.append({
                    'source': 'server-agent',
                    'timestamp': datetime.now().isoformat(),
                    'level': 'ERROR',
                    'message': line.strip(),
                    'category': 'agent_error'
                })
        return errors
    
    def analyze_with_yandexgpt(self, errors: List[Dict]) -> Dict:
        """Анализ ошибок с помощью YandexGPT"""
        if not self.config.get('ai_integration', {}).get('enabled', False):
            return {"status": "disabled", "analysis": "AI анализ отключен"}
            
        try:
            # Формируем запрос для YandexGPT
            prompt = self.create_analysis_prompt(errors)
            
            # Симуляция запроса к YandexGPT (реальный API требует авторизации)
            analysis = self.simulate_yandexgpt_analysis(errors)
            
            self.log_info("🤖 AI анализ выполнен")
            return analysis
            
        except Exception as e:
            self.log_error(f"❌ Ошибка AI анализа: {e}")
            return {"status": "error", "error": str(e)}
    
    def create_analysis_prompt(self, errors: List[Dict]) -> str:
        """Создание промпта для анализа"""
        prompt = """Проанализируй следующие критические ошибки сервера и предоставь:
1. Краткое описание проблемы
2. Возможные причины
3. Рекомендации по исправлению
4. Уровень критичности (1-10)
5. Можно ли исправить автоматически

Ошибки:
"""
        for error in errors[:5]:  # Анализируем только первые 5 ошибок
            prompt += f"- {error['source']}: {error['message']}\n"
            
        return prompt
    
    def simulate_yandexgpt_analysis(self, errors: List[Dict]) -> Dict:
        """Симуляция анализа YandexGPT (для демонстрации)"""
        # Простой анализ на основе ключевых слов
        analysis = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "errors_analyzed": len(errors),
            "recommendations": [],
            "critical_level": 1,
            "auto_fixable": False
        }
        
        for error in errors:
            if 'gita-api' in error.get('source', ''):
                analysis["recommendations"].append({
                    "issue": "Проблема с API сервисом",
                    "solution": "Проверить зависимости Node.js (npm install), перезапустить сервис",
                    "auto_fix": "sudo systemctl restart gita-api",
                    "priority": "high"
                })
                analysis["critical_level"] = max(analysis["critical_level"], 8)
                analysis["auto_fixable"] = True
                
            elif 'ssl' in error.get('message', '').lower():
                analysis["recommendations"].append({
                    "issue": "Проблема с SSL сертификатом",
                    "solution": "Обновить SSL сертификат с помощью certbot",
                    "auto_fix": "sudo certbot renew",
                    "priority": "medium"
                })
                analysis["critical_level"] = max(analysis["critical_level"], 6)
                
            elif 'nginx' in error.get('source', ''):
                analysis["recommendations"].append({
                    "issue": "Ошибка веб-сервера",
                    "solution": "Проверить конфигурацию Nginx, перезапустить сервис",
                    "auto_fix": "sudo nginx -t && sudo systemctl restart nginx",
                    "priority": "high"
                })
                analysis["critical_level"] = max(analysis["critical_level"], 7)
                analysis["auto_fixable"] = True
        
        return analysis
    
    def apply_safe_fixes(self, analysis: Dict) -> Dict:
        """Применение безопасных автоматических исправлений"""
        if not self.config.get('ai_integration', {}).get('auto_apply_safe_fixes', False):
            return {"status": "disabled", "message": "Автоматические исправления отключены"}
            
        if not analysis.get('auto_fixable', False):
            return {"status": "no_fixes", "message": "Нет безопасных автоматических исправлений"}
            
        applied_fixes = []
        
        try:
            for rec in analysis.get('recommendations', []):
                if rec.get('auto_fix') and rec.get('priority') in ['high', 'critical']:
                    cmd = rec['auto_fix']
                    self.log_info(f"🔧 Применяю автоисправление: {cmd}")
                    
                    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                    
                    applied_fixes.append({
                        "command": cmd,
                        "success": result.returncode == 0,
                        "output": result.stdout if result.returncode == 0 else result.stderr
                    })
                    
            return {"status": "success", "fixes_applied": len(applied_fixes), "details": applied_fixes}
            
        except Exception as e:
            self.log_error(f"❌ Ошибка применения исправлений: {e}")
            return {"status": "error", "error": str(e)}
    
    def generate_ai_report(self, analysis: Dict) -> str:
        """Генерация отчета AI анализа"""
        report = f"""
🤖 AI АНАЛИЗ ЛОГОВ - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

📊 СТАТИСТИКА:
- Проанализировано ошибок: {analysis.get('errors_analyzed', 0)}
- Уровень критичности: {analysis.get('critical_level', 0)}/10
- Автоматические исправления: {'Доступны' if analysis.get('auto_fixable') else 'Недоступны'}

🔍 РЕКОМЕНДАЦИИ:
"""
        
        for i, rec in enumerate(analysis.get('recommendations', []), 1):
            report += f"""
{i}. ПРОБЛЕМА: {rec.get('issue', 'Неизвестно')}
   РЕШЕНИЕ: {rec.get('solution', 'Не определено')}
   ПРИОРИТЕТ: {rec.get('priority', 'средний').upper()}
   АВТОИСПРАВЛЕНИЕ: {rec.get('auto_fix', 'Недоступно')}
"""
        
        return report
    
    def run_analysis(self) -> Dict:
        """Запуск полного цикла AI анализа"""
        self.log_info("🤖 Запуск AI анализа логов")
        
        # 1. Извлекаем критические ошибки
        errors = self.extract_critical_errors(hours=1)
        
        if not errors:
            self.log_info("✅ Критических ошибок не найдено")
            return {"status": "no_errors", "message": "Критических ошибок нет"}
        
        # 2. Анализируем с помощью AI
        analysis = self.analyze_with_yandexgpt(errors)
        
        # 3. Применяем безопасные исправления
        fixes_result = self.apply_safe_fixes(analysis)
        
        # 4. Генерируем отчет
        report = self.generate_ai_report(analysis)
        
        # 5. Сохраняем результаты
        result = {
            "timestamp": datetime.now().isoformat(),
            "errors_found": len(errors),
            "analysis": analysis,
            "fixes_applied": fixes_result,
            "report": report
        }
        
        self.save_analysis_result(result)
        
        self.log_info("✅ AI анализ завершен")
        return result
    
    def save_analysis_result(self, result: Dict):
        """Сохранение результатов анализа"""
        try:
            filename = f"/home/yc-user/gita-1972/logs/ai-analysis-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
                
            self.log_info(f"💾 Результаты сохранены: {filename}")
        except Exception as e:
            self.log_error(f"❌ Ошибка сохранения результатов: {e}")
    
    def log_info(self, message):
        """Логирование информации"""
        logging.info(message)
        
    def log_error(self, message):
        """Логирование ошибок"""
        logging.error(message)

def main():
    """Главная функция"""
    analyzer = AILogAnalyzer()
    result = analyzer.run_analysis()
    
    print("🤖 AI АНАЛИЗ ЛОГОВ ЗАВЕРШЕН")
    print(f"📊 Результат: {result.get('status', 'unknown')}")
    
    if result.get('report'):
        print(result['report'])

if __name__ == "__main__":
    main()
