-- Создание таблиц для финансовой системы
CREATE TABLE IF NOT EXISTS finance_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(10) CHECK(type IN ('income', 'expense')) NOT NULL,
    color VARCHAR(7) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    type VARCHAR(10) CHECK(type IN ('income', 'expense')) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    period VARCHAR(10) CHECK(period IN ('month', 'quarter', 'year')) NOT NULL,
    limit_amount DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка категорий
INSERT INTO finance_categories (name, type, color, icon) VALUES
('Аренда', 'income', '#10b981', 'fas fa-building'),
('Услуги', 'income', '#3b82f6', 'fas fa-handshake'),
('Парковка', 'income', '#8b5cf6', 'fas fa-car'),
('Консультации', 'income', '#f59e0b', 'fas fa-user-tie'),
('Оборудование', 'expense', '#ef4444', 'fas fa-tools'),
('Коммунальные услуги', 'expense', '#f97316', 'fas fa-bolt'),
('Зарплата', 'expense', '#06b6d4', 'fas fa-users'),
('Маркетинг', 'expense', '#ec4899', 'fas fa-bullhorn'),
('Обслуживание', 'expense', '#84cc16', 'fas fa-wrench'),
('Прочие расходы', 'expense', '#6b7280', 'fas fa-receipt');

-- Вставка транзакций (10 записей)
INSERT INTO transactions (date, description, category, type, amount) VALUES
('2024-01-15', 'Аренда офисного помещения - январь', 'Аренда', 'income', 450000.00),
('2024-01-14', 'Консультационные услуги по безопасности', 'Консультации', 'income', 125000.00),
('2024-01-13', 'Парковочные места - январь', 'Парковка', 'income', 85000.00),
('2024-01-12', 'Техническое обслуживание систем', 'Услуги', 'income', 95000.00),
('2024-01-11', 'Закупка серверного оборудования', 'Оборудование', 'expense', 180000.00),
('2024-01-10', 'Зарплата сотрудников - январь', 'Зарплата', 'expense', 320000.00),
('2024-01-09', 'Коммунальные платежи', 'Коммунальные услуги', 'expense', 45000.00),
('2024-01-08', 'Реклама в социальных сетях', 'Маркетинг', 'expense', 25000.00),
('2024-01-07', 'Обслуживание камер видеонаблюдения', 'Обслуживание', 'expense', 35000.00),
('2024-01-06', 'Канцелярские товары и расходные материалы', 'Прочие расходы', 'expense', 15000.00);

-- Дополнительные транзакции для разнообразия
INSERT INTO transactions (date, description, category, type, amount) VALUES
('2024-01-20', 'Аренда дополнительных помещений', 'Аренда', 'income', 280000.00),
('2024-01-19', 'Установка систем безопасности', 'Услуги', 'income', 150000.00),
('2024-01-18', 'Консультации по IT-инфраструктуре', 'Консультации', 'income', 75000.00),
('2024-01-17', 'Парковка для VIP-клиентов', 'Парковка', 'income', 65000.00),
('2024-01-16', 'Модернизация сетевого оборудования', 'Оборудование', 'expense', 120000.00);

-- Вставка бюджетов
INSERT INTO budgets (name, category, period, limit_amount, spent, start_date, end_date) VALUES
('Операционные расходы - Январь', 'Операционные', 'month', 500000.00, 380000.00, '2024-01-01', '2024-01-31'),
('Маркетинг - Q1 2024', 'Маркетинг', 'quarter', 300000.00, 245000.00, '2024-01-01', '2024-03-31'),
('Развитие инфраструктуры - 2024', 'Развитие', 'year', 1000000.00, 850000.00, '2024-01-01', '2024-12-31'),
('Обслуживание оборудования - Январь', 'Обслуживание', 'month', 150000.00, 125000.00, '2024-01-01', '2024-01-31'),
('Зарплатный фонд - Q1 2024', 'Персонал', 'quarter', 1200000.00, 960000.00, '2024-01-01', '2024-03-31'); 