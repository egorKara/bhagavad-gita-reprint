// 🤖 Yandex Server Agent Dashboard JavaScript
class AgentDashboard {
    constructor() {
        this.apiUrl = window.location.protocol === 'https:' 
            ? 'https://api.gita-1972-reprint.ru' 
            : 'http://localhost:3000';
        this.updateInterval = 30000; // 30 секунд
        this.performanceChart = null;
        this.init();
    }

    init() {
        this.initChart();
        this.startDataUpdates();
        this.setupEventListeners();
        
        // Первоначальная загрузка данных
        this.updateDashboard();
        
        console.log('🚀 Agent Dashboard инициализирован');
    }

    initChart() {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'CPU %',
                        data: [],
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'RAM %',
                        data: [],
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Ошибка загрузки ${endpoint}:`, error);
            this.updateConnectionStatus(false);
            return null;
        }
    }

    async updateDashboard() {
        try {
            // Обновляем статус подключения
            this.updateConnectionStatus(true);
            
            // Загружаем системные метрики
            const metrics = await this.fetchData('/api/metrics');
            if (metrics) {
                this.updateSystemMetrics(metrics);
                this.updateChart(metrics);
            }

            // Загружаем статус сервисов
            const services = await this.fetchData('/api/services');
            if (services) {
                this.updateServicesStatus(services);
            }

            // Загружаем AI анализ
            const aiAnalysis = await this.fetchData('/api/ai-analysis');
            if (aiAnalysis) {
                this.updateAIAnalysis(aiAnalysis);
            }

            // Загружаем логи
            const logs = await this.fetchData('/api/logs');
            if (logs) {
                this.updateLogs(logs);
            }

            // Обновляем время последнего обновления
            this.updateLastUpdateTime();

        } catch (error) {
            console.error('Ошибка обновления дашборда:', error);
            this.updateConnectionStatus(false);
        }
    }

    updateSystemMetrics(metrics) {
        const system = metrics.system || {};
        
        document.getElementById('cpu-usage').textContent = 
            system.cpu_percent ? `${system.cpu_percent.toFixed(1)}%` : '---%';
        
        document.getElementById('memory-usage').textContent = 
            system.memory_percent ? `${system.memory_percent.toFixed(1)}%` : '---%';
        
        document.getElementById('disk-usage').textContent = 
            system.disk_percent ? `${system.disk_percent.toFixed(1)}%` : '---%';
        
        document.getElementById('uptime').textContent = 
            system.uptime_seconds ? this.formatUptime(system.uptime_seconds) : '-- дней';
    }

    updateChart(metrics) {
        const system = metrics.system || {};
        const now = new Date().toLocaleTimeString();
        
        // Добавляем новые данные
        this.performanceChart.data.labels.push(now);
        this.performanceChart.data.datasets[0].data.push(system.cpu_percent || 0);
        this.performanceChart.data.datasets[1].data.push(system.memory_percent || 0);
        
        // Ограничиваем количество точек (последние 20)
        if (this.performanceChart.data.labels.length > 20) {
            this.performanceChart.data.labels.shift();
            this.performanceChart.data.datasets[0].data.shift();
            this.performanceChart.data.datasets[1].data.shift();
        }
        
        this.performanceChart.update();
    }

    updateServicesStatus(services) {
        const serviceElements = {
            'yandex-server-agent': 'agent-status',
            'nginx': 'nginx-status',
            'api': 'api-status',
            'telegram': 'telegram-status'
        };

        Object.entries(serviceElements).forEach(([service, elementId]) => {
            const element = document.getElementById(elementId);
            const isActive = services[service]?.active || false;
            
            if (isActive) {
                element.textContent = 'Активен';
                element.className = 'px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm';
            } else {
                element.textContent = 'Неактивен';
                element.className = 'px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm';
            }
        });
    }

    updateAIAnalysis(analysis) {
        const container = document.getElementById('ai-analysis');
        if (!analysis) return;

        const criticalIssues = analysis.critical_issues || 0;
        const securityLevel = analysis.security_level || 'Неизвестно';
        const recommendations = analysis.recommendations || [];

        container.innerHTML = `
            <div class="flex items-start">
                <i class="fas fa-brain text-purple-600 mr-3 mt-1"></i>
                <div>
                    <p class="font-medium">Последний анализ логов</p>
                    <p class="text-gray-600 text-sm">Обнаружено ${criticalIssues} критических проблем</p>
                </div>
            </div>
            
            <div class="flex items-start">
                <i class="fas fa-chart-line text-green-600 mr-3 mt-1"></i>
                <div>
                    <p class="font-medium">Предиктивный анализ</p>
                    <p class="text-gray-600 text-sm">${analysis.prediction || 'Производительность стабильна'}</p>
                </div>
            </div>
            
            <div class="flex items-start">
                <i class="fas fa-shield-alt text-blue-600 mr-3 mt-1"></i>
                <div>
                    <p class="font-medium">Безопасность</p>
                    <p class="text-gray-600 text-sm">Уровень защиты: ${securityLevel}</p>
                </div>
            </div>
        `;
    }

    updateLogs(logs) {
        const container = document.getElementById('recent-logs');
        if (!logs || !Array.isArray(logs)) return;

        container.innerHTML = logs.slice(0, 10).map(log => {
            const level = log.level || 'info';
            const time = new Date(log.timestamp).toLocaleTimeString();
            const message = log.message || 'Неизвестное событие';
            
            const levelColors = {
                'error': 'bg-red-50 border-red-400',
                'warning': 'bg-yellow-50 border-yellow-400',
                'info': 'bg-blue-50 border-blue-400',
                'success': 'bg-green-50 border-green-400'
            };
            
            const levelIcons = {
                'error': '❌',
                'warning': '⚠️',
                'info': '📊',
                'success': '✅'
            };
            
            return `
                <div class="text-sm p-2 ${levelColors[level] || levelColors.info} rounded border-l-4">
                    <span class="text-gray-500">${time}</span>
                    <span class="ml-2">${levelIcons[level] || '📋'} ${message}</span>
                </div>
            `;
        }).join('');
    }

    updateConnectionStatus(isConnected) {
        const indicator = document.getElementById('status-indicator');
        const status = document.getElementById('connection-status');
        
        if (isConnected) {
            indicator.className = 'status-indicator status-online mr-2';
            status.textContent = 'Подключен';
        } else {
            indicator.className = 'status-indicator status-offline mr-2';
            status.textContent = 'Отключен';
        }
    }

    updateLastUpdateTime() {
        const element = document.getElementById('last-update');
        element.textContent = `Обновлено: ${new Date().toLocaleTimeString()}`;
    }

    formatUptime(seconds) {
        const days = Math.floor(seconds / (24 * 3600));
        const hours = Math.floor((seconds % (24 * 3600)) / 3600);
        
        if (days > 0) {
            return `${days} дн. ${hours} ч.`;
        } else if (hours > 0) {
            return `${hours} ч.`;
        } else {
            return `${Math.floor(seconds / 60)} мин.`;
        }
    }

    startDataUpdates() {
        setInterval(() => {
            this.updateDashboard();
        }, this.updateInterval);
        
        console.log(`🔄 Автообновление каждые ${this.updateInterval / 1000} секунд`);
    }

    setupEventListeners() {
        // Обновление при фокусе на окне
        window.addEventListener('focus', () => {
            this.updateDashboard();
        });

        // Обработка ошибок
        window.addEventListener('error', (error) => {
            console.error('Ошибка дашборда:', error);
        });
    }
}

// Инициализация дашборда после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new AgentDashboard();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentDashboard;
}
