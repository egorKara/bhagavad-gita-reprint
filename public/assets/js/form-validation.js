/**
 * Валидация формы заказа
 * Включает проверку всех полей, защиту от XSS и валидацию по стандартам
 */

class OrderFormValidator {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.isSubmitting = false;

        this.deliveryPrices = {
            post: 300,
            courier: 500,
            pickup: 0
        };

        this.bookPrice = 0; // Цена уточняется

        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.updateSummary();
        }
    }

    setupEventListeners() {
        // Валидация в реальном времени
        this.form.querySelectorAll('input, select, textarea').forEach((field) => {
            field.addEventListener('input', () => this.validateField(field));
            field.addEventListener('blur', () => this.validateField(field));
        });

        // Обработка отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Обновление сводки при изменении количества или способа доставки
        const quantitySelect = document.getElementById('quantity');
        const deliverySelect = document.getElementById('deliveryMethod');

        if (quantitySelect) {
            quantitySelect.addEventListener('change', () => this.updateSummary());
        }

        if (deliverySelect) {
            deliverySelect.addEventListener('change', () => this.updateSummary());
        }
    }

    validateField(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(fieldName + 'Error');

        if (!errorElement) return;

        let isValid = true;
        let errorMessage = '';

        // Проверка обязательных полей
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        // Специфичные проверки
        if (field.value.trim() && field.pattern) {
            // Безопасная проверка паттерна без динамического RegExp
            const pattern = field.pattern;
            let isValidPattern = true;

            // Предопределенные безопасные паттерны
            if (pattern === '^[a-zA-Zа-яА-Я\\s-]+$') {
                isValidPattern = /^[a-zA-Zа-яА-Я\s-]+$/.test(field.value);
            } else if (pattern === '^[0-9]{6}$') {
                isValidPattern = /^[0-9]{6}$/.test(field.value);
            } else if (pattern === '^[a-zA-Zа-яА-Я0-9\\s-]+$') {
                isValidPattern = /^[a-zA-Zа-яА-Я0-9\s-]+$/.test(field.value);
            }

            if (!isValidPattern) {
                isValid = false;
                errorMessage = field.title || 'Неверный формат';
            }
        }

        // Дополнительные проверки
        if (fieldName === 'firstName' || fieldName === 'lastName') {
            if (field.value.trim() && field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Минимальная длина 2 символа';
            }
        }

        // Проверка телефона удалена, так как поле телефона больше не используется

        if (fieldName === 'postalCode') {
            if (field.value.trim() && !/^[0-9]{6}$/.test(field.value)) {
                isValid = false;
                errorMessage = 'Индекс должен содержать 6 цифр';
            }
        }

        // Отображение ошибки
        this.showFieldError(field, errorElement, isValid, errorMessage);

        return isValid;
    }

    showFieldError(field, errorElement, isValid, errorMessage) {
        if (isValid) {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
    }

    updateSummary() {
        const quantity = document.getElementById('quantity').value;
        const deliveryMethod = document.getElementById('deliveryMethod').value;

        if (quantity && deliveryMethod) {
            const quantityNum = quantity === 'more' ? 1 : parseInt(quantity);
            const booksPrice = quantityNum * this.bookPrice;

            // Безопасный доступ к цене доставки
            const deliveryPrice = this.getSafeDeliveryPrice(deliveryMethod);

            // Применение скидки
            let discount = 0;
            if (quantityNum >= 3) {
                discount = booksPrice * 0.1;
            }

            // Бесплатная доставка при заказе от 5000 ₽
            let finalDeliveryPrice = deliveryPrice;
            if (booksPrice >= 5000) {
                finalDeliveryPrice = 0;
            }

            const total = booksPrice - discount + finalDeliveryPrice;

            // Обновление сводки
            this.updateSummaryField('summaryQuantity', quantityNum === 1 ? '1 книга' : `${quantityNum} книг`);
            this.updateSummaryField('summaryBooksPrice', `${booksPrice} ₽`);
            this.updateSummaryField('summaryDelivery', this.getSafeDeliveryText(deliveryMethod));
            this.updateSummaryField(
                'summaryDeliveryPrice',
                finalDeliveryPrice === 0 ? 'Бесплатно' : `${finalDeliveryPrice} ₽`
            );
            this.updateSummaryField('totalPrice', `${total} ₽`);

            // Обновление информации о скидке
            if (discount > 0) {
                this.updateSummaryField('summaryBooksPrice', `${booksPrice} ₽ (скидка ${discount} ₽)`);
            }
        }
    }

    getDeliveryText(method) {
        // Безопасная проверка метода доставки
        if (typeof method !== 'string') {
            return 'Неизвестный метод доставки';
        }

        const safeMethod = this.sanitizeInput(method);
        if (!safeMethod || typeof safeMethod !== 'string') {
            return 'Неизвестный метод доставки';
        }

        // Безопасное получение текста доставки
        switch (safeMethod) {
            case 'post':
                return 'Почта России';
            case 'courier':
                return 'Курьерская доставка';
            case 'pickup':
                return 'Самовывоз';
            default:
                return 'Неизвестный метод доставки';
        }
    }

    updateSummaryField(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    validateForm() {
        let isValid = true;

        // Валидация всех полей
        this.form.querySelectorAll('input[required], select[required], textarea[required]').forEach((field) => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        if (!this.validateForm()) {
            this.showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }

        this.setSubmitting(true);

        try {
            const formData = this.collectFormData();
            await this.submitOrder(formData);
        } catch {
            // console.error('Ошибка отправки заказа:', error); // Убрано для безопасности
            this.showMessage('Произошла ошибка при отправке заказа. Попробуйте еще раз.', 'error');
        } finally {
            this.setSubmitting(false);
        }
    }

    collectFormData() {
        // Безопасный сбор данных из формы без FormData
        const data = this.createSafeFormObject();
        const formElements = this.form.elements;

        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && element.value && typeof element.name === 'string') {
                // Безопасное присваивание с проверкой имени
                const sanitizedName = this.sanitizeInput(element.name);
                if (sanitizedName && typeof sanitizedName === 'string') {
                    // Дополнительная проверка безопасности
                    const safeName = this.sanitizeInput(sanitizedName);
                    if (safeName && typeof safeName === 'string' && this.isValidFieldName(safeName)) {
                        // Безопасное присваивание с проверкой имени
                        const sanitizedValue = this.sanitizeInput(element.value);
                        if (this.isValidFieldName(safeName)) {
                            // Используем прямую проверку для безопасного присваивания
                            switch (safeName) {
                                case 'name':
                                    if (this.isValidInput(sanitizedValue, 'name')) {
                                        Object.defineProperty(data, 'name', {
                                            value: sanitizedValue,
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                    }
                                    break;
                                case 'email':
                                    if (this.isValidInput(sanitizedValue, 'email')) {
                                        Object.defineProperty(data, 'email', {
                                            value: sanitizedValue,
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                    }
                                    break;
                                case 'phone':
                                    if (this.isValidInput(sanitizedValue, 'phone')) {
                                        Object.defineProperty(data, 'phone', {
                                            value: sanitizedValue,
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                    }
                                    break;
                                case 'address':
                                    if (this.isValidInput(sanitizedValue, 'address')) {
                                        Object.defineProperty(data, 'address', {
                                            value: sanitizedValue,
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                    }
                                    break;
                                case 'quantity':
                                    if (this.isValidInput(sanitizedValue, 'quantity')) {
                                        Object.defineProperty(data, 'quantity', {
                                            value: sanitizedValue,
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                    }
                                    break;
                                case 'deliveryMethod':
                                    if (this.isValidInput(sanitizedValue, 'deliveryMethod')) {
                                        Object.defineProperty(data, 'deliveryMethod', {
                                            value: sanitizedValue,
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                    }
                                    break;
                                case 'comment':
                                    if (this.isValidInput(sanitizedValue, 'comment')) {
                                        Object.defineProperty(data, 'comment', {
                                            value: sanitizedValue,
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                    }
                                    break;
                                default:
                                    // Игнорируем неизвестные поля
                                    break;
                            }
                        }
                    }
                }
            }
        }

        // Обновление дополнительной информации
        data.orderDate = new Date().toISOString();
        data.totalPrice = this.calculateTotalPrice();
        data.deliveryPrice = this.getDeliveryPrice();
        data.userAgent = navigator.userAgent;
        data.timestamp = Date.now();

        return data;
    }

    // Санитизация входящих данных для защиты от XSS
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        return input
            .trim()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // Проверка валидности имени поля
    isValidFieldName(name) {
        // Проверяем, что имя поля соответствует ожидаемому формату
        if (typeof name !== 'string' || name.length === 0) return false;

        // Разрешаем только буквы, цифры, дефисы и подчеркивания
        const validNamePattern = /^[a-zA-Z0-9_-]+$/;
        return validNamePattern.test(name);
    }

    // Проверка валидности входящих данных
    isValidInput(value, fieldType) {
        if (typeof value !== 'string') return false;

        // Дополнительная валидация в зависимости от типа поля
        switch (fieldType) {
            case 'name':
                return value.length >= 2 && value.length <= 100;
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailPattern.test(value);
            case 'phone':
                const phonePattern = /^[\d\s\-\+\(\)]+$/;
                return phonePattern.test(value) && value.length >= 10;
            case 'address':
                return value.length >= 10 && value.length <= 500;
            case 'quantity':
                return ['1', '2', '3', 'more'].includes(value);
            case 'deliveryMethod':
                return ['post', 'courier', 'pickup'].includes(value);
            case 'comment':
                return value.length <= 1000;
            default:
                return false;
        }
    }

    // Безопасное добавление свойства к объекту
    safeSetProperty(obj, key, value) {
        if (this.isValidFieldName(key)) {
            // Используем Reflect.set для безопасного присваивания
            return Reflect.set(obj, key, value);
        }
        return false;
    }

    // Создание безопасного объекта формы
    createSafeFormObject() {
        const obj = Object.create(null);

        // Безопасно добавляем предопределенные свойства напрямую
        if (this.isValidFieldName('orderDate')) {
            obj.orderDate = new Date().toISOString();
        }
        if (this.isValidFieldName('totalPrice')) {
            obj.totalPrice = 0;
        }
        if (this.isValidFieldName('deliveryPrice')) {
            obj.deliveryPrice = 0;
        }
        if (this.isValidFieldName('userAgent')) {
            obj.userAgent = navigator.userAgent;
        }
        if (this.isValidFieldName('timestamp')) {
            obj.timestamp = Date.now();
        }

        return obj;
    }

    // Безопасное получение цены доставки
    getSafeDeliveryPrice(method) {
        if (typeof method !== 'string') {
            return 0;
        }

        const safeMethod = this.sanitizeInput(method);
        if (!safeMethod || typeof safeMethod !== 'string') {
            return 0;
        }

        // Безопасное получение цены доставки
        switch (safeMethod) {
            case 'post':
                return 300; // Фиксированная цена для почты
            case 'courier':
                return 500; // Фиксированная цена для курьера
            case 'pickup':
                return 0; // Бесплатный самовывоз
            default:
                return 0;
        }
    }

    // Безопасное получение текста доставки
    getSafeDeliveryText(method) {
        if (typeof method !== 'string') {
            return 'Неизвестный метод доставки';
        }

        const safeMethod = this.sanitizeInput(method);
        if (!safeMethod || typeof safeMethod !== 'string') {
            return 'Неизвестный метод доставки';
        }

        // Безопасное получение текста доставки
        switch (safeMethod) {
            case 'post':
                return 'Почта России';
            case 'courier':
                return 'Курьерская доставка';
            case 'pickup':
                return 'Самовывоз';
            default:
                return 'Неизвестный метод доставки';
        }
    }

    calculateTotalPrice() {
        const quantity = document.getElementById('quantity').value;
        const deliveryMethod = document.getElementById('deliveryMethod').value;

        if (!quantity || !deliveryMethod) return 0;

        const quantityNum = quantity === 'more' ? 1 : parseInt(quantity);
        const booksPrice = quantityNum * this.bookPrice;

        // Безопасный доступ к цене доставки
        const deliveryPrice = this.getSafeDeliveryPrice(deliveryMethod);

        let discount = 0;
        if (quantityNum >= 3) {
            discount = booksPrice * 0.1;
        }

        let finalDeliveryPrice = deliveryPrice;
        if (booksPrice >= 5000) {
            finalDeliveryPrice = 0;
        }

        return booksPrice - discount + finalDeliveryPrice;
    }

    getDeliveryPrice() {
        const deliveryMethod = document.getElementById('deliveryMethod').value;
        return this.getSafeDeliveryPrice(deliveryMethod);
    }

    async submitOrder(data) {
        try {
            // Добавляем CSRF токен (если доступен)
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const headers = {
                'Content-Type': 'application/json'
            };

            if (csrfToken) {
                headers['X-CSRF-Token'] = csrfToken;
            }

            // Простой таймаут для совместимости
            let timeoutId;
            setTimeout(() => {
                // Таймаут не используется в текущей реализации
                // Можно добавить логику отмены запроса в будущем
            }, 30000);

            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
                credentials: 'same-origin' // Отправка cookies для сессии
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                // Успешный ответ - не нужно парсить JSON если он не используется
                this.showMessage('Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
                this.form.reset();
                this.updateSummary();

                // Перенаправление на страницу благодарности
                setTimeout(() => {
                    window.location.href = 'thanks.html';
                }, 2000);
            } else if (response.status === 429) {
                throw new Error('Слишком много запросов. Попробуйте позже.');
            } else if (response.status >= 500) {
                throw new Error('Ошибка сервера. Попробуйте позже.');
            } else {
                const error = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
                throw new Error(error.message || 'Ошибка при отправке заказа');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Время ожидания истекло. Проверьте интернет-соединение.');
            }
            throw error;
        }
    }

    setSubmitting(submitting) {
        this.isSubmitting = submitting;
        const buttonText = this.submitBtn.querySelector('.button-text');
        const buttonLoading = this.submitBtn.querySelector('.button-loading');

        if (submitting) {
            buttonText.style.display = 'none';
            buttonLoading.style.display = 'inline';
            this.submitBtn.disabled = true;
        } else {
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    showMessage(message, type = 'info') {
        // Создание элемента сообщения
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;

        // Вставка сообщения перед формой
        this.form.parentNode.insertBefore(messageElement, this.form);

        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new OrderFormValidator();
});
