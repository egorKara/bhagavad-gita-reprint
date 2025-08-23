#!/bin/bash

# Система резервного копирования и восстановления для Gita 1972
# Поддерживает локальные и удаленные бэкапы

BACKUP_DIR="/backup"
REMOTE_BACKUP_HOST=""  # Заполнить для удаленных бэкапов
REMOTE_BACKUP_PATH=""  # Путь на удаленном сервере
REMOTE_USER=""         # Пользователь для SSH
PROJECT_DIR="/var/www/gita-1972-reprint"
LOG_FILE="/var/log/backup.log"

# Функция логирования
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Проверка требований
check_requirements() {
    local missing_tools=()
    
    # Проверка необходимых инструментов
    for tool in tar gzip rsync; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        log "Ошибка: Не установлены необходимые инструменты: ${missing_tools[*]}"
        exit 1
    fi
    
    # Создание директории бэкапов
    sudo mkdir -p "$BACKUP_DIR"
    sudo chmod 755 "$BACKUP_DIR"
    
    log "Проверка требований пройдена ✅"
}

# Создание полного бэкапа
create_full_backup() {
    local backup_name="gita-full-$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log "Создание полного бэкапа: $backup_name"
    
    # Создание временной директории
    local temp_dir=$(mktemp -d)
    local backup_temp="$temp_dir/gita-backup"
    mkdir -p "$backup_temp"
    
    # 1. Проект (без node_modules и .git)
    log "Архивирование проекта..."
    rsync -av --exclude='node_modules' --exclude='.git' \
          "$PROJECT_DIR/" "$backup_temp/project/"
    
    # 2. Конфигурации
    log "Сохранение конфигураций..."
    mkdir -p "$backup_temp/configs"
    
    # Nginx конфигурация
    if [ -f "/etc/nginx/sites-available/api.gita-1972-reprint.ru" ]; then
        cp "/etc/nginx/sites-available/api.gita-1972-reprint.ru" \
           "$backup_temp/configs/"
    fi
    
    # Systemd сервис
    if [ -f "/etc/systemd/system/gita-api.service" ]; then
        cp "/etc/systemd/system/gita-api.service" \
           "$backup_temp/configs/"
    fi
    
    # Environment файл
    if [ -f "$PROJECT_DIR/.env" ]; then
        cp "$PROJECT_DIR/.env" "$backup_temp/configs/"
    fi
    
    # 3. База данных (если есть)
    log "Проверка базы данных..."
    if command -v mysqldump &> /dev/null; then
        mkdir -p "$backup_temp/database"
        # Добавить дамп БД если используется
    fi
    
    # 4. SSL сертификаты
    log "Сохранение SSL сертификатов..."
    if [ -d "/etc/letsencrypt" ]; then
        mkdir -p "$backup_temp/ssl"
        sudo cp -r /etc/letsencrypt "$backup_temp/ssl/" 2>/dev/null || true
    fi
    
    # 5. Важные логи (последние 7 дней)
    log "Архивирование логов..."
    mkdir -p "$backup_temp/logs"
    find /var/log/nginx -name "*.log" -mtime -7 -exec cp {} "$backup_temp/logs/" \; 2>/dev/null || true
    journalctl -u gita-api --since "7 days ago" --no-pager > "$backup_temp/logs/gita-api.log" 2>/dev/null || true
    
    # 6. Создание метаданных
    log "Создание метаданных..."
    cat > "$backup_temp/backup_info.txt" << EOF
Backup Information
==================
Date: $(date)
Hostname: $(hostname)
Backup Type: Full
Project Version: $(cd "$PROJECT_DIR" && git rev-parse HEAD 2>/dev/null || echo "Unknown")
System: $(lsb_release -d 2>/dev/null | cut -f2 || uname -a)
Disk Usage: $(df -h / | tail -1)
Services Status:
$(systemctl is-active nginx gita-api 2>/dev/null)
EOF
    
    # 7. Создание архива
    log "Создание итогового архива..."
    cd "$temp_dir"
    tar -czf "$backup_path.tar.gz" gita-backup/
    
    # Проверка целостности
    if tar -tzf "$backup_path.tar.gz" >/dev/null 2>&1; then
        log "✅ Бэкап создан успешно: $backup_path.tar.gz"
        log "Размер: $(du -h "$backup_path.tar.gz" | cut -f1)"
    else
        log "❌ Ошибка создания бэкапа!"
        rm -f "$backup_path.tar.gz"
        return 1
    fi
    
    # Очистка временных файлов
    rm -rf "$temp_dir"
    
    # Создание символической ссылки на последний бэкап
    ln -sf "$backup_path.tar.gz" "$BACKUP_DIR/latest-full.tar.gz"
    
    echo "$backup_path.tar.gz"
}

