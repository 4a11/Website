import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { FacilityService } from '../services/facility.service';
import { Employee } from '../services/employee.service';
import { Facility } from '../services/facility.service';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';
import { AddFacilityModalComponent } from './add-facility-modal/add-facility-modal.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { NewsService } from '../services/news.service';
import { News } from '../models/news.model';
import { AddNewsModalComponent } from './add-news-modal.component';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';
import { AddEquipmentModalComponent } from './add-equipment-modal.component';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report.model';
import { CalculationService } from '../services/calculation.service';
import { Calculation } from '../models/calculation.model';
import { SettingService } from '../services/setting.service';
import { Setting } from '../models/setting.model';
import { ReviewService } from '../services/review.service';
import { Review } from '../models/review.model';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, FeedbackResponse } from '../models/feedback.model';
import { DatePipe } from '@angular/common';
import { AuthService, UserRole } from '../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule, 
        HttpClientModule, 
        FormsModule,
        ReactiveFormsModule,
        DatePipe,
        AddEmployeeModalComponent, 
        AddFacilityModalComponent, 
        AddNewsModalComponent,
        AddEquipmentModalComponent
    ],
    providers: [
        EmployeeService, 
        FacilityService, 
        NewsService,
        EquipmentService,
        ReportService,
        CalculationService,
        SettingService,
        ReviewService,
        FeedbackService
    ]
})
export class AdminComponent implements OnInit, OnDestroy {
    currentSection: string = 'dashboard';
    pageTitle: string = 'Панель управления';
    employees: Employee[] = [];
    facilities: Facility[] = [];
    filteredFacilities: Facility[] = [];
    facilitySearchQuery: string = '';
    equipments: Equipment[] = [];
    totalEmployees: number = 0;
    totalFacilities: number = 0;
    averageWorkload: number = 0;
    showAddEmployeeModal: boolean = false;
    showAddFacilityModal: boolean = false;
    showAddEquipmentModal = false;
    selectedEmployee: Employee | null = null;
    selectedFacility: Facility | null = null;
    selectedEquipment: Equipment | null = null;
    isDarkTheme: boolean = false;
    newsList: News[] = [];
    showAddNewsModal: boolean = false;
    selectedNews: News | null = null;

    reports: Report[] = [];
    showAddReportModal: boolean = false;
    selectedReport: Report | null = null;

    calculations: Calculation[] = [];
    showAddCalculationModal: boolean = false;
    selectedCalculation: Calculation | null = null;

    settings: Setting[] = [];
    settingCategories = [
        { id: 'system', title: 'Системные настройки' },
        { id: 'notification', title: 'Уведомления' },
        { id: 'security', title: 'Безопасность' },
        { id: 'appearance', title: 'Внешний вид' }
    ];

    reviews: Review[] = [];

    feedbacks: Feedback[] = [];
    selectedFeedback: Feedback | null = null;
    newResponse: string = '';

    // Добавляем свойства для управления ролями
    userRole: UserRole | null = null;
    userName: string = '';

    // Поиск для сотрудников
    employeeSearchQuery: string = '';
    filteredEmployees: Employee[] = [];

    // Поиск для оборудования
    equipmentSearchQuery: string = '';
    filteredEquipments: Equipment[] = [];

    // Поиск для новостей
    newsSearchQuery: string = '';
    filteredNews: News[] = [];

    // Поиск для отчетов
    reportSearchQuery: string = '';
    filteredReports: Report[] = [];

    // Поиск для расчетов
    calculationSearchQuery: string = '';
    filteredCalculations: Calculation[] = [];

    // Поиск для отзывов
    reviewSearchQuery: string = '';
    filteredReviews: Review[] = [];

    loading = {
        equipment: false
    };

    // Свойства для модального окна оборудования
    equipmentModalVisible = false;
    equipmentEditMode = false;

