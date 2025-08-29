#!/bin/bash
PID_FILE="/tmp/cursor-security-agent.pid"
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "✅ Агент безопасности активен (PID: $PID)"
        echo "📊 Последние логи:"
        tail -n 20 security-agent.log 2>/dev/null || echo "Лог файл не найден"
    else
        echo "❌ Агент не активен"
        rm -f "$PID_FILE"
    fi
else
    echo "❌ PID файл не найден"
fi
