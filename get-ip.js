#!/usr/bin/env node

const os = require('os');

console.log('🌐 Информация о сетевых интерфейсах для удаленного доступа');
console.log('===========================================================');

const interfaces = os.networkInterfaces();

console.log('\n📋 Доступные IP-адреса:');

Object.keys(interfaces).forEach(interfaceName => {
    console.log(`\n🖥️  Интерфейс: ${interfaceName}`);
    
    interfaces[interfaceName].forEach(interface => {
        if (interface.family === 'IPv4') {
            const isExternal = !interface.internal;
            const status = isExternal ? '🌐 Внешний' : '🏠 Локальный';
            
            console.log(`   ${status}: ${interface.address}`);
            
            if (isExternal) {
                console.log(`   📱 Для доступа: http://${interface.address}:3000`);
            }
        }
    });
});

console.log('\n💡 Рекомендации:');
console.log('• Используйте внешние IP-адреса для доступа из других устройств');
console.log('• Убедитесь, что порт 3000 открыт в брандмауэре');
console.log('• Для продакшена используйте домен и HTTPS');

console.log('\n🔧 Команды для открытия портов:');
console.log('Windows: netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=3000');
console.log('Linux: sudo ufw allow 3000');

console.log('\n🚀 Запуск сервера:');
console.log('npm run server или npm run dev'); 