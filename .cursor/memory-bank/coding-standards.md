# Coding Standards & Guidelines

## Language Configuration
- **Primary Language:** English (code comments, documentation, UI)
- **Secondary Language:** Russian (localization, user-facing content)
- **Code Communication:** English only in source code
- **User Interface:** Bilingual with English as default

## JavaScript Standards
- **Version:** ES6+ features preferred
- **Style Guide:** Airbnb-based with project customizations
- **Linting:** ESLint v9+ flat configuration
- **Formatting:** Prettier with 2-space indentation
- **File Naming:** kebab-case for files, camelCase for variables

## CSS Standards
- **Methodology:** BEM-inspired class naming
- **Variables:** CSS custom properties for theming
- **Layout:** CSS Grid and Flexbox
- **Responsive:** Mobile-first breakpoints
- **Performance:** Avoid inline styles, minimize CSS
- **Browser Support:** Modern browsers only

## HTML Standards
- **Semantic Markup:** Proper HTML5 elements
- **Accessibility:** ARIA labels and roles
- **SEO:** Structured data (JSON-LD), meta tags
- **Performance:** Lazy loading for images
- **Validation:** W3C compliant markup

## Git Workflow
- **Commit Prefixes:** feat, fix, chore, refactor, docs, ci, perf, test
- **Branch Naming:** cursor/{short-task-description}
- **Commit Messages:** Clear, concise, imperative mood
- **Pull Requests:** [type] Summary format
- **Atomic Commits:** Small, focused changes

## Security Guidelines
- **Secrets Management:** .env files, GitHub Secrets only
- **Input Validation:** Sanitize all user inputs
- **CORS:** Strict origin policies
- **Headers:** Security headers via Helmet.js
- **Rate Limiting:** API endpoint protection

## Documentation Standards
- **README:** English primary, Russian summary
- **Comments:** Explain why, not what
- **API Documentation:** OpenAPI/Swagger format
- **Inline Docs:** JSDoc for complex functions
- **Architecture:** Markdown documentation in docs/

## Testing Approach (Current: Minimal)
- **Unit Tests:** Jest framework ready
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Not currently implemented
- **Linting:** Automated via GitHub Actions
- **Manual QA:** Cross-browser testing required

## Performance Standards
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size:** Minimize JavaScript payload
- **Images:** WebP format, lazy loading
- **Caching:** Appropriate cache headers
- **Minification:** CSS and JS optimization
