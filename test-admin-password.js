const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Подключение к БД
const pool = new Pool({
    user: 'postgres',          
    password: 'NiceDbPassword',  
    host: 'localhost',         
    port: 5432,                
    database: 'postgres',      
    ssl: false                 
});

async function testAdminPassword() {
    try {
        console.log('🔐 Проверка пароля "password123" для пользователя admin...');
        
        // Получаем хеш пароля для admin
        const result = await pool.query('SELECT id, username, password_hash FROM users WHERE username = $1', ['admin']);
        
        if (result.rows.length === 0) {
            console.log('❌ Пользователь admin не найден!');
            return;
        }
        
        const user = result.rows[0];
        console.log(`✅ Пользователь найден: ${user.username} (ID: ${user.id})`);
        
        // Проверяем пароль password123
        const testPassword = 'password123';
        const isValid = await bcrypt.compare(testPassword, user.password_hash);
        
        if (isValid) {
            console.log('🎉 УСПЕХ! Пароль "password123" ПРАВИЛЬНЫЙ!');
            console.log('');
            console.log('📋 Данные для входа:');
            console.log('   Логин: admin');
            console.log('   Пароль: password123');
            console.log('   URL: http://novadom.duckdns.org:3000');
            
            // Тестируем API авторизации
            console.log('\n🧪 Тестирование API авторизации...');
            
            const axios = require('axios').default;
            
            try {
                const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
                    username: 'admin',
                    password: 'password123'
                });
                
                console.log('✅ API авторизация успешна!');
                console.log(`   Токен получен: ${loginResponse.data.token ? 'Да' : 'Нет'}`);
                console.log(`   Роль: ${loginResponse.data.role}`);
                
            } catch (apiError) {
                console.log('❌ Ошибка API авторизации:', apiError.response?.data?.message || apiError.message);
            }
            
        } else {
            console.log('❌ Пароль "password123" НЕПРАВИЛЬНЫЙ!');
            console.log('');
            console.log('🔧 Хотите ли установить пароль "password123"?');
            console.log('   Запустите: node set-admin-password.js');
        }
        
    } catch (error) {
        console.error('❌ Ошибка при проверке пароля:', error.message);
    } finally {
        await pool.end();
    }
}

testAdminPassword(); 