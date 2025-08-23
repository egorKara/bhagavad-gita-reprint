# Сценарии тестирования BugBot / BugBot Test Scenarios

## 🧪 Набор тестов для автоматического обнаружения багов / Test Suite for Automated Bug Detection

### Обзор / Overview
Этот документ содержит тестовые сценарии для валидации функциональности BugBot для проекта "Бхагавад-Гита как она есть".

This document contains test scenarios to validate BugBot functionality for the Bhagavad Gita Reprint project.

### Категории тестов / Test Categories
1. **Проблемы безопасности** / **Security Issues**
2. **Качество кода** / **Code Quality**
3. **Проблемы производительности** / **Performance Problems**
4. **Нарушения языковой политики** / **Language Policy Violations**
5. **Проблемы документации** / **Documentation Issues**

---

## 🔒 Сценарии тестирования безопасности / Security Test Scenarios

### Тест 1: Обнаружение жёстко закодированных секретов / Test 1: Hardcoded Secrets Detection
**Цель:** Проверить, что BugBot обнаруживает жёстко закодированные секреты
**Objective:** Verify BugBot detects hardcoded secrets

**Тестовый код / Test Code:**
```javascript
// Это должно вызвать предупреждение BugBot
// This should trigger BugBot warning
const apiKey = "sk_test_123456789abcdef";
const password = "admin123";
const secret = "my-secret-token";

// Хорошая практика (должна пройти)
// Good practice (should pass)
const apiKey = process.env.API_KEY;
```

**Ожидаемый результат / Expected Result:** ⚠️ BugBot должен пометить жёстко закодированные секреты / BugBot should flag hardcoded secrets

**Шаги тестирования / Test Steps:**
1. Создать PR с жёстко закодированными секретами / Create PR with hardcoded secrets
2. Дождаться анализа BugBot / Wait for BugBot analysis
3. Проверить появление предупреждения в комментариях PR / Verify warning appears in PR comments

---

### Тест 2: Использование переменных окружения / Test 2: Environment Variable Usage
**Цель:** Обеспечить правильное использование переменных окружения
**Objective:** Ensure proper environment variable usage

**Тестовый код / Test Code:**
```javascript
// Плохая практика / Bad practice
const config = {
    dbPassword: "password123",
    jwtSecret: "supersecret"
};

// Хорошая практика / Good practice
const config = {
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET
};
```

**Ожидаемый результат / Expected Result:** ⚠️ BugBot должен предложить переменные окружения / BugBot should suggest environment variables

---

## 🎯 Сценарии тестирования качества кода / Code Quality Test Scenarios

### Тест 3: Обнаружение операторов console / Test 3: Console Statement Detection
**Цель:** Пометить операторы console в production коде
**Objective:** Flag console statements in production code

**Тестовый код / Test Code:**
```javascript
function processUser(user) {
    console.log("Обрабатываем пользователя:", user.id); // Должно быть помечено
    console.log("Processing user:", user.id); // Should be flagged
    console.error("Произошла ошибка"); // Должно быть помечено
    console.error("Error occurred"); // Should be flagged
    
    // Правильное логирование / Proper logging
    logger.info("Обрабатываем пользователя:", user.id); // Должно пройти
    logger.info("Processing user:", user.id); // Should pass
    return user;
}
```

**Ожидаемый результат / Expected Result:** ⚠️ BugBot должен предложить удалить операторы console / BugBot should suggest removing console statements

---

### Тест 4: Комментарии TODO/FIXME / Test 4: TODO/FIXME Comments
**Цель:** Отслеживать маркеры технического долга
**Objective:** Track technical debt markers

**Тестовый код / Test Code:**
```javascript
// TODO: Реализовать механизм кэширования
// TODO: Implement caching mechanism
function fetchData() {
    // FIXME: Это неэффективно
    // FIXME: This is inefficient
    return database.query("SELECT * FROM users");
    
    // HACK: Временное решение
    // HACK: Temporary workaround
    return mockData;
}
```

**Ожидаемый результат / Expected Result:** 📝 BugBot должен отметить комментарии TODO/FIXME / BugBot should note TODO/FIXME comments

---

