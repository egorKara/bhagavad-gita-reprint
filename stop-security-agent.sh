#!/bin/bash
PID_FILE="/tmp/cursor-security-agent.pid"
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Останавливаю агент с PID $PID..."
        kill "$PID"
        rm -f "$PID_FILE"
        echo "Агент остановлен"
    else
        echo "Процесс не найден, удаляю PID файл"
        rm -f "$PID_FILE"
    fi
else
    echo "PID файл не найден"
fi
