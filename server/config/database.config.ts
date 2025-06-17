import { Pool } from 'pg';

// Конфигурация подключения к базе данных
const dbConfig = {
    user: process.env['DB_USER'] || 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    database: process.env['DB_NAME'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'NiceDbPassword',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    // Дополнительные настройки для production
    ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // максимальное количество соединений в пуле
    idleTimeoutMillis: 30000, // время ожидания перед закрытием неактивного соединения
    connectionTimeoutMillis: 2000, // время ожидания подключения
};

// Создание пула соединений
export const pool = new Pool(dbConfig);

// Обработка ошибок подключения
pool.on('error', (err) => {
    console.error('Неожиданная ошибка в пуле соединений:', err);
    process.exit(-1);
});

// Функция для проверки подключения к базе данных
export const testConnection = async (): Promise<boolean> => {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Подключение к базе данных успешно установлено');
        return true;
    } catch (error) {
        console.error('❌ Ошибка подключения к базе данных:', error);
        return false;
    }
};

// Функция для инициализации таблиц (если они не существуют)
export const initializeTables = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        
        // Создание таблицы категорий финансов
        await client.query(`
            CREATE TABLE IF NOT EXISTS finance_categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
                color VARCHAR(7) NOT NULL,
                icon VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Создание таблицы транзакций
        await client.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                date DATE NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(100) NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
                amount DECIMAL(12, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Создание таблицы бюджетов
        await client.query(`
            CREATE TABLE IF NOT EXISTS budgets (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                category VARCHAR(100) NOT NULL,
                period VARCHAR(20) NOT NULL CHECK (period IN ('month', 'quarter', 'year')),
                limit_amount DECIMAL(12, 2) NOT NULL,
                spent DECIMAL(12, 2) DEFAULT 0,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Создание индексов для оптимизации запросов
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
            CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
            CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
            CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period);
            CREATE INDEX IF NOT EXISTS idx_budgets_dates ON budgets(start_date, end_date);
        `);

        client.release();
        console.log('✅ Таблицы базы данных успешно инициализированы');
    } catch (error) {
        console.error('❌ Ошибка при инициализации таблиц:', error);
        throw error;
    }
};

export default pool; 