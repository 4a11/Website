# Финансовая система - Настройка и запуск

## Проблема и решение

**Проблема:** Данные при редактировании или добавлении на вкладках фактически не добавляются в базу данных.

**Решение:** Создана полноценная интеграция с PostgreSQL базой данных вместо использования мок-данных.

## Что было сделано

### 1. Серверная часть (Backend)

- ✅ **API маршруты** (`server/routes/finance.routes.ts`)
  - GET/POST/PUT/DELETE для транзакций
  - GET/POST/PUT/DELETE для бюджетов
  - GET для категорий и аналитики
  - Полная валидация данных

- ✅ **Конфигурация БД** (`server/config/database.config.ts`)
  - Пул соединений PostgreSQL
  - Автоматическое создание таблиц
  - Обработка ошибок подключения

- ✅ **Скрипт заполнения данных** (`server/scripts/seed-finance-data.ts`)
  - 10 категорий финансов
  - 15 реалистичных транзакций
  - 5 бюджетов с разными периодами

### 2. Клиентская часть (Frontend)

- ✅ **Обновленный сервис** (`src/app/services/finance.service.ts`)
  - Реальные HTTP запросы вместо мок-данных
  - Полный CRUD функционал
  - Обработка ошибок

- ✅ **Модальные окна** для добавления/редактирования
  - Форма транзакций с валидацией
  - Форма бюджетов с валидацией
  - Красивые стили с темной темой

- ✅ **Обновленный компонент** (`src/app/admin/admin.component.ts`)
  - Методы для работы с модальными окнами
  - Автоматическое обновление данных после операций
  - Обработка ошибок

## Настройка базы данных

### 1. Установка PostgreSQL

```bash
# Windows (через Chocolatey)
choco install postgresql

# macOS (через Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

### 2. Создание базы данных

```sql
-- Подключитесь к PostgreSQL как суперпользователь
psql -U postgres

-- Используем существующую базу данных postgres
-- Или создайте новую, если нужно:
-- CREATE DATABASE website_db;

-- Создайте пользователя (опционально)
CREATE USER website_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE postgres TO website_user;
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password

# Сервер
PORT=3000
NODE_ENV=development
```

## Запуск системы

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск сервера

```bash
# Разработка
npm run dev

# Или через ts-node
npx ts-node server/server.ts
```

### 3. Заполнение тестовыми данными

```bash
# Запуск скрипта заполнения
npx ts-node server/scripts/seed-finance-data.ts
```

### 4. Запуск фронтенда

```bash
# В отдельном терминале
npm start
```

## Структура базы данных

### Таблица `finance_categories`
```sql
id SERIAL PRIMARY KEY
name VARCHAR(100) NOT NULL UNIQUE
type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense'))
color VARCHAR(7) NOT NULL
icon VARCHAR(50)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Таблица `transactions`
```sql
id SERIAL PRIMARY KEY
date DATE NOT NULL
description TEXT NOT NULL
category VARCHAR(100) NOT NULL
type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense'))
amount DECIMAL(12, 2) NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Таблица `budgets`
```sql
id SERIAL PRIMARY KEY
name VARCHAR(200) NOT NULL
category VARCHAR(100) NOT NULL
period VARCHAR(20) NOT NULL CHECK (period IN ('month', 'quarter', 'year'))
limit_amount DECIMAL(12, 2) NOT NULL
spent DECIMAL(12, 2) DEFAULT 0
start_date DATE NOT NULL
end_date DATE NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## API Endpoints

### Транзакции
- `GET /api/finance/transactions` - Получить все транзакции
- `POST /api/finance/transactions` - Создать транзакцию
- `PUT /api/finance/transactions/:id` - Обновить транзакцию
- `DELETE /api/finance/transactions/:id` - Удалить транзакцию

### Бюджеты
- `GET /api/finance/budgets` - Получить все бюджеты
- `POST /api/finance/budgets` - Создать бюджет
- `PUT /api/finance/budgets/:id` - Обновить бюджет
- `DELETE /api/finance/budgets/:id` - Удалить бюджет

### Аналитика
- `GET /api/finance/categories` - Получить категории
- `GET /api/finance/summary?period=month` - Финансовая сводка
- `GET /api/finance/revenue-breakdown` - Структура доходов

## Использование

1. **Добавление транзакции:**
   - Нажмите "Добавить транзакцию"
   - Заполните форму
   - Нажмите "Создать"
   - Данные сохранятся в БД и обновятся на экране

2. **Редактирование транзакции:**
   - Нажмите кнопку редактирования у транзакции
   - Измените данные в форме
   - Нажмите "Обновить"
   - Изменения сохранятся в БД

3. **Удаление транзакции:**
   - Нажмите кнопку удаления
   - Подтвердите действие
   - Запись удалится из БД

Аналогично работает с бюджетами.

## Отладка

### Проверка подключения к БД
```bash
# Проверьте, что PostgreSQL запущен
sudo service postgresql status

# Подключитесь к БД
psql -U postgres -d postgres

# Проверьте таблицы
\dt
```

### Логи сервера
Сервер выводит подробные логи о:
- Подключении к БД
- Создании таблиц
- Выполнении запросов
- Ошибках

### Проверка данных
```sql
-- Проверьте количество записей
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM budgets;
SELECT COUNT(*) FROM finance_categories;

-- Посмотрите последние транзакции
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
```

## Возможные проблемы

1. **Ошибка подключения к БД:**
   - Проверьте, что PostgreSQL запущен
   - Проверьте настройки в `.env`
   - Убедитесь, что база данных создана

2. **Ошибки CORS:**
   - Убедитесь, что сервер запущен на порту 3000
   - Проверьте настройки прокси в Angular

3. **Ошибки валидации:**
   - Проверьте, что все обязательные поля заполнены
   - Убедитесь, что типы данных корректны

Теперь финансовая система полностью интегрирована с базой данных и все операции добавления, редактирования и удаления работают корректно! 