export interface Report {
    id: number;
    title: string;
    type: 'financial' | 'operational' | 'maintenance' | 'analytics';
    date: Date;
    status: 'draft' | 'published' | 'archived';
    author: string;
    content?: string;
    // Дополнительные свойства для современного интерфейса
    description?: string;
    createdDate?: Date;
    updatedDate?: Date;
    size?: string;
    showMenu?: boolean; // для интерфейса
}
