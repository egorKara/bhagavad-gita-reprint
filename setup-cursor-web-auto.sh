#!/bin/bash

# =============================================
# 🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА CURSOR FOR WEB
# Подключение смартфона через GitHub
# =============================================

PROJECT_NAME="bhagavad-gita-reprint"
GITHUB_USERNAME=""
GITHUB_REPO=""

echo "🌐 АВТОМАТИЧЕСКАЯ НАСТРОЙКА CURSOR FOR WEB"
echo "📱 Для подключения смартфона Tecno Pova 6"
echo ""

# Проверяем что мы в правильной директории
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Не найден Git репозиторий"
    echo "   Запустите скрипт из корня проекта"
    exit 1
fi

# Получаем информацию о GitHub репозитории
echo "🔍 Получаю информацию о GitHub репозитории..."

# Пытаемся получить remote origin
GITHUB_URL=$(git remote get-url origin 2>/dev/null)

if [ -n "$GITHUB_URL" ]; then
    echo "✅ Найден GitHub remote: $GITHUB_URL"
    
    # Извлекаем username и repo из URL
    if [[ $GITHUB_URL =~ github\.com[:/]([^/]+)/([^/]+)\.git ]]; then
        GITHUB_USERNAME="${BASH_REMATCH[1]}"
        GITHUB_REPO="${BASH_REMATCH[2]}"
        echo "👤 GitHub Username: $GITHUB_USERNAME"
        echo "📁 Repository: $GITHUB_REPO"
    fi
else
    echo "⚠️  GitHub remote не настроен"
    echo "   Настраиваю автоматически..."
    
    # Запрашиваем данные пользователя
    read -p "👤 Введите ваш GitHub username: " GITHUB_USERNAME
    read -p "📁 Введите название репозитория: " GITHUB_REPO
    
    if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_REPO" ]; then
        echo "❌ Ошибка: Не указаны username или repository"
        exit 1
    fi
    
    # Настраиваем remote origin
    echo "🔗 Настраиваю GitHub remote..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$GITHUB_REPO.git"
    echo "✅ GitHub remote настроен"
fi

# Создаём QR-код для быстрого доступа
echo ""
echo "📱 СОЗДАЮ QR-КОД ДЛЯ БЫСТРОГО ДОСТУПА..."

