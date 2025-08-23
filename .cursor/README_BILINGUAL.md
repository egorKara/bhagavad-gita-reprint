# Конфигурация Cursor для проекта "Бхагавад-Гита как она есть"
# Cursor Configuration for Bhagavad Gita Reprint Project

Этот каталог содержит оптимизированную конфигурацию Cursor IDE для улучшенного рабочего процесса разработки.

This directory contains optimized Cursor IDE configuration for enhanced development workflow.

---

## 📁 Структура / Structure

```
.cursor/
├── memory-bank/              # Файлы Memory Bank 2.0 / Memory Bank 2.0 files
│   ├── project-context.md    # Основная информация о проекте / Core project information
│   ├── technical-stack.md    # Архитектура и технологический стек / Architecture and tech stack
│   ├── coding-standards.md   # Правила разработки / Development guidelines
│   ├── deployment-process.md # CI/CD и развёртывание / CI/CD and deployment
│   ├── current-priorities.md # Активные задачи и дорожная карта / Active tasks and roadmap
│   └── rules.json           # Машиночитаемые правила проекта / Machine-readable project rules
├── plugin-configs/          # Конфигурации плагинов / Plugin configurations
├── settings.json            # Настройки Cursor IDE / Cursor IDE preferences
├── analytics.md             # Отслеживание метрик производительности / Performance metrics tracking
└── README.md               # Этот файл / This file
```

---

## 🧠 Memory Bank 2.0

Memory Bank обеспечивает постоянный контекст для AI агентов, гарантируя:
Memory Bank provides persistent context for AI agents, ensuring:

### Функции / Features:
- **Удержание контекста** / **Context Retention:** Детали проекта помнятся между сессиями / Project details remembered across sessions
- **Консистентность** / **Consistency:** Единообразное понимание целей и ограничений проекта / Uniform understanding of project goals and constraints  
- **Эффективность** / **Efficiency:** Снижение необходимости повторного объяснения специфики проекта / Reduced need to re-explain project specifics
- **Качество** / **Quality:** Лучшая генерация кода на основе паттернов проекта / Better code generation based on project patterns

---

## ⚙️ Ключевые функции конфигурации / Key Configuration Features

### Языковые настройки / Language Settings
- **Основной язык** / **Primary Language:** Русский / Russian (код, документация, коммиты / code, documentation, commits)
- **Дополнительный язык** / **Secondary Language:** Английский / English (локализация пользовательского интерфейса / UI localization)
- **Стандарты кода** / **Code Standards:** Русские комментарии и документация / Russian comments and documentation

### Оптимизация агентов / Agent Optimization
- **Background Agent:** Включён с интеграцией памяти / Enabled with memory integration
- **Параллельная обработка** / **Parallel Processing:** Оптимизировано для одновременных операций / Optimized for concurrent operations
- **Автоисправление** / **Auto-fixing:** Ошибки линтера исправляются автоматически когда возможно / Linter errors resolved automatically when possible
- **Git интеграция** / **Git Integration:** Workflow с приоритетом rebase и auto-stash / Rebase-first workflow with auto-stash

### Функции производительности / Performance Features
- **Ленивая загрузка** / **Lazy Loading:** Оптимизированная загрузка ресурсов / Optimized resource loading
- **Кэширование** / **Caching:** Улучшенное время отклика / Enhanced response times
- **Индексация** / **Indexing:** Автоматическая индексация кодовой базы с интеграцией Git graph / Automatic codebase indexing with Git graph integration

---

## 🚀 Использование / Usage

### Для разработчиков / For Developers
1. Cursor автоматически загружает эти настройки при открытии проекта / Cursor automatically loads these settings when opening the project
2. Memory Bank предоставляет контекст для всех AI взаимодействий / Memory Bank provides context to all AI interactions
3. Background агенты используют эти конфигурации для автономной работы / Background agents use these configurations for autonomous work

### Для Background агентов / For Background Agents
1. **Перед началом** / **Before Starting:** Агенты читают Memory Bank для контекста проекта / Agents read Memory Bank for project context
2. **Во время работы** / **During Work:** Настройки управляют поведением и решениями агентов / Settings guide agent behavior and decisions
3. **После завершения** / **After Completion:** Аналитика отслеживает улучшения производительности / Analytics track performance improvements

---

## 📊 Мониторинг / Monitoring

