import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Employee {
    id: number;
    name: string;
    position: string;
    email: string;
    phone: string;
    created_at: string | null;
    // Дополнительные свойства для современного интерфейса
    status?: 'active' | 'inactive' | 'vacation';
    department?: string;
    skills?: string[];
    rating?: number;
    projectsCount?: number;
    tasksCompleted?: number;
    showMenu?: boolean; // для интерфейса
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = 'http://localhost:3000/api/employees';

    constructor(private http: HttpClient) {}

    getEmployees(): Observable<Employee[]> {
        console.log('Запрашиваем список сотрудников');
        return this.http.get<Employee[]>(this.apiUrl).pipe(
            tap(response => {
                console.log('Получен ответ от сервера:', response);
            }),
            map(employees => {
                console.log('Начинаем обработку данных');
                return employees.map(emp => {
                    console.log('Обработка сотрудника:', emp);
                    if (!emp || !emp.id) {
                        console.warn('Найдена некорректная запись:', emp);
                        return null;
                    }
                    return {
                        id: emp.id,
                        name: emp.name || '',
                        position: emp.position || '',
                        email: emp.email || '',
                        phone: emp.phone || '',
                        created_at: emp.created_at || null
                    };
                }).filter(emp => emp !== null) as Employee[];
            }),
            tap(employees => {
                console.log('Обработанные данные:', employees);
            }),
            catchError(error => {
                console.error('Ошибка при получении сотрудников:', error);
                return throwError(() => error);
            })
        );
    }

    getEmployee(id: number): Observable<Employee> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(emp => ({
                ...emp,
                created_at: emp.created_at ? new Date(emp.created_at) : null
            })),
            catchError(error => throwError(() => error))
        );
    }

    // Проверка существования email
    checkEmailExists(email: string): Observable<boolean> {
        return this.http.get<Employee[]>(`${this.apiUrl}?email=${email}`).pipe(
            map(employees => employees.length > 0),
            catchError(error => throwError(() => error))
        );
    }

    addEmployee(employee: Omit<Employee, 'id' | 'created_at'>): Observable<Employee> {
        return this.http.post<any>(this.apiUrl, employee).pipe(
            map(emp => ({
                ...emp,
                created_at: emp.created_at ? new Date(emp.created_at) : null
            })),
            catchError(error => throwError(() => error))
        );
    }

    updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, employee).pipe(
            map(emp => ({
                ...emp,
                created_at: emp.created_at ? new Date(emp.created_at) : null
            })),
            catchError(error => throwError(() => error))
        );
    }

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => throwError(() => error))
        );
    }
} 