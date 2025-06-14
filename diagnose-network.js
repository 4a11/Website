#!/usr/bin/env node

const os = require('os');
const http = require('http');

console.log('🔍 Диагностика сетевых проблем с авторизацией');
console.log('=============================================');

// Получение всех IP-адресов
function getAllIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    
    for (const interfaceName in interfaces) {
        const interfaceData = interfaces[interfaceName];
        for (const connection of interfaceData) {
            if (connection.family === 'IPv4' && !connection.internal) {
                ips.push({
                    interface: interfaceName,
                    ip: connection.address
                });
            }
        }
    }
    
    return ips;
}

// Тестирование подключения к серверу
function testServerConnection(ip, port = 3000) {
    return new Promise((resolve) => {
        const req = http.get(`http://${ip}:${port}/api/employees`, { timeout: 5000 }, (res) => {
            resolve({
                success: true,
                status: res.statusCode,
                ip: ip,
                port: port
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                ip: ip,
                port: port
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Timeout',
                ip: ip,
                port: port
            });
        });
    });
}

// Тестирование авторизации
function testAuth(ip, port = 3000) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            username: 'admin',
            password: 'password123'
        });
        
        const options = {
            hostname: ip,
            port: port,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({
                        success: res.statusCode === 200,
                        status: res.statusCode,
                        data: parsed,
                        ip: ip,
                        port: port
                    });
                } catch (e) {
                    resolve({
                        success: false,
                        error: 'Invalid JSON response',
                        status: res.statusCode,
                        data: data,
                        ip: ip,
                        port: port
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                ip: ip,
                port: port
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Timeout',
                ip: ip,
                port: port
            });
        });
        
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('1. 📋 Проверка сетевых интерфейсов:');
    console.log('===================================');
    
    const ips = getAllIPs();
    if (ips.length === 0) {
        console.log('❌ Активные сетевые интерфейсы не найдены');
        return;
    }
    
    ips.forEach(({ interface: iface, ip }) => {
        console.log(`${iface}: ${ip}`);
    });
    
    console.log('\n2. 🌐 Тестирование подключения к серверу:');
    console.log('=========================================');
    
    // Тестируем localhost
    console.log('\nТестирование localhost:3000...');
    const localhostTest = await testServerConnection('localhost');
    if (localhostTest.success) {
        console.log(`✅ localhost:3000 - Статус: ${localhostTest.status}`);
    } else {
        console.log(`❌ localhost:3000 - Ошибка: ${localhostTest.error}`);
    }
    
    // Тестируем все найденные IP
    for (const { interface: iface, ip } of ips) {
        console.log(`\nТестирование ${ip}:3000 (${iface})...`);
        const result = await testServerConnection(ip);
        if (result.success) {
            console.log(`✅ ${ip}:3000 - Статус: ${result.status}`);
        } else {
            console.log(`❌ ${ip}:3000 - Ошибка: ${result.error}`);
        }
    }
    
    console.log('\n3. 🔐 Тестирование авторизации:');
    console.log('==============================');
    
    // Тестируем авторизацию на localhost
    console.log('\nТестирование авторизации на localhost:3000...');
    const localhostAuth = await testAuth('localhost');
    if (localhostAuth.success) {
        console.log(`✅ Авторизация на localhost:3000 - Успешно`);
        console.log(`   Пользователь: ${localhostAuth.data.username}`);
        console.log(`   Роль: ${localhostAuth.data.role}`);
    } else {
        console.log(`❌ Авторизация на localhost:3000 - Ошибка: ${localhostAuth.error || localhostAuth.data?.message}`);
    }
    
    // Тестируем авторизацию на всех IP
    for (const { interface: iface, ip } of ips) {
        console.log(`\nТестирование авторизации на ${ip}:3000 (${iface})...`);
        const result = await testAuth(ip);
        if (result.success) {
            console.log(`✅ Авторизация на ${ip}:3000 - Успешно`);
            console.log(`   Пользователь: ${result.data.username}`);
            console.log(`   Роль: ${result.data.role}`);
        } else {
            console.log(`❌ Авторизация на ${ip}:3000 - Ошибка: ${result.error || result.data?.message}`);
        }
    }
    
    console.log('\n4. 💡 Рекомендации:');
    console.log('==================');
    
    if (localhostTest.success) {
        console.log('✅ Сервер работает локально');
        
        const workingIPs = ips.filter(async ({ ip }) => {
            const test = await testServerConnection(ip);
            return test.success;
        });
        
        if (ips.length > 0) {
            console.log('🌐 Для доступа с других компьютеров:');
            ips.forEach(({ interface: iface, ip }) => {
                console.log(`   - Используйте IP: ${ip} (интерфейс: ${iface})`);
                console.log(`   - URL для фронтенда: http://${ip}:4200`);
                console.log(`   - URL для API: http://${ip}:3000/api`);
            });
            
            console.log('\n🔧 Необходимые настройки:');
            console.log('1. Запускайте Angular с параметром --host 0.0.0.0:');
            console.log('   ng serve --host 0.0.0.0 --port 4200');
            
            console.log('\n2. Убедитесь, что сервер запущен с host: "0.0.0.0"');
            console.log('   (проверьте server.js - должно быть: app.listen(port, "0.0.0.0"))');
            
            console.log('\n3. Откройте порты в брандмауэре Windows:');
            console.log('   netsh advfirewall firewall add rule name="NodeJS App" dir=in action=allow protocol=TCP localport=3000');
            console.log('   netsh advfirewall firewall add rule name="Angular Dev Server" dir=in action=allow protocol=TCP localport=4200');
            
            console.log('\n4. Обновите environment.ts:');
            console.log(`   apiUrl: 'http://${ips[0].ip}:3000/api'`);
        }
    } else {
        console.log('❌ Сервер не запущен или недоступен');
        console.log('💡 Запустите сервер командой: node server.js');
    }
}

main().catch(console.error); 