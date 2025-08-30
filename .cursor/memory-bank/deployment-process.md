# Deployment Process & CI/CD (.NET)

## Deployment Architecture
- **Frontend:** GitHub Pages (static files)
- **Backend:** Yandex Cloud VM (Ubuntu, .NET Runtime, systemd services)
- **Domain Setup:** Dual domain configuration
- **SSL:** Let's Encrypt automated renewal

## GitHub Actions Workflows

### 1. Deploy to GitHub Pages
- **File:** `.github/workflows/deploy-gh-pages.yml`
- **Trigger:** Push to main branch or manual dispatch
- **Process:**
  1. Checkout repository
  2. Copy public/* to out/
  3. Add CNAME record
  4. Deploy to gh-pages branch
- **Timeout:** 8 minutes
- **Concurrency:** Cancel in-progress for new deploys

### 2. .NET Build & Test
- **File:** `.github/workflows/dotnet-build.yml` (to be created)
- **Trigger:** Pull requests, push to main
- **Process:** 
  1. Setup .NET 8.0
  2. Restore dependencies
  3. Build projects
  4. Run tests (xUnit)
- **Standards:** Zero tolerance for build errors

### 3. Quality Assurance
- **File:** `.github/workflows/quality.yml` (to be created)
- **Process:** Code analysis, security scanning
- **Tools:** .NET analyzers, security scanners

## Backend Deployment (Yandex Cloud)

### Server Setup
- **OS:** Ubuntu Linux
- **Runtime:** .NET 8.0 Runtime
- **Web Server:** Nginx (reverse proxy)
- **Process Manager:** systemd
- **SSL:** Let's Encrypt with auto-renewal
- **Security:** Fail2ban, UFW firewall

### Deployment Commands
```bash
# Manual deployment process
git pull --rebase --autostash
dotnet publish -c Release -o /var/www/gita-landing
sudo systemctl restart gita-api
sudo systemctl reload nginx
```

### Configuration Files
- **Nginx:** `/etc/nginx/sites-available/gita-1972-reprint.ru`
- **systemd:** `/etc/systemd/system/gita-api.service`
- **SSL:** Automatic via certbot
- **Logs:** `/var/log/nginx/` and journalctl

## .NET Specific Deployment

### Build Process
```bash
# Local build
dotnet restore
dotnet build
dotnet test

# Production build
dotnet publish -c Release -o ./publish
```

### Runtime Configuration
- **Port:** 5000 (HTTP), 5001 (HTTPS)
- **Environment:** Production/Development
- **Database:** PostgreSQL connection string
- **Logging:** Serilog with file output

### Dependencies
- **Runtime:** .NET 8.0 Runtime
- **Database:** PostgreSQL client libraries
- **Monitoring:** Prometheus.NET

## Automated Scripts

### Agent Setup (`scripts/agent_setup.sh`)
- Git configuration for agents
- Repository synchronization
- .NET dependencies installation
- Non-interactive execution

### Snapshot Creation (`scripts/agent_snapshot.sh`)
- Project state capture
- Selective file inclusion/exclusion
- Timestamped archives
- Development workflow support

## Monitoring & Health Checks
- **Prometheus Metrics:** `/metrics` endpoint
- **Health Check:** `/health` endpoint
- **Nginx Status:** `stub_status` module
- **System Monitoring:** systemd service status
- **Security:** Fail2ban intrusion detection

## Environment Configuration
- **Production:** appsettings.Production.json
- **Development:** appsettings.Development.json
- **GitHub Secrets:** Sensitive data storage
- **CORS:** Strict origin policies
- **Rate Limiting:** Built-in .NET protection

## Rollback Procedures
1. **Frontend:** Revert commit and push to main
2. **Backend:** 
   - `git revert <commit>`
   - `dotnet publish` and restart service
3. **Database:** Entity Framework migrations
4. **DNS:** TTL considerations for domain changes

## Performance Monitoring
- **Core Web Vitals:** Automated tracking
- **API Response Times:** Prometheus metrics
- **Error Rates:** Structured logging with Serilog
- **Uptime:** External monitoring recommended

## .NET Migration Benefits
- **Faster Deployment:** Compiled assemblies
- **Better Performance:** Native .NET execution
- **Stronger Security:** Built-in .NET security
- **Easier Maintenance:** Strong typing and tooling
