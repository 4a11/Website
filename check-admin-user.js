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

async function checkUsers() {
    try {
        console.log('🔍 Проверка пользователей в таблице users...');
        
        // Проверяем существование таблицы users
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        
        if (!tableCheck.rows[0].exists) {
            console.log('❌ Таблица users не существует!');
            console.log('🔧 Создаю таблицу users...');
            
            await pool.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'user',
                    token TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            
            console.log('✅ Таблица users создана');
        } else {
            console.log('✅ Таблица users существует');
        }
        
        // Получаем всех пользователей
        const result = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY id');
        
        console.log(`\n👥 Всего пользователей в БД: ${result.rows.length}`);
        
        if (result.rows.length === 0) {
            console.log('❌ Нет пользователей в базе данных!');
            console.log('🔧 Создаю админского пользователя...');
            
            const adminPassword = 'admin123'; // Пароль по умолчанию
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            
            await pool.query(`
                INSERT INTO users (username, email, password_hash, role) 
                VALUES ('admin', 'admin@novadom.com', $1, 'admin')
            `, [hashedPassword]);
            
            console.log('✅ Админский пользователь создан:');
            console.log('   Логин: admin');
            console.log('   Пароль: admin123');
            console.log('   Email: admin@novadom.com');
            
        } else {
            console.log('\n📋 Список пользователей:');
            result.rows.forEach((user, index) => {
                console.log(`${index + 1}. ${user.username} (${user.email}) - Роль: ${user.role}`);
            });
            
            // Проверяем есть ли пользователь admin
            const adminUser = result.rows.find(user => user.username === 'admin');
            if (adminUser) {
                console.log('\n✅ Пользователь admin найден!');
                console.log(`   ID: ${adminUser.id}`);
                console.log(`   Email: ${adminUser.email}`);
                console.log(`   Роль: ${adminUser.role}`);
                
                // Проверяем пароль
                console.log('\n🔐 Проверка паролей...');
                const passwordCheck = await pool.query('SELECT password_hash FROM users WHERE username = $1', ['admin']);
                const storedHash = passwordCheck.rows[0].password_hash;
                
                const testPasswords = ['admin', 'admin123', '123456', 'password', 'NiceDbPassword'];
                
                for (const testPassword of testPasswords) {
                    const isValid = await bcrypt.compare(testPassword, storedHash);
                    const status = isValid ? '✅' : '❌';
                    console.log(`   ${status} "${testPassword}"`);
                }
                
            } else {
                console.log('\n❌ Пользователь admin НЕ найден!');
                console.log('🔧 Создаю пользователя admin...');
                
                const adminPassword = 'admin123';
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                
                await pool.query(`
                    INSERT INTO users (username, email, password_hash, role) 
                    VALUES ('admin', 'admin@novadom.com', $1, 'admin')
                `, [hashedPassword]);
                
                console.log('✅ Пользователь admin создан с паролем: admin123');
            }
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await pool.end();
    }
}

checkUsers(); 