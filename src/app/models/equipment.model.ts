export interface Equipment {
    id: number;
    name: string;
    type: string;
    description?: string;
    purchase_date?: string;
    status: 'active' | 'inactive' | 'maintenance';
    company_id?: number;
    created_at?: string;
    location?: string;
    cost?: number;
    showMenu?: boolean;
}

// Для обратной совместимости с существующим кодом
export interface EquipmentLegacy {
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
    showMenu?: boolean;
}
