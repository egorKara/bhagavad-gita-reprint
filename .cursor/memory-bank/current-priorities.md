# Current Priorities & Active Tasks (.NET)

## Project Status: MIGRATED TO .NET (v3.0.0)
**Migration Date:** August 2025  
**Overall Status:** .NET architecture ready, setup required

## Active Development Tasks (PROJECT_TODO.md)

### High Priority (.NET Setup)
- [ ] Install .NET 8.0 SDK locally
- [ ] Create and configure .csproj files
- [ ] Set up Entity Framework Core with PostgreSQL
- [ ] Configure Nginx for .NET API
- [ ] Deploy .NET API to production server

### Medium Priority (Integration)
- [ ] Test .NET API endpoints locally
- [ ] Integrate .NET API with frontend
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD for .NET

### Low Priority (Enhancements)
- [ ] Add real photographs (cover, spreads, author)
- [ ] Connect Telegram/WhatsApp/SMS integration
- [ ] Improve SEO: sitemap.xml, robots.txt, JSON-LD
- [ ] Enhance monitoring and analytics

## Migration Status ✅
- [x] Node.js components removed
- [x] .NET projects created (API + Data)
- [x] Entity Framework Core configured
- [x] Documentation updated
- [x] .gitignore configured for .NET

## Current Architecture
- **Frontend:** Static files (GitHub Pages) ✅
- **Backend:** ASP.NET Core 8 + EF Core ⏳
- **Database:** PostgreSQL (prod), SQLite (dev) ⏳
- **Infrastructure:** Yandex Cloud + Nginx ⏳

## Development Workflow Notes
- **Git Strategy:** Atomic commits with semantic prefixes
- **Branch Naming:** `cursor/{short-task-description}`
- **Testing:** xUnit ready for .NET testing
- **Documentation:** English primary, Russian where needed
- **Agent Rules:** Background agents maintain TODO list

## Technical Benefits of .NET Migration
- **Performance:** Compiled code vs interpreted Node.js
- **Type Safety:** Strong C# typing vs dynamic JavaScript
- **Database:** Entity Framework Core vs manual SQL
- **Security:** Built-in .NET security features
- **Scalability:** Better resource management

## Next Steps
1. **Local .NET Development** (1 day)
2. **Server Deployment** (1 day)
3. **Integration & Testing** (1 day)
4. **Production Launch** (1 day)

**Total Time:** 4 days for full .NET deployment
