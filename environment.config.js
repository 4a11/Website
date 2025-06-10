// Конфигурация переменных окружения
// Скопируйте это в файл .env в корне проекта

/*
# Настройки сервера
NODE_ENV=development
HOST=0.0.0.0
PORT=3000
JWT_SECRET=your-very-long-and-secure-secret-key-for-production

# Настройки базы данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=NiceDbPassword

# Для продакшена укажите реальные значения:
# DB_HOST=your-database-server.com
# DB_USER=your_db_user
# DB_PASSWORD=your_secure_password
*/

module.exports = {
    server: {
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 3000,
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key-should-be-long-and-secure'
    },
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'NiceDbPassword'
    }
}; 