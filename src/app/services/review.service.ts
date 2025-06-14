import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = `${environment.apiUrl}/reviews`;

    constructor(private http: HttpClient) {}

    getReviews(): Observable<Review[]> {
        return this.http.get<Review[]>(this.apiUrl);
    }

    updateReviewStatus(review: Review): Observable<Review> {
        return this.http.put<Review>(`${this.apiUrl}/${review.id}`, review);
    }

    addResponse(review: Review): Observable<Review> {
        return this.http.put<Review>(`${this.apiUrl}/${review.id}`, review);
    }

    deleteReview(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 