# Создание инкрементального бэкапа
create_incremental_backup() {
    local backup_name="gita-inc-$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    local reference_file="$BACKUP_DIR/.last_incremental"
    
    log "Создание инкрементального бэкапа: $backup_name"
    
    # Поиск измененных файлов
    local find_opts="-type f"
    if [ -f "$reference_file" ]; then
        local last_backup=$(cat "$reference_file")
        find_opts="$find_opts -newer $last_backup"
        log "Поиск файлов, измененных после: $(date -r "$last_backup")"
    else
        log "Первый инкрементальный бэкап (создание reference файла)"
    fi
    
    # Создание архива измененных файлов
    cd "$PROJECT_DIR"
    find . $find_opts \( -name "node_modules" -prune \) -o \( -name ".git" -prune \) -o -print | \
    tar -czf "$backup_path.tar.gz" -T -
    
    if [ $? -eq 0 ]; then
        log "✅ Инкрементальный бэкап создан: $backup_path.tar.gz"
        log "Размер: $(du -h "$backup_path.tar.gz" | cut -f1)"
        
        # Обновление reference файла
        touch "$reference_file"
        echo "$backup_path.tar.gz" > "$BACKUP_DIR/.last_incremental_list"
    else
        log "❌ Ошибка создания инкрементального бэкапа"
        return 1
    fi
    
    echo "$backup_path.tar.gz"
}

# Список доступных бэкапов
list_backups() {
    log "Список доступных бэкапов:"
    echo ""
    echo "ПОЛНЫЕ БЭКАПЫ:"
    echo "=============="
    
    find "$BACKUP_DIR" -name "gita-full-*.tar.gz" -printf "%T@ %Tc %p\n" | sort -nr | cut -d' ' -f2- | head -10
    
    echo ""
    echo "ИНКРЕМЕНТАЛЬНЫЕ БЭКАПЫ:"
    echo "======================="
    
    find "$BACKUP_DIR" -name "gita-inc-*.tar.gz" -printf "%T@ %Tc %p\n" | sort -nr | cut -d' ' -f2- | head -10
    
    echo ""
    echo "ПОСЛЕДНИЕ БЭКАПЫ:"
    echo "================="
    if [ -L "$BACKUP_DIR/latest-full.tar.gz" ]; then
        echo "Последний полный: $(readlink "$BACKUP_DIR/latest-full.tar.gz")"
    fi
    
    if [ -f "$BACKUP_DIR/.last_incremental_list" ]; then
        echo "Последний инкрементальный: $(cat "$BACKUP_DIR/.last_incremental_list")"
    fi
}

# Восстановление из бэкапа
restore_backup() {
    local backup_file="$1"
    local restore_mode="${2:-safe}"  # safe, force, preview
    
    if [ -z "$backup_file" ]; then
        log "Ошибка: Не указан файл бэкапа"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        log "Ошибка: Файл бэкапа не найден: $backup_file"
        return 1
    fi
    
    log "Восстановление из бэкапа: $backup_file"
    log "Режим: $restore_mode"
    
    # Создание точки восстановления
    if [ "$restore_mode" != "preview" ]; then
        local recovery_point="/tmp/recovery-$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$recovery_point"
        
        # Создание быстрого бэкапа текущего состояния
        log "Создание точки восстановления: $recovery_point"
        tar -czf "$recovery_point/before-restore.tar.gz" -C "$(dirname "$PROJECT_DIR")" "$(basename "$PROJECT_DIR")"
    fi
    
    # Временная директория для извлечения
    local temp_dir=$(mktemp -d)
    
    # Извлечение бэкапа
    log "Извлечение бэкапа..."
    cd "$temp_dir"
    tar -xzf "$backup_file"
    
    if [ ! -d "$temp_dir/gita-backup" ]; then
        log "❌ Неверная структура бэкапа"
        rm -rf "$temp_dir"
        return 1
    fi
    
    # Показ информации о бэкапе
    if [ -f "$temp_dir/gita-backup/backup_info.txt" ]; then
        log "Информация о бэкапе:"
        cat "$temp_dir/gita-backup/backup_info.txt"
        echo ""
    fi
    
    if [ "$restore_mode" = "preview" ]; then
        log "ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР - изменения не применяются"
        log "Содержимое бэкапа:"
        find "$temp_dir/gita-backup" -type f | head -20
        rm -rf "$temp_dir"
        return 0
    fi
    
    # Остановка сервисов
    log "Остановка сервисов..."
    sudo systemctl stop gita-api nginx
    
    # Восстановление проекта
    if [ -d "$temp_dir/gita-backup/project" ]; then
        log "Восстановление файлов проекта..."
        if [ "$restore_mode" = "force" ]; then
            sudo rm -rf "$PROJECT_DIR"
        fi
        sudo mkdir -p "$PROJECT_DIR"
        sudo cp -r "$temp_dir/gita-backup/project/"* "$PROJECT_DIR/"
        sudo chown -R www-data:www-data "$PROJECT_DIR"
    fi
    
    # Восстановление конфигураций
    if [ -d "$temp_dir/gita-backup/configs" ]; then
        log "Восстановление конфигураций..."
        
        # Nginx
        if [ -f "$temp_dir/gita-backup/configs/api.gita-1972-reprint.ru" ]; then
            sudo cp "$temp_dir/gita-backup/configs/api.gita-1972-reprint.ru" \
                   "/etc/nginx/sites-available/"
        fi
        
        # Systemd
        if [ -f "$temp_dir/gita-backup/configs/gita-api.service" ]; then
            sudo cp "$temp_dir/gita-backup/configs/gita-api.service" \
                   "/etc/systemd/system/"
            sudo systemctl daemon-reload
        fi
        
        # Environment
        if [ -f "$temp_dir/gita-backup/configs/.env" ]; then
            sudo cp "$temp_dir/gita-backup/configs/.env" "$PROJECT_DIR/"
            sudo chown www-data:www-data "$PROJECT_DIR/.env"
            sudo chmod 600 "$PROJECT_DIR/.env"
        fi
    fi
    
    # Установка зависимостей
    log "Установка зависимостей..."
    cd "$PROJECT_DIR"
    sudo npm ci --production
    
    # Запуск сервисов
    log "Запуск сервисов..."
    sudo systemctl start nginx gita-api
    
    # Проверка восстановления
    sleep 10
    if curl -s http://localhost:3000/api/status >/dev/null; then
        log "✅ Восстановление выполнено успешно!"
    else
        log "⚠️  Восстановление завершено, но API не отвечает"
    fi
    
    # Очистка
    rm -rf "$temp_dir"
    
    log "Точка восстановления сохранена в: $recovery_point"
}

# Очистка старых бэкапов
cleanup_old_backups() {
    local keep_full=${1:-30}        # Сколько дней хранить полные бэкапы
    local keep_incremental=${2:-7}  # Сколько дней хранить инкрементальные
    
    log "Очистка старых бэкапов (полные: ${keep_full}д, инкрементальные: ${keep_incremental}д)"
    
    # Удаление старых полных бэкапов
    local deleted_full=$(find "$BACKUP_DIR" -name "gita-full-*.tar.gz" -mtime +$keep_full -delete -print | wc -l)
    
    # Удаление старых инкрементальных бэкапов
    local deleted_inc=$(find "$BACKUP_DIR" -name "gita-inc-*.tar.gz" -mtime +$keep_incremental -delete -print | wc -l)
    
    log "Удалено: $deleted_full полных бэкапов, $deleted_inc инкрементальных"
}

# Синхронизация с удаленным сервером
sync_remote() {
    if [ -z "$REMOTE_BACKUP_HOST" ] || [ -z "$REMOTE_BACKUP_PATH" ] || [ -z "$REMOTE_USER" ]; then
        log "Удаленное копирование не настроено"
        return 1
    fi
    
    log "Синхронизация с удаленным сервером: $REMOTE_USER@$REMOTE_BACKUP_HOST"
    
    # Создание директории на удаленном сервере
    ssh "$REMOTE_USER@$REMOTE_BACKUP_HOST" "mkdir -p $REMOTE_BACKUP_PATH"
    
    # Синхронизация бэкапов
    rsync -avz --progress "$BACKUP_DIR/" "$REMOTE_USER@$REMOTE_BACKUP_HOST:$REMOTE_BACKUP_PATH/"
    
    if [ $? -eq 0 ]; then
        log "✅ Синхронизация с удаленным сервером завершена"
    else
        log "❌ Ошибка синхронизации с удаленным сервером"
        return 1
    fi
}

# Проверка целостности бэкапов
verify_backups() {
    log "Проверка целостности бэкапов..."
    
    local corrupted=0
    local total=0
    
    for backup in "$BACKUP_DIR"/gita-*.tar.gz; do
        if [ -f "$backup" ]; then
            ((total++))
            if ! tar -tzf "$backup" >/dev/null 2>&1; then
                log "❌ Поврежден: $backup"
                ((corrupted++))
            fi
        fi
    done
    
    log "Проверено: $total бэкапов, повреждено: $corrupted"
    
    if [ $corrupted -gt 0 ]; then
        return 1
    fi
    
    return 0
}

# Главная функция
main() {
    case "${1:-help}" in
        "full")
            check_requirements
            create_full_backup
            ;;
        "incremental"|"inc")
            check_requirements
            create_incremental_backup
            ;;
        "list")
            list_backups
            ;;
        "restore")
            if [ -z "$2" ]; then
                echo "Использование: $0 restore <backup_file> [safe|force|preview]"
                exit 1
            fi
            restore_backup "$2" "$3"
            ;;
        "cleanup")
            cleanup_old_backups "$2" "$3"
            ;;
        "sync")
            sync_remote
            ;;
        "verify")
            verify_backups
            ;;
        "auto")
            # Автоматический режим: полный бэкап + очистка + синхронизация
            check_requirements
            backup_file=$(create_full_backup)
            cleanup_old_backups
            if [ -n "$REMOTE_BACKUP_HOST" ]; then
                sync_remote
            fi
            verify_backups
            ;;
        *)
            echo "Система резервного копирования Gita 1972"
            echo "========================================="
            echo ""
            echo "Использование: $0 <команда> [опции]"
            echo ""
            echo "Команды:"
            echo "  full                    - Создать полный бэкап"
            echo "  incremental|inc         - Создать инкрементальный бэкап"
            echo "  list                    - Показать список бэкапов"
            echo "  restore <file> [mode]   - Восстановить из бэкапа"
            echo "                            mode: safe|force|preview"
            echo "  cleanup [days_full] [days_inc] - Очистить старые бэкапы"
            echo "  sync                    - Синхронизация с удаленным сервером"
            echo "  verify                  - Проверить целостность бэкапов"
            echo "  auto                    - Автоматический режим (full+cleanup+sync)"
            echo ""
            echo "Примеры:"
            echo "  $0 full                                    # Полный бэкап"
            echo "  $0 restore /backup/gita-full-20241201.tar.gz preview"
            echo "  $0 cleanup 30 7                           # Хранить 30д полные, 7д инкр."
            ;;
    esac
}

# Запуск основной функции
main "$@"
