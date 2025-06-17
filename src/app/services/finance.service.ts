import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction, Budget, FinanceCategory, FinanceSummary, RevenueBreakdown, ChartData } from '../models/finance.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    private apiUrl = `${environment.apiUrl}/finance`;
    
    // Мок данные для демонстрации
    private mockTransactions: Transaction[] = [
        {
            id: 1,
            date: new Date('2024-01-15'),
            description: 'Аренда офисного помещения - январь',
            category: 'Аренда',
            type: 'income',
            amount: 450000,
            createdAt: new Date('2024-01-15')
        },
        {
            id: 2,
            date: new Date('2024-01-14'),
            description: 'Консультационные услуги по безопасности',
            category: 'Консультации',
            type: 'income',
            amount: 125000,
            createdAt: new Date('2024-01-14')
        },
        {
            id: 3,
            date: new Date('2024-01-13'),
            description: 'Парковочные места - январь',
            category: 'Парковка',
            type: 'income',
            amount: 85000,
            createdAt: new Date('2024-01-13')
        },
        {
            id: 4,
            date: new Date('2024-01-12'),
            description: 'Техническое обслуживание систем',
            category: 'Услуги',
            type: 'income',
            amount: 95000,
            createdAt: new Date('2024-01-12')
        },
        {
            id: 5,
            date: new Date('2024-01-11'),
            description: 'Закупка серверного оборудования',
            category: 'Оборудование',
            type: 'expense',
            amount: 180000,
            createdAt: new Date('2024-01-11')
        },
        {
            id: 6,
            date: new Date('2024-01-10'),
            description: 'Зарплата сотрудников - январь',
            category: 'Зарплата',
            type: 'expense',
            amount: 320000,
            createdAt: new Date('2024-01-10')
        },
        {
            id: 7,
            date: new Date('2024-01-09'),
            description: 'Коммунальные платежи',
            category: 'Коммунальные услуги',
            type: 'expense',
            amount: 45000,
            createdAt: new Date('2024-01-09')
        },
        {
            id: 8,
            date: new Date('2024-01-08'),
            description: 'Реклама в социальных сетях',
            category: 'Маркетинг',
            type: 'expense',
            amount: 25000,
            createdAt: new Date('2024-01-08')
        },
        {
            id: 9,
            date: new Date('2024-01-07'),
            description: 'Обслуживание камер видеонаблюдения',
            category: 'Обслуживание',
            type: 'expense',
            amount: 35000,
            createdAt: new Date('2024-01-07')
        },
        {
            id: 10,
            date: new Date('2024-01-06'),
            description: 'Канцелярские товары и расходные материалы',
            category: 'Прочие расходы',
            type: 'expense',
            amount: 15000,
            createdAt: new Date('2024-01-06')
        },
        {
            id: 11,
            date: new Date('2024-01-20'),
            description: 'Аренда дополнительных помещений',
            category: 'Аренда',
            type: 'income',
            amount: 280000,
            createdAt: new Date('2024-01-20')
        },
        {
            id: 12,
            date: new Date('2024-01-19'),
            description: 'Установка систем безопасности',
            category: 'Услуги',
            type: 'income',
            amount: 150000,
            createdAt: new Date('2024-01-19')
        },
        {
            id: 13,
            date: new Date('2024-01-18'),
            description: 'Консультации по IT-инфраструктуре',
            category: 'Консультации',
            type: 'income',
            amount: 75000,
            createdAt: new Date('2024-01-18')
        },
        {
            id: 14,
            date: new Date('2024-01-17'),
            description: 'Парковка для VIP-клиентов',
            category: 'Парковка',
            type: 'income',
            amount: 65000,
            createdAt: new Date('2024-01-17')
        },
        {
            id: 15,
            date: new Date('2024-01-16'),
            description: 'Модернизация сетевого оборудования',
            category: 'Оборудование',
            type: 'expense',
            amount: 120000,
            createdAt: new Date('2024-01-16')
        }
    ];

    private mockBudgets: Budget[] = [
        {
            id: 1,
            name: 'Операционные расходы - Январь',
            category: 'Операционные',
            period: 'month',
            limit: 500000,
            spent: 380000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 2,
            name: 'Маркетинг - Q1 2024',
            category: 'Маркетинг',
            period: 'quarter',
            limit: 300000,
            spent: 245000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-03-31'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 3,
            name: 'Развитие инфраструктуры - 2024',
            category: 'Развитие',
            period: 'year',
            limit: 1000000,
            spent: 850000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 4,
            name: 'Обслуживание оборудования - Январь',
            category: 'Обслуживание',
            period: 'month',
            limit: 150000,
            spent: 125000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 5,
            name: 'Зарплатный фонд - Q1 2024',
            category: 'Персонал',
            period: 'quarter',
            limit: 1200000,
            spent: 960000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-03-31'),
            createdAt: new Date('2024-01-01')
        }
    ];

    private mockCategories: FinanceCategory[] = [
        { id: 1, name: 'Аренда', type: 'income', color: '#10b981', icon: 'fas fa-building' },
        { id: 2, name: 'Услуги', type: 'income', color: '#3b82f6', icon: 'fas fa-handshake' },
        { id: 3, name: 'Парковка', type: 'income', color: '#8b5cf6', icon: 'fas fa-car' },
        { id: 4, name: 'Консультации', type: 'income', color: '#f59e0b', icon: 'fas fa-user-tie' },
        { id: 5, name: 'Оборудование', type: 'expense', color: '#ef4444', icon: 'fas fa-tools' },
        { id: 6, name: 'Коммунальные услуги', type: 'expense', color: '#f97316', icon: 'fas fa-bolt' },
        { id: 7, name: 'Зарплата', type: 'expense', color: '#06b6d4', icon: 'fas fa-users' },
        { id: 8, name: 'Маркетинг', type: 'expense', color: '#ec4899', icon: 'fas fa-bullhorn' },
        { id: 9, name: 'Обслуживание', type: 'expense', color: '#84cc16', icon: 'fas fa-wrench' },
        { id: 10, name: 'Прочие расходы', type: 'expense', color: '#6b7280', icon: 'fas fa-receipt' }
    ];

    private transactionsSubject = new BehaviorSubject<Transaction[]>(this.mockTransactions);
    private budgetsSubject = new BehaviorSubject<Budget[]>(this.mockBudgets);

    constructor(private http: HttpClient) {}

    // Транзакции
    getTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`).pipe(
            catchError((error) => {
                console.warn('API недоступен, используем мок-данные:', error);
                return of(this.mockTransactions);
            })
        );
    }

    addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
    }

    updateTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiUrl}/transactions/${transaction.id}`, transaction);
    }

    deleteTransaction(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`);
    }

    // Бюджеты
    getBudgets(): Observable<Budget[]> {
        return this.http.get<Budget[]>(`${this.apiUrl}/budgets`).pipe(
            catchError((error: any) => {
                console.warn('API недоступен, используем мок-данные для бюджетов:', error);
                return of(this.mockBudgets);
            })
        );
    }

    addBudget(budget: Omit<Budget, 'id' | 'createdAt'>): Observable<Budget> {
        return this.http.post<Budget>(`${this.apiUrl}/budgets`, budget);
    }

    updateBudget(budget: Budget): Observable<Budget> {
        return this.http.put<Budget>(`${this.apiUrl}/budgets/${budget.id}`, budget);
    }

    deleteBudget(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/budgets/${id}`);
    }

    // Категории
    getCategories(): Observable<FinanceCategory[]> {
        return this.http.get<FinanceCategory[]>(`${this.apiUrl}/categories`).pipe(
            catchError((error: any) => {
                console.warn('API недоступен, используем мок-данные для категорий:', error);
                return of(this.mockCategories);
            })
        );
    }

    // Аналитика
    getFinanceSummary(period: string = 'month'): Observable<FinanceSummary> {
        return this.http.get<FinanceSummary>(`${this.apiUrl}/summary?period=${period}`).pipe(
            catchError((error: any) => {
                console.warn('API недоступен, используем мок-данные для сводки:', error);
                // Генерируем мок-сводку на основе транзакций
                const income = this.mockTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                const expenses = this.mockTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);

                const summary: FinanceSummary = {
                    totalRevenue: income,
                    totalExpenses: expenses,
                    profit: income - expenses,
                    revenueChange: 12.5,
                    expensesChange: 8.3,
                    profitChange: 18.7
                };
                
                return of(summary);
            })
        );
    }

    getRevenueBreakdown(): Observable<RevenueBreakdown[]> {
        return this.http.get<RevenueBreakdown[]>(`${this.apiUrl}/revenue-breakdown`).pipe(
            catchError((error: any) => {
                console.warn('API недоступен, используем мок-данные для структуры доходов:', error);
                // Генерируем мок-структуру доходов
                const incomeTransactions = this.mockTransactions.filter(t => t.type === 'income');
                const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
                
                const categoryTotals = incomeTransactions.reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + t.amount;
                    return acc;
                }, {} as Record<string, number>);

                const breakdown: RevenueBreakdown[] = Object.entries(categoryTotals).map(([category, amount]) => {
                    const categoryData = this.mockCategories.find(c => c.name === category && c.type === 'income');
                    return {
                        category,
                        amount,
                        percentage: Math.round((amount / totalIncome) * 100),
                        color: categoryData?.color || '#6b7280'
                    };
                });
                
                return of(breakdown);
            })
        );
    }

    getChartData(type: 'revenue' | 'expenses' | 'comparison', period: string = 'month'): Observable<ChartData> {
        // Генерируем данные для графиков
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
        
        let chartData: ChartData;

        switch (type) {
            case 'revenue':
                chartData = {
                    labels: months,
                    datasets: [{
                        label: 'Доходы',
                        data: [320000, 285000, 410000, 375000, 445000, 520000],
                        backgroundColor: ['rgba(16, 185, 129, 0.8)'],
                        borderColor: ['rgba(16, 185, 129, 1)']
                    }]
                };
                break;
            case 'expenses':
                chartData = {
                    labels: months,
                    datasets: [{
                        label: 'Расходы',
                        data: [280000, 245000, 320000, 295000, 365000, 410000],
                        backgroundColor: ['rgba(239, 68, 68, 0.8)'],
                        borderColor: ['rgba(239, 68, 68, 1)']
                    }]
                };
                break;
            case 'comparison':
                chartData = {
                    labels: months,
                    datasets: [
                        {
                            label: 'Доходы',
                            data: [320000, 285000, 410000, 375000, 445000, 520000],
                            backgroundColor: ['rgba(16, 185, 129, 0.8)'],
                            borderColor: ['rgba(16, 185, 129, 1)']
                        },
                        {
                            label: 'Расходы',
                            data: [280000, 245000, 320000, 295000, 365000, 410000],
                            backgroundColor: ['rgba(239, 68, 68, 0.8)'],
                            borderColor: ['rgba(239, 68, 68, 1)']
                        }
                    ]
                };
                break;
            default:
                chartData = { labels: [], datasets: [] };
        }

        return new Observable(observer => {
            observer.next(chartData);
            observer.complete();
        });
    }
} 