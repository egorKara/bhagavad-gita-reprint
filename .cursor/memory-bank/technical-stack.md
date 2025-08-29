# Technical Stack & Architecture (.NET)

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
- **Runtime:** .NET 8.0
- **Framework:** ASP.NET Core 8
- **ORM:** Entity Framework Core 8
- **Database:** 
  - Production: PostgreSQL
  - Development: SQLite
- **Security:** 
  - Built-in .NET security features
  - CORS configuration
  - Rate limiting
  - Serilog logging
- **Monitoring:** Prometheus metrics endpoint
- **API Documentation:** Swagger/OpenAPI

## Infrastructure
- **Web Server:** Nginx (reverse proxy, SSL termination)
- **SSL:** Let's Encrypt certificates
- **Process Management:** systemd services
- **Hosting:** 
  - Frontend: GitHub Pages
  - Backend: Yandex Cloud VM with .NET Runtime
- **DNS:** reg.ru domain management
- **CDN:** GitHub Pages built-in CDN

## Development Tools
- **IDE:** Visual Studio Code, Visual Studio 2022
- **SDK:** .NET 8.0 SDK
- **Package Manager:** NuGet
- **Testing:** xUnit (ready for configuration)
- **CI/CD:** GitHub Actions workflows

## File Structure
```
public/                    # Static frontend files (GitHub Pages)
├── assets/
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side scripts
│   └── images/           # Images and SVG assets
├── *.html                # Page templates

GitaLanding.API/          # .NET Web API
├── Controllers/          # API controllers
├── Program.cs            # Application entry point
├── appsettings.json      # Configuration
└── GitaLanding.API.csproj

GitaLanding.Data/         # Entity Framework Core
├── Repositories/         # Data repositories
├── GitaLandingDbContext.cs
└── GitaLanding.Data.csproj

GitaLanding.sln           # .NET Solution file
docs/                     # Documentation
deployment/               # Deployment scripts
.github/                  # CI/CD workflows
```

## Performance Characteristics
- **Bundle Size:** ~360KB total project (frontend)
- **API Response:** Expected <100ms average (.NET compiled)
- **Core Web Vitals:** Optimized
- **Browser Support:** All modern browsers
- **Mobile Optimization:** 100% responsive

## Migration Benefits
- **Performance:** Compiled .NET vs interpreted Node.js
- **Type Safety:** Strong C# typing vs dynamic JavaScript
- **Database:** EF Core vs manual SQL queries
- **Security:** Built-in .NET security features
- **Scalability:** Better resource management