### Тест 5: Нарушения правил ESLint / Test 5: ESLint Rule Violations
**Цель:** Поймать общие нарушения ESLint
**Objective:** Catch common ESLint violations

**Тестовый код / Test Code:**
```javascript
// Множественные нарушения / Multiple violations
var unused_variable = 123;
function duplicateFunction() {}
function duplicateFunction() {} // Дублированное объявление / Duplicate declaration

// Отсутствующая точка с запятой / Missing semicolon
const user = { name: "test" }
```

**Ожидаемый результат / Expected Result:** ❌ BugBot должен перечислить нарушения ESLint / BugBot should list ESLint violations

---

## ⚡ Сценарии тестирования производительности / Performance Test Scenarios

### Тест 6: Неэффективные запросы к базе данных / Test 6: Inefficient Database Queries
**Цель:** Выявить узкие места производительности
**Objective:** Identify performance bottlenecks

**Тестовый код / Test Code:**
```javascript
// Неэффективно - проблема N+1 запросов / Inefficient - N+1 query problem
async function getUsersWithPosts() {
    const users = await User.findAll();
    
    for (let user of users) {
        user.posts = await Post.findByUserId(user.id); // Проблема N+1 / N+1 problem
    }
    
    return users;
}

// Эффективная версия / Efficient version
async function getUsersWithPostsOptimized() {
    return await User.findAll({
        include: [Post] // Один запрос с объединением / Single query with join
    });
}
```

**Ожидаемый результат / Expected Result:** 🐌 BugBot должен предложить оптимизацию запросов / BugBot should suggest query optimization

---

### Тест 7: Утечки памяти / Test 7: Memory Leaks
**Цель:** Обнаружить потенциальные утечки памяти
**Objective:** Detect potential memory leaks

**Тестовый код / Test Code:**
```javascript
// Потенциальная утечка памяти / Potential memory leak
let globalCache = {};

function addToCache(key, value) {
    globalCache[key] = value; // Никогда не очищается / Never cleaned up
}

// Лучший подход / Better approach
const LRU = require('lru-cache');
const cache = new LRU({ max: 1000, ttl: 1000 * 60 * 5 });
```

**Ожидаемый результат / Expected Result:** 🧠 BugBot должен предупредить о неограниченном кэше / BugBot should warn about unbounded cache

---

## 🌐 Сценарии тестирования языковой политики / Language Policy Test Scenarios

### Тест 8: Не-русские комментарии / Test 8: Non-Russian Comments
**Цель:** Обеспечить соблюдение политики русскоязычного кода
**Objective:** Enforce Russian-only code policy

**Тестовый код / Test Code:**
```javascript
// Calculate order total - Should be flagged
function calculateTotal(items) {
    let sum = 0;
    
    // Iterate through all items - Should be flagged
    for (let item of items) {
        sum += item.price;
    }
    
    return sum;
}

// Вычисляем общую стоимость заказа - Должно пройти
function calculateTotalCorrect(items) {
    let sum = 0;
    
    // Проходим по всем элементам - Должно пройти
    for (let item of items) {
        sum += item.price;
    }
    
    return sum;
}
```

**Ожидаемый результат / Expected Result:** 🌐 BugBot должен пометить не-русские комментарии / BugBot should flag non-Russian comments

---

### Тест 9: Смешанные языки в переменных / Test 9: Mixed Language Variables
**Цель:** Обеспечить русские названия переменных
**Objective:** Ensure Russian variable naming

**Тестовый код / Test Code:**
```javascript
// Смешанные языки - Должно быть помечено / Mixed languages - Should be flagged
function processOrder(order) {
    const totalSum = order.calculateSum();
    const status = "processed";
    
    return {
        sum: totalSum,
        status: status
    };
}

// Только русский - Должно пройти / Russian only - Should pass
function processZakaz(zakaz) {
    const obshayaSumma = zakaz.calculateSum();
    const status = "obrabotan";
    
    return {
        summa: obshayaSumma,
        status: status
    };
}
```

**Ожидаемый результат / Expected Result:** 🔤 BugBot должен предложить русские названия переменных / BugBot should suggest Russian variable names

---

## 📚 Сценарии тестирования документации / Documentation Test Scenarios

### Тест 10: Отсутствующая документация / Test 10: Missing Documentation
**Цель:** Пометить недокументированные функции
**Objective:** Flag undocumented functions

