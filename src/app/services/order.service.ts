import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:3000/orders'; // URL вашего API

    constructor(private http: HttpClient) { }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order);
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    updateOrder(id: string, order: Order): Observable<Order> {
        return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
    }

    deleteOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 