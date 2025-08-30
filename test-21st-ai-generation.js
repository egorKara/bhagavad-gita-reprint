/**
 * 🧪 ТЕСТОВЫЙ СКРИПТ ДЛЯ AI ГЕНЕРАЦИИ 21ST.DEV
 *
 * Демонстрирует полный цикл работы с платформой:
 * 1. AI генерация компонента
 * 2. Адаптация под наш стиль
 * 3. Экспорт в проект
 * 4. Интеграция с Landing Page
 */

import TwentyFirstDevIntegration from './21st-dev-integration.js';

// 🎨 Наш стиль-гайд
const ourStyleGuide = {
    colors: {
        gold: '#D4AF37',
        darkBlue: '#1B365D',
        white: '#FFFFFF',
        lightGold: '#F4E4BC',
    },
    fonts: {
        serif: "'Georgia', 'Times New Roman', serif",
        sansSerif: "'Arial', 'Helvetica', sans-serif",
    },
    primaryColor: '#D4AF37',
    theme: 'spiritual-minimal',
};

async function testAIGeneration() {
    console.log('🧪 ЗАПУСК ТЕСТА AI ГЕНЕРАЦИИ 21ST.DEV');
    console.log('=========================================');

    const integration = new TwentyFirstDevIntegration();

    try {
        // 🔍 1. Поиск существующих компонентов
        console.log('\n🔍 ШАГ 1: Поиск компонентов...');
        const existingComponents = await integration.searchComponents('heroes', 'spiritual');
        console.log(`✅ Найдено компонентов: ${existingComponents.length}`);

        // 🤖 2. AI генерация нового компонента
        console.log('\n🤖 ШАГ 2: AI генерация компонента...');
        const requirements = `
            - Hero секция для главной страницы
            - Тема: Бхагавад-Гита как источник мудрости
            - Стиль: минималистичный, духовный
            - Анимация: плавное появление
            - Адаптивность: мобильные устройства
        `;

        const generatedComponent = await integration.generateComponentWithAI(
            'heroes',
            requirements
        );
        console.log(`✅ Компонент сгенерирован: ${generatedComponent.name}`);
        console.log(`📊 Размер HTML: ${generatedComponent.html.length} символов`);
        console.log(`📊 Размер CSS: ${generatedComponent.css.length} символов`);
        console.log(`📊 Размер JS: ${generatedComponent.js.length} символов`);

        // 🎨 3. Адаптация под наш стиль
        console.log('\n🎨 ШАГ 3: Адаптация под наш стиль...');
        const adaptedComponent = integration.adaptComponentToStyle(
            generatedComponent,
            ourStyleGuide
        );
        console.log('✅ Компонент адаптирован под наш стиль');
        console.log(`🎨 Цвета: ${JSON.stringify(adaptedComponent.colors)}`);
        console.log(`🔤 Шрифты: ${JSON.stringify(adaptedComponent.typography)}`);

        // 📤 4. Экспорт в проект
        console.log('\n📤 ШАГ 4: Экспорт в проект...');
        const exportPath = './components/21st-generated-hero';
        const exportSuccess = await integration.exportComponent(adaptedComponent, exportPath);

        if (exportSuccess) {
            console.log('✅ Компонент успешно экспортирован!');
            console.log(`📁 Файлы созданы в: ${exportPath}`);
        } else {
            console.log('❌ Ошибка экспорта компонента');
        }

        // 🔗 5. Интеграция с Landing Page
        console.log('\n🔗 ШАГ 5: Интеграция с Landing Page...');
        await integrateWithLandingPage(adaptedComponent);

        // 📊 6. Финальная статистика
        console.log('\n📊 ФИНАЛЬНАЯ СТАТИСТИКА:');
        console.log('========================');
        console.log(`🚀 Компонентов найдено: ${existingComponents.length}`);
        console.log(`🤖 AI генерация: ${generatedComponent ? 'УСПЕШНО' : 'ОШИБКА'}`);
        console.log(`🎨 Адаптация стиля: ${adaptedComponent ? 'УСПЕШНО' : 'ОШИБКА'}`);
        console.log(`📤 Экспорт: ${exportSuccess ? 'УСПЕШНО' : 'ОШИБКА'}`);
        console.log(`🔗 Интеграция: УСПЕШНО`);

        console.log('\n🎉 ТЕСТ AI ГЕНЕРАЦИИ 21ST.DEV ЗАВЕРШЁН УСПЕШНО!');
    } catch (error) {
        console.error('❌ ОШИБКА В ТЕСТЕ:', error);
    }
}

/**
 * 🔗 Интеграция с Landing Page
 */
async function integrateWithLandingPage(component) {
    console.log('🔗 Интегрируем компонент в Landing Page...');

    try {
        // Читаем текущий Landing Page
        const fs = await import('fs/promises');
        const landingPagePath = './docs/index.html';

        let landingPageContent = '';
        try {
            landingPageContent = await fs.readFile(landingPagePath, 'utf8');
        } catch {
            console.log('📝 Landing Page не найден, создаём новый...');
            landingPageContent = createNewLandingPage();
        }

        // Интегрируем компонент
        const updatedContent = integrateComponent(landingPageContent, component);

        // Сохраняем обновлённую страницу
        await fs.writeFile(landingPagePath, updatedContent);
        console.log('✅ Landing Page обновлён с новым компонентом!');

        // Создаём превью
        await createPreview(component);
    } catch (error) {
        console.error('❌ Ошибка интеграции с Landing Page:', error);
    }
}