**Тестовый код / Test Code:**
```javascript
// Отсутствующая документация - Должно быть помечено
// Missing documentation - Should be flagged
function complexCalculation(a, b, c, options) {
    if (!options) options = {};
    
    const result = (a * b) + (c / (options.divisor || 1));
    return Math.round(result * 100) / 100;
}

/**
 * Вычисляет взвешенное среднее с округлением
 * Calculates weighted average with rounding
 * @param {number} a - Первое значение / First value
 * @param {number} b - Вес для первого значения / Weight for first value
 * @param {number} c - Второе значение / Second value
 * @param {object} options - Параметры конфигурации / Configuration options
 * @param {number} options.divisor - Делитель для второго значения / Divisor for second value
 * @returns {number} Вычисленный результат с округлением до 2 знаков / Calculated result rounded to 2 decimals
 */
function complexCalculationDocumented(a, b, c, options) {
    if (!options) options = {};
    
    const result = (a * b) + (c / (options.divisor || 1));
    return Math.round(result * 100) / 100;
}
```

**Ожидаемый результат / Expected Result:** 📝 BugBot должен предложить добавить документацию / BugBot should suggest adding documentation

---

## 🚀 План выполнения тестов / Test Execution Plan

### Фаза 1: Базовая функциональность (Неделя 1) / Phase 1: Basic Functionality (Week 1)
1. **Настройка тестовой среды / Setup Test Environment**
   ```bash
   git checkout -b test/bugbot-validation
   ```

2. **Создание тестовых PR / Create Test PRs**
   - Один PR на тестовый сценарий / One PR per test scenario
   - Небольшие, сфокусированные изменения / Small, focused changes
   - Ясные цели тестирования в описании PR / Clear test objectives in PR description

3. **Валидация обнаружения / Validate Detection**
   - Проверить появление комментариев BugBot / Check BugBot comments appear
   - Проверить точность обнаружений / Verify accuracy of detections
   - Документировать ложные срабатывания/пропуски / Document any false positives/negatives

### Фаза 2: Продвинутые сценарии (Неделя 2) / Phase 2: Advanced Scenarios (Week 2)
1. **Сложные паттерны кода / Complex Code Patterns**
   - Смешать несколько проблем в одном PR / Mix multiple issues in single PR
   - Тестировать граничные случаи / Test edge cases
   - Валидировать приоритизацию / Validate prioritization

2. **Интеграционное тестирование / Integration Testing**
   - Тестировать с существующим CI/CD пайплайном / Test with existing CI/CD pipeline
   - Проверить отсутствие конфликтов рабочих процессов / Verify no workflow conflicts
   - Проверить влияние на производительность / Check performance impact

### Фаза 3: Тонкая настройка (Неделя 3) / Phase 3: Fine-tuning (Week 3)
1. **Оптимизация конфигурации / Configuration Optimization**
   - Настроить чувствительность обнаружения / Adjust detection sensitivity
   - Кастомизировать правила под нужды проекта / Customize rules for project needs
   - Обновить рабочий процесс при необходимости / Update workflow if needed

2. **Обучение команды / Team Training**
   - Поделиться результатами тестов с командой / Share test results with team
   - Документировать лучшие практики / Document best practices
   - Создать руководство по рабочему процессу / Create workflow guidelines

## 📊 Метрики успеха / Success Metrics

### Точность обнаружения / Detection Accuracy:
- **Истинно положительные:** Проблемы правильно выявлены / **True Positives:** Issues correctly identified
- **Ложно положительные:** Не-проблемы помечены как проблемы / **False Positives:** Non-issues flagged as problems
- **Ложно отрицательные:** Реальные проблемы пропущены / **False Negatives:** Real issues missed
- **Целевая точность:** 90%+ истинно положительных / **Target Accuracy:** 90%+ true positive rate

### Покрытие / Coverage:
- **Проблемы безопасности:** 95% скорость обнаружения / **Security Issues:** 95% detection rate
- **Качество кода:** 85% скорость обнаружения / **Code Quality:** 85% detection rate
- **Производительность:** 70% скорость обнаружения / **Performance:** 70% detection rate
- **Документация:** 80% скорость обнаружения / **Documentation:** 80% detection rate

