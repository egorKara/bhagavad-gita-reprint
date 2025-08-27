#!/bin/bash

echo "🚀 ПОЛНАЯ МИГРАЦИЯ GITA-1972-REPRINT"
echo "===================================="
echo ""
echo "⚠️  ВНИМАНИЕ: Этот скрипт выполнит:"
echo "1. 🏗️  Создание новой VM с рабочим SSH"
echo "2. 💾 Восстановление данных со старой VM"
echo "3. ⚙️  Настройку полного окружения"
echo "4. 🔄 Обновление DNS записей"
echo ""
read -p "Продолжить? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Отменено пользователем"
    exit 1
fi

echo ""
echo "�� ЭТАП 1: СОЗДАНИЕ НОВОЙ VM"
echo "============================="
chmod +x create-new-vm.sh
./create-new-vm.sh

# Получаем данные новой VM
NEW_VM_ID=$(yc compute instance list --filter "name='gita-1972-reprint-new'" --format json | jq -r '.[0].id')
OLD_DISK_ID="fhm1oq24ev3b0uagbk8g"

if [ -z "$NEW_VM_ID" ] || [ "$NEW_VM_ID" = "null" ]; then
    echo "❌ Ошибка: не удалось получить ID новой VM"
    exit 1
fi

echo "✅ Новая VM создана: $NEW_VM_ID"
echo ""

echo "🎯 ЭТАП 2: ВОССТАНОВЛЕНИЕ ДАННЫХ"
echo "================================"
chmod +x restore-data.sh
./restore-data.sh "$NEW_VM_ID" "$OLD_DISK_ID"
echo ""

echo "🎯 ЭТАП 3: НАСТРОЙКА ОКРУЖЕНИЯ"
echo "=============================="
chmod +x setup-environment.sh
./setup-environment.sh "$NEW_VM_ID"
echo ""

echo "🎯 ЭТАП 4: ЗАПУСК СЕРВИСОВ"
echo "=========================="
yc compute ssh "$NEW_VM_ID" --command "
cd ~/gita-1972
sudo systemctl start gita-api
sudo systemctl status gita-api --no-pager
curl -s http://localhost:3000/api/health || echo 'API еще запускается...'
"

echo ""
echo "🎯 ЭТАП 5: ПОЛУЧЕНИЕ НОВОГО IP ДЛЯ DNS"
echo "======================================"
NEW_VM_IP=$(yc compute instance get "$NEW_VM_ID" --format json | jq -r '.network_interfaces[0].primary_v4_address.one_to_one_nat.address')

echo ""
echo "🎉 МИГРАЦИЯ ЗАВЕРШЕНА!"
echo "====================="
echo ""
echo "📊 НОВАЯ VM:"
echo "- ID: $NEW_VM_ID"
echo "- IP: $NEW_VM_IP"
echo "- SSH: yc compute ssh $NEW_VM_ID"
echo ""
echo "🔧 СЛЕДУЮЩИЕ ШАГИ:"
echo "1. Обновить DNS записи:"
echo "   - api.gita-1972-reprint.ru → $NEW_VM_IP"
echo "   - gita-1972-reprint.ru → $NEW_VM_IP"
echo ""
echo "2. Проверить работу API:"
echo "   curl https://api.gita-1972-reprint.ru/api/health"
echo ""
echo "3. Удалить старую VM после проверки:"
echo "   yc compute instance delete fhmmuttj78nf215noffh"