### Отслеживаемые метрики / Tracked Metrics
- Сокращение времени разработки (цель: 35%) / Development time reduction (target: 35%)
- Улучшение качества кода (цель: 98% ESLint score) / Code quality improvement (target: 98% ESLint score)
- Скорость обнаружения багов (цель: 70% автоматически) / Bug detection rate (target: 70% automated)
- Покрытие документации (цель: 85%) / Documentation coverage (target: 85%)

### Еженедельные отчёты / Weekly Reports
- Автоматически генерируются каждую пятницу / Generated automatically every Friday
- Сравнивают фактические и целевые метрики / Compare actual vs target metrics
- Выявляют возможности для оптимизации / Identify optimization opportunities

---

## 🔧 Настройка / Customization

### Обновление настроек / Updating Settings
1. Изменяйте `settings.json` для настроек IDE / Modify `settings.json` for IDE preferences
2. Обновляйте файлы Memory Bank при изменениях контекста проекта / Update Memory Bank files for project context changes
3. Корректируйте `analytics.md` для отслеживания других метрик / Adjust `analytics.md` for tracking different metrics

### Добавление новых правил / Adding New Rules
1. Обновляйте `rules.json` для машиночитаемых правил / Update `rules.json` for machine-readable rules
2. Документируйте изменения в соответствующих файлах Memory Bank / Document changes in appropriate Memory Bank files
3. Тестируйте с background агентами для обеспечения правильной интерпретации / Test with background agents to ensure proper interpretation

---

## 🔄 Обслуживание / Maintenance

### Регулярные задачи / Regular Tasks
- **Ежемесячно** / **Monthly:** Просматривайте аналитику и оптимизируйте настройки / Review analytics and optimize settings
- **Ежеквартально** / **Quarterly:** Обновляйте Memory Bank с развитием проекта / Update Memory Bank with project evolution
- **По необходимости** / **As Needed:** Корректируйте конфигурации на основе обратной связи команды / Adjust configurations based on team feedback

### Лучшие практики / Best Practices
- Держите файлы Memory Bank краткими, но исчерпывающими / Keep Memory Bank files concise but comprehensive
- Документируйте обоснование изменений конфигурации / Document reasoning for configuration changes
- Тестируйте поведение агентов после крупных обновлений / Test agent behavior after major updates
- Поддерживайте языковую последовательность (русский основной) / Maintain language consistency (Russian primary)

---

## 🆘 Устранение неполадок / Troubleshooting

### Общие проблемы / Common Issues
1. **Путаница агентов** / **Agent Confusion:** Проверьте консистентность Memory Bank / Check Memory Bank consistency
2. **Проблемы производительности** / **Performance Issues:** Просмотрите оптимизацию settings.json / Review settings.json optimization
3. **Смешение языков** / **Language Mixing:** Убедитесь в соблюдении политики русский-первый / Ensure Russian-first policy compliance
4. **Потеря контекста** / **Context Loss:** Проверьте доступность файлов Memory Bank / Verify Memory Bank file accessibility

### Поддержка / Support
- Проверьте `.cursor/analytics.md` для анализа производительности / Check `.cursor/analytics.md` for performance insights
- Просмотрите отдельные файлы Memory Bank для специфического контекста / Review individual Memory Bank files for specific context
- Обратитесь к документации проекта в каталоге `docs/` / Consult project documentation in `docs/` directory

---

## 🚀 Установленные MCP плагины / Installed MCP Plugins

### Основные плагины / Core Plugins
- **🔗 GitHub Integration Enhanced:** Расширенное управление репозиторием / Advanced repository management
- **⚡ Performance Auditor:** Автоматический аудит производительности / Automated performance auditing
- **🌍 i18n Translation Manager:** Управление многоязычным контентом / Multilingual content management
- **🔍 SEO Assistant Pro:** Оптимизация поисковых систем / Search engine optimization
- **🎨 CSS Variables Manager:** Управление системой дизайна / Design system management

### Конфигурация плагинов / Plugin Configuration
Файлы конфигурации расположены в `.cursor/plugin-configs/` для настройки каждого плагина под специфику проекта.

Plugin configuration files are located in `.cursor/plugin-configs/` to customize each plugin for project specifics.

---

**🎯 Цель:** Максимальная эффективность разработки с 40% улучшением производительности!

**🎯 Goal:** Maximum development efficiency with 40% productivity improvement!
