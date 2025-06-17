export interface Transaction {
    id: number;
    date: Date;
    description: string;
    category: string;
    type: 'income' | 'expense';
    amount: number;
    createdAt?: Date;
}

export interface Budget {
    id: number;
    name: string;
    category: string;
    period: 'month' | 'quarter' | 'year';
    limit: number;
    spent: number;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
}

export interface FinanceCategory {
    id: number;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
}

export interface FinanceSummary {
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    revenueChange: number;
    expensesChange: number;
    profitChange: number;
}

export interface RevenueBreakdown {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
    }[];
} 