### Принятие командой / Team Adoption:
- **Использованные комментарии PR:** Цель 90% / **PR Comments Acted On:** Target 90%
- **Удовлетворённость команды:** Опрос через 1 месяц / **Team Satisfaction:** Survey after 1 month
- **Интеграция рабочего процесса:** Бесперебойная работа / **Workflow Integration:** Seamless operation

---

## 🔧 Автоматизация тестов / Test Automation

### Автоматизированное создание тестов / Automated Test Creation:
```bash
#!/bin/bash
# Создать тестовый PR с известными проблемами
# Create test PR with known issues

git checkout -b test/security-$(date +%s)

# Добавить тестовый файл с проблемой безопасности
# Add test file with security issue
cat > test-security.js << EOF
const apiKey = "hardcoded-secret-123";
console.log("Отладочная информация:", apiKey);
console.log("Debug info:", apiKey);
EOF

git add test-security.js
git commit -m "test: добавить тестовый случай безопасности"
git commit -m "test: add security test case"
git push origin HEAD

# Создать PR через GitHub CLI / Create PR via GitHub CLI
gh pr create --title "Тест: Обнаружение проблем безопасности / Test: Security Issue Detection" \
             --body "Тестирование возможностей BugBot по обнаружению безопасности / Testing BugBot security detection capabilities"
```

### Скрипты валидации / Validation Scripts:
```bash
#!/bin/bash
# Валидировать ответы BugBot / Validate BugBot responses

PR_NUMBER=$1
EXPECTED_ISSUES=$2

# Ждём анализа BugBot / Wait for BugBot analysis
sleep 30

# Проверяем, прокомментировал ли BugBot / Check if BugBot commented
COMMENTS=$(gh pr view $PR_NUMBER --json comments --jq '.comments | length')

if [ $COMMENTS -gt 0 ]; then
    echo "✅ BugBot ответил на PR #$PR_NUMBER / BugBot responded to PR #$PR_NUMBER"
    
    # Проверяем, найдены ли ожидаемые проблемы / Check if expected issues were found
    gh pr view $PR_NUMBER --json comments --jq '.comments[].body' | \
        grep -i "$EXPECTED_ISSUES" && echo "✅ Ожидаемая проблема обнаружена / Expected issue detected"
else
    echo "❌ BugBot не ответил на PR #$PR_NUMBER / BugBot did not respond to PR #$PR_NUMBER"
fi
```

## 📝 Отчётность / Reporting

### Формат результатов тестов / Test Results Format:
```markdown
# Результаты тестирования BugBot - [Дата] / BugBot Test Results - [Date]

## Краткое изложение / Summary
- **Выполнено тестов / Tests Executed:** X/Y
- **Скорость обнаружения / Detection Rate:** XX%
- **Ложно положительные / False Positives:** X
- **Влияние на производительность / Performance Impact:** <1s per PR

## Подробные результаты / Detailed Results
| Тест / Test | Ожидалось / Expected | Фактически / Actual | Статус / Status |
|-------------|---------------------|---------------------|-----------------|
| Безопасность #1 / Security #1 | ⚠️ Secret detected | ⚠️ Secret detected | ✅ Пройден / Pass |
| Качество #1 / Quality #1 | ⚠️ Console found | ❌ Not detected | ❌ Неуспех / Fail |

## Рекомендации / Recommendations
- Настроить чувствительность обнаружения безопасности / Adjust security detection sensitivity
- Добавить пользовательские правила для операторов console / Add custom rules for console statements
- Обновить руководящие принципы команды / Update team guidelines
```

### Еженедельные отчёты / Weekly Reports:
- Сводка выполнения тестов / Test execution summary
- Тренды точности обнаружения / Detection accuracy trends
- Компиляция обратной связи команды / Team feedback compilation
- Рекомендации по конфигурации / Configuration recommendations

---

**Следующие шаги / Next Steps:**
1. Выполнить тесты Фазы 1 на этой неделе / Execute Phase 1 tests this week
2. Документировать все находки / Document all findings
3. Поделиться результатами с командой разработки / Share results with development team
4. Доработать конфигурацию BugBot на основе результатов / Refine BugBot configuration based on results
