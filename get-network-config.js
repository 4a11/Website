#!/usr/bin/env node

const os = require('os');
const fs = require('fs');

console.log('🌐 Определение сетевой конфигурации...');
console.log('=====================================');

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    console.log('Доступные сетевые интерфейсы:');
    
    let localIP = null;
    
    for (const interfaceName in interfaces) {
        const interfaceData = interfaces[interfaceName];
        console.log(`\n${interfaceName}:`);
        
        for (const connection of interfaceData) {
            console.log(`  ${connection.family}: ${connection.address} (${connection.internal ? 'внутренний' : 'внешний'})`);
            
            // Ищем IPv4, не внутренний (loopback) адрес
            if (connection.family === 'IPv4' && !connection.internal) {
                if (!localIP) {
                    localIP = connection.address;
                    console.log(`  ✅ Используется как основной IP: ${localIP}`);
                }
            }
        }
    }
    
    return localIP;
}

function generateEnvironmentConfig(ip) {
    const config = `export const environment = {
    production: false,
    // Автоматически определенный IP-адрес: ${ip}
    apiUrl: 'http://${ip}:3000/api',
    database: {
        host: 'localhost',
        port: 5432,
        name: 'admin_panel_db',
        user: 'postgres',
        password: 'postgres'
    }
};`;

    return config;
}

function generateProxyConfig(ip) {
    const config = {
        "/api/*": {
            "target": `http://${ip}:3000`,
            "secure": false,
            "changeOrigin": true,
            "logLevel": "debug"
        }
    };
    
    return JSON.stringify(config, null, 2);
}

function main() {
    const localIP = getLocalIPAddress();
    
    if (!localIP) {
        console.log('❌ Не удалось определить локальный IP-адрес');
        console.log('💡 Возможные причины:');
        console.log('   - Нет активного сетевого подключения');
        console.log('   - Используется только loopback (127.0.0.1)');
        return;
    }
    
    console.log(`\n🎯 Определенный IP-адрес: ${localIP}`);
    
    // Создаем environment.auto.ts
    const envConfig = generateEnvironmentConfig(localIP);
    fs.writeFileSync('src/environments/environment.auto.ts', envConfig);
    console.log('✅ Создан файл: src/environments/environment.auto.ts');
    
    // Создаем proxy.auto.conf.json
    const proxyConfig = generateProxyConfig(localIP);
    fs.writeFileSync('proxy.auto.conf.json', proxyConfig);
    console.log('✅ Создан файл: proxy.auto.conf.json');
    
    console.log('\n📋 Инструкции по использованию:');
    console.log('===============================');
    console.log('1. Для Angular приложения:');
    console.log('   Импортируйте environment.auto.ts вместо environment.ts');
    console.log('   или замените содержимое environment.ts');
    
    console.log('\n2. Для запуска с прокси:');
    console.log('   ng serve --proxy-config proxy.auto.conf.json');
    
    console.log('\n3. Адреса для подключения:');
    console.log(`   Локальный:  http://localhost:4200`);
    console.log(`   Сетевой:    http://${localIP}:4200`);
    console.log(`   API:        http://${localIP}:3000/api`);
    
    console.log('\n4. Для доступа с других компьютеров:');
    console.log(`   - Убедитесь, что сервер запущен с host: '0.0.0.0'`);
    console.log(`   - Откройте порты 3000 и 4200 в брандмауэре`);
    console.log(`   - Другие компьютеры могут подключиться по адресу: http://${localIP}:4200`);
    
    console.log('\n🔧 Команды для запуска:');
    console.log('=======================');
    console.log('# Запуск сервера:');
    console.log('node server.js');
    console.log('');
    console.log('# Запуск Angular с автоконфигурацией:');
    console.log('ng serve --host 0.0.0.0 --proxy-config proxy.auto.conf.json');
    console.log('');
    console.log('# Или с указанием порта:');
    console.log('ng serve --host 0.0.0.0 --port 4200 --proxy-config proxy.auto.conf.json');
}

main(); 