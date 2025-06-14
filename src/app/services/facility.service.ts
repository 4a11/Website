import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type FacilityStatus = 'active' | 'inactive' | 'ready' | 'ready_to_rent' | 'rented';
export type FacilityType = 'Офис' | 'Склад' | 'Производство' | 'Торговля';

export interface Facility {
  id: number;
  name: string;
  address: string;
  type: FacilityType;
  status: FacilityStatus;
  cost: number;
  showMenu?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
      private apiUrl = `${environment.apiUrl}/facilities`;

  constructor(private http: HttpClient) { }

  getFacilities(): Observable<Facility[]> {
    console.log('Отправляем запрос к API:', this.apiUrl);
    return this.http.get<Facility[]>(this.apiUrl).pipe(
      tap(facilities => console.log('Получен ответ от API:', facilities)),
      catchError(error => {
        console.error('Ошибка при получении данных:', error);
        return throwError(() => error);
      })
    );
  }

  getFacilityById(id: number): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}/${id}`);
  }

  addFacility(facility: Omit<Facility, 'id'>): Observable<Facility> {
    return this.http.post<Facility>(this.apiUrl, facility);
  }

  updateFacility(facility: Facility): Observable<Facility> {
    return this.http.put<Facility>(`${this.apiUrl}/${facility.id}`, facility);
  }

  deleteFacility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 