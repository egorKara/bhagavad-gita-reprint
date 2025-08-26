# 🔐 Настройка Secrets для Background Agents

## 📋 Обзор

Этот документ описывает настройку секретных данных для Cursor Background Agents в проекте Бхагавад-Гита 1972.

## 🎯 Что настроено

### **1. Основные секреты:**
- **GitHub Token** - для интеграции с GitHub API
- **Database Password** - пароль для PostgreSQL
- **JWT Secret** - ключ для JWT токенов
- **Yandex API Key** - ключ для Yandex.Cloud
- **Email Password** - пароль для SMTP
- **PostgreSQL Connection** - строка подключения к БД
- **API Secret Key** - секретный ключ для API
- **Monitoring Token** - токен для Prometheus

### **2. Runtime конфигурация:**
- **Environment** - среда разработки
- **Port** - порт для API (3000)
- **Node Environment** - переменная NODE_ENV
- **Log Level** - уровень логирования
- **CORS Origin** - разрешенные источники
- **Rate Limit** - ограничение запросов
- **Session Secret** - секрет для сессий

## 🔧 Как настроить

### **Шаг 1: Скопируйте пример**
```bash
cp .cursor/environment.example.json .cursor/environment.json
```

### **Шаг 2: Заполните реальные значения**
Замените placeholder'ы на реальные значения:

```json
{
    "secrets": {
        "github_token": "ghp_xxxxxxxxxxxxxxxxxxxx",
        "database_password": "your_real_password",
        "jwt_secret": "your_real_jwt_secret"
    }
}
```

### **Шаг 3: Проверьте права доступа**
```bash
chmod 600 .cursor/environment.json
```

## 🚨 Безопасность

### **Что НЕ делать:**
- ❌ НЕ коммитьте `environment.json` в Git
- ❌ НЕ используйте слабые пароли
- ❌ НЕ передавайте секреты в чатах
- ❌ НЕ храните секреты в открытом виде

### **Что делать:**
- ✅ Используйте `.gitignore` для защиты
- ✅ Регулярно обновляйте токены
- ✅ Используйте сильные пароли
- ✅ Ограничивайте доступ к файлу

## 📁 Структура файлов

```
.cursor/
├── environment.json          # Реальные секреты (НЕ коммитить!)
├── environment.example.json  # Пример (можно коммитить)
└── backup-*/                # Резервные копии
```

## 🔄 Обновление секретов

### **GitHub Token:**
1. Перейдите в GitHub Settings → Developer settings → Personal access tokens
2. Создайте новый токен
3. Обновите в `environment.json`

### **Database Password:**
1. Измените пароль в PostgreSQL
2. Обновите в `environment.json`
3. Перезапустите приложение

### **JWT Secret:**
1. Сгенерируйте новый секрет
2. Обновите в `environment.json`
3. Перезапустите приложение

## 📞 Поддержка

При проблемах с секретами:
1. Проверьте права доступа к файлу
2. Убедитесь что файл не в Git
3. Проверьте синтаксис JSON
4. Обратитесь к команде разработки

## ✅ Чек-лист настройки

- [ ] Скопирован `environment.example.json`
- [ ] Заполнены все секреты
- [ ] Установлены правильные права доступа
- [ ] Файл добавлен в `.gitignore`
- [ ] Проверена работа Background Agents
- [ ] Созданы резервные копии
