# Gita 1972 Landing Page

Современная архитектура landing page для проекта "Бхагавад-Гита как она есть" 1972 года.

## 🏗️ Архитектура проекта

### Backend (C# + ASP.NET Core)
```
GitaLanding.API/          # Web API проект
GitaLanding.Core/         # Бизнес-логика и доменная модель
GitaLanding.Data/         # Доступ к данным и репозитории
GitaLanding.Tests/        # Unit и integration тесты
```

### Frontend (TypeScript + CSS Grid)
```
frontend/
├── src/
│   ├── components/       # ООП компоненты
│   ├── services/         # Сервисы для API
│   └── utils/            # Утилиты
├── dist/                 # Скомпилированные файлы
└── assets/               # Статические ресурсы
```

## 🚀 Технологический стек

- **Backend**: C# 12, ASP.NET Core 8, Entity Framework Core
- **Frontend**: TypeScript 5, CSS Grid, Vanilla JavaScript
- **База данных**: SQLite (для разработки)
- **Архитектура**: Clean Architecture, Repository Pattern
- **Тестирование**: xUnit, Moq

## 📋 Требования

- .NET 8.0 SDK
- Node.js 18+
- TypeScript 5.0+

## 🛠️ Установка и запуск

### Backend
```bash
# Восстановление зависимостей
dotnet restore

# Запуск API
cd GitaLanding.API
dotnet run

# API будет доступен по адресу: http://localhost:5000
```

### Frontend
```bash
# Установка зависимостей
cd frontend
npm install

# Компиляция TypeScript
npm run build

# Запуск локального сервера
npm run serve

# Frontend будет доступен по адресу: http://localhost:3000
```

## 🎯 Основные функции

1. **Landing Page**: Три экрана с адаптивным дизайном
2. **Слайдер книг**: 13 изображений с комментариями
3. **Многоязычность**: Русский и английский языки
4. **API**: RESTful API для управления заказами
5. **Админ панель**: Управление контентом и заказами

## 🎨 Дизайн

- **Стиль**: Минималистичный современный
- **Цвета**: Чёрный текст, белый фон, золотой акцент
- **Адаптивность**: Mobile-first подход
- **Доступность**: WCAG AA стандарт

## 📱 Адаптивность

- **Десктоп**: Приоритет (от 800px+)
- **Планшет**: Автоматическая адаптация
- **Мобильные**: Вертикальная компоновка, свайпы

## 🔧 Разработка

### Структура C# проектов
```csharp
// Доменная модель
public class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public int PublicationYear { get; set; }
}

// Сервисный слой
public interface IBookService
{
    Task<IEnumerable<Book>> GetAllBooksAsync();
    Task<Book?> GetBookByIdAsync(Guid id);
}
```

### TypeScript компоненты
```typescript
// Базовый класс компонента
abstract class BaseComponent {
    protected element: HTMLElement;
    
    constructor(selector: string) {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`Элемент ${selector} не найден`);
        this.element = el as HTMLElement;
    }
    
    abstract render(): void;
    abstract destroy(): void;
}
```

## 📊 Статус разработки

- [x] Создание структуры проекта
- [x] Установка .NET 8 SDK
- [x] Настройка C# проектов
- [x] Настройка TypeScript
- [ ] Доменная модель
- [ ] API контроллеры
- [ ] Frontend компоненты
- [ ] CSS Grid разметка
- [ ] Тестирование
- [ ] Деплой

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 📞 Контакты

- Email: info@gita-1972-reprint.ru
- Telegram: @gita-1972-reprint-bot
