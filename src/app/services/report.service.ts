import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../models/report.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = `${environment.apiUrl}/reports`;

    constructor(private http: HttpClient) {}

    getReports(): Observable<Report[]> {
        return this.http.get<Report[]>(this.apiUrl);
    }

    addReport(report: Report): Observable<Report> {
        return this.http.post<Report>(this.apiUrl, report);
    }

    updateReport(report: Report): Observable<Report> {
        return this.http.put<Report>(`${this.apiUrl}/${report.id}`, report);
    }

    deleteReport(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
