import { Router, Request, Response } from 'express';
import { pool } from '../config/database.config';

const router = Router();

// Получить все транзакции
router.get('/transactions', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM transactions ORDER BY date DESC, created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении транзакций:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить новую транзакцию
router.post('/transactions', async (req: Request, res: Response) => {
    try {
        const { date, description, category, type, amount } = req.body;
        
        if (!date || !description || !category || !type || !amount) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Тип должен быть income или expense' });
        }

        const result = await pool.query(
            'INSERT INTO transactions (date, description, category, type, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [date, description, category, type, amount]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании транзакции:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить транзакцию
router.put('/transactions/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date, description, category, type, amount } = req.body;
        
        const result = await pool.query(
            'UPDATE transactions SET date = $1, description = $2, category = $3, type = $4, amount = $5 WHERE id = $6 RETURNING *',
            [date, description, category, type, amount, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении транзакции:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить транзакцию
router.delete('/transactions/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении транзакции:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить все бюджеты
router.get('/budgets', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM budgets ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении бюджетов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить новый бюджет
router.post('/budgets', async (req: Request, res: Response) => {
    try {
        const { name, category, period, limit_amount, spent, start_date, end_date } = req.body;
        
        if (!name || !category || !period || !limit_amount || !start_date || !end_date) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        if (!['month', 'quarter', 'year'].includes(period)) {
            return res.status(400).json({ error: 'Период должен быть month, quarter или year' });
        }

        const result = await pool.query(
            'INSERT INTO budgets (name, category, period, limit_amount, spent, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, category, period, limit_amount, spent || 0, start_date, end_date]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании бюджета:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить бюджет
router.put('/budgets/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, period, limit_amount, spent, start_date, end_date } = req.body;
        
        const result = await pool.query(
            'UPDATE budgets SET name = $1, category = $2, period = $3, limit_amount = $4, spent = $5, start_date = $6, end_date = $7 WHERE id = $8 RETURNING *',
            [name, category, period, limit_amount, spent, start_date, end_date, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Бюджет не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении бюджета:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить бюджет
router.delete('/budgets/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query('DELETE FROM budgets WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Бюджет не найден' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении бюджета:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить категории
router.get('/categories', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM finance_categories ORDER BY type, name'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить финансовую сводку
router.get('/summary', async (req: Request, res: Response) => {
    try {
        const { period = 'month' } = req.query;
        
        // Определяем диапазон дат в зависимости от периода
        let dateFilter = '';
        const now = new Date();
        
        switch (period) {
            case 'today':
                dateFilter = `AND date = CURRENT_DATE`;
                break;
            case 'week':
                dateFilter = `AND date >= CURRENT_DATE - INTERVAL '7 days'`;
                break;
            case 'month':
                dateFilter = `AND date >= DATE_TRUNC('month', CURRENT_DATE)`;
                break;
            case 'quarter':
                dateFilter = `AND date >= DATE_TRUNC('quarter', CURRENT_DATE)`;
                break;
            case 'year':
                dateFilter = `AND date >= DATE_TRUNC('year', CURRENT_DATE)`;
                break;
        }

        // Получаем доходы и расходы
        const incomeResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income' ${dateFilter}`
        );
        
        const expenseResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense' ${dateFilter}`
        );

        const totalRevenue = parseFloat(incomeResult.rows[0].total);
        const totalExpenses = parseFloat(expenseResult.rows[0].total);
        const profit = totalRevenue - totalExpenses;

        // Для изменений используем заглушки (в реальном приложении нужно сравнивать с предыдущим периодом)
        const summary = {
            totalRevenue,
            totalExpenses,
            profit,
            revenueChange: 12.5,
            expensesChange: 8.3,
            profitChange: profit > 0 ? 18.7 : -5.2
        };

        res.json(summary);
    } catch (error) {
        console.error('Ошибка при получении финансовой сводки:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить структуру доходов
router.get('/revenue-breakdown', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.category,
                SUM(t.amount) as amount,
                fc.color
            FROM transactions t
            LEFT JOIN finance_categories fc ON t.category = fc.name AND fc.type = 'income'
            WHERE t.type = 'income'
            GROUP BY t.category, fc.color
            ORDER BY amount DESC
        `);

        const totalIncome = result.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);
        
        const breakdown = result.rows.map(row => ({
            category: row.category,
            amount: parseFloat(row.amount),
            percentage: Math.round((parseFloat(row.amount) / totalIncome) * 100),
            color: row.color || '#6b7280'
        }));

        res.json(breakdown);
    } catch (error) {
        console.error('Ошибка при получении структуры доходов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router; 