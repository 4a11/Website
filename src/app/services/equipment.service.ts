import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
                this.equipment = equipment;
                this.equipmentSubject.next(equipment);
            },
            error => console.error('Ошибка при загрузке оборудования:', error)
        );
    }

    getEquipment(): Observable<Equipment[]> {

        return this.equipmentSubject.asObservable();
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
            filteredEquipment = filteredEquipment.filter(item => item.category === category);
        }

        if (query) {
            filteredEquipment = filteredEquipment.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.features.some(feature => feature.toLowerCase().includes(query)) ||
                item.description?.toLowerCase().includes(query)
            );
        }

        this.equipmentSubject.next(filteredEquipment);
    }

    getCategories(): string[] {
        return ['Все', ...new Set(this.equipment.map(item => item.category))];
    }

    addEquipment(equipment: Omit<Equipment, 'id'>): Observable<Equipment> {
        return this.http.get<Equipment[]>(this.apiUrl);
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

    getEquipmentById(id: number): Observable<Equipment | undefined> {
        return of(this.equipment.find(e => e.id === id));
    }
} 