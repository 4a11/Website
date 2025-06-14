import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback, FeedbackResponse } from '../models/feedback.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private apiUrl = `${environment.apiUrl}/feedback`;

    constructor(private http: HttpClient) {}

    getFeedback(): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(this.apiUrl);
    }

    updateFeedbackStatus(feedback: Feedback): Observable<Feedback> {
        return this.http.put<Feedback>(`${this.apiUrl}/${feedback.id}`, feedback);
    }

    addResponse(feedbackId: number, response: FeedbackResponse): Observable<Feedback> {
        return this.http.post<Feedback>(`${this.apiUrl}/${feedbackId}/responses`, response);
    }

    deleteFeedback(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 