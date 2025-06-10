#!/usr/bin/env node

const net = require('net');
const os = require('os');
const { exec } = require('child_process');

console.log('🔍 Диагностика проблем с подключением');
console.log('=====================================');

// Проверка портов
function checkPort(host, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        socket.setTimeout(3000);
        
        socket.on('connect', () => {
            console.log(`✅ Порт ${port} на ${host} доступен`);
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            console.log(`⏰ Таймаут при подключении к ${host}:${port}`);
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', (err) => {
            console.log(`❌ Порт ${port} на ${host} недоступен: ${err.message}`);
            resolve(false);
        });
        
        socket.connect(port, host);
    });
}

// Выполнение системных команд
function runCommand(command, description) {
    return new Promise((resolve) => {
        console.log(`\n📋 ${description}...`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Ошибка: ${error.message}`);
                resolve(false);
                return;
            }
            if (stderr && !stderr.includes('Warning')) {
                console.warn(`⚠️ ${stderr}`);
            }
            if (stdout) {
                console.log(stdout.trim());
            }
            resolve(true);
        });
    });
}

// Основная диагностика
async function diagnose() {
    console.log('\n🖥️ Информация о системе:');
    console.log(`Платформа: ${os.platform()}`);
    console.log(`Архитектура: ${os.arch()}`);
    
    // Получаем IP-адреса
    console.log('\n🌐 Сетевые интерфейсы:');
    const interfaces = os.networkInterfaces();
    let externalIPs = [];
    
    Object.keys(interfaces).forEach(interfaceName => {
        interfaces[interfaceName].forEach(interface => {
            if (interface.family === 'IPv4' && !interface.internal) {
                console.log(`${interfaceName}: ${interface.address}`);
                externalIPs.push(interface.address);
            }
        });
    });
    
    // Проверяем локальные порты
    console.log('\n🔌 Проверка локальных портов:');
    await checkPort('localhost', 3000);
    await checkPort('127.0.0.1', 3000);
    
    // Проверяем внешние IP
    console.log('\n🌍 Проверка внешних IP:');
    for (const ip of externalIPs) {
        await checkPort(ip, 3000);
    }
    
    // Проверяем целевой IP
    console.log('\n🎯 Проверка целевого IP (212.220.204.230):');
    await checkPort('212.220.204.230', 3000);
    
    // Проверяем процессы на порту 3000
    console.log('\n👀 Процессы на порту 3000:');
    if (os.platform() === 'win32') {
        await runCommand('netstat -ano | findstr :3000', 'Поиск процессов Windows');
    } else {
        await runCommand('lsof -i :3000', 'Поиск процессов Linux/Mac');
        await runCommand('netstat -tlnp | grep :3000', 'Альтернативная проверка Linux');
    }
    
    // Проверяем статус брандмауэра
    console.log('\n🛡️ Проверка брандмауэра:');
    if (os.platform() === 'win32') {
        await runCommand('netsh advfirewall show allprofiles state', 'Статус Windows Firewall');
    } else {
        await runCommand('sudo ufw status', 'Статус UFW (Ubuntu)');
    }
    
    console.log('\n💡 Рекомендации по устранению:');
    console.log('1. Убедитесь, что сервер запущен: npm run server');
    console.log('2. Проверьте, что порт 3000 открыт в брандмауэре');
    console.log('3. Если используете роутер, настройте проброс портов');
    console.log('4. Проверьте, что IP-адрес 212.220.204.230 корректный');
}

// Запуск диагностики
diagnose().catch(console.error); 