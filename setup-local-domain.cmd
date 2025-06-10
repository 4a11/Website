@echo off
echo 🌐 Настройка локального домена novadom.local
echo ===============================================

echo Добавляю запись в hosts файл...
echo.

REM Проверяем права администратора
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ОШИБКА: Запустите скрипт от имени администратора!
    echo.
    echo Щелкните правой кнопкой мыши на файл и выберите "Запустить от имени администратора"
    pause
    exit /b 1
)

REM Добавляем записи в hosts файл
echo 212.220.204.230 novadom.local >> C:\Windows\System32\drivers\etc\hosts
echo 212.220.204.230 www.novadom.local >> C:\Windows\System32\drivers\etc\hosts
echo 192.168.0.4 novadom.local >> C:\Windows\System32\drivers\etc\hosts
echo 192.168.0.4 www.novadom.local >> C:\Windows\System32\drivers\etc\hosts

echo ✅ Локальный домен настроен!
echo.
echo 🎯 Теперь сайт доступен по адресам:
echo    • http://novadom.local:3000
echo    • http://www.novadom.local:3000
echo.
echo 💡 Примечание: Домен будет работать только на этом компьютере
echo    Для доступа с других устройств нужно повторить настройку
echo.

REM Очистка DNS кэша
ipconfig /flushdns >nul 2>&1
echo 🔄 DNS кэш очищен

echo.
pause 