const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Запускаю сервер...');

// Запускаем сервер с правильной конфигурацией TypeScript
const serverProcess = spawn('npx', [
    'ts-node', 
    '--project', 
    'tsconfig.server.json', 
    'server/server.ts'
], {
    stdio: 'inherit',
    cwd: process.cwd()
});

serverProcess.on('error', (error) => {
    console.error('❌ Ошибка запуска сервера:', error);
});

serverProcess.on('close', (code) => {
    console.log(`🔴 Сервер остановлен с кодом ${code}`);
});

// Обработка сигналов для корректного завершения
process.on('SIGINT', () => {
    console.log('\n🛑 Получен сигнал SIGINT, останавливаю сервер...');
    serverProcess.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM, останавливаю сервер...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
}); 