module.exports = {
  // Основные настройки сканирования
  scanning: {
    // Интервал сканирования в миллисекундах (по умолчанию: 5 минут)
    interval: 5 * 60 * 1000,
    
    // Максимальная глубина сканирования директорий
    maxDepth: 3,
    
    // Размер файла для сканирования (в байтах) - файлы больше этого размера пропускаются
    maxFileSize: 10 * 1024 * 1024, // 10MB
    
    // Таймаут для сканирования одного файла (в миллисекундах)
    fileTimeout: 5000,
    
    // Количество одновременных сканирований файлов
    concurrentFiles: 5
  },

  // Паттерны для поиска секретов
  patterns: {
    // Включить/выключить определенные типы паттернов
    enabled: {
      apiKeys: true,
      passwords: true,
      tokens: true,
      sshKeys: true,
      databaseUrls: true,
      awsKeys: true,
      googleCloud: true,
      githubTokens: true,
      slackTokens: true,
      discordTokens: true,
      telegramTokens: true,
      jwtTokens: true
    },
    
    // Дополнительные пользовательские паттерны
    custom: [
      // Пример: поиск специфичных для проекта секретов
      // /myapp_secret\s*[:=]\s*['"`]?[a-zA-Z0-9]{16,}['"`]?/gi,
      // /internal_api_key\s*[:=]\s*['"`]?[a-zA-Z0-9]{20,}['"`]?/gi
    ]
  },

  // Исключения
  exclusions: {
    // Директории для исключения
    directories: [
      'node_modules',
      '.git',
      '.vscode',
      '.idea',
      'coverage',
      'dist',
      'build',
      '.next',
      '.nuxt',
      'tmp',
      'temp',
      'cache',
      'logs'
    ],
    
    // Файлы для исключения
    files: [
      '.env.example',
      '.env.template',
      'package-lock.json',
      'yarn.lock',
      '*.min.js',
      '*.min.css',
      '*.map',
      '*.log',
      '*.tmp',
      '*.cache'
    ],
    
    // Расширения файлов для исключения
    extensions: [
      '.min.js',
      '.min.css',
      '.map',
      '.log',
      '.tmp',
      '.cache',
      '.gz',
      '.zip',
      '.tar',
      '.rar'
    ]
  },

  // Настройки отчетности
  reporting: {
    // Форматы отчетов
    formats: ['json', 'markdown', 'html'],
    
    // Путь для сохранения отчетов
    outputPath: './security-reports',
    
    // Включить детальные отчеты
    detailed: true,
    
    // Включить статистику
    statistics: true,
    
    // Максимальное количество отчетов для хранения
    maxReports: 10
  },

  // Настройки GitHub Secrets
  githubSecrets: {
    // Автоматически создавать инструкции для GitHub Secrets
    autoGenerate: true,
    
    // Префикс для имен секретов
    secretPrefix: 'SECRET_',
    
    // Максимальная длина секрета для отображения
    maxDisplayLength: 20,
    
    // Включить маскировку секретов в отчетах
    maskSecrets: true,
    
    // Создавать файл с инструкциями
    createInstructions: true
  },

  // Настройки уведомлений
  notifications: {
    // Включить уведомления в консоль
    console: true,
    
    // Включить логирование в файл
    fileLogging: true,
    
    // Путь к лог файлу
    logFile: './security-agent.log',
    
    // Уровень логирования
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    
    // Максимальный размер лог файла (в байтах)
    maxLogSize: 10 * 1024 * 1024, // 10MB
    
    // Количество лог файлов для ротации
    maxLogFiles: 5
  },

  // Настройки безопасности
  security: {
    // Включить проверку целостности файлов
    integrityCheck: true,
    
    // Хеширование найденных секретов для сравнения
    hashSecrets: true,
    
    // Включить проверку на подозрительные изменения
    suspiciousChanges: true,
    
    // Максимальное количество попыток сканирования одного файла
    maxRetries: 3
  },

  // Настройки производительности
  performance: {
    // Использовать кэширование результатов
    enableCaching: true,
    
    // Размер кэша (в элементах)
    cacheSize: 1000,
    
    // Время жизни кэша (в миллисекундах)
    cacheTTL: 60 * 60 * 1000, // 1 час
    
    // Использовать worker threads для сканирования
    useWorkers: false,
    
    // Количество worker threads
    workerCount: 2
  },

  // Настройки интеграции
  integration: {
    // Включить интеграцию с Git hooks
    gitHooks: false,
    
    // Включить интеграцию с CI/CD
    ciCd: false,
    
    // Включить интеграцию с IDE
    ide: true,
    
    // Включить интеграцию с системными мониторами
    systemMonitor: false
  },

  // Настройки локализации
  localization: {
    // Основной язык
    defaultLanguage: 'ru',
    
    // Поддерживаемые языки
    supportedLanguages: ['ru', 'en'],
    
    // Автоопределение языка системы
    autoDetect: true
  },

  // Настройки обновлений
  updates: {
    // Проверять обновления агента
    checkUpdates: true,
    
    // URL для проверки обновлений
    updateUrl: 'https://api.github.com/repos/cursor-ide/security-agent/releases/latest',
    
    // Автоматически обновлять паттерны
    autoUpdatePatterns: true
  }
};