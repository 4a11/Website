import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private apiUrl = `${environment.apiUrl}/equipment`;

    constructor(private http: HttpClient) {}

    getEquipment(): Observable<Equipment[]> {
        return new Observable<Equipment[]>(observer => {
            observer.next([
                {
                    id: 1,
                    name: 'Кондиционер',
                    type: 'Климатическое оборудование',
                    location: 'Главный офис',
                    status: 'Исправно',
                    inventory_number: 'INV-001',
                    last_maintenance_date: new Date('2024-02-15'),
                    next_maintenance_date: new Date('2024-05-15'),
                    description: 'Кондиционер для офиса',
                    company_id: 1,
                    purchase_date: new Date('2023-01-15'),
                    created_at: new Date('2023-01-15'),
                    responsible_person: 'Иванов И.И.'
                },
                {
                    id: 2,
                    name: 'Сервер',
                    type: 'IT оборудование',
                    location: 'Дата-центр',
                    status: 'Исправно',
                    inventory_number: 'INV-002',
                    last_maintenance_date: new Date('2024-01-20'),
                    next_maintenance_date: new Date('2024-04-20'),
                    description: 'Сервер для хранения данных',
                    company_id: 1,
                    purchase_date: new Date('2023-02-10'),
                    created_at: new Date('2023-02-10'),
                    responsible_person: 'Петров П.П.'
                }
            ]);
            observer.complete();
        });
    }

    addEquipment(equipment: Equipment): Observable<Equipment> {
        return this.http.post<Equipment>(this.apiUrl, equipment);
    }

    updateEquipment(equipment: Equipment): Observable<Equipment> {
        return this.http.put<Equipment>(`${this.apiUrl}/${equipment.id}`, equipment);
    }

    deleteEquipment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
