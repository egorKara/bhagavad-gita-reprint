# Cursor Background Agents Configuration

## Agent Capabilities
- Synchronizes repository (`pull --rebase`)
- Executes TODO tasks
- Makes atomic commits and pushes
- Can trigger deployment (push to `main`) and create snapshots
- Integrates with Memory Bank for context retention
- Auto-fixes linting errors when possible

## Базовые команды
```bash
# синхронизация
git fetch --all --prune && git pull --rebase --autostash

# запуск линтера и тестов
npm run lint
npm test

# деплой (запускается по push в main)
git push origin main
```

## Снапшот в Cursor
- Кнопка: Take Snapshot
- CLI/скрипт: `scripts/agent_snapshot.sh`
- Включается: `public/**`, `src/**`, `docs/**`, `.github/**`, `package.json`, `README.md`
- Исключается: `.git/**`, `node_modules/**`, `tests/**`, `package-lock.json`

## Правила коммитов
- Префиксы: `feat|fix|chore|refactor|docs|ci`
- Сообщение: кратко цель, что изменено

## Деплой GitHub Pages
- Workflow: `.github/workflows/deploy-gh-pages.yml`
- Триггер: push в `main` или ручной запуск в Actions

## Troubleshooting
- Застрял `git pull`: прервать, `git merge --abort`, `git rebase --abort`, удалить `.git/index.lock`, затем `git pull --rebase --autostash`
- Очередь Actions: запустить `Cleanup Actions queue` (workflow)