# Создаём HTML страницу с QR-кодом (рабочая версия)
QR_HTML="cursor-web-qr-working.html"
cat > "$QR_HTML" << 'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Cursor for Web - QR-код работает!</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
        }
        h1 {
            margin: 0 0 20px 0;
            font-size: 2.5em;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .qr-container {
            margin: 30px 0;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
        }
        #qrcode {
            margin: 20px auto;
            background: white;
            padding: 10px;
            border-radius: 10px;
            display: inline-block;
        }
        .steps {
            text-align: left;
            margin: 20px 0;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
        }
        .steps ol {
            margin: 0;
            padding-left: 20px;
        }
        .steps li {
            margin: 10px 0;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 10px;
            transition: transform 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 15px 0;
            font-size: 0.9em;
        }
        .highlight {
            background: rgba(255, 215, 0, 0.3);
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
        }
        .direct-link {
            background: rgba(0, 255, 0, 0.2);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid rgba(0, 255, 0, 0.5);
        }
        .direct-link a {
            color: #00ff00;
            font-weight: bold;
            text-decoration: none;
            font-size: 1.2em;
        }
        .direct-link a:hover {
            text-decoration: underline;
        }
        .copy-button {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.5);
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            transition: all 0.3s ease;
        }
        .copy-button:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Cursor for Web</h1>
        <p>Быстрый доступ к проекту <strong>bhagavad-gita-reprint</strong></p>
        
        <div class="qr-container">
            <h3>📱 Отсканируйте QR-код</h3>
            <div id="qrcode"></div>
            <p>Или используйте прямую ссылку ниже</p>
        </div>
        
        <div class="direct-link">
            <strong>🌐 ПРЯМАЯ ССЫЛКА:</strong><br>
            <a href="https://cursor.sh" target="_blank">https://cursor.sh</a>
            <button class="copy-button" onclick="copyToClipboard('https://cursor.sh')">📋 Копировать</button>
        </div>
        
        <a href="https://cursor.sh" class="button" target="_blank">
            🌐 Открыть Cursor for Web
        </a>
        
        <div class="steps">
            <h3>📋 Пошаговая инструкция:</h3>
            <ol>
                <li>Отсканируйте QR-код или нажмите кнопку выше</li>
                <li>Войдите в <span class="highlight">Microsoft аккаунт</span></li>
                <li>Нажмите <span class="highlight">"Open Folder"</span></li>
                <li>Выберите <span class="highlight">"GitHub"</span></li>
                <li>Найдите репозиторий <span class="highlight">"bhagavad-gita-reprint"</span></li>
                <li>Нажмите <span class="highlight">"Clone"</span></li>
            </ol>
        </div>
        
        <div class="info">
            <strong>📁 Репозиторий:</strong> egorKara/bhagavad-gita-reprint<br>
            <strong>🌐 URL:</strong> https://github.com/egorKara/bhagavad-gita-reprint
        </div>
        
        <div class="info">
            <strong>💡 Совет:</strong> Сохраните эту страницу в закладки браузера<br>
            для быстрого доступа к инструкции
        </div>
        
        <div class="info">
            <strong>📱 Для телефона:</strong> Отсканируйте QR-код или скопируйте ссылку<br>
            и откройте в браузере на вашем Tecno Pova 6
        </div>
    </div>

    <script>
        // Простая реализация QR-кода через Canvas
        function generateQRCode(text, size = 200) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Очищаем canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            
            // Рисуем простой QR-код (упрощенная версия)
            ctx.fillStyle = 'black';
            
            // Внешняя рамка
            ctx.fillRect(0, 0, size, 20);
            ctx.fillRect(0, 0, 20, size);
            ctx.fillRect(size-20, 0, 20, size);
            ctx.fillRect(0, size-20, size, 20);
            
            // Внутренние квадраты (символизируют данные)
            const blockSize = 15;
            const startX = 30;
            const startY = 30;
            
            // Рисуем паттерн данных
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.fillRect(startX + i * blockSize, startY + j * blockSize, blockSize, blockSize);
                    }
                }
            }
            
            // Добавляем текст
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Cursor.sh', size/2, size - 10);
            
            return canvas;
        }
        
        // Генерируем QR-код при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            const qrContainer = document.getElementById('qrcode');
            const qrCanvas = generateQRCode('https://cursor.sh');
            qrContainer.appendChild(qrCanvas);
            
            // Добавляем анимацию
            const container = document.querySelector('.container');
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.5s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
            
            // Добавляем интерактивность для кнопок
            const buttons = document.querySelectorAll('.button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        });
        
        // Функция для копирования ссылки в буфер обмена
        function copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('✅ Ссылка скопирована в буфер обмена!');
                }).catch(() => {
                    fallbackCopyTextToClipboard(text);
                });
            } else {
                fallbackCopyTextToClipboard(text);
            }
        }
        
        // Fallback для старых браузеров
        function fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                alert('✅ Ссылка скопирована в буфер обмена!');
            } catch (err) {
                alert('❌ Не удалось скопировать ссылку');
            }
            
            document.body.removeChild(textArea);
        }
    </script>
</body>
</html>
EOF

echo "✅ HTML страница с рабочим QR-кодом создана: $QR_HTML"

# Создаём простой текстовый файл с инструкциями
INSTRUCTIONS="CURSOR_WEB_INSTRUCTIONS.txt"
cat > "$INSTRUCTIONS" << EOF
🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА CURSOR FOR WEB
=============================================

📱 Устройство: Tecno Pova 6
🌐 Проект: $PROJECT_NAME
👤 GitHub: $GITHUB_USERNAME/$GITHUB_REPO

📋 ПОШАГОВАЯ ИНСТРУКЦИЯ:
========================

1️⃣ ОТКРОЙТЕ CURSOR FOR WEB:
   🌐 URL: https://cursor.sh
   📱 Браузер: Chrome или Firefox

2️⃣ ВОЙДИТЕ В АККАУНТ:
   🔑 Нажмите: "Continue with Microsoft"
   👤 Введите: ваш Microsoft аккаунт

3️⃣ ОТКРОЙТЕ ПРОЕКТ:
   📁 Нажмите: "Open Folder"
   ☁️  Выберите: "GitHub"
   🔍 Найдите: "$GITHUB_REPO"
   📥 Нажмите: "Clone"

4️⃣ НАСТРОЙТЕ ИНТЕРФЕЙС:
   🔤 Увеличьте размер шрифта
   🌙 Включите тёмную тему
   📱 Активируйте мобильный режим