    private destroy$ = new Subject<void>();
    private roleAccess = {
        [UserRole.ADMIN]: ['dashboard', 'employees', 'facilities', 'equipment', 'news', 'reports', 'calculations', 'settings', 'reviews', 'feedback'],
        [UserRole.MANAGER]: ['dashboard', 'employees', 'facilities', 'equipment', 'reports'],
        [UserRole.EMPLOYEE]: ['dashboard', 'facilities', 'equipment'],
        [UserRole.GUEST]: ['dashboard']
    };

    constructor(
        private router: Router,
        private renderer: Renderer2,
        private employeeService: EmployeeService,
        private facilityService: FacilityService,
        private newsService: NewsService,
        private equipmentService: EquipmentService,
        private reportService: ReportService,
        private calculationService: CalculationService,
        private settingService: SettingService,
        private reviewService: ReviewService,
        private feedbackService: FeedbackService,
        private authService: AuthService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const url = event.urlAfterRedirects;
                const section = url.split('/').pop() || 'dashboard';
                this.switchToSection(section);
            }
        });

        const savedTheme = localStorage.getItem('adminTheme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
        }
    }

    ngOnInit(): void {
        console.log('AdminComponent.ngOnInit()');
        
        // Подписываемся на изменения пользователя
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                console.log('Получены данные пользователя из AuthService:', user);
                
                if (user) {
                    // Определяем роль пользователя через строковое представление
                    const roleStr = String(user.role).toLowerCase();
                    console.log('Строковое представление роли:', roleStr);
                    
                    // Устанавливаем роль по строковому представлению
                    if (roleStr === 'admin') {
                        console.log('Установка роли администратора');
                        this.userRole = UserRole.ADMIN;
                    } else if (roleStr === 'manager') {
                        console.log('Установка роли менеджера');
                        this.userRole = UserRole.MANAGER;
                    } else if (roleStr === 'employee') {
                        console.log('Установка роли сотрудника');
                        this.userRole = UserRole.EMPLOYEE;
                    } else if (roleStr === 'guest') {
                        console.log('Установка роли гостя');
                        this.userRole = UserRole.GUEST;
                    } else {
                        console.warn('Неизвестная роль пользователя:', user.role);
                        // По умолчанию устанавливаем гостевую роль
                        this.userRole = UserRole.GUEST;
                    }
                    
                    this.userName = user.username;
                    console.log('Роль пользователя установлена:', this.userRole);
                    
                    // Проверяем доступ к текущей секции после установки роли
                    if (!this.hasAccessToSection(this.currentSection)) {
                        console.log(`Нет доступа к текущей секции ${this.currentSection}, перенаправление на дашборд`);
                        this.router.navigate(['/admin/dashboard']);
                    }
                } else {
                    console.error('Пользователь не авторизован!');
                    // Перенаправляем на страницу входа
                    this.router.navigate(['/login']);
                }
            });
        
        // Явно вызываем обновление данных пользователя
        this.authService.refreshCurrentUser();

        this.loadAllData();
    }

    // Добавляем метод для очистки подписок при уничтожении компонента
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Проверяем, имеет ли пользователь доступ к определенной секции
    hasAccessToSection(section: string): boolean {
        console.log(`Проверка доступа к секции ${section}`);
        
        // Получаем текущего пользователя напрямую из сервиса
        const currentUser = this.authService.currentUserValue;
        console.log('Текущий пользователь при проверке доступа:', currentUser);
        
        if (!currentUser) {
            console.log('Пользователь не авторизован, доступ запрещен');
            return false;
        }
        
        // Приводим роль к строковому представлению в нижнем регистре для стабильного сравнения
        const roleStr = String(currentUser.role).toLowerCase();
        console.log('Роль пользователя (строка):', roleStr);
        
        // Если пользователь админ, всегда разрешаем доступ
        if (roleStr === 'admin') {
            console.log('Пользователь - администратор, доступ разрешен');
            return true;
        }
        
        // Для остальных ролей определяем доступные секции
        let allowedSections: string[] = [];
        
        if (roleStr === 'manager') {
            allowedSections = this.roleAccess[UserRole.MANAGER];
        } else if (roleStr === 'employee') {
            allowedSections = this.roleAccess[UserRole.EMPLOYEE];
        } else if (roleStr === 'guest') {
            allowedSections = this.roleAccess[UserRole.GUEST];
        } else {
            allowedSections = this.roleAccess[UserRole.GUEST]; // По умолчанию
        }
        
        // Проверяем наличие доступа к секции
        const hasAccess = allowedSections.includes(section);
        console.log(`Доступ ${hasAccess ? 'разрешен' : 'запрещен'} для роли ${roleStr} к секции ${section}`);
        return hasAccess;
    }

    // Проверяем, имеет ли пользователь указанную роль
    hasRole(role: UserRole): boolean {
        return this.authService.hasRole(role);
    }

    // Проверяем, имеет ли пользователь любую из указанных ролей
    hasAnyRole(roles: UserRole[]): boolean {
        return this.authService.hasAnyRole(roles);
    }

    // Метод выхода из системы
    logout(): void {
        console.log('Вызван метод logout в AdminComponent');
        // Очищаем localStorage напрямую
        localStorage.removeItem('currentUser');
        // Вызываем logout в AuthService
        this.authService.logout();
        // Перенаправляем на страницу входа
        this.router.navigate(['/login']);
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('adminTheme', this.isDarkTheme ? 'dark' : 'light');
    }

    switchToSection(section: string): void {
        console.log(`Переключение на раздел: ${section}`);
        
        // Получаем текущего пользователя напрямую из сервиса
        const currentUser = this.authService.currentUserValue;
        console.log('Текущий пользователь при переключении раздела:', currentUser);
        
        if (!currentUser) {
            console.log('Пользователь не авторизован, перенаправление на страницу входа');
            this.router.navigate(['/login']);
            return;
        }
        
        // Приводим роль к строковому представлению в нижнем регистре для стабильного сравнения
        const roleStr = String(currentUser.role).toLowerCase();
        console.log('Роль пользователя (строка):', roleStr);
        
        // Если пользователь админ, всегда разрешаем доступ
        if (roleStr === 'admin') {
            console.log('Пользователь - администратор, доступ разрешен');
            this.currentSection = section;
            this.pageTitle = this.getPageTitle(section);
            
            if (section === 'employees') {
                console.log('Загружаем данные сотрудников...');
                this.loadEmployees();
            } else if (section === 'facilities') {
                console.log('Загружаем данные объектов...');
                this.loadFacilities();
            } else if (section === 'feedback') {
                console.log('Загружаем данные обратной связи...');
                this.loadFeedbacks();
            } else if (section === 'settings') {
                console.log('Загружаем настройки...');
                this.loadSettings();
            }
            return;
        }
        
        // Проверяем доступ к секции для всех остальных ролей
        if (!this.hasAccessToSection(section)) {
            console.log(`Доступ к разделу ${section} запрещен для роли ${roleStr}`);
            this.router.navigate(['/forbidden']);
            return;
        }

        this.currentSection = section;
        this.pageTitle = this.getPageTitle(section);
        
        if (section === 'employees') {
            console.log('Загружаем данные сотрудников...');
            this.loadEmployees();
        } else if (section === 'facilities') {
            console.log('Загружаем данные объектов...');
            this.loadFacilities();
        } else if (section === 'feedback') {
            console.log('Загружаем данные обратной связи...');
            this.loadFeedbacks();
        } else if (section === 'settings') {
            console.log('Загружаем настройки...');
            this.loadSettings();
        }
    }

    private getPageTitle(section: string): string {
        const titles: { [key: string]: string } = {
            'dashboard': 'Дашборд',
            'employees': 'Сотрудники',
            'facilities': 'Объекты',
            'equipment': 'Оборудование',
            'news': 'Новости',
            'reports': 'Отчеты',
            'calculations': 'Расчеты',
            'reviews': 'Отзывы',
            'feedback': 'Обратная связь',
            'settings': 'Настройки'
        };
        return titles[section] || 'Админ-панель';
    }

    private loadAllData(): void {
        this.loadEmployees();
        this.loadFacilities();
        this.loadEquipment();
        this.loadNews();
        this.loadReports();
        this.loadCalculations();
        this.loadReviews();
        this.loadFeedbacks();
        this.loadSettings();
    }

    // Обновляем методы загрузки данных
    loadEmployees(): void {
        console.log('🔄 Загружаю сотрудников...');
        this.employeeService.getEmployees().subscribe({
            next: (employees) => {
                console.log('✅ Получены сотрудники:', employees);
                this.employees = employees;
                this.filteredEmployees = employees;
                this.totalEmployees = employees.length;
                this.calculateStatistics();
            },
            error: (error) => {
                console.error('❌ Ошибка при загрузке сотрудников:', error);
            }
        });
    }

    loadFacilities(): void {
        this.facilityService.getFacilities().subscribe(facilities => {
            this.facilities = facilities;
            this.filteredFacilities = facilities;
        });
    }

    loadEquipment(): void {
        this.equipmentService.getEquipment().subscribe(equipment => {
            this.equipments = equipment;
            this.filteredEquipments = equipment;
        });
    }

    loadNews(): void {
        this.newsService.getNews().subscribe(news => {
            this.newsList = news;
            this.filteredNews = news;
        });
    }

    loadReports(): void {
        this.reportService.getReports().subscribe(reports => {
            this.reports = reports;
            this.filteredReports = reports;
        });
    }

    loadCalculations(): void {
        this.calculationService.getCalculations().subscribe(calculations => {
            this.calculations = calculations;
            this.filteredCalculations = calculations;
        });
    }

    loadReviews(): void {
        this.reviewService.getReviews().subscribe(reviews => {
            this.reviews = reviews;
            this.filteredReviews = reviews;
        });
    }

    onAddEmployee(): void {
        this.selectedEmployee = null;
        this.showAddEmployeeModal = true;
    }

    onCloseAddEmployeeModal(): void {
        this.showAddEmployeeModal = false;
        this.selectedEmployee = null;
    }

    onEmployeeAdded(employee: Employee): void {
        this.employeeService.addEmployee(employee).subscribe(() => {
            this.loadEmployees();
            this.onCloseAddEmployeeModal();
        });
    }

    onEmployeeUpdated(employee: Employee): void {
        this.employeeService.updateEmployee(employee.id, employee).subscribe(() => {
            this.loadEmployees();
            this.onCloseAddEmployeeModal();
        });
    }

    onEditEmployee(employee: Employee): void {
        this.selectedEmployee = employee;
        this.showAddEmployeeModal = true;
    }

    onDeleteEmployee(employee: Employee): void {
        if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            this.employeeService.deleteEmployee(employee.id).subscribe(
                () => {
                    this.employees = this.employees.filter(e => e.id !== employee.id);
                    this.totalEmployees = this.employees.length;
                    this.calculateStatistics();
                },
                (error: Error) => {
                    console.error('Ошибка при удалении сотрудника:', error);
                }
            );
        }
    }

    onAddFacility(): void {
        this.selectedFacility = null;
        this.showAddFacilityModal = true;
    }

    onCloseAddFacilityModal(): void {
        this.showAddFacilityModal = false;
        this.selectedFacility = null;
    }

    onFacilityAdded(newFacility: Facility): void {
        this.facilities.push(newFacility);
        this.totalFacilities = this.facilities.length;
        this.calculateStatistics();
    }

    onFacilityUpdated(updatedFacility: Facility): void {
        const index = this.facilities.findIndex(f => f.id === updatedFacility.id);
        if (index !== -1) {
            this.facilities[index] = updatedFacility;
        }
    }

    onEditFacility(facility: Facility): void {
        this.selectedFacility = facility;
        this.showAddFacilityModal = true;
    }

    onDeleteFacility(facility: Facility): void {
        if (confirm('Вы уверены, что хотите удалить этот объект?')) {
            this.facilityService.deleteFacility(facility.id).subscribe(
                () => {
                    this.facilities = this.facilities.filter(f => f.id !== facility.id);
                    this.filteredFacilities = this.filteredFacilities.filter(f => f.id !== facility.id);
                    this.totalFacilities = this.facilities.length;
                    this.calculateStatistics();
                },
                (error: Error) => {
                    console.error('Ошибка при удалении объекта:', error);
                }
            );
        }
    }

    onViewFacility(facility: Facility): void {
        // В будущем здесь будет открываться модальное окно с детальной информацией
        console.log('Просмотр объекта:', facility);
    }

    onFacilitySearch(query: string): void {
        this.facilitySearchQuery = query;
        if (!query) {
            this.filteredFacilities = this.facilities;
            return;
        }
        
        const searchQuery = query.toLowerCase();
        this.filteredFacilities = this.facilities.filter(facility => 
            facility.name.toLowerCase().includes(searchQuery) ||
            facility.address.toLowerCase().includes(searchQuery) ||
            facility.type.toLowerCase().includes(searchQuery)
        );
    }

    // Методы для работы с оборудованием
    onShowAddEquipmentModal(): void {
        this.selectedEquipment = null;
        this.showAddEquipmentModal = true;
    }

    onAddEquipment(): void {
        this.selectedEquipment = null;
        this.showAddEquipmentModal = true;
    }

    onCloseAddEquipmentModal(): void {
        this.showAddEquipmentModal = false;
        this.selectedEquipment = null;
    }

    onEquipmentAdded(equipment: Equipment): void {
        this.equipmentService.addEquipment(equipment).subscribe({
            next: () => {
                this.loadEquipment();
                this.showAddEquipmentModal = false;
            },
            error: (error) => console.error('Ошибка при добавлении оборудования:', error)
        });
    }

    onEquipmentUpdated(equipment: Equipment): void {
        this.equipmentService.updateEquipment(equipment).subscribe({
            next: () => {
                this.loadEquipment();
                this.selectedEquipment = null;
            },
            error: (error) => console.error('Ошибка при обновлении оборудования:', error)
        });
    }

    onEditEquipment(equipment: Equipment): void {
        this.selectedEquipment = equipment;
        this.showAddEquipmentModal = true;
    }

    onDeleteEquipment(equipment: Equipment): void {
        if (confirm('Вы уверены, что хотите удалить это оборудование?')) {
            this.equipmentService.deleteEquipment(equipment.id).subscribe({
                next: () => {
                    this.loadEquipment();
                },
                error: (error) => console.error('Ошибка при удалении оборудования:', error)
            });
        }
    }

    onAddNews() {
        this.selectedNews = null;
        this.showAddNewsModal = true;
    }

    onEditNews(news: News) {
        this.selectedNews = news;
        this.showAddNewsModal = true;
    }

    onDeleteNews(news: News) {
        if (confirm('Вы уверены, что хотите удалить эту новость?')) {
            this.newsService.deleteNews(news.id).subscribe(() => {
                this.loadNews();
            });
        }
    }

    onCloseAddNewsModal() {
        this.showAddNewsModal = false;
        this.selectedNews = null;
    }

    onNewsAdded(news: News) {
        this.newsService.addNews(news).subscribe(() => {
            this.loadNews();
            this.onCloseAddNewsModal();
        });
    }

    onNewsUpdated(news: News) {
        this.newsService.updateNews(news).subscribe(() => {
            this.loadNews();
            this.onCloseAddNewsModal();
        });
    }
    onAddReport() {
        this.selectedReport = null;
        this.showAddReportModal = true;
    }

    onEditReport(report: Report) {
        this.selectedReport = report;
        this.showAddReportModal = true;
    }

    onViewReport(report: Report) {
        // Реализация просмотра отчета
        console.log('View report:', report);
    }

    onDeleteReport(report: Report) {
        if (confirm('Вы уверены, что хотите удалить этот отчет?')) {
            this.reportService.deleteReport(report.id).subscribe(() => {
                this.loadReports();
            });
        }
    }

    onAddCalculation() {
        this.selectedCalculation = null;
        this.showAddCalculationModal = true;
    }

    onEditCalculation(calculation: Calculation) {
        this.selectedCalculation = calculation;
        this.showAddCalculationModal = true;
    }

    onViewCalculation(calculation: Calculation) {
        // Реализация просмотра расчета
        console.log('View calculation:', calculation);
    }

    onDeleteCalculation(calculation: Calculation) {
        if (confirm('Вы уверены, что хотите удалить этот расчет?')) {
            this.calculationService.deleteCalculation(calculation.id).subscribe(() => {
                this.loadCalculations();
            });
        }
    }

    // Методы для работы с настройками
    loadSettings() {
        this.settingService.getSettings().subscribe(
            settings => {
                this.settings = settings;
                console.log('Настройки загружены:', settings);
            },
            error => {
                console.error('Ошибка при загрузке настроек:', error);
            }
        );
    }

    getSettingsByCategory(categoryId: string): Setting[] {
        return this.settings.filter(setting => setting.category === categoryId);
    }

    onSettingChange(setting: Setting) {
        this.settingService.updateSetting(setting).subscribe(updatedSetting => {
            const index = this.settings.findIndex(s => s.id === updatedSetting.id);
            if (index !== -1) {
                this.settings[index] = updatedSetting;
            }
        });
    }

    // Методы для работы с отзывами
    onApproveReview(review: Review) {
        review.status = 'approved';
        this.reviewService.updateReviewStatus(review).subscribe(() => {
            this.loadReviews();
        });
    }

    onRejectReview(review: Review) {
        review.status = 'rejected';
        this.reviewService.updateReviewStatus(review).subscribe(() => {
            this.loadReviews();
        });
    }

    onAddResponse(review: Review) {
        const response = prompt('Введите ответ на отзыв:');
        if (response) {
            review.response = response;
            this.reviewService.addResponse(review).subscribe(() => {
                this.loadReviews();
            });
        }
    }

    onDeleteReview(review: Review) {
        if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            this.reviewService.deleteReview(review.id).subscribe(() => {
                this.loadReviews();
            });
        }
    }

    loadFeedbacks() {
        this.feedbackService.getFeedback().subscribe(
            feedbacks => {
                this.feedbacks = feedbacks;
            },
            error => {
                console.error('Ошибка при загрузке обращений:', error);
            }
        );
    }

    onSelectFeedback(feedback: Feedback) {
        this.selectedFeedback = feedback;
    }

    onUpdateStatus(feedback: Feedback) {
        let newStatus: 'new' | 'in_progress' | 'resolved' | 'closed';
        
        switch (feedback.status) {
            case 'new':
                newStatus = 'in_progress';
                break;
            case 'in_progress':
                newStatus = 'resolved';
                break;
            case 'resolved':
                newStatus = 'closed';
                break;
            default:
                newStatus = 'new';
        }

        const updatedFeedback = { ...feedback, status: newStatus };
        this.feedbackService.updateFeedbackStatus(updatedFeedback).subscribe(
            updated => {
                const index = this.feedbacks.findIndex(f => f.id === updated.id);
                if (index !== -1) {
                    this.feedbacks[index] = updated;
                    if (this.selectedFeedback?.id === updated.id) {
                        this.selectedFeedback = updated;
                    }
                }
            },
            error => {
                console.error('Ошибка при обновлении статуса:', error);
            }
        );
    }

    onSendResponse() {
        if (!this.selectedFeedback || !this.newResponse.trim()) return;

        const response: FeedbackResponse = {
            id: Date.now(),
            feedbackId: this.selectedFeedback.id,
            author: 'Администратор',
            message: this.newResponse.trim(),
            date: new Date(),
            isAdmin: true
        };

        this.feedbackService.addResponse(this.selectedFeedback.id, response).subscribe(
            updatedFeedback => {
                const index = this.feedbacks.findIndex(f => f.id === updatedFeedback.id);
                if (index !== -1) {
                    this.feedbacks[index] = updatedFeedback;
                    if (this.selectedFeedback?.id === updatedFeedback.id) {
                        this.selectedFeedback = updatedFeedback;
                    }
                }
                this.newResponse = '';
            },
            error => {
                console.error('Ошибка при отправке ответа:', error);
            }
        );
    }

    onDeleteFeedback(feedback: Feedback) {
        if (confirm('Вы уверены, что хотите удалить это обращение?')) {
            this.feedbackService.deleteFeedback(feedback.id).subscribe(
                () => {
                    this.feedbacks = this.feedbacks.filter(f => f.id !== feedback.id);
                    if (this.selectedFeedback?.id === feedback.id) {
                        this.selectedFeedback = null;
                    }
                },
                error => {
                    console.error('Ошибка при удалении обращения:', error);
                }
            );
        }
    }

    // Методы поиска
    onEmployeeSearch(query: string): void {
        if (!query) {
            this.filteredEmployees = this.employees;
            return;
        }
        query = query.toLowerCase();
        this.filteredEmployees = this.employees.filter(employee => 
            employee.name.toLowerCase().includes(query) ||
            employee.position.toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query)
        );
    }

    onEquipmentSearch(query: string): void {
        if (!query) {
            this.filteredEquipments = this.equipments;
            return;
        }
        query = query.toLowerCase();
        this.filteredEquipments = this.equipments.filter(equipment => 
            equipment.name.toLowerCase().includes(query) ||
            equipment.type.toLowerCase().includes(query) ||
            equipment.location.toLowerCase().includes(query)
        );
    }

    onNewsSearch(query: string): void {
        if (!query) {
            this.filteredNews = this.newsList;
            return;
        }
        query = query.toLowerCase();
        this.filteredNews = this.newsList.filter(news => 
            news.title.toLowerCase().includes(query) ||
            news.content.toLowerCase().includes(query)
        );
    }

    onReportSearch(query: string): void {
        if (!query) {
            this.filteredReports = this.reports;
            return;
        }
        query = query.toLowerCase();
        this.filteredReports = this.reports.filter(report => 
            report.title.toLowerCase().includes(query) ||
            report.type.toLowerCase().includes(query)
        );
    }

    onCalculationSearch(query: string): void {
        if (!query) {
            this.filteredCalculations = this.calculations;
            return;
        }
        query = query.toLowerCase();
        this.filteredCalculations = this.calculations.filter(calculation => 
            calculation.name.toLowerCase().includes(query) ||
            calculation.type.toLowerCase().includes(query)
        );
    }

    onReviewSearch(query: string): void {
        if (!query) {
            this.filteredReviews = this.reviews;
            return;
        }
        query = query.toLowerCase();
        this.filteredReviews = this.reviews.filter(review => 
            review.author.toLowerCase().includes(query) ||
            review.content.toLowerCase().includes(query)
        );
    }

    private calculateStatistics(): void {
        // Если нет объектов, устанавливаем загрузку в 0%
        if (this.totalFacilities === 0) {
            this.averageWorkload = 0;
            return;
        }
        
        // Среднее количество сотрудников на объект
        const avgEmployeesPerFacility = this.totalEmployees / this.totalFacilities;
        
        // Оптимальное соотношение: 3 сотрудника на объект = 100% загрузки
        const optimalEmployeesPerFacility = 3;
        
        // Расчет процента загрузки (максимум 100%)
        this.averageWorkload = Math.min(
            Math.round((avgEmployeesPerFacility / optimalEmployeesPerFacility) * 100),
            100
        );
    }

    // Метод для получения роли на русском языке
    getRoleInRussian(): string {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) return 'Гость';
        
        const roleStr = String(currentUser.role).toLowerCase();
        switch (roleStr) {
            case 'admin':
                return 'Администратор';
            case 'manager':
                return 'Менеджер';
            case 'employee':
                return 'Сотрудник';
            case 'guest':
                return 'Гость';
            default:
                return 'Неизвестная роль';
        }
    }
}
