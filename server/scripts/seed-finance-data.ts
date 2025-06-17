import { pool } from '../config/database.config';

// Данные для заполнения таблиц
const financeCategories = [
    { name: 'Аренда офиса', type: 'income', color: '#8b5cf6', icon: 'fa-building' },
    { name: 'Консультации по безопасности', type: 'income', color: '#10b981', icon: 'fa-shield-alt' },
    { name: 'Парковка', type: 'income', color: '#f59e0b', icon: 'fa-car' },
    { name: 'Технические услуги', type: 'income', color: '#3b82f6', icon: 'fa-tools' },
    { name: 'Серверное оборудование', type: 'expense', color: '#ef4444', icon: 'fa-server' },
    { name: 'Зарплата', type: 'expense', color: '#f97316', icon: 'fa-users' },
    { name: 'Коммунальные услуги', type: 'expense', color: '#06b6d4', icon: 'fa-bolt' },
    { name: 'Маркетинг', type: 'expense', color: '#ec4899', icon: 'fa-bullhorn' },
    { name: 'Канцелярские товары', type: 'expense', color: '#84cc16', icon: 'fa-pen' },
    { name: 'Интернет и связь', type: 'expense', color: '#6366f1', icon: 'fa-wifi' }
];

const transactions = [
    { date: '2024-01-15', description: 'Аренда офиса за январь', category: 'Аренда офиса', type: 'income', amount: 450000 },
    { date: '2024-01-10', description: 'Консультация по системе безопасности', category: 'Консультации по безопасности', type: 'income', amount: 125000 },
    { date: '2024-01-20', description: 'Аренда парковочных мест', category: 'Парковка', type: 'income', amount: 85000 },
    { date: '2024-01-25', description: 'Техническое обслуживание систем', category: 'Технические услуги', type: 'income', amount: 95000 },
    { date: '2024-01-05', description: 'Покупка серверного оборудования', category: 'Серверное оборудование', type: 'expense', amount: 180000 },
    { date: '2024-01-31', description: 'Зарплата сотрудников', category: 'Зарплата', type: 'expense', amount: 320000 },
    { date: '2024-01-28', description: 'Оплата электричества и отопления', category: 'Коммунальные услуги', type: 'expense', amount: 45000 },
    { date: '2024-01-12', description: 'Реклама в социальных сетях', category: 'Маркетинг', type: 'expense', amount: 25000 },
    { date: '2024-01-08', description: 'Покупка канцелярских принадлежностей', category: 'Канцелярские товары', type: 'expense', amount: 8500 },
    { date: '2024-01-03', description: 'Оплата интернета и мобильной связи', category: 'Интернет и связь', type: 'expense', amount: 15000 },
    { date: '2024-02-01', description: 'Дополнительная консультация', category: 'Консультации по безопасности', type: 'income', amount: 75000 },
    { date: '2024-02-05', description: 'Обновление серверного ПО', category: 'Технические услуги', type: 'income', amount: 45000 },
    { date: '2024-02-10', description: 'Покупка нового принтера', category: 'Серверное оборудование', type: 'expense', amount: 35000 },
    { date: '2024-02-15', description: 'Аренда офиса за февраль', category: 'Аренда офиса', type: 'income', amount: 450000 },
    { date: '2024-02-20', description: 'Маркетинговая кампания', category: 'Маркетинг', type: 'expense', amount: 40000 }
];

const budgets = [
    {
        name: 'Операционные расходы',
        category: 'Зарплата',
        period: 'month',
        limit_amount: 350000,
        spent: 320000,
        start_date: '2024-01-01',
        end_date: '2024-01-31'
    },
    {
        name: 'Маркетинговый бюджет',
        category: 'Маркетинг',
        period: 'quarter',
        limit_amount: 150000,
        spent: 65000,
        start_date: '2024-01-01',
        end_date: '2024-03-31'
    },
    {
        name: 'Развитие инфраструктуры',
        category: 'Серверное оборудование',
        period: 'year',
        limit_amount: 500000,
        spent: 215000,
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    },
    {
        name: 'Обслуживание оборудования',
        category: 'Технические услуги',
        period: 'quarter',
        limit_amount: 200000,
        spent: 140000,
        start_date: '2024-01-01',
        end_date: '2024-03-31'
    },
    {
        name: 'Фонд оплаты труда',
        category: 'Зарплата',
        period: 'year',
        limit_amount: 4000000,
        spent: 640000,
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    }
];

// Функция для заполнения данных
export const seedFinanceData = async (): Promise<void> => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        console.log('🌱 Начинаем заполнение финансовых данных...');
        
        // Очистка существующих данных (опционально)
        await client.query('DELETE FROM budgets');
        await client.query('DELETE FROM transactions');
        await client.query('DELETE FROM finance_categories');
        
        // Сброс последовательностей
        await client.query('ALTER SEQUENCE finance_categories_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE transactions_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE budgets_id_seq RESTART WITH 1');
        
        // Заполнение категорий
        console.log('📂 Добавляем категории...');
        for (const category of financeCategories) {
            await client.query(
                'INSERT INTO finance_categories (name, type, color, icon) VALUES ($1, $2, $3, $4)',
                [category.name, category.type, category.color, category.icon]
            );
        }
        
        // Заполнение транзакций
        console.log('💰 Добавляем транзакции...');
        for (const transaction of transactions) {
            await client.query(
                'INSERT INTO transactions (date, description, category, type, amount) VALUES ($1, $2, $3, $4, $5)',
                [transaction.date, transaction.description, transaction.category, transaction.type, transaction.amount]
            );
        }
        
        // Заполнение бюджетов
        console.log('📊 Добавляем бюджеты...');
        for (const budget of budgets) {
            await client.query(
                'INSERT INTO budgets (name, category, period, limit_amount, spent, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [budget.name, budget.category, budget.period, budget.limit_amount, budget.spent, budget.start_date, budget.end_date]
            );
        }
        
        await client.query('COMMIT');
        
        console.log('✅ Финансовые данные успешно добавлены!');
        console.log(`   - Категорий: ${financeCategories.length}`);
        console.log(`   - Транзакций: ${transactions.length}`);
        console.log(`   - Бюджетов: ${budgets.length}`);
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Ошибка при заполнении данных:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Запуск скрипта, если файл выполняется напрямую
if (require.main === module) {
    seedFinanceData()
        .then(() => {
            console.log('🎉 Заполнение данных завершено!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Ошибка:', error);
            process.exit(1);
        });
} 