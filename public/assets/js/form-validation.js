/**
 * Валидация формы заказа
 * Включает проверку всех полей, защиту от XSS и валидацию по стандартам
 */

class OrderFormValidator {
    constructor() {
        this.form = document.getElementById('orderForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.quantitySelect = document.getElementById('quantity');
        this.totalPriceElement = document.getElementById('totalPrice');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
            this.updateTotalPrice();
        }
    }

    bindEvents() {
        // Валидация при вводе
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', (e) => this.validateField(e.target));
            field.addEventListener('blur', (e) => this.validateField(e.target));
        });

        // Валидация при отправке
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Обновление общей цены при изменении количества
        if (this.quantitySelect) {
            this.quantitySelect.addEventListener('change', () => this.updateTotalPrice());
        }
    }

    /**
     * Валидация отдельного поля
     */
    validateField(field) {
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + 'Error');
        let isValid = true;
        let errorMessage = '';

        // Очистка предыдущих ошибок
        this.clearFieldError(fieldId);

        // Проверка обязательных полей
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        // Специфичная валидация для каждого типа поля
        if (isValid && field.value.trim()) {
            switch (fieldId) {
                case 'firstName':
                case 'lastName':
                    isValid = this.validateName(field.value);
                    if (!isValid) {
                        errorMessage = 'Имя должно содержать от 2 до 50 символов, только буквы, пробелы, дефисы и апострофы';
                    }
                    break;

                case 'email':
                    isValid = this.validateEmail(field.value);
                    if (!isValid) {
                        errorMessage = 'Введите корректный email адрес';
                    }
                    break;

                case 'phone':
                    isValid = this.validatePhone(field.value);
                    if (!isValid) {
                        errorMessage = 'Введите номер телефона в формате: +7 (XXX) XXX-XX-XX или 8 XXX XXX-XX-XX';
                    }
                    break;

                case 'address':
                    isValid = this.validateAddress(field.value);
                    if (!isValid) {
                        errorMessage = 'Адрес должен содержать от 10 до 200 символов';
                    }
                    break;

                case 'quantity':
                    isValid = this.validateQuantity(field.value);
                    if (!isValid) {
                        errorMessage = 'Выберите количество книг';
                    }
                    break;

                case 'agreement':
                    isValid = field.checked;
                    if (!isValid) {
                        errorMessage = 'Необходимо согласие с условиями заказа';
                    }
                    break;
            }
        }

        // Применение стилей и сообщений об ошибках
        if (!isValid) {
            this.showFieldError(fieldId, errorMessage);
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    /**
     * Валидация имени (защита от XSS и проверка формата)
     */
    validateName(name) {
        // Проверка длины
        if (name.length < 2 || name.length > 50) {
            return false;
        }

        // Проверка на только цифры
        if (/^\d+$/.test(name)) {
            return false;
        }

        // Проверка на исполняемые последовательности
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /data:text\/html/i,
            /vbscript:/i,
            /expression\(/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(name)) {
                return false;
            }
        }

        // Проверка на допустимые символы
        const validNamePattern = /^[А-Яа-яЁёA-Za-z\s\-']+$/;
        return validNamePattern.test(name);
    }

    /**
     * Валидация email
     */
    validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    /**
     * Валидация телефона (российский формат)
     */
    validatePhone(phone) {
        // Удаление всех пробелов и дефисов для проверки
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        // Проверка на только цифры
        if (!/^\d+$/.test(cleanPhone)) {
            return false;
        }

        // Проверка длины (10 или 11 цифр)
        if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
            return false;
        }

        // Проверка формата
        const phonePattern = /^(\+7|8)[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/;
        return phonePattern.test(phone);
    }

    /**
     * Валидация адреса
     */
    validateAddress(address) {
        if (address.length < 10 || address.length > 200) {
            return false;
        }

        // Проверка на исполняемые последовательности
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /data:text\/html/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(address)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Валидация количества
     */
    validateQuantity(quantity) {
        return quantity && quantity !== '';
    }

    /**
     * Показ ошибки для поля
     */
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * Очистка ошибки для поля
     */
    clearFieldError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    /**
     * Валидация всей формы
     */
    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, textarea, select');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Обработка отправки формы
     */
    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showFormError('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        // Показ состояния загрузки
        this.setLoadingState(true);

        try {
            // Сбор данных формы
            const formData = this.collectFormData();
            
            // Отправка данных (здесь будет интеграция с API)
            await this.submitOrder(formData);
            
            // Успешная отправка
            this.showSuccessMessage();
            this.resetForm();
            
        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
            this.showFormError('Произошла ошибка при отправке заказа. Попробуйте еще раз.');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Сбор данных формы
     */
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value.trim();
        }

        // Добавление дополнительной информации
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.language = document.documentElement.lang;

        return data;
    }

    /**
     * Отправка заказа на сервер
     */
    async submitOrder(data) {
        try {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('Заказ успешно отправлен на сервер:', result);
                return result;
            } else {
                throw new Error(result.error || 'Ошибка отправки заказа');
            }
        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
            throw error;
        }
    }

    /**
     * Установка состояния загрузки
     */
    setLoadingState(loading) {
        const buttonText = this.submitBtn.querySelector('.button-text');
        const buttonLoading = this.submitBtn.querySelector('.button-loading');
        
        if (loading) {
            buttonText.style.display = 'none';
            buttonLoading.style.display = 'inline';
            this.submitBtn.disabled = true;
        } else {
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    /**
     * Показ сообщения об ошибке формы
     */
    showFormError(message) {
        // Создание элемента для ошибки формы
        let formError = document.getElementById('formError');
        if (!formError) {
            formError = document.createElement('div');
            formError.id = 'formError';
            formError.className = 'form-error';
            this.form.insertBefore(formError, this.form.firstChild);
        }
        
        formError.textContent = message;
        formError.style.display = 'block';
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            formError.style.display = 'none';
        }, 5000);
    }

    /**
     * Показ сообщения об успехе
     */
    showSuccessMessage() {
        // Создание элемента для успешного сообщения
        let successMessage = document.getElementById('successMessage');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.id = 'successMessage';
            successMessage.className = 'success-message';
            this.form.insertBefore(successMessage, this.form.firstChild);
        }
        
        successMessage.textContent = 'Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.';
        successMessage.style.display = 'block';
        
        // Автоматическое скрытие через 10 секунд
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 10000);
    }

    /**
     * Сброс формы
     */
    resetForm() {
        this.form.reset();
        this.form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        this.form.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        this.updateTotalPrice();
    }

    /**
     * Обновление общей цены
     */
    updateTotalPrice() {
        if (this.quantitySelect && this.totalPriceElement) {
            const quantity = parseInt(this.quantitySelect.value) || 0;
            const bookPrice = 1500;
            const deliveryPrice = 300;
            const total = quantity * bookPrice + deliveryPrice;
            
            this.totalPriceElement.textContent = total + ' ₽';
        }
    }
}

// Инициализация валидатора при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new OrderFormValidator();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderFormValidator;
}
