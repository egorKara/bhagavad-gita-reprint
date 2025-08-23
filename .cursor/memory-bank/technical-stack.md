# Technical Stack & Architecture

## Frontend Technologies
- **HTML5:** Semantic markup, ARIA accessibility
- **CSS3:** 
  - CSS Variables for theming
  - CSS Grid + Flexbox for layouts
  - Mobile-first responsive design
  - Animations and transitions
- **JavaScript ES6+:**
  - Modular architecture
  - Translation system
  - Theme switcher
  - Interactive components
  - SEO optimization

## Backend Technologies
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js v5+
- **Security:** 
  - Helmet.js for headers
  - CORS configuration
  - Rate limiting
  - Morgan logging
- **Monitoring:** Prometheus metrics endpoint
- **Dependencies:**
  - UUID for request tracking
  - Cheerio for HTML parsing
  - dotenv for environment variables

## Infrastructure
- **Web Server:** Nginx (reverse proxy, SSL termination)
- **SSL:** Let's Encrypt certificates
- **Process Management:** systemd services
- **Hosting:** 
  - Frontend: GitHub Pages
  - Backend: Yandex Cloud VM
- **DNS:** reg.ru domain management
- **CDN:** GitHub Pages built-in CDN

## Development Tools
- **Linting:** ESLint v9+ (flat config)
- **Formatting:** Prettier
- **Git Hooks:** Husky
- **Testing:** Jest (configured but minimal coverage)
- **CI/CD:** GitHub Actions workflows

## File Structure
```
public/           # Static frontend files
├── assets/
│   ├── css/     # Stylesheets
│   ├── js/      # Client-side scripts
│   └── images/  # Images and SVG assets
├── *.html       # Page templates
src/             # Backend API
├── api/         # Controllers and routes
├── config/      # Configuration
├── services/    # Business logic
└── server.js    # Application entry point
docs/            # Documentation
scripts/         # Automation scripts
.github/         # CI/CD workflows
```

## Performance Characteristics
- **Bundle Size:** ~360KB total project
- **API Response:** ~170ms average
- **Core Web Vitals:** Optimized
- **Browser Support:** All modern browsers
- **Mobile Optimization:** 100% responsive
