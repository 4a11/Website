import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calculation } from '../models/calculation.model';

@Injectable({
    providedIn: 'root'
})
export class CalculationService {
    private apiUrl = 'http://localhost:3000/api/calculations';

    constructor(private http: HttpClient) {}

    getCalculations(): Observable<Calculation[]> {
        return this.http.get<Calculation[]>(this.apiUrl);
    }

    addCalculation(calculation: Calculation): Observable<Calculation> {
        return this.http.post<Calculation>(this.apiUrl, calculation);
    }

    updateCalculation(calculation: Calculation): Observable<Calculation> {
        return this.http.put<Calculation>(`${this.apiUrl}/${calculation.id}`, calculation);
    }

    deleteCalculation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
