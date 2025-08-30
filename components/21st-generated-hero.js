/* global document, setTimeout */

// Анимация появления hero секции
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.spiritual-hero');
    heroSection.style.opacity = '0';
    heroSection.style.transform = 'translateY(30px)';

    setTimeout(() => {
        heroSection.style.transition = 'all 1s ease';
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }, 300);
});
