import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { environment } from '../../environments/environment';

export interface Company {
    id: number;
    name: string;
    description: string;
    founded_year: number;
    website: string;
    created_at: Date;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
    created_at: Date;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    position: string;
    company_id: number;
    created_at: Date;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        console.log('DataService initialized with apiUrl:', this.apiUrl);
    }

    // Компании
    getCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.apiUrl}/companies`);
    }

    addCompany(company: Partial<Company>): Observable<Company> {
        return this.http.post<Company>(`${this.apiUrl}/companies`, company);
    }

    updateCompany(id: number, company: Partial<Company>): Observable<Company> {
        return this.http.put<Company>(`${this.apiUrl}/companies/${id}`, company);
    }

    deleteCompany(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/companies/${id}`);
    }

    // Оборудование
    getEquipment(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment`);
    }

    addEquipment(equipment: Partial<Equipment>): Observable<Equipment> {
        return this.http.post<Equipment>(`${this.apiUrl}/equipment`, equipment);
    }

    updateEquipment(id: number, equipment: Partial<Equipment>): Observable<Equipment> {
        return this.http.put<Equipment>(`${this.apiUrl}/equipment/${id}`, equipment);
    }

    deleteEquipment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/equipment/${id}`);
    }

    // Услуги
    getServices(): Observable<Service[]> {
        return this.http.get<Service[]>(`${this.apiUrl}/services`);
    }

    addService(service: Partial<Service>): Observable<Service> {
        return this.http.post<Service>(`${this.apiUrl}/services`, service);
    }

    updateService(id: number, service: Partial<Service>): Observable<Service> {
        return this.http.put<Service>(`${this.apiUrl}/services/${id}`, service);
    }

    deleteService(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/services/${id}`);
    }

    // Контакты
    getContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(`${this.apiUrl}/contacts`);
    }

    addContact(contact: Partial<Contact>): Observable<Contact> {
        return this.http.post<Contact>(`${this.apiUrl}/contacts`, contact);
    }

    updateContact(id: number, contact: Partial<Contact>): Observable<Contact> {
        return this.http.put<Contact>(`${this.apiUrl}/contacts/${id}`, contact);
    }

    deleteContact(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/contacts/${id}`);
    }
} 