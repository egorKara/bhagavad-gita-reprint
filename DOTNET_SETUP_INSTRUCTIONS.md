# 🚀 ИНСТРУКЦИИ ПО НАСТРОЙКЕ .NET

## 📋 ПРЕДВАРИТЕЛЬНЫЕ ТРЕБОВАНИЯ

### 🖥️ Локальная разработка
- **.NET 8.0 SDK** - [Скачать](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Visual Studio Code** или **Visual Studio 2022**
- **PostgreSQL** (для production) или **SQLite** (для development)

### 🖥️ Сервер (Yandex Cloud)
- **Ubuntu 22.04 LTS**
- **.NET 8.0 Runtime** (для production)
- **PostgreSQL** база данных
- **Nginx** веб-сервер

---

## 🛠️ УСТАНОВКА .NET SDK (Локально)

### Windows
```bash
# Скачать и установить .NET 8.0 SDK
# https://dotnet.microsoft.com/download/dotnet/8.0

# Проверить установку
dotnet --version
# Ожидаемый результат: 8.0.x
```

### macOS
```bash
# Установить через Homebrew
brew install dotnet

# Проверить установку
dotnet --version
```

### Linux (Ubuntu/Debian)
```bash
# Добавить репозиторий Microsoft
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Установить .NET SDK
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0

# Проверить установку
dotnet --version
```

---

## 🚀 ЗАПУСК .NET ПРОЕКТОВ

### 1. Восстановление зависимостей
```bash
# В корневой директории проекта
dotnet restore

# Или в конкретном проекте
cd GitaLanding.API
dotnet restore
```

### 2. Сборка проектов
```bash
# Собрать все проекты
dotnet build

# Собрать конкретный проект
cd GitaLanding.API
dotnet build
```

### 3. Запуск API
```bash
# Запустить API локально
cd GitaLanding.API
dotnet run

# API будет доступен по адресу: https://localhost:5001
# Swagger UI: https://localhost:5001/swagger
```

---

## 🗄️ НАСТРОЙКА БАЗЫ ДАННЫХ

### PostgreSQL (Production)
```bash
# Установить PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Создать базу данных
sudo -u postgres psql
CREATE DATABASE gita_landing;
CREATE USER gita_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gita_landing TO gita_user;
\q
```

### SQLite (Development)
```bash
# SQLite встроен в .NET, дополнительная установка не требуется
# База данных будет создана автоматически при первом запуске
```

---

## 🔧 КОНФИГУРАЦИЯ

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=gita_landing;Username=gita_user;Password=your_password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### appsettings.Development.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=gita_landing.db"
  }
}
```

---

## 🚀 ЗАПУСК НА СЕРВЕРЕ

### 1. Установка .NET Runtime
```bash
# Подключиться к серверу
ssh yc-user@your-server-ip

# Установить .NET Runtime
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt-get update
sudo apt-get install -y dotnet-runtime-8.0
```

### 2. Развертывание приложения
```bash
# Создать директорию для приложения
sudo mkdir -p /var/www/gita-landing
sudo chown yc-user:yc-user /var/www/gita-landing

# Скопировать файлы приложения
cp -r GitaLanding.API/* /var/www/gita-landing/

# Запустить приложение
cd /var/www/gita-landing
dotnet GitaLanding.API.dll --urls "http://localhost:5000"
```

### 3. Настройка Nginx
```nginx
server {
    listen 80;
    server_name api.gita-1972-reprint.ru;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 ПРОВЕРКА РАБОТОСПОСОБНОСТИ

### Локально
```bash
# Проверить API
curl https://localhost:5001/health

# Проверить Swagger
open https://localhost:5001/swagger
```

### На сервере
```bash
# Проверить API
curl http://localhost:5000/health

# Проверить через Nginx
curl https://api.gita-1972-reprint.ru/health
```

---

## 🚨 УСТРАНЕНИЕ ПРОБЛЕМ

### Ошибка "dotnet: command not found"
```bash
# Установить .NET SDK
# См. раздел "Установка .NET SDK"
```

### Ошибка подключения к базе данных
```bash
# Проверить строку подключения в appsettings.json
# Проверить доступность PostgreSQL
# Проверить права доступа пользователя
```

### Ошибка "Port already in use"
```bash
# Изменить порт в appsettings.json
# Или остановить процесс, использующий порт
sudo lsof -i :5000
sudo kill -9 <PID>
```

---

## 📚 ПОЛЕЗНЫЕ КОМАНДЫ

```bash
# Создать миграцию
dotnet ef migrations add InitialCreate

# Обновить базу данных
dotnet ef database update

# Удалить последнюю миграцию
dotnet ef migrations remove

# Создать скрипт SQL
dotnet ef migrations script

# Очистить кэш
dotnet clean
dotnet restore
```

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

1. **Установить .NET SDK** локально
2. **Запустить проекты** локально
3. **Протестировать API** endpoints
4. **Настроить базу данных**
5. **Развернуть на сервере**

---

**Готов к настройке .NET?** 🚀