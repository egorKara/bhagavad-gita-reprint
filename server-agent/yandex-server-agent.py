#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
🤖 Yandex Server Agent
Автономный агент для поддержания сервера в отличном состоянии
Версия: 1.0.0
Дата: 26 августа 2025
"""

import json
import os
import sys
import time
import subprocess
import logging
import requests
import schedule
from datetime import datetime, timedelta
from pathlib import Path
import shutil
import psutil

class YandexServerAgent:
    def __init__(self, config_path="agent-config.json"):
        """Инициализация агента"""
        self.config_path = config_path
        self.config = self.load_config()
        self.setup_logging()
        self.last_sync = None
        self.status = "initializing"
        
        self.log_info("🤖 Yandex Server Agent запущен")
        self.log_info(f"Версия: {self.config['agent']['version']}")
        
    def load_config(self):
        """Загрузка конфигурации"""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Ошибка загрузки конфигурации: {e}")
            sys.exit(1)
            
    def setup_logging(self):
        """Настройка логирования"""
        log_dir = os.path.dirname(self.config['logging']['log_file'])
        os.makedirs(log_dir, exist_ok=True)
        
        logging.basicConfig(
            level=getattr(logging, self.config['logging']['level']),
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(self.config['logging']['log_file']),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def log_info(self, message):
        """Логирование информации"""
        self.logger.info(message)
        
    def log_warning(self, message):
        """Логирование предупреждений"""
        self.logger.warning(message)
        
    def log_error(self, message):
        """Логирование ошибок"""
        self.logger.error(message)
        
    def run_command(self, command, timeout=30):
        """Выполнение команды с таймаутом"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True, 
                timeout=timeout
            )
            return result.returncode == 0, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            self.log_error(f"Команда превысила таймаут: {command}")
            return False, "", "Timeout"
        except Exception as e:
            self.log_error(f"Ошибка выполнения команды: {e}")
            return False, "", str(e)
            
    def check_api_availability(self):
        """Проверка доступности API"""
        api_url = self.config['services']['api']['check_url']
        timeout = self.config['monitoring']['alerts']['api_timeout']
        
        try:
            response = requests.get(api_url, timeout=timeout)
            if response.status_code == 200:
                self.log_info("✅ API доступен")
                return True
            else:
                self.log_warning(f"⚠️ API вернул код: {response.status_code}")
                return False
        except Exception as e:
            self.log_error(f"❌ API недоступен: {e}")
            return False
            
    def check_systemd_services(self):
        """Проверка systemd сервисов"""
        services = [
            self.config['services']['api']['name'],
            self.config['services']['nginx']['name']
        ]
        
        all_ok = True
        for service in services:
            success, stdout, stderr = self.run_command(f"systemctl is-active {service}")
            if success and "active" in stdout:
                self.log_info(f"✅ Сервис {service} работает")
            else:
                self.log_error(f"❌ Сервис {service} не работает")
                all_ok = False
                
                # Автоматический перезапуск если включен
                if self.config['automation']['auto_restart_services']:
                    self.restart_service(service)
                    
        return all_ok
        
    def restart_service(self, service_name):
        """Перезапуск сервиса"""
        self.log_info(f"🔄 Перезапуск сервиса {service_name}")
        success, stdout, stderr = self.run_command(f"sudo systemctl restart {service_name}")
        
        if success:
            self.log_info(f"✅ Сервис {service_name} перезапущен")
            # Проверяем что сервис запустился
            time.sleep(5)
            success, stdout, stderr = self.run_command(f"systemctl is-active {service_name}")
            if success:
                self.log_info(f"✅ Сервис {service_name} успешно работает")
            else:
                self.log_error(f"❌ Сервис {service_name} не запустился после перезапуска")
        else:
            self.log_error(f"❌ Ошибка перезапуска сервиса {service_name}: {stderr}")
            
    def check_system_resources(self):
        """Проверка ресурсов системы"""
        alerts = self.config['monitoring']['alerts']
        issues = []
        
        # CPU
        cpu_percent = psutil.cpu_percent(interval=1)
        if cpu_percent > alerts['cpu_threshold']:
            issues.append(f"CPU: {cpu_percent}% (>{alerts['cpu_threshold']}%)")
            self.log_warning(f"⚠️ Высокое использование CPU: {cpu_percent}%")
        else:
            self.log_info(f"✅ CPU: {cpu_percent}%")
            
        # Memory  
        memory = psutil.virtual_memory()
        if memory.percent > alerts['memory_threshold']:
            issues.append(f"RAM: {memory.percent}% (>{alerts['memory_threshold']}%)")
            self.log_warning(f"⚠️ Высокое использование памяти: {memory.percent}%")
        else:
            self.log_info(f"✅ Memory: {memory.percent}%")
            
        # Disk
        disk = psutil.disk_usage('/')
        if disk.percent > alerts['disk_threshold']:
            issues.append(f"Диск: {disk.percent}% (>{alerts['disk_threshold']}%)")
            self.log_warning(f"⚠️ Высокое использование диска: {disk.percent}%")
            
            # Автоматическая очистка логов если включена
            if self.config['automation']['auto_cleanup_logs']:
                self.cleanup_old_logs()
        else:
            self.log_info(f"✅ Disk: {disk.percent}%")
            
        return len(issues) == 0, issues
        
    def cleanup_old_logs(self):
        """Очистка старых логов"""
        self.log_info("🧹 Запуск очистки старых логов")
        
        # Очистка nginx логов старше 30 дней
        success, stdout, stderr = self.run_command(
            "find /var/log/nginx/ -name '*.log.*' -mtime +30 -delete"
        )
        
        # Очистка системных логов
        success, stdout, stderr = self.run_command(
            "journalctl --vacuum-time=30d"
        )
        
        self.log_info("✅ Очистка логов завершена")
        
    def check_ssl_certificates(self):
        """Проверка SSL сертификатов"""
        cert_path = self.config['services']['certbot']['ssl_cert_path'] 
        
        # Проверка срока действия сертификата
        success, stdout, stderr = self.run_command(
            f"openssl x509 -in {cert_path}/cert.pem -noout -dates"
        )
        
        if success and "notAfter" in stdout:
            self.log_info("✅ SSL сертификат действителен")
            
            # Проверяем не истекает ли в ближайшие 7 дней
            success, stdout, stderr = self.run_command(
                f"openssl x509 -in {cert_path}/cert.pem -noout -checkend 604800"
            )
            
            if not success:
                self.log_warning("⚠️ SSL сертификат истекает в течение 7 дней")
                if self.config['automation']['auto_ssl_renewal']:
                    self.renew_ssl_certificate()
            
            return True
        else:
            self.log_error("❌ Проблема с SSL сертификатом")
            return False
            
    def renew_ssl_certificate(self):
        """Обновление SSL сертификата"""
        self.log_info("🔄 Обновление SSL сертификата")
        success, stdout, stderr = self.run_command("sudo certbot renew --quiet")
        
        if success:
            self.log_info("✅ SSL сертификат обновлен")
            # Перезагружаем nginx
            self.run_command("sudo systemctl reload nginx")
        else:
            self.log_error(f"❌ Ошибка обновления SSL: {stderr}")
            
    def sync_with_cursor(self):
        """Синхронизация с Cursor IDE"""
        try:
            cursor_config = self.config['sync']['cursor_ide']
            if not cursor_config['enabled']:
                return
                
            self.log_info("🔄 Синхронизация с Cursor IDE")
            
            # Читаем приоритеты из Cursor
            priority_file = cursor_config['priority_file']
            if os.path.exists(priority_file):
                with open(priority_file, 'r', encoding='utf-8') as f:
                    priorities = f.read()
                    self.log_info("✅ Приоритеты Cursor загружены")
            
            # Обновляем статус синхронизации
            status_file = cursor_config['status_file']
            os.makedirs(os.path.dirname(status_file), exist_ok=True)
            
            with open(status_file, 'a', encoding='utf-8') as f:
                f.write(f"Yandex Server Agent sync at {datetime.now()}\n")
                
            self.last_sync = datetime.now()
            self.log_info("✅ Синхронизация с Cursor завершена")
            
        except Exception as e:
            self.log_error(f"❌ Ошибка синхронизации с Cursor: {e}")
            
    def sync_with_github(self):
        """Синхронизация с GitHub"""
        try:
            github_config = self.config['sync']['github']
            if not github_config['enabled']:
                return
                
            self.log_info("🔄 Синхронизация с GitHub")
            
            # Переходим в директорию проекта
            project_path = self.config['server']['project_path']
            os.chdir(project_path)
            
            # Подтягиваем изменения
            if github_config['auto_pull']:
                success, stdout, stderr = self.run_command("git pull --rebase --autostash")
                if success:
                    self.log_info("✅ GitHub sync завершен")
                else:
                    self.log_error(f"❌ Ошибка git pull: {stderr}")
                    
        except Exception as e:
            self.log_error(f"❌ Ошибка синхронизации с GitHub: {e}")
            
    def emergency_recovery(self):
        """Экстренное восстановление"""
        self.log_info("🚨 Запуск экстренного восстановления")
        
        emergency_script = self.config['sync']['local_agents']['emergency_script']
        script_path = os.path.join(self.config['server']['project_path'], emergency_script)
        
        if os.path.exists(script_path):
            success, stdout, stderr = self.run_command(f"bash {script_path}")
            if success:
                self.log_info("✅ Экстренное восстановление завершено")
            else:
                self.log_error(f"❌ Ошибка экстренного восстановления: {stderr}")
        else:
            self.log_error(f"❌ Скрипт восстановления не найден: {script_path}")
            
    def perform_critical_checks(self):
        """Критические проверки"""
        self.log_info("🔍 Выполнение критических проверок")
        
        issues = []
        
        # API
        if not self.check_api_availability():
            issues.append("API недоступен")
            
        # Сервисы
        if not self.check_systemd_services():
            issues.append("Проблемы с сервисами")
            
        # Ресурсы
        resources_ok, resource_issues = self.check_system_resources()
        if not resources_ok:
            issues.extend(resource_issues)
            
        # SSL
        if not self.check_ssl_certificates():
            issues.append("Проблемы с SSL")
            
        if issues:
            self.log_warning(f"⚠️ Обнаружены проблемы: {', '.join(issues)}")
            if self.config['automation']['emergency_recovery']:
                self.emergency_recovery()
        else:
            self.log_info("✅ Все критические проверки пройдены")
            
        return len(issues) == 0
        
    def generate_status_report(self):
        """Генерация отчета о состоянии"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "agent_status": self.status,
            "last_sync": self.last_sync.isoformat() if self.last_sync else None,
            "system": {
                "cpu": psutil.cpu_percent(interval=1),
                "memory": psutil.virtual_memory().percent,
                "disk": psutil.disk_usage('/').percent
            },
            "services": {},
            "ssl_status": "checking",
            "last_check": datetime.now().isoformat()
        }
        
        # Проверка сервисов
        services = [
            self.config['services']['api']['name'],
            self.config['services']['nginx']['name']
        ]
        
        for service in services:
            success, stdout, stderr = self.run_command(f"systemctl is-active {service}")
            report["services"][service] = "active" if success else "inactive"
            
        return report
        
    def save_status_report(self, report):
        """Сохранение отчета"""
        report_path = os.path.join(
            self.config['server']['project_path'], 
            'logs', 
            'agent-status.json'
        )
        
        os.makedirs(os.path.dirname(report_path), exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
            
    def setup_schedule(self):
        """Настройка расписания"""
        interval = self.config['monitoring']['interval_minutes']
        
        # Основные проверки каждые 15 минут
        schedule.every(interval).minutes.do(self.perform_critical_checks)
        
        # Синхронизация с Cursor каждый час
        schedule.every().hour.do(self.sync_with_cursor)
        
        # Синхронизация с GitHub каждые 30 минут
        schedule.every(30).minutes.do(self.sync_with_github)
        
        # Генерация отчета каждые 5 минут
        schedule.every(5).minutes.do(lambda: self.save_status_report(self.generate_status_report()))
        
        self.log_info(f"✅ Расписание настроено (проверки каждые {interval} минут)")
        
    def run(self):
        """Основной цикл агента"""
        self.status = "running"
        self.setup_schedule()
        
        # Первоначальная проверка
        self.perform_critical_checks()
        self.sync_with_cursor()
        
        self.log_info("🚀 Агент запущен и работает")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Проверяем расписание каждую минуту
                
        except KeyboardInterrupt:
            self.log_info("🛑 Агент остановлен пользователем")
            self.status = "stopped"
        except Exception as e:
            self.log_error(f"❌ Критическая ошибка агента: {e}")
            self.status = "error"

def main():
    """Главная функция"""
    if len(sys.argv) > 1:
        config_path = sys.argv[1]
    else:
        config_path = "agent-config.json"
        
    agent = YandexServerAgent(config_path)
    agent.run()

if __name__ == "__main__":
    main()
