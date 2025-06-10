import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  token?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  GUEST = 'guest'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    // Проверяем токен при инициализации сервиса
    this.verifyToken();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Проверяет текущий токен
   */
  private verifyToken(): void {
    const user = this.currentUserValue;
    if (!user?.token) {
      return;
    }

    // Для тестирования пропускаем проверку токена на сервере
    if (user.token === 'test-token-123') {
      console.log('Используется тестовый токен, пропускаем проверку на сервере');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });

    this.http.get<User>(`${this.apiUrl}/verify`, { headers })
      .pipe(
        catchError(() => {
          // Если токен недействителен, разлогиниваем пользователя
          console.log('Токен недействителен, выполняем выход');
          this.logout();
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Авторизует пользователя
   * @param username Имя пользователя
   * @param password Пароль пользователя
   */
  login(username: string, password: string): Observable<User> {
    console.log('Попытка входа:', { username, password });
    
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          console.log('Исходный ответ от сервера:', response);
          
          // Проверка наличия всех необходимых полей
          if (!response.id || !response.username || !response.role) {
            console.error('Отсутствуют необходимые поля в ответе:', response);
            throw new Error('Некорректный ответ от сервера');
          }
          
          // Преобразование строковой роли в UserRole
          const roleStr = response.role.toLowerCase();
          let userRole: UserRole;
          
          console.log('Роль из сервера (строка):', roleStr);
          
          // Сопоставление строковой роли из API с enum UserRole
          switch(roleStr) {
            case 'admin':
              userRole = UserRole.ADMIN;
              break;
            case 'manager':
              userRole = UserRole.MANAGER;
              break;
            case 'employee':
              userRole = UserRole.EMPLOYEE;
              break;
            case 'guest':
              userRole = UserRole.GUEST;
              break;
            default:
              console.error('Неизвестная роль:', roleStr);
              throw new Error('Неизвестная роль пользователя');
          }
          
          // Создаем объект пользователя с правильным типом роли
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            role: userRole,
            token: response.token
          };
          
          console.log('Преобразованный пользователь:', user);
          console.log('Тип роли после преобразования:', typeof user.role);
          
          console.log('Сохранение пользователя в localStorage');
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          
                      console.log('Текущий пользователь после входа:', {
                id: this.currentUserValue?.id,
                username: this.currentUserValue?.username,
                role: this.currentUserValue?.role
            });
          return user;
        }),
        map(response => {
          // Если response уже преобразован в tap, используем его напрямую
          if ('role' in response && typeof response.role === 'string') {
            // Преобразование строковой роли в UserRole если это еще не сделано
            const roleStr = response.role.toLowerCase();
            let userRole: UserRole;
            
            switch(roleStr) {
              case 'admin': userRole = UserRole.ADMIN; break;
              case 'manager': userRole = UserRole.MANAGER; break;
              case 'employee': userRole = UserRole.EMPLOYEE; break;
              case 'guest': userRole = UserRole.GUEST; break;
              default: throw new Error('Неизвестная роль пользователя');
            }
            
            return {
              ...response,
              role: userRole
            } as User;
          }
          return response as User;
        }),
        catchError(error => {
          console.error('Ошибка при входе:', error);
          return throwError(() => new Error('Неверное имя пользователя или пароль'));
        })
      );
  }

  /**
   * Выход пользователя из системы
   */
  logout(): void {
    console.log('Вызван метод logout в AuthService');
    
    try {
      // Очищаем данные пользователя в localStorage
      localStorage.removeItem('currentUser');
      console.log('Данные пользователя удалены из localStorage');
      
      // Обновляем состояние в сервисе
      this.currentUserSubject.next(null);
      
      // Перенаправляем на страницу входа
      console.log('Перенаправление на страницу входа');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      
      // В случае ошибки используем прямое перенаправление
      window.location.href = '/login';
    }
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  /**
   * Проверяет, имеет ли пользователь указанную роль
   * @param role Роль для проверки
   */
  hasRole(role: UserRole): boolean {
    const user = this.currentUserValue;
    return !!user && user.role === role;
  }

  /**
   * Проверяет, имеет ли пользователь любую из указанных ролей
   * @param roles Список ролей для проверки
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    return !!user && roles.includes(user.role);
  }

  /**
   * Принудительный выход и перенаправление с перезагрузкой страницы
   */
  forceLogoutAndRedirect(): void {
    console.log('Вызван метод forceLogoutAndRedirect в AuthService');
    
    try {
      // Очищаем все данные в localStorage
      localStorage.clear();
      console.log('Локальное хранилище очищено');
      
      // Обновляем состояние в сервисе
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Ошибка при очистке данных:', error);
    }
    
    // Используем прямое перенаправление с перезагрузкой страницы
    console.log('Перенаправление на страницу входа с перезагрузкой');
    window.location.href = '/login';
  }

  /**
   * Обновляет роль пользователя на основе строкового значения
   * @param roleString Строковое значение роли
   */
  private normalizeUserRole(roleString: string): UserRole {
    const roleLower = String(roleString).toLowerCase();
    
    switch(roleLower) {
      case 'admin': return UserRole.ADMIN;
      case 'manager': return UserRole.MANAGER;
      case 'employee': return UserRole.EMPLOYEE;
      case 'guest': return UserRole.GUEST;
      default: 
        console.error('Неизвестная роль:', roleString);
        return UserRole.GUEST; // По умолчанию гостевая роль
    }
  }

  /**
   * Принудительно обновляет данные текущего пользователя
   */
  refreshCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      console.error('Нет сохраненных данных пользователя');
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      
      // Проверяем наличие необходимых полей
      if (!userData.id || !userData.username || !userData.role) {
        console.error('Некорректные данные пользователя:', userData);
        return;
      }
      
      // Нормализуем роль пользователя
      const normalizedRole = this.normalizeUserRole(userData.role);
      
      // Создаем обновленный объект пользователя
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email || '',
        role: normalizedRole,
        token: userData.token
      };
      
      console.log('Обновлены данные пользователя:', user);
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
    }
  }
} 