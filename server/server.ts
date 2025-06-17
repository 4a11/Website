import express from 'express';
import cors from 'cors';
import { testConnection, initializeTables } from './config/database.config';
import employeeRoutes from './routes/employee.routes';
import authRoutes from './routes/auth.routes';
import financeRoutes from './routes/finance.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к БД и инициализация
const initializeDatabase = async () => {
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            await initializeTables();
            console.log("✅ База данных готова к работе!");
        } else {
            console.error("❌ Не удалось подключиться к базе данных");
            process.exit(1);
        }
    } catch (error: any) {
        console.error("❌ Ошибка инициализации базы данных:", error);
        process.exit(1);
    }
};

initializeDatabase();

// Роуты
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);

const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 