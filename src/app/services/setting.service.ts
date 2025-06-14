import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    private apiUrl = `${environment.apiUrl}/settings`;

    constructor(private http: HttpClient) {}

    getSettings(): Observable<Setting[]> {
        return this.http.get<Setting[]>(this.apiUrl);
    }

    updateSetting(setting: Setting): Observable<Setting> {
        return this.http.put<Setting>(`${this.apiUrl}/${setting.id}`, setting);
    }
}
