#!/usr/bin/env node

const http = require('http');

console.log('🧪 Тестирование подключений к серверу');
console.log('=====================================');

const testUrls = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.4:3000',  // Локальная сеть
    'http://26.230.34.171:3000' // Radmin VPN
];

function testConnection(url) {
    return new Promise((resolve) => {
        console.log(`\n🔍 Тестирую: ${url}`);
        
        const req = http.get(url, { timeout: 5000 }, (res) => {
            console.log(`✅ ${url} - Статус: ${res.statusCode}`);
            resolve(true);
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${url} - Ошибка: ${err.message}`);
            resolve(false);
        });
        
        req.on('timeout', () => {
            console.log(`⏰ ${url} - Таймаут`);
            req.destroy();
            resolve(false);
        });
    });
}

async function testAllConnections() {
    console.log('Проверяем доступность сервера...\n');
    
    let workingUrls = [];
    
    for (const url of testUrls) {
        const success = await testConnection(url);
        if (success) {
            workingUrls.push(url);
        }
    }
    
    console.log('\n📋 Результаты тестирования:');
    console.log('============================');
    
    if (workingUrls.length > 0) {
        console.log('\n✅ Рабочие адреса:');
        workingUrls.forEach(url => {
            console.log(`   ${url}`);
        });
        
        console.log('\n💡 Рекомендации:');
        console.log('• Для доступа с этого компьютера используйте: http://localhost:3000');
        console.log('• Для доступа из локальной сети используйте: http://192.168.0.4:3000');
        console.log('• Для доступа через VPN используйте: http://26.230.34.171:3000');
    } else {
        console.log('\n❌ Все адреса недоступны!');
        console.log('\n🔧 Проверьте:');
        console.log('1. Запущен ли сервер: npm run server');
        console.log('2. Открыт ли порт в брандмауэре');
        console.log('3. Не блокирует ли антивирус подключения');
    }
    
    console.log('\n🛡️ Настройка брандмауэра:');
    console.log('Запустите firewall-setup.cmd от имени администратора');
}

testAllConnections().catch(console.error); 