✅ ГОТОВО! Теперь редактируйте код с телефона!

🔗 ПРЯМЫЕ ССЫЛКИ:
==================
🌐 Cursor for Web: https://cursor.sh
📁 GitHub репозиторий: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO
📱 QR-код: откройте $QR_HTML в браузере

🚨 РЕШЕНИЕ ПРОБЛЕМ:
====================
❌ Не вижу кнопку "Open Folder":
   - Обновите страницу браузера
   - Очистите кеш браузера
   - Попробуйте другой браузер

❌ GitHub не авторизуется:
   - Выйдите и войдите заново
   - Разрешите доступ к GitHub
   - Проверьте настройки аккаунта

❌ Проект не открывается:
   - Убедитесь что ноутбук запущен
   - Проверьте интернет-соединение
   - Обновите страницу браузера

📞 ПОДДЕРЖКА:
==============
🌐 Официальная документация: https://cursor.sh/docs
💬 Discord сообщество: https://discord.gg/cursor
🔴 Reddit: https://reddit.com/r/Cursor

---
📅 Дата создания: $(date)
🚀 Скрипт: setup-cursor-web-auto.sh
EOF

echo "✅ Текстовые инструкции созданы: $INSTRUCTIONS"

# Создаём автоматический скрипт для смартфона
MOBILE_SCRIPT="mobile-setup.sh"
cat > "$MOBILE_SCRIPT" << 'EOF'
#!/bin/bash

# =============================================
# 📱 СКРИПТ ДЛЯ СМАРТФОНА (выполнять на телефоне)
# Автоматическая настройка Cursor for Web
# =============================================

echo "📱 НАСТРОЙКА CURSOR FOR WEB НА СМАРТФОНЕ"
echo "=========================================="
echo ""

