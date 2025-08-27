#!/bin/bash

echo "🚀 СОЗДАНИЕ НОВОЙ VM GITA-1972-REPRINT"
echo "======================================"
echo ""

# Конфигурация на основе текущей VM
VM_NAME="gita-1972-reprint-new"
ZONE="ru-central1-a"
PLATFORM="standard-v2"
CORES="2"
MEMORY="2GB"
DISK_SIZE="20GB"
SUBNET_ID="e9bk13ptc6bqdsfa587q"

echo "📋 Параметры новой VM:"
echo "- Имя: $VM_NAME"
echo "- Зона: $ZONE"
echo "- Платформа: $PLATFORM"
echo "- CPU: $CORES ядра"
echo "- RAM: $MEMORY"
echo "- Диск: $DISK_SIZE (вместо 10GB)"
echo "- Подсеть: $SUBNET_ID"
echo ""

echo "🔧 Создаю VM с рабочим SSH..."
yc compute instance create \
  --name "$VM_NAME" \
  --zone "$ZONE" \
  --platform "$PLATFORM" \
  --cores "$CORES" \
  --memory "$MEMORY" \
  --create-boot-disk image-family=ubuntu-2404-lts,size="$DISK_SIZE",type=network-hdd \
  --network-interface subnet-id="$SUBNET_ID",nat-ip-version=ipv4 \
  --metadata enable-oslogin=true \
  --metadata startup-script='#!/bin/bash
    echo "=== VM Startup Script ===" >> /var/log/vm-startup.log
    apt-get update >> /var/log/vm-startup.log 2>&1
    apt-get install -y htop curl wget git >> /var/log/vm-startup.log 2>&1
    systemctl enable ssh >> /var/log/vm-startup.log 2>&1
    systemctl start ssh >> /var/log/vm-startup.log 2>&1
    echo "SSH enabled and started" >> /var/log/vm-startup.log
    '

echo ""
echo "✅ VM создана! Получаю информацию..."

# Ждем создания VM
sleep 30

# Получаем ID новой VM
NEW_VM_ID=$(yc compute instance list --filter "name='$VM_NAME'" --format json | jq -r '.[0].id')
echo "🆔 ID новой VM: $NEW_VM_ID"

# Получаем IP адрес
NEW_VM_IP=$(yc compute instance get "$NEW_VM_ID" --format json | jq -r '.network_interfaces[0].primary_v4_address.one_to_one_nat.address')
echo "🌐 IP новой VM: $NEW_VM_IP"

echo ""
echo "🧪 Тестирую SSH подключение к новой VM..."
sleep 60  # Ждем полной загрузки

# Тестируем SSH
if timeout 10 yc compute ssh "$NEW_VM_ID" --command "echo 'SSH работает!'" 2>/dev/null; then
    echo "✅ SSH к новой VM работает!"
else
    echo "⏰ SSH еще не готов, нужно подождать..."
fi

echo ""
echo "📊 РЕЗУЛЬТАТ:"
echo "VM ID: $NEW_VM_ID"
echo "VM IP: $NEW_VM_IP" 
echo "SSH: yc compute ssh $NEW_VM_ID"
echo ""
echo "🎯 Готово к восстановлению данных!"
