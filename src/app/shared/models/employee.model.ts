export interface Employee {
    id: number;
    name: string;
    position: string;
    email: string;
    phone: string;
    created_at: Date;
    department?: string;
    status?: 'active' | 'inactive' | 'vacation';
    skills?: string[];
    rating?: number;
    projectsCount?: number;
    tasksCompleted?: number;
    showMenu?: boolean;
} 