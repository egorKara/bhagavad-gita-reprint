/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}', './dist/**/*.html'],
    theme: {
        extend: {
            colors: {
                'gita-gold': '#D4AF37',
                'gita-dark': '#1a1a1a',
                'gita-light': '#f8f8f8'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif']
            }
        }
    },
    plugins: []
};
