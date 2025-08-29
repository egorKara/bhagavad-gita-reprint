#!/bin/bash

# 🎥 Автоматическая оптимизация Tor Browser для YouTube

echo "🚀 TOR YOUTUBE OPTIMIZER"
echo "========================"
echo ""

# Проверка Tor Browser
TOR_PROFILE=$(find ~/.tor-browser* -name "prefs.js" 2>/dev/null | head -1)
if [ -z "$TOR_PROFILE" ]; then
    echo "❌ Tor Browser не найден"
    echo "💡 Установите Tor Browser сначала"
    exit 1
fi

TOR_DIR=$(dirname "$TOR_PROFILE")
echo "✅ Найден Tor Browser: $TOR_DIR"

# Создание оптимизированных настроек
echo ""
echo "⚡ ПРИМЕНЯЮ ОПТИМИЗАЦИИ..."

# Создаём файл с оптимизациями
cat >> "$TOR_PROFILE" << 'PREFS'

// 🎥 YouTube оптимизации для Tor Browser
user_pref("network.http.max-connections", 200);
user_pref("network.http.max-connections-per-server", 32);
user_pref("media.cache_size", 1048576);
user_pref("media.memory_cache_max_size", 524288);
user_pref("network.buffer.cache.size", 65536);
user_pref("media.hardware-video-decoding.enabled", true);
user_pref("gfx.webrender.enabled", true);
user_pref("media.autoplay.default", 1);
user_pref("extensions.torbutton.security_slider", 1);

PREFS

echo "✅ Оптимизации применены!"
echo ""
echo "🎯 РЕКОМЕНДУЕМЫЕ INVIDIOUS ИНСТАНСЫ:"
echo "   🥇 https://invidious.privacydev.net"
echo "   🥈 https://yewtu.be" 
echo "   🥉 https://inv.nadeko.net"
echo ""
echo "📋 ЧТО СДЕЛАНО:"
echo "   ⚡ Увеличены лимиты соединений"
echo "   💾 Увеличен видео кэш до 1GB"
echo "   🎬 Включено аппаратное декодирование"
echo "   🔧 Оптимизирован буфер сети"
echo ""
echo "🔄 ПЕРЕЗАПУСТИТЕ TOR BROWSER для применения настроек!"
