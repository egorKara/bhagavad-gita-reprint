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
            const deliveryPrice = this.deliveryPrices[deliveryMethod] || 0;

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
            this.updateSummaryField('summaryDelivery', this.getDeliveryText(deliveryMethod));
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
        const deliveryTexts = {
            post: 'Почта России',
            courier: 'Курьерская доставка',
            pickup: 'Самовывоз'
        };
        return deliveryTexts[method] || method;
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
        } catch (error) {
            // console.error('Ошибка отправки заказа:', error); // Убрано для безопасности
            this.showMessage('Произошла ошибка при отправке заказа. Попробуйте еще раз.', 'error');
        } finally {
            this.setSubmitting(false);
        }
    }

    collectFormData() {
        // Безопасный сбор данных из формы без FormData
        const data = {};
        const formElements = this.form.elements;
        
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && element.value) {
                data[element.name] = this.sanitizeInput(element.value);
            }
        }

        // Добавление дополнительной информации
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

    calculateTotalPrice() {
        const quantity = document.getElementById('quantity').value;
        const deliveryMethod = document.getElementById('deliveryMethod').value;

        if (!quantity || !deliveryMethod) return 0;

        const quantityNum = quantity === 'more' ? 1 : parseInt(quantity);
        const booksPrice = quantityNum * this.bookPrice;
        const deliveryPrice = this.deliveryPrices[deliveryMethod] || 0;

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
        return this.deliveryPrices[deliveryMethod] || 0;
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

            // Простой таймаут без AbortController для совместимости
            let timeoutId;
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 30000);
            });

            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
                // signal: controller.signal, // Убрано для совместимости
                credentials: 'same-origin' // Отправка cookies для сессии
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const result = await response.json();
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
