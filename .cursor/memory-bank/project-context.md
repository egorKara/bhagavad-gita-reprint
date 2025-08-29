# Project Context: Bhagavad Gita Reprint (.NET)

## Core Information
- **Project Name:** Bhagavad-Gita As It Is (1972 Original Edition)
- **Status:** Migrated to .NET, version 3.0.0
- **Primary Goal:** Sale of licensed reprint of the original 1972 Macmillan edition
- **Target Audience:** English-speaking spiritual seekers, collectors, scholars

## Business Context
- **Product:** Authenticated reprint of Srila Prabhupada's original 1972 edition
- **Authorization:** Bhaktivedanta Book Trust licensed
- **Market:** Global English market with Russian localization
- **Value Proposition:** Authentic original edition vs. later modified versions

## Technical Architecture
- **Frontend:** Static files (HTML5, CSS3, JavaScript ES6+) - GitHub Pages
- **Backend:** ASP.NET Core 8 + Entity Framework Core
- **Database:** PostgreSQL (production), SQLite (development)
- **Deployment:** 
  - Frontend: GitHub Pages
  - Backend: Yandex Cloud VM with .NET Runtime
- **Domains:** 
  - Main: gita-1972-reprint.ru
  - API: api.gita-1972-reprint.ru

## Key Features
- **Multilingual:** English (primary), Russian (secondary)
- **Responsive Design:** Mobile-first approach
- **Theme System:** Light/dark mode with manual override
- **SEO Optimized:** JSON-LD structured data, meta tags
- **Performance:** Core Web Vitals optimized, lazy loading
- **Accessibility:** WCAG 2.1 AA compliant
- **API:** RESTful .NET Web API with Swagger documentation

## Current State
- **Architecture:** Migrated from Node.js to .NET (August 2025)
- **Status:** .NET projects created, ready for setup
- **Next Phase:** Local .NET development and server deployment
- **Monitoring:** Prometheus + Serilog integration ready

## Migration Benefits
- **Performance:** Compiled .NET code vs interpreted Node.js
- **Type Safety:** Strong typing with C# vs dynamic JavaScript
- **Database:** Entity Framework Core vs manual SQL queries
- **Security:** Built-in .NET security features
- **Scalability:** Better resource management and performance
