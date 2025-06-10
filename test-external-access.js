#!/usr/bin/env node

const http = require('http');
const https = require('https');

console.log('🌐 Проверка внешнего доступа к серверу');
console.log('====================================');

const EXTERNAL_IP = '212.220.204.230';
const PORT = 3000;

// Функция для проверки подключения
function testConnection(url, timeout = 10000) {
    return new Promise((resolve) => {
        console.log(`\n🔍 Тестирую: ${url}`);
        
        const isHttps = url.startsWith('https://');
        const client = isHttps ? https : http;
        
        const req = client.get(url, { timeout }, (res) => {
            console.log(`✅ ${url} - Статус: ${res.statusCode}`);
            console.log(`   Заголовки: ${JSON.stringify(res.headers, null, 2)}`);
            resolve({ success: true, status: res.statusCode, url });
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${url} - Ошибка: ${err.message}`);
            resolve({ success: false, error: err.message, url });
        });
        
        req.on('timeout', () => {
            console.log(`⏰ ${url} - Таймаут (${timeout/1000}с)`);
            req.destroy();
            resolve({ success: false, error: 'Timeout', url });
        });
    });
}

// Проверка портов с помощью онлайн-сервисов
async function checkPortOnline() {
    console.log('\n🌍 Проверка порта через онлайн-сервисы:');
    console.log('=====================================');
    
    const services = [
        `https://api.ipify.org/?format=json`, // Получить текущий IP
        `https://portchecker.co/check?ip=${EXTERNAL_IP}&port=${PORT}`,
    ];
    
    // Получаем текущий IP
    try {
        const response = await fetch('https://api.ipify.org/?format=json');
        const data = await response.json();
        console.log(`📍 Ваш текущий внешний IP: ${data.ip}`);
        
        if (data.ip === EXTERNAL_IP) {
            console.log('✅ IP-адрес совпадает с ожидаемым');
        } else {
            console.log('⚠️ IP-адрес НЕ совпадает с ожидаемым!');
            console.log('   Возможно, нужно обновить настройки DNS или роутера');
        }
    } catch (error) {
        console.log('❌ Не удалось получить текущий IP:', error.message);
    }
}

// Основная функция тестирования
async function testExternalAccess() {
    console.log(`🎯 Целевой IP: ${EXTERNAL_IP}`);
    console.log(`🔌 Порт: ${PORT}`);
    
    const testUrls = [
        `http://${EXTERNAL_IP}:${PORT}`,
        `http://${EXTERNAL_IP}:${PORT}/api/employees`,
        `http://${EXTERNAL_IP}:${PORT}/api/auth/verify`,
    ];
    
    console.log('\n📋 Тестирование подключений:');
    console.log('============================');
    
    const results = [];
    
    for (const url of testUrls) {
        const result = await testConnection(url, 15000);
        results.push(result);
        
        // Пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Проверка онлайн-сервисами
    await checkPortOnline();
    
    // Анализ результатов
    console.log('\n📊 Анализ результатов:');
    console.log('======================');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
        console.log('\n✅ Успешные подключения:');
        successful.forEach(r => {
            console.log(`   ${r.url} (${r.status})`);
        });
    }
    
    if (failed.length > 0) {
        console.log('\n❌ Неудачные подключения:');
        failed.forEach(r => {
            console.log(`   ${r.url} - ${r.error}`);
        });
    }
    
    // Рекомендации
    console.log('\n💡 Рекомендации:');
    console.log('================');
    
    if (successful.length === 0) {
        console.log('🔧 Все подключения неудачны. Проверьте:');
        console.log('   1. Настройки проброса портов на роутере');
        console.log('   2. Запущен ли сервер (npm run server)');
        console.log('   3. Открыт ли порт в брандмауэре Windows');
        console.log('   4. Не блокирует ли провайтер порт 3000');
        console.log('   5. Правильность IP-адреса 212.220.204.230');
        
        console.log('\n🛠️ Команды для диагностики:');
        console.log('   • Проверить локальное подключение: node test-connections.js');
        console.log('   • Проверить настройки роутера: см. ROUTER-SETUP.md');
        console.log('   • Открыть брандмауэр: .\firewall-setup.cmd (от администратора)');
    } else if (successful.length < results.length) {
        console.log('⚠️ Частичный успех. Некоторые маршруты недоступны.');
        console.log('   Возможно, нужно настроить раздачу статических файлов');
        console.log('   или проверить маршруты API');
    } else {
        console.log('🎉 Все подключения успешны!');
        console.log(`   Ваш сайт доступен по адресу: http://${EXTERNAL_IP}:${PORT}`);
    }
    
    console.log('\n🌐 Онлайн-проверка портов:');
    console.log('=========================');
    console.log(`   • https://www.yougetsignal.com/tools/open-ports/`);
    console.log(`   • https://portchecker.co/`);
    console.log(`   • https://canyouseeme.org/`);
    console.log(`   Введите IP: ${EXTERNAL_IP}, Порт: ${PORT}`);
}

// Запуск тестирования
testExternalAccess().catch(console.error); 