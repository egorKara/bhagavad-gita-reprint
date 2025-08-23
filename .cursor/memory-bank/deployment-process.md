# Deployment Process & CI/CD

## Deployment Architecture
- **Frontend:** GitHub Pages (static files)
- **Backend:** Yandex Cloud VM (Ubuntu, systemd services)
- **Domain Setup:** Dual domain configuration
- **SSL:** Let's Encrypt automated renewal

## GitHub Actions Workflows

### 1. Deploy to GitHub Pages
- **File:** `.github/workflows/deploy-gh-pages.yml`
- **Trigger:** Push to main branch or manual dispatch
- **Process:**
  1. Checkout repository
  2. Setup Node.js v20
  3. Copy public/* to out/
  4. Add CNAME record
  5. Deploy to gh-pages branch
- **Timeout:** 12 minutes
- **Concurrency:** Cancel in-progress for new deploys

### 2. Linting & Quality
- **File:** `.github/workflows/lint.yml`
- **Trigger:** Pull requests, push to main
- **Process:** ESLint validation
- **Standards:** Zero tolerance for linting errors

### 3. Testing
- **File:** `.github/workflows/test.yml`
- **Framework:** Jest
- **Coverage:** Minimal (API endpoints only)
- **Status:** Configured but not comprehensive

### 4. Utility Workflows
- **Cleanup Actions Queue:** Manual cleanup for stuck workflows
- **Sync Labels:** GitHub repository label management
- **Sync Project TODO:** TODO synchronization with GitHub Issues

## Backend Deployment (Yandex Cloud)

### Server Setup
- **OS:** Ubuntu Linux
- **Web Server:** Nginx (reverse proxy + static files)
- **Process Manager:** systemd
- **SSL:** Let's Encrypt with auto-renewal
- **Security:** Fail2ban, UFW firewall

### Deployment Commands
```bash
# Manual deployment process
git pull --rebase --autostash
npm ci --production
sudo systemctl restart gita-api
sudo systemctl reload nginx
```

### Configuration Files
- **Nginx:** `/etc/nginx/sites-available/gita-1972-reprint.ru`
- **systemd:** `/etc/systemd/system/gita-api.service`
- **SSL:** Automatic via certbot
- **Logs:** `/var/log/nginx/` and journalctl

## Automated Scripts

### Agent Setup (`scripts/agent_setup.sh`)
- Git configuration for agents
- Repository synchronization
- Dependencies installation
- Non-interactive execution

### Snapshot Creation (`scripts/agent_snapshot.sh`)
- Project state capture
- Selective file inclusion/exclusion
- Timestamped archives
- Development workflow support

## Monitoring & Health Checks
- **Prometheus Metrics:** `/metrics` endpoint
- **Nginx Status:** `stub_status` module
- **System Monitoring:** systemd service status
- **Security:** Fail2ban intrusion detection

## Environment Configuration
- **Production:** Environment variables via .env
- **GitHub Secrets:** Sensitive data storage
- **CORS:** Strict origin policies
- **Rate Limiting:** API protection

## Rollback Procedures
1. **Frontend:** Revert commit and push to main
2. **Backend:** 
   - `git revert <commit>`
   - `sudo systemctl restart gita-api`
3. **Database:** Not applicable (stateless API)
4. **DNS:** TTL considerations for domain changes

## Performance Monitoring
- **Core Web Vitals:** Automated tracking
- **API Response Times:** Prometheus metrics
- **Error Rates:** Structured logging
- **Uptime:** External monitoring recommended
