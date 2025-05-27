export interface Order {
    id?: string;
    service: string;
    name: string;
    email: string;
    phone: string;
    date: Date;
    status: 'new' | 'processing' | 'completed';
} 