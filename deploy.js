#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Скрипт развертывания приложения');
console.log('===================================');

// Функция для выполнения команд
function runCommand(command, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n📋 ${description}...`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Ошибка: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.warn(`⚠️ Предупреждение: ${stderr}`);
            }
            console.log(`✅ ${description} завершено`);
            if (stdout) console.log(stdout);
            resolve(stdout);
        });
    });
}

// Проверка существования файла .env
function checkEnvFile() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        console.log('\n⚠️ Файл .env не найден!');
        console.log('📝 Создайте файл .env со следующим содержимым:');
        console.log(`
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
JWT_SECRET=your-very-long-and-secure-secret-key-for-production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=NiceDbPassword
        `);
        return false;
    }
    return true;
}

// Основная функция развертывания
async function deploy() {
    try {
        console.log('🔍 Проверка окружения...');
        
        // Проверяем файл .env
        if (!checkEnvFile()) {
            process.exit(1);
        }

        // Установка зависимостей
        await runCommand('npm install', 'Установка зависимостей');

        // Проверка базы данных
        await runCommand('node test-db-connection.js', 'Проверка подключения к базе данных');

        // Сборка Angular приложения
        await runCommand('npm run build', 'Сборка Angular приложения');

        console.log('\n🎉 Развертывание завершено успешно!');
        console.log('\n📋 Следующие шаги:');
        console.log('1. Запустите сервер: npm run dev');
        console.log('2. Откройте http://localhost:3000 в браузере');
        console.log('3. Для доступа извне используйте ваш IP-адрес');
        
        // Получаем IP-адрес
        const os = require('os');
        const interfaces = os.networkInterfaces();
        console.log('\n🌐 Доступные IP-адреса:');
        Object.keys(interfaces).forEach(interfaceName => {
            interfaces[interfaceName].forEach(interface => {
                if (interface.family === 'IPv4' && !interface.internal) {
                    console.log(`   - http://${interface.address}:3000`);
                }
            });
        });

    } catch (error) {
        console.error('\n❌ Развертывание не удалось:', error.message);
        process.exit(1);
    }
}

// Запуск скрипта
deploy(); 