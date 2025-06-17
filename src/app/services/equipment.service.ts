import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private apiUrl = `${environment.apiUrl}/equipment`;
    private equipment: Equipment[] = [];
    private equipmentSubject = new BehaviorSubject<Equipment[]>([]);
    private selectedCategorySubject = new BehaviorSubject<string>('Все');
    private searchQuerySubject = new BehaviorSubject<string>('');

    constructor(private http: HttpClient) {
        this.loadEquipment();
    }

    private loadEquipment(): void {
        this.http.get<Equipment[]>(this.apiUrl).subscribe(
            equipment => {
                console.log('🔧 Загружено оборудование:', equipment);
                this.equipment = equipment;
                this.equipmentSubject.next(equipment);
            },
            error => console.error('Ошибка при загрузке оборудования:', error)
        );
    }

    getEquipment(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(this.apiUrl);
    }

    getEquipmentById(id: number): Observable<Equipment> {
        return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
    }

    getSelectedCategory(): Observable<string> {
        return this.selectedCategorySubject.asObservable();
    }

    getSearchQuery(): Observable<string> {
        return this.searchQuerySubject.asObservable();
    }

    setSelectedCategory(category: string): void {
        this.selectedCategorySubject.next(category);
        this.filterEquipment();
    }

    setSearchQuery(query: string): void {
        this.searchQuerySubject.next(query);
        this.filterEquipment();
    }

    private filterEquipment(): void {
        const category = this.selectedCategorySubject.value;
        const query = this.searchQuerySubject.value.toLowerCase();

        let filteredEquipment = [...this.equipment];

        if (category !== 'Все') {
            filteredEquipment = filteredEquipment.filter(item => item.type === category);
        }

        if (query) {
            filteredEquipment = filteredEquipment.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.type && item.type.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query)) ||
                (item.location && item.location.toLowerCase().includes(query))
            );
        }

        this.equipmentSubject.next(filteredEquipment);
    }

    getCategories(): string[] {
        return ['Все', ...new Set(this.equipment.map(item => item.type || 'Без категории'))];
    }

    addEquipment(equipment: Omit<Equipment, 'id'>): Observable<Equipment> {
        return this.http.post<Equipment>(this.apiUrl, equipment);
    }

    updateEquipment(id: number, equipment: Partial<Equipment>): Observable<Equipment> {
        return this.http.put<Equipment>(`${this.apiUrl}/${id}`, equipment);
    }

    deleteEquipment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchEquipment(query: string): Observable<Equipment[]> {
        return this.getEquipment().pipe(
            map(equipment => equipment.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                (item.type && item.type.toLowerCase().includes(query.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
                (item.location && item.location.toLowerCase().includes(query.toLowerCase()))
            ))
        );
    }

    // Получить оборудование с Observable для автообновления
    getEquipmentStream(): Observable<Equipment[]> {
        return this.equipmentSubject.asObservable();
    }

    // Обновить данные
    refreshEquipment(): void {
        this.loadEquipment();
    }
} 