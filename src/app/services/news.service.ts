import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private apiUrl = `${environment.apiUrl}/news`;

    constructor(private http: HttpClient) {}

    getNews(): Observable<News[]> {
        return this.http.get<News[]>(this.apiUrl);
    }

    addNews(news: News): Observable<News> {
        return this.http.post<News>(this.apiUrl, news);
    }

    updateNews(news: News): Observable<News> {
        return this.http.put<News>(`${this.apiUrl}/${news.id}`, news);
    }

    deleteNews(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
