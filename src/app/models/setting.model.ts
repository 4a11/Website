export interface Setting {
    id: number;
    key: string;
    value: string;
    category: 'system' | 'notification' | 'security' | 'appearance';
    description: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'color';
    created_at?: Date;
}