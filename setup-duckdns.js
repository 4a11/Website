#!/usr/bin/env node

const http = require('http');

console.log('🦆 Быстрая настройка домена через DuckDNS');
console.log('=========================================');

console.log(`
📋 Инструкция:

1️⃣ Перейдите на https://www.duckdns.org/
2️⃣ Войдите через Google, GitHub или другой аккаунт
3️⃣ В поле "sub domain" введите: novadom
4️⃣ В поле "current ip" укажите: 212.220.204.230
5️⃣ Нажмите "add domain"

✅ Результат: Ваш сайт будет доступен по адресу:
   🌐 http://novadom.duckdns.org:3000

⏱️  Время активации: 1-5 минут
💰 Стоимость: Бесплатно навсегда
`);

// Функция для проверки домена
function checkDomain(domain) {
    return new Promise((resolve) => {
        const options = {
            hostname: domain,
            port: 3000,
            path: '/',
            method: 'HEAD',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            console.log(`✅ ${domain} доступен! Статус: ${res.statusCode}`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`❌ ${domain} пока недоступен: ${err.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`⏰ ${domain} таймаут`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

console.log('\n🧪 Проверка доступности (запустите после настройки DuckDNS):');
console.log('============================================================');

async function testDomains() {
    const domains = [
        'novadom.duckdns.org'
    ];

    for (const domain of domains) {
        console.log(`\n🔍 Проверяю ${domain}...`);
        await checkDomain(domain);
        
        // Пауза между проверками
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Опциональная проверка
if (process.argv.includes('--test')) {
    testDomains();
} else {
    console.log('\n💡 Для проверки домена после настройки выполните:');
    console.log('   node setup-duckdns.js --test');
}

console.log('\n🔧 После настройки не забудьте обновить CORS в server.js!');
console.log('   Добавьте: "http://novadom.duckdns.org:3000"'); 