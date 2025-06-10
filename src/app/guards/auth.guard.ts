import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('=== AuthGuard.canActivate вызван ===');
    console.log('URL:', state.url);
    
    // Получаем данные о текущем пользователе
    const currentUser = this.authService.currentUserValue;
    
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!currentUser) {
      console.log('Пользователь не авторизован, перенаправление на страницу входа');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
            console.log('Текущий пользователь:', {
            id: currentUser?.id,
            username: currentUser?.username,
            role: currentUser?.role
        });
    
    // Нормализуем роль пользователя (преобразуем в строку и приводим к нижнему регистру)
    const userRoleStr = String(currentUser.role).toLowerCase();
    
    // ВАЖНО: Если пользователь - администратор, всегда разрешаем доступ
    if (userRoleStr === 'admin') {
      console.log('Пользователь имеет роль администратора, доступ разрешен');
      return true;
    }
    
    // Для других ролей проверяем требуемые роли маршрута
    const requiredRoles = route.data['roles'] as UserRole[];
    
    // Если у маршрута нет требований к ролям, разрешаем доступ
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('Маршрут не требует специальных ролей, доступ разрешен');
      return true;
    }
    
    // Преобразуем строковые представления ролей
    const requiredRolesStr = requiredRoles.map(role => String(role).toLowerCase());
    
    // Проверяем наличие роли пользователя в списке требуемых ролей
    if (requiredRolesStr.includes(userRoleStr)) {
      console.log('Роль пользователя соответствует требуемым, доступ разрешен');
      return true;
    }
    
    console.log('Роль пользователя не соответствует требуемым, доступ запрещен');
    console.log('Требуемые роли (строки):', requiredRolesStr);
    console.log('Роль пользователя (строка):', userRoleStr);
    
    // Если роль не подходит, перенаправляем на страницу 403
    this.router.navigate(['/forbidden']);
    return false;
  }
} 