export interface Equipment {
    id: number;
    name: string;
    type: string;
    category: string;
    status: 'active' | 'inactive' | 'maintenance';
    inventoryNumber: string;
    location: string;
    responsiblePerson: string;
    purchaseDate: Date;
    lastMaintenance: Date;
    nextMaintenance: Date;
    features: Array<{
        name: string;
        value: string;
    }>;
}
