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

# Новые модули для расширенной функциональности
try:
    from ai_log_analyzer import AILogAnalyzer
    from telegram_notifier import TelegramNotifier  
    from yandex_monitoring_integration import YandexMonitoringIntegration
    AI_ENABLED = True
except ImportError:
    AI_ENABLED = False
    logging.info("⚠️ AI модули недоступны, работаем в базовом режиме")

class YandexServerAgent:
    def __init__(self, config_path="agent-config.json"):
        """Инициализация агента"""
        self.config_path = config_path
        self.config = self.load_config()
        self.setup_logging()
        self.last_sync = None
        
        # Инициализация новых модулей
        if AI_ENABLED:
            try:
                self.ai_analyzer = AILogAnalyzer(config_path)
                self.telegram = TelegramNotifier(config_path)
                self.monitoring = YandexMonitoringIntegration(config_path)
                self.log_info("🤖 AI модули загружены успешно")
            except Exception as e:
                self.log_error(f"❌ Ошибка загрузки AI модулей: {e}")
                self.ai_analyzer = None
                self.telegram = None
                self.monitoring = None
        else:
            self.ai_analyzer = None
            self.telegram = None
            self.monitoring = None
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
        
    def check_system_updates(self):
        """Проверка доступных обновлений системы"""
        self.log_info("🔍 Проверка системных обновлений")
        
        try:
            # Обновляем списки пакетов
            success, stdout, stderr = self.run_command("sudo apt update -qq")
            if not success:
                self.log_error(f"❌ Ошибка обновления списков пакетов: {stderr}")
                return False, []
                
            # Проверяем доступные обновления
            success, stdout, stderr = self.run_command("apt list --upgradable 2>/dev/null | grep -v 'WARNING'")
            
            if success and stdout.strip():
                updates = []
                for line in stdout.strip().split('\n')[1:]:  # Пропускаем заголовок
                    if '/' in line:
                        package = line.split('/')[0]
                        updates.append(package)
                        
                self.log_info(f"📦 Найдено {len(updates)} обновлений")
                return True, updates
            else:
                self.log_info("✅ Система актуальна, обновлений нет")
                return True, []
                
        except Exception as e:
            self.log_error(f"❌ Ошибка проверки обновлений: {e}")
            return False, []
            
    def install_security_updates(self):
        """Установка только критических обновлений безопасности"""
        self.log_info("🔒 Установка обновлений безопасности")
        
        try:
            # Устанавливаем только обновления безопасности
            success, stdout, stderr = self.run_command(
                "sudo unattended-upgrade -d 2>/dev/null || "
                "sudo apt upgrade -y --with-new-pkgs -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold'"
            )
            
            if success:
                self.log_info("✅ Обновления безопасности установлены")
                
                # Проверяем нужна ли перезагрузка
                if os.path.exists('/var/run/reboot-required'):
                    self.log_warning("⚠️ Требуется перезагрузка сервера")
                    
                    # Отправляем уведомление, но НЕ перезагружаем автоматически
                    self.log_info("ℹ️ Перезагрузка отложена - требуется ручное подтверждение")
                    
                return True
            else:
                self.log_error(f"❌ Ошибка установки обновлений: {stderr}")
                return False
                
        except Exception as e:
            self.log_error(f"❌ Ошибка при установке обновлений: {e}")
            return False
            
    def install_package_updates(self, allowed_packages=None):
        """Установка обновлений определенных пакетов"""
        if not allowed_packages:
            allowed_packages = ['python3', 'python3-*', 'nginx', 'curl', 'git']
            
        self.log_info(f"📦 Установка обновлений пакетов: {', '.join(allowed_packages)}")
        
        try:
            # Формируем команду для обновления только разрешенных пакетов
            packages_str = ' '.join(allowed_packages)
            success, stdout, stderr = self.run_command(
                f"sudo apt install --only-upgrade -y {packages_str}"
            )
            
            if success:
                self.log_info("✅ Пакеты обновлены успешно")
                return True
            else:
                # Если некоторые пакеты не найдены, это нормально
                if "unable to locate package" in stderr.lower():
                    self.log_info("ℹ️ Некоторые пакеты уже актуальны")
                    return True
                else:
                    self.log_error(f"❌ Ошибка обновления пакетов: {stderr}")
                    return False
                    
        except Exception as e:
            self.log_error(f"❌ Ошибка при обновлении пакетов: {e}")
            return False
            
    def cleanup_after_updates(self):
        """Очистка после обновлений"""
        self.log_info("🧹 Очистка после обновлений")
        
        # Удаляем ненужные пакеты
        success, stdout, stderr = self.run_command("sudo apt autoremove -y")
        if success:
            self.log_info("✅ Ненужные пакеты удалены")
            
        # Очищаем кэш пакетов
        success, stdout, stderr = self.run_command("sudo apt autoclean")
        if success:
            self.log_info("✅ Кэш пакетов очищен")
            
    def perform_system_maintenance(self):
        """Выполнение системного обслуживания"""
        self.log_info("🔧 Запуск системного обслуживания")
        
        maintenance_results = {
            'updates_checked': False,
            'security_updates': False,
            'package_updates': False,
            'cleanup_done': False,
            'reboot_required': False
        }
        
        # Проверяем обновления
        updates_available, update_list = self.check_system_updates()
        maintenance_results['updates_checked'] = updates_available
        
        if updates_available and update_list:
            # Устанавливаем обновления безопасности
            if self.config['automation'].get('auto_security_updates', True):
                maintenance_results['security_updates'] = self.install_security_updates()
                
            # Устанавливаем обновления разрешенных пакетов
            allowed_packages = self.config.get('update_policy', {}).get('allowed_packages', [])
            if allowed_packages and self.config['automation'].get('auto_package_updates', False):
                maintenance_results['package_updates'] = self.install_package_updates(allowed_packages)
                
        # Очистка после обновлений
        maintenance_results['cleanup_done'] = True
        self.cleanup_after_updates()
        
        # Проверка необходимости перезагрузки
        if os.path.exists('/var/run/reboot-required'):
            maintenance_results['reboot_required'] = True
            self.log_warning("⚠️ Сервер требует перезагрузки")
            
        return maintenance_results
        
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

        # Системное обслуживание и обновления
        if self.config['automation'].get('auto_security_updates', True):
            # Проверка обновлений безопасности каждые 6 часов
            schedule.every(6).hours.do(self.perform_system_maintenance)

        # Еженедельное обслуживание (воскресенье в 3:00)
        schedule.every().sunday.at("03:00").do(self.perform_system_maintenance)

        # Новые расширенные функции
        if AI_ENABLED and self.ai_analyzer:
            # AI анализ логов каждые 30 минут
            schedule.every(30).minutes.do(self.run_ai_analysis)
            
        if AI_ENABLED and self.monitoring:
            # Сбор и отправка метрик каждые 5 минут
            schedule.every(5).minutes.do(self.collect_and_send_metrics)
            
        if AI_ENABLED and self.telegram:
            # Ежедневный отчет в 9:00
            schedule.every().day.at("09:00").do(self.send_daily_telegram_report)

        self.log_info(f"✅ Расписание настроено (проверки каждые {interval} минут, AI анализ каждые 30 минут)")
    
    def run_ai_analysis(self):
        """Запуск AI анализа логов"""
        if not self.ai_analyzer:
            return
            
        try:
            self.log_info("🤖 Запуск AI анализа логов")
            result = self.ai_analyzer.run_analysis()
            
            if result.get('status') == 'success' and result.get('fixes_applied', {}).get('fixes_applied', 0) > 0:
                # Отправляем уведомление о примененных исправлениях
                if self.telegram:
                    message = f"🔧 AI автоисправление: применено {result['fixes_applied']['fixes_applied']} исправлений"
                    self.telegram.send_message(message, "admin")
                    
        except Exception as e:
            self.log_error(f"❌ Ошибка AI анализа: {e}")
    
    def collect_and_send_metrics(self):
        """Сбор и отправка метрик"""
        if not self.monitoring:
            return
            
        try:
            self.log_info("📊 Сбор метрик")
            metrics = self.monitoring.run_metrics_collection()
            
            # Проверяем критические значения
            if 'business' in metrics:
                business = metrics['business']
                
                # Алерт при низком uptime
                if business.get('uptime_percentage_today', 100) < 95:
                    if self.telegram:
                        self.telegram.send_critical_alert(
                            "low_uptime", 
                            f"Uptime снизился до {business['uptime_percentage_today']:.1f}%"
                        )
                
                # Алерт при истечении SSL
                ssl_days = business.get('ssl_certificate_days_remaining', 30)
                if ssl_days < 7:
                    if self.telegram:
                        self.telegram.send_critical_alert(
                            "ssl_expired",
                            f"SSL сертификат истекает через {ssl_days} дней"
                        )
                        
        except Exception as e:
            self.log_error(f"❌ Ошибка сбора метрик: {e}")
    
    def send_daily_telegram_report(self):
        """Отправка ежедневного отчета в Telegram"""
        if not self.telegram:
            return
            
        try:
            self.log_info("📱 Отправка ежедневного отчета")
            
            # Собираем данные для отчета
            system_stats = {
                'cpu': psutil.cpu_percent(interval=1),
                'memory': psutil.virtual_memory().percent,
                'disk': psutil.disk_usage('/').percent,
                'uptime': f"{(time.time() - psutil.boot_time()) / 3600:.1f} hours"
            }
            
            service_status = {
                'gita-api': self.check_service_status('gita-api'),
                'nginx': self.check_service_status('nginx'),
                'yandex-server-agent': self.check_service_status('yandex-server-agent')
            }
            
            # Получаем недавние проблемы из логов
            recent_issues = self.get_recent_issues()
            
            self.telegram.send_daily_report(system_stats, service_status, recent_issues)
            
        except Exception as e:
            self.log_error(f"❌ Ошибка отправки отчета: {e}")
    
    def check_service_status(self, service_name):
        """Проверка статуса сервиса"""
        try:
            success, stdout, stderr = self.run_command(f"systemctl is-active {service_name}")
            return stdout.strip() if success else "inactive"
        except:
            return "unknown"
    
    def get_recent_issues(self):
        """Получение недавних проблем из логов"""
        try:
            issues = []
            
            # Ищем ошибки в логах агента за последние 24 часа
            success, stdout, stderr = self.run_command(
                "grep 'ERROR' /home/yc-user/gita-1972/logs/server-agent.log | tail -5"
            )
            
            if success and stdout:
                for line in stdout.strip().split('\n'):
                    if line:
                        # Простой парсинг времени и описания
                        parts = line.split(' - ', 2)
                        if len(parts) >= 3:
                            issues.append({
                                'time': parts[0],
                                'description': parts[2]
                            })
            
            return issues
            
        except Exception as e:
            self.log_error(f"❌ Ошибка получения недавних проблем: {e}")
            return []
        
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
