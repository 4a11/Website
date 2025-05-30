export interface Calculation {
    id: number;
    name: string;
    type: 'cost' | 'efficiency' | 'maintenance' | 'technical';
    date: Date;
    result: number;
    parameters?: {
        [key: string]: number;
    };
    description?: string;
}
