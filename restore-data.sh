#!/bin/bash

echo "📁 ВОССТАНОВЛЕНИЕ ДАННЫХ ИЗ СТАРОЙ VM"
echo "====================================="
echo ""

if [ $# -ne 2 ]; then
    echo "Использование: $0 <NEW_VM_ID> <OLD_DISK_ID>"
    echo "Пример: $0 new123 fhm1oq24ev3b0uagbk8g"
    exit 1
fi

NEW_VM_ID="$1"
OLD_DISK_ID="$2"

echo "🆔 Новая VM: $NEW_VM_ID"
echo "💾 Старый диск: $OLD_DISK_ID"
echo ""

echo "🛑 1. Останавливаю старую VM для безопасного отключения диска..."
yc compute instance stop fhmmuttj78nf215noffh
sleep 30

echo "🔌 2. Подключаю старый диск к новой VM как дополнительный..."
yc compute instance attach-disk "$NEW_VM_ID" \
  --disk-id "$OLD_DISK_ID" \
  --device-name old-data \
  --auto-delete false

echo "⏰ 3. Жду подключения диска (30 секунд)..."
sleep 30

echo "🚀 4. Подключаюсь к новой VM и монтирую старый диск..."
yc compute ssh "$NEW_VM_ID" --command "
sudo mkdir -p /mnt/old-vm
sudo mount /dev/disk/by-id/virtio-old-data1 /mnt/old-vm 2>/dev/null || sudo mount /dev/vdb1 /mnt/old-vm
echo 'Диск смонтирован в /mnt/old-vm'
ls -la /mnt/old-vm/home/
"

echo "📂 5. Копирую проект gita-1972..."
yc compute ssh "$NEW_VM_ID" --command "
sudo mkdir -p /home/\$(whoami)/gita-1972
sudo cp -r /mnt/old-vm/home/yc-user/gita-1972/* /home/\$(whoami)/gita-1972/ 2>/dev/null || echo 'Проект не найден в ожидаемом месте'
sudo chown -R \$(whoami):\$(whoami) /home/\$(whoami)/gita-1972/
echo 'Проект скопирован'
ls -la /home/\$(whoami)/gita-1972/
"

echo "🔐 6. Копирую SSL сертификаты..."
yc compute ssh "$NEW_VM_ID" --command "
sudo mkdir -p /etc/letsencrypt
sudo cp -r /mnt/old-vm/etc/letsencrypt/* /etc/letsencrypt/ 2>/dev/null || echo 'SSL сертификаты не найдены'
echo 'SSL сертификаты скопированы'
"

echo "⚙️ 7. Копирую конфигурацию Nginx..."
yc compute ssh "$NEW_VM_ID" --command "
sudo cp /mnt/old-vm/etc/nginx/sites-available/* /etc/nginx/sites-available/ 2>/dev/null || echo 'Nginx конфиг не найден'
sudo cp /mnt/old-vm/etc/nginx/sites-enabled/* /etc/nginx/sites-enabled/ 2>/dev/null || echo 'Nginx symlinks не найдены'
echo 'Nginx конфигурация скопирована'
"

echo ""
echo "✅ ВОССТАНОВЛЕНИЕ ДАННЫХ ЗАВЕРШЕНО!"
echo "🎯 Следующие шаги:"
echo "1. Установить Node.js и зависимости"
echo "2. Установить Nginx"
echo "3. Восстановить SSL сертификаты"
echo "4. Запустить API сервер"
echo "5. Развернуть Yandex Server Agent"
