/**
 * Переключатель цветовых схем для проекта Бхагавад-Гита 1972
 * Позволяет пользователям выбирать между различными цветовыми темами
 */

class ThemeSwitcher {
    constructor() {
        this.themes = [
            { id: 'classic', name: 'Классическая', description: 'Оригинальная коричнево-золотая схема' },
            { id: 'vedic', name: 'Ведическая', description: 'Красно-золотая схема в стиле ведической традиции' },
            { id: 'modern', name: 'Современная', description: 'Сине-серая схема для современного восприятия' },
            { id: 'warm', name: 'Теплая', description: 'Песочная схема с оранжевыми акцентами' },
            { id: 'elegant', name: 'Элегантная', description: 'Серо-золотая схема для изысканного дизайна' },
            { id: 'calm', name: 'Спокойная', description: 'Оливково-зеленая схема для умиротворения' }
        ];
        
        this.currentTheme = 'classic';
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.createThemeSwitcher();
        this.applyTheme(this.currentTheme);
    }
    
    createThemeSwitcher() {
        // Создаем кнопку переключателя тем
        const themeButton = document.createElement('button');
        themeButton.className = 'theme-switch';
        themeButton.innerHTML = '🎨';
        themeButton.title = 'Сменить цветовую схему';
        themeButton.onclick = () => this.showThemeModal();
        
        // Добавляем кнопку рядом с переключателем языка
        const languageSwitch = document.querySelector('.language-switch');
        if (languageSwitch && languageSwitch.parentNode) {
            languageSwitch.parentNode.insertBefore(themeButton, languageSwitch.nextSibling);
        } else {
            document.body.appendChild(themeButton);
        }
        
        // Добавляем стили для кнопки
        this.addThemeSwitchStyles();
    }
    
    addThemeSwitchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-switch {
                position: fixed;
                top: 20px;
                right: 80px;
                z-index: 9999;
                background: var(--accent-color);
                color: var(--text-dark);
                border: 2px solid var(--primary-color);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .theme-switch:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                background: var(--primary-color);
                color: white;
            }
            
            .theme-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .theme-modal.show {
                display: flex;
            }
            
            .theme-modal-content {
                background: var(--background-white);
                border-radius: var(--border-radius);
                padding: 30px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-medium);
                border: 2px solid var(--accent-color);
            }
            
            .theme-modal-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .theme-modal-title {
                color: var(--primary-color);
                font-size: 1.8rem;
                margin-bottom: 10px;
            }
            
            .theme-modal-subtitle {
                color: var(--text-light);
                font-size: 1rem;
            }
            
            .themes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .theme-option {
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius);
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--background-white);
            }
            
            .theme-option:hover {
                border-color: var(--accent-color);
                transform: translateY(-2px);
                box-shadow: var(--shadow-medium);
            }
            
            .theme-option.active {
                border-color: var(--accent-color);
                background: var(--overlay-accent);
            }
            
            .theme-preview {
                width: 100%;
                height: 60px;
                border-radius: 8px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 0.9rem;
            }
            
            .theme-name {
                color: var(--text-dark);
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 8px;
            }
            
            .theme-description {
                color: var(--text-light);
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .theme-actions {
                text-align: center;
            }
            
            .theme-apply-btn {
                background: var(--gradient-primary);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: var(--border-radius);
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: var(--shadow-light);
            }
            
            .theme-apply-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-medium);
            }
            
            .theme-close-btn {
                background: transparent;
                color: var(--text-light);
                border: 2px solid var(--border-color);
                padding: 10px 20px;
                border-radius: var(--border-radius);
                margin-left: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .theme-close-btn:hover {
                background: var(--border-color);
                color: var(--text-dark);
            }
            
            @media (max-width: 768px) {
                .theme-switch {
                    right: 20px;
                    top: 80px;
                }
                
                .themes-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    showThemeModal() {
        const modal = document.createElement('div');
        modal.className = 'theme-modal';
        modal.innerHTML = this.createModalHTML();
        
        document.body.appendChild(modal);
        
        // Показываем модальное окно
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Обработчики событий
        this.bindModalEvents(modal);
    }
    
    createModalHTML() {
        const themesHTML = this.themes.map(theme => `
            <div class="theme-option ${theme.id === this.currentTheme ? 'active' : ''}" 
                 data-theme="${theme.id}">
                <div class="theme-preview" style="background: ${this.getThemePreviewColor(theme.id)}">
                    ${theme.name}
                </div>
                <div class="theme-name">${theme.name}</div>
                <div class="theme-description">${theme.description}</div>
            </div>
        `).join('');
        
        return `
            <div class="theme-modal-content">
                <div class="theme-modal-header">
                    <h2 class="theme-modal-title">Выберите цветовую схему</h2>
                    <p class="theme-modal-subtitle">Персонализируйте внешний вид сайта под свой вкус</p>
                </div>
                
                <div class="themes-grid">
                    ${themesHTML}
                </div>
                
                <div class="theme-actions">
                    <button class="theme-apply-btn">Применить схему</button>
                    <button class="theme-close-btn">Закрыть</button>
                </div>
            </div>
        `;
    }
    
    getThemePreviewColor(themeId) {
        const themeColors = {
            'classic': 'linear-gradient(135deg, #8B4513, #D2691E)',
            'vedic': 'linear-gradient(135deg, #8B0000, #B22222)',
            'modern': 'linear-gradient(135deg, #2C3E50, #34495E)',
            'warm': 'linear-gradient(135deg, #A0522D, #CD853F)',
            'elegant': 'linear-gradient(135deg, #2F4F4F, #696969)',
            'calm': 'linear-gradient(135deg, #556B2F, #6B8E23)'
        };
        return themeColors[themeId] || themeColors['classic'];
    }
    
    bindModalEvents(modal) {
        // Выбор темы
        modal.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.currentTheme = option.dataset.theme;
            });
        });
        
        // Применение темы
        modal.querySelector('.theme-apply-btn').addEventListener('click', () => {
            this.applyTheme(this.currentTheme);
            this.saveTheme();
            this.closeModal(modal);
        });
        
        // Закрытие модального окна
        modal.querySelector('.theme-close-btn').addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }
    
    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    applyTheme(themeId) {
        // Удаляем все предыдущие темы
        document.documentElement.removeAttribute('data-theme');
        
        // Применяем новую тему
        if (themeId !== 'classic') {
            document.documentElement.setAttribute('data-theme', themeId);
        }
        
        // Обновляем текущую тему
        this.currentTheme = themeId;
        
        // Показываем уведомление
        this.showThemeNotification(themeId);
    }
    
    showThemeNotification(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        if (!theme) return;
        
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <span>🎨 Применена схема: ${theme.name}</span>
        `;
        
        // Добавляем стили для уведомления
        const style = document.createElement('style');
        style.textContent = `
            .theme-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--gradient-primary);
                color: white;
                padding: 15px 25px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-medium);
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                font-weight: 500;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Автоматически скрываем через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    saveTheme() {
        localStorage.setItem('gita-theme', this.currentTheme);
    }
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('gita-theme');
        if (savedTheme && this.themes.some(t => t.id === savedTheme)) {
            this.currentTheme = savedTheme;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSwitcher();
});