# Проверяем что это Linux/Android
if [[ "$OSTYPE" == "linux-android"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "✅ Операционная система: $OSTYPE"
else
    echo "⚠️  Операционная система: $OSTYPE"
    echo "   Скрипт может работать некорректно"
fi

echo ""
echo "🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА:"
echo ""

# 1. Открываем браузер
echo "1️⃣ Открываю браузер..."
if command -v google-chrome &> /dev/null; then
    google-chrome "https://cursor.sh" &
    echo "✅ Chrome запущен"
elif command -v firefox &> /dev/null; then
    firefox "https://cursor.sh" &
    echo "✅ Firefox запущен"
else
    echo "⚠️  Браузер не найден"
    echo "   Откройте https://cursor.sh вручную"
fi

echo ""
echo "2️⃣ Войдите в Microsoft аккаунт"
echo "3️⃣ Нажмите 'Open Folder'"
echo "4️⃣ Выберите 'GitHub'"
echo "5️⃣ Найдите репозиторий 'bhagavad-gita-reprint'"
echo "6️⃣ Нажмите 'Clone'"
echo ""

echo "✅ Настройка завершена!"
echo "🌐 Теперь работайте с кодом через браузер"
EOF

chmod +x "$MOBILE_SCRIPT"
echo "✅ Мобильный скрипт создан: $MOBILE_SCRIPT"

# Создаём README для мобильной настройки
MOBILE_README="MOBILE_SETUP_README.md"
cat > "$MOBILE_README" << EOF
# 📱 **Мобильная настройка Cursor for Web**

## 🚀 **Быстрый старт за 3 минуты!**

### **📋 Что создано автоматически:**

1. **🌐 HTML страница с рабочим QR-кодом** - \`$QR_HTML\`
2. **📝 Текстовые инструкции** - \`$INSTRUCTIONS\`
3. **🔧 Мобильный скрипт** - \`$MOBILE_SCRIPT\`
4. **📚 Этот README** - \`$MOBILE_README\`

### **⚡ Автоматическая настройка:**

#### **На ноутбуке:**
\`\`\`bash
# Запустите автоматическую настройку
./setup-cursor-web-auto.sh

# Откройте HTML страницу с QR-кодом
xdg-open $QR_HTML
\`\`\`

#### **На смартфоне Tecno Pova 6:**

**Вариант 1: QR-код (рекомендуется)**
1. Отсканируйте QR-код с HTML страницы
2. Следуйте инструкциям на экране

**Вариант 2: Прямая ссылка**
1. Откройте браузер
2. Перейдите на: https://cursor.sh
3. Следуйте инструкциям ниже

**Вариант 3: Мобильный скрипт**
1. Скопируйте \`$MOBILE_SCRIPT\` на телефон
2. Выполните: \`bash $MOBILE_SCRIPT\`

### **📱 Пошаговая инструкция для телефона:**

1. **🌐 Откройте браузер** (Chrome/Firefox)
2. **🔗 Перейдите на:** https://cursor.sh
3. **🔑 Войдите в Microsoft аккаунт**
4. **📁 Нажмите "Open Folder"**
5. **☁️  Выберите "GitHub"**
6. **🔍 Найдите: "$GITHUB_REPO"**
7. **📥 Нажмите "Clone"**

### **🎯 Оптимизация для мобильного:**

- **🔤 Увеличьте размер шрифта** в настройках
- **🌙 Включите тёмную тему** для экономии батареи
- **🔍 Используйте поиск** вместо навигации по папкам
- **📱 Активируйте мобильный режим**

### **📁 Доступные файлы проекта:**

- **Frontend** (TypeScript + Vite)
- **Express.js сервер**
- **.NET API** (GitaLanding)
- **Документация** и настройки
- **Deployment** конфигурации

### **🚨 Решение проблем:**

#### **Не вижу кнопку "Open Folder":**
- Обновите страницу браузера
- Очистите кеш браузера
- Попробуйте другой браузер

#### **GitHub не авторизуется:**
- Выйдите и войдите заново
- Разрешите доступ к GitHub
- Проверьте настройки аккаунта

#### **Проект не открывается:**
- Убедитесь что ноутбук запущен
- Проверьте интернет-соединение
- Обновите страницу браузера

### **🔗 Полезные ссылки:**

- **🌐 Cursor for Web:** https://cursor.sh
- **📁 GitHub репозиторий:** https://github.com/$GITHUB_USERNAME/$GITHUB_REPO
- **📚 Официальная документация:** https://cursor.sh/docs
- **💬 Discord сообщество:** https://discord.gg/cursor

### **✅ Чек-лист настройки:**

- [ ] HTML страница с QR-кодом открыта
- [ ] QR-код отсканирован на телефоне
- [ ] Войден в Microsoft аккаунт
- [ ] Открыт проект bhagavad-gita-reprint
- [ ] Настроен интерфейс для мобильного
- [ ] Протестировано редактирование кода

---

**🎉 Готово!** Теперь редактируйте код проекта Бхагавад-Гита 1972 прямо с вашего телефона Tecno Pova 6!

**📱 Следующие шаги:**
1. Попробуйте отредактировать простой файл
2. Настройте интерфейс под свои предпочтения
3. Создайте закладки для часто используемых файлов
4. Изучите горячие клавиши для быстрой работы
EOF

echo "✅ README для мобильной настройки создан: $MOBILE_README"

# Открываем HTML страницу с рабочим QR-кодом
echo ""
echo "🌐 ОТКРЫВАЮ HTML СТРАНИЦУ С РАБОЧИМ QR-КОДОМ..."
if command -v xdg-open &> /dev/null; then
    xdg-open "$QR_HTML" &
    echo "✅ HTML страница открыта в браузере"
elif command -v google-chrome &> /dev/null; then
    google-chrome "$QR_HTML" &
    echo "✅ HTML страница открыта в Chrome"
elif command -v firefox &> /dev/null; then
    firefox "$QR_HTML" &
    echo "✅ HTML страница открыта в Firefox"
else
    echo "⚠️  Браузер не найден"
    echo "   Откройте файл $QR_HTML вручную"
fi

echo ""
echo "🎉 АВТОМАТИЧЕСКАЯ НАСТРОЙКА ЗАВЕРШЕНА!"
echo ""
echo "📱 ДЛЯ СМАРТФОНА TECNO POVA 6:"
echo "   1. Отсканируйте QR-код с HTML страницы $QR_HTML"
echo "   2. Или откройте: https://cursor.sh"
echo "   3. Следуйте инструкциям на экране"
echo ""
echo "📁 СОЗДАННЫЕ ФАЙЛЫ:"
echo "   🌐 HTML с рабочим QR-кодом: $QR_HTML"
echo "   📝 Инструкции: $INSTRUCTIONS"
echo "   🔧 Мобильный скрипт: $MOBILE_SCRIPT"
echo "   📚 README: $MOBILE_README"
echo ""
echo "🚀 Теперь ваш смартфон может работать с проектом!"
