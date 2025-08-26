/**
 * JavaScript для админ-панели управления заказами
 * Включает загрузку, отображение, поиск и управление заказами
 */

class AdminOrdersManager {
    constructor() {
        this.currentPage = 1;
        this.ordersPerPage = 20;
        this.allOrders = [];
        this.filteredOrders = [];
        this.currentOrder = null;
        this.adminToken = null;

        this.init();
    }

    init() {
        this.ensureAuth();
        this.loadOrders();
        this.bindEvents();
    }

    ensureAuth() {
        const stored = sessionStorage.getItem('admin_token');
        if (stored) {
            this.adminToken = stored;
            return;
        }
        const token = window.prompt('Введите токен администратора');
        if (token && token.trim()) {
            this.adminToken = token.trim();
            sessionStorage.setItem('admin_token', this.adminToken);
        }
    }

    getAuthHeaders() {
        return this.adminToken ? { Authorization: `Bearer ${this.adminToken}` } : {};
    }

    bindEvents() {
        // Поиск при вводе
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length >= 3 || e.target.value.length === 0) {
                    this.searchOrders();
                }
            });
        }

        // Поиск по Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchOrders();
            }
        });
    }

    /**
     * Загрузка всех заказов
     */
    async loadOrders() {
        try {
            const response = await fetch('/api/orders/list', {
                headers: this.getAuthHeaders()
            });
            const data = await response.json();

            if (data.success) {
                this.allOrders = data.data;
                this.filteredOrders = [...this.allOrders];
                this.displayOrders();
                this.updatePagination();
                this.loadStats();
            } else {
                this.showError('Ошибка загрузки заказов: ' + data.error);
            }
        } catch {
            this.showError('Ошибка соединения с сервером');
        }
    }

    /**
     * Отображение заказов в таблице
     */
    displayOrders() {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.ordersPerPage;
        const endIndex = startIndex + this.ordersPerPage;
        const pageOrders = this.filteredOrders.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        if (pageOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px;">
                        <p style="color: var(--text-light); font-size: 1.1rem;">
                            ${this.filteredOrders.length === 0 ? 'Заказы не найдены' : 'Нет заказов на этой странице'}
                        </p>
                    </td>
                </tr>
            `;
            return;
        }

        pageOrders.forEach((order) => {
            const row = this.createOrderRow(order);
            tbody.appendChild(row);
        });
    }

    /**
     * Создание строки заказа
     */
    createOrderRow(order) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${order.id.slice(0, 8)}...</code></td>
            <td>${this.formatDate(order.createdAt)}</td>
            <td>${order.firstName} ${order.lastName}</td>
            <td>${order.email}</td>
            <td>${order.phone}</td>
            <td>${order.quantity}</td>
            <td><strong>${order.totalAmount} ₽</strong></td>
            <td>${this.createStatusBadge(order.status)}</td>
            <td>${this.createActionButtons(order)}</td>
        `;

        // Добавление обработчика клика для просмотра деталей
        row.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                this.showOrderDetails(order);
            }
        });

        return row;
    }

    /**
     * Создание бейджа статуса
     */
    createStatusBadge(status) {
        const statusText = this.getStatusText(status);
        return `<span class="status-badge status-${status}">${statusText}</span>`;
    }

    /**
     * Получение текста статуса
     */
    getStatusText(status) {
        // Безопасная проверка статуса без Generic Object Injection Sink
        const validStatuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return status; // Возвращаем оригинальный статус если невалидный
        }

        // Безопасный доступ к статусам через switch
        switch (status) {
            case 'new':
                return 'Новый';
            case 'processing':
                return 'В обработке';
            case 'shipped':
                return 'Отправлен';
            case 'delivered':
                return 'Доставлен';
            case 'cancelled':
                return 'Отменен';
            default:
                return status;
        }
    }

    /**
     * Создание кнопок действий
     */
    createActionButtons(order) {
        // Безопасное создание кнопок без inline onclick
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-buttons';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'action-btn view';
        viewBtn.textContent = '👁️ Просмотр';
        viewBtn.addEventListener('click', () => adminManager.showOrderDetails(order.id));

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit';
        editBtn.textContent = '✏️ Изменить';
        editBtn.addEventListener('click', () => adminManager.editOrder(order.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.textContent = '🗑️ Удалить';
        deleteBtn.addEventListener('click', () => adminManager.deleteOrder(order.id));

        actionDiv.appendChild(viewBtn);
        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);

        return actionDiv.outerHTML;
    }

    /**
     * Форматирование даты
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Поиск заказов
     */
    searchOrders() {
        const query = document.getElementById('search-input').value.toLowerCase();

        if (query.length === 0) {
            this.filteredOrders = [...this.allOrders];
        } else {
            this.filteredOrders = this.allOrders.filter(
                (order) =>
                    order.firstName.toLowerCase().includes(query) ||
                    order.lastName.toLowerCase().includes(query) ||
                    order.email.toLowerCase().includes(query) ||
                    order.phone.includes(query) ||
                    order.id.toLowerCase().includes(query)
            );
        }

        this.currentPage = 1;
        this.displayOrders();
        this.updatePagination();
    }

    /**
     * Фильтрация заказов
     */
    filterOrders() {
        const statusFilter = document.getElementById('status-filter').value;
        const dateFilter = document.getElementById('date-filter').value;

        this.filteredOrders = this.allOrders.filter((order) => {
            let matchesStatus = true;
            let matchesDate = true;

            // Фильтр по статусу
            if (statusFilter && order.status !== statusFilter) {
                matchesStatus = false;
            }

            // Фильтр по дате
            if (dateFilter) {
                const orderDate = new Date(order.createdAt);
                const now = new Date();

                switch (dateFilter) {
                    case 'today':
                        matchesDate = orderDate.toDateString() === now.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        matchesDate = orderDate >= weekAgo;
                        break;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        matchesDate = orderDate >= monthAgo;
                        break;
                }
            }

            return matchesStatus && matchesDate;
        });

        this.currentPage = 1;
        this.displayOrders();
        this.updatePagination();
    }

    /**
     * Обновление пагинации
     */
    updatePagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredOrders.length / this.ordersPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Кнопка "Предыдущая"
        paginationHTML += `
            <button onclick="adminManager.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ← Предыдущая
            </button>
        `;

        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button onclick="adminManager.goToPage(${i})" 
                            class="${i === this.currentPage ? 'active' : ''}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span>...</span>';
            }
        }

        // Кнопка "Следующая"
        paginationHTML += `
            <button onclick="adminManager.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                Следующая →
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    /**
     * Переход на страницу
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredOrders.length / this.ordersPerPage);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.displayOrders();
        this.updatePagination();
    }

    /**
     * Показать детали заказа
     */
    async showOrderDetails(orderId) {
        try {
            let order;

            if (typeof orderId === 'string') {
                // Если передан ID, загружаем заказ
                const response = await fetch(`/api/orders/${orderId}`, {
                    headers: this.getAuthHeaders()
                });
                const data = await response.json();

                if (data.success) {
                    order = data.data;
                } else {
                    this.showError('Заказ не найден');
                    return;
                }
            } else {
                // Если передан объект заказа
                order = orderId;
            }

            this.currentOrder = order;
            this.displayOrderModal(order);
        } catch {
            this.showError('Ошибка загрузки деталей заказа');
        }
    }

    /**
     * Отображение модального окна с деталями заказа
     */
    displayOrderModal(order) {
        const modal = document.getElementById('orderModal');
        const details = document.getElementById('orderDetails');

        if (!modal || !details) return;

        details.innerHTML = `
            <div class="order-details">
                <div class="order-detail-row">
                    <span class="order-detail-label">ID заказа:</span>
                    <span class="order-detail-value">${order.id}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Дата создания:</span>
                    <span class="order-detail-value">${this.formatDate(order.createdAt)}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Статус:</span>
                    <span class="order-detail-value">${this.createStatusBadge(order.status)}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Имя:</span>
                    <span class="order-detail-value">${order.firstName}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Фамилия:</span>
                    <span class="order-detail-value">${order.lastName}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Email:</span>
                    <span class="order-detail-value">${order.email}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Телефон:</span>
                    <span class="order-detail-value">${order.phone}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Адрес:</span>
                    <span class="order-detail-value">${order.address}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Количество:</span>
                    <span class="order-detail-value">${order.quantity}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Сумма:</span>
                    <span class="order-detail-value"><strong>${order.totalAmount} ₽</strong></span>
                </div>
                ${
                    order.message
                        ? `
                <div class="order-detail-row">
                    <span class="order-detail-label">Дополнительная информация:</span>
                    <span class="order-detail-value">${order.message}</span>
                </div>
                `
                        : ''
                }
            </div>
        `;

        modal.style.display = 'flex';
    }

    /**
     * Закрытие модального окна
     */
    closeOrderModal() {
        const modal = document.getElementById('orderModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Обновление статуса заказа
     */
    async updateOrderStatus() {
        if (!this.currentOrder) return;

        const newStatus = document.getElementById('orderStatusSelect')?.value || 'processing';

        try {
            const response = await fetch(`/api/orders/${this.currentOrder.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();

            if (data.success) {
                this.showSuccess('Статус обновлен');
                this.refreshOrders();
            } else {
                this.showError('Ошибка обновления статуса: ' + data.error);
            }
        } catch {
            this.showError('Ошибка соединения с сервером');
        }
    }

    /**
     * Удаление заказа
     */
    async deleteOrder(orderId) {
        if (!orderId && this.currentOrder) {
            orderId = this.currentOrder.id;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();

            if (data.success) {
                this.showSuccess('Заказ удален');
                this.refreshOrders();
            } else {
                this.showError('Ошибка удаления заказа: ' + data.error);
            }
        } catch {
            this.showError('Ошибка соединения с сервером');
        }
    }

    /**
     * Экспорт в CSV
     */
    async exportToCSV() {
        try {
            const response = await fetch('/api/orders/export/csv', {
                headers: this.getAuthHeaders()
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                this.showSuccess('Экспорт завершен');
            } else {
                const data = await response.json();
                this.showError('Ошибка экспорта: ' + data.error);
            }
        } catch {
            this.showError('Ошибка экспорта');
        }
    }

    /**
     * Загрузка статистики
     */
    async loadStats() {
        try {
            const response = await fetch('/api/orders/stats/overview', {
                headers: this.getAuthHeaders()
            });
            const data = await response.json();

            if (data.success) {
                this.displayStats(data.data);
            }
        } catch {
            // Ошибка загрузки статистики
        }
    }

    /**
     * Отображение статистики
     */
    displayStats(stats) {
        document.getElementById('total-orders').textContent = stats.totalOrders;
        document.getElementById('total-revenue').textContent = stats.totalRevenue + ' ₽';
        document.getElementById('average-order').textContent = Math.round(stats.averageOrderValue) + ' ₽';

        // Подсчет заказов за сегодня
        const today = new Date().toISOString().slice(0, 10);
        // Безопасный доступ к данным без Generic Object Injection Sink
        let todayOrders = 0;
        if (stats.ordersByMonth && typeof stats.ordersByMonth === 'object') {
            // Проверяем что ключ безопасен (только дата в формате YYYY-MM-DD)
            if (typeof today === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(today)) {
                // Используем безопасный доступ через Object.prototype.hasOwnProperty
                if (Object.prototype.hasOwnProperty.call(stats.ordersByMonth, today)) {
                    // Безопасное получение данных через Object.getOwnPropertyDescriptor
                    const todayData = Object.getOwnPropertyDescriptor(stats.ordersByMonth, today)?.value;
                    if (todayData && typeof todayData === 'object' && typeof todayData.count === 'number') {
                        todayOrders = todayData.count;
                    }
                }
            }
        }
        document.getElementById('today-orders').textContent = todayOrders;
    }

    /**
     * Показать статистику
     */
    showStats() {
        const statsOverview = document.getElementById('stats-overview');
        if (statsOverview) {
            statsOverview.style.display = statsOverview.style.display === 'none' ? 'block' : 'none';
        }
    }

    /**
     * Обновление заказов
     */
    refreshOrders() {
        this.loadOrders();
        this.showSuccess('Заказы обновлены');
    }

    /**
     * Показать сообщение об успехе
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Показать сообщение об ошибке
     */
    showError(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Показать сообщение
     */
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Инициализация при загрузке страницы
let adminManager;

document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminOrdersManager();
});

// Глобальные функции для вызова из HTML
/* eslint-disable no-unused-vars */
// Глобальные функции для вызова из HTML (используются в onclick)
function searchOrders() {
    if (adminManager) adminManager.searchOrders();
}

function filterOrders() {
    if (adminManager) adminManager.filterOrders();
}

function refreshOrders() {
    if (adminManager) adminManager.refreshOrders();
}

function exportToCSV() {
    if (adminManager) adminManager.exportToCSV();
}

function showStats() {
    if (adminManager) adminManager.showStats();
}

function closeOrderModal() {
    if (adminManager) adminManager.closeOrderModal();
}

function updateOrderStatus() {
    if (adminManager) adminManager.updateOrderStatus();
}

function deleteOrder() {
    if (adminManager) adminManager.deleteOrder();
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', (e) => {
    const modal = document.getElementById('order-modal');
    if (e.target === modal) {
        closeOrderModal();
    }
});

// Добавление CSS анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