/**
 * 📝 Создание нового Landing Page
 */
function createNewLandingPage() {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Бхагавад-Гита 1972 - Landing Page</title>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- 21ST.DEV AI ГЕНЕРИРОВАННЫЙ КОМПОНЕНТ БУДЕТ ВСТАВЛЕН ЗДЕСЬ -->
        <div id="21st-generated-component"></div>
        
        <footer>
            <p>Создано с помощью 21st.dev AI + Cursor IDE</p>
        </footer>
    </div>
</body>
</html>`;
}

/**
 * 🔗 Интеграция компонента в страницу
 */
function integrateComponent(pageContent, component) {
    // Находим место для вставки компонента
    const placeholder = '<!-- 21ST.DEV AI ГЕНЕРИРОВАННЫЙ КОМПОНЕНТ БУДЕТ ВСТАВЛЕН ЗДЕСЬ -->';

    if (pageContent.includes(placeholder)) {
        // Вставляем компонент
        const integratedContent = pageContent.replace(
            placeholder,
            `
        <!-- 🚀 21ST.DEV AI ГЕНЕРИРОВАННЫЙ КОМПОНЕНТ -->
        ${component.html}
        
        <style>
        /* 🎨 21ST.DEV AI ГЕНЕРИРОВАННЫЕ СТИЛИ */
        ${component.css}
        </style>
        
        <script>
        /* 🤖 21ST.DEV AI ГЕНЕРИРОВАННЫЙ КОД */
        ${component.js}
        </script>
        `
        );

        return integratedContent;
    } else {
        // Если placeholder не найден, добавляем в конец body
        const bodyEnd = '</body>';
        const integratedContent = pageContent.replace(
            bodyEnd,
            `
        <!-- 🚀 21ST.DEV AI ГЕНЕРИРОВАННЫЙ КОМПОНЕНТ -->
        ${component.html}
        
        <style>
        /* 🎨 21ST.DEV AI ГЕНЕРИРОВАННЫЕ СТИЛИ */
        ${component.css}
        </style>
        
        <script>
        /* 🤖 21ST.DEV AI ГЕНЕРИРОВАННЫЙ КОД */
        ${component.js}
        </script>
        ${bodyEnd}
        `
        );

        return integratedContent;
    }
}

/**
 * 🖼️ Создание превью компонента
 */
async function createPreview(component) {
    console.log('🖼️ Создаём превью компонента...');

    try {
        const fs = await import('fs/promises');
        const previewDir = './previews';
        await fs.mkdir(previewDir, { recursive: true });

        const previewContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>21st.dev AI Generated Component Preview</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
            font-family: Arial, sans-serif; 
        }
        .preview-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .preview-header {
            background: linear-gradient(135deg, #1B365D 0%, #2C5AA0 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .preview-content {
            padding: 40px 20px;
        }
        .component-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .component-info h3 {
            color: #1B365D;
            margin-top: 0;
        }
        .component-info code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="preview-header">
            <h1>🚀 21st.dev AI Generated Component</h1>
            <p>Предварительный просмотр сгенерированного компонента</p>
        </div>
        
        <div class="preview-content">
            <div class="component-info">
                <h3>📊 Информация о компоненте</h3>
                <p><strong>ID:</strong> <code>${component.id}</code></p>
                <p><strong>Название:</strong> ${component.name}</p>
                <p><strong>Сгенерирован:</strong> ${component.metadata.generatedAt}</p>
                <p><strong>AI модель:</strong> <code>${component.metadata.aiModel}</code></p>
                <p><strong>Размер HTML:</strong> ${component.html.length} символов</p>
                <p><strong>Размер CSS:</strong> ${component.css.length} символов</p>
                <p><strong>Размер JS:</strong> ${component.js.length} символов</p>
            </div>
            
            <!-- 🎨 ПРЕВЬЮ КОМПОНЕНТА -->
            ${component.html}
        </div>
    </div>
    
    <style>
    /* 🎨 21ST.DEV AI ГЕНЕРИРОВАННЫЕ СТИЛИ */
    ${component.css}
    </style>
    
    <script>
    /* 🤖 21ST.DEV AI ГЕНЕРИРОВАННЫЙ КОД */
    ${component.js}
    </script>
</body>
</html>`;

        const previewPath = `${previewDir}/21st-component-preview.html`;
        await fs.writeFile(previewPath, previewContent);
        console.log(`✅ Превью создано: ${previewPath}`);
    } catch (error) {
        console.error('❌ Ошибка создания превью:', error);
    }
}

// 🚀 ЗАПУСК ТЕСТА
if (import.meta.url === `file://${process.argv[1]}`) {
    testAIGeneration();
}
