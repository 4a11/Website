export interface Equipment {
    id: number;
    name: string;
    type: string;
    category: string;
    facility: string;
    status: 'active' | 'inactive' | 'maintenance';
    lastMaintenance: Date;
    nextMaintenance: Date;
    description?: string;
    features: string[];
    image?: string;
    price?: number;
}
