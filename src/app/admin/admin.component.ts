import { Component, OnInit, Renderer2, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
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

    // Финансовые свойства
    selectedFinancePeriod: string = 'month';
    chartType: string = 'bar';
    showAddTransactionModal: boolean = false;
    showBudgetModal: boolean = false;

    // Отчеты - расширенные свойства
    reportsView: 'list' | 'cards' | 'editor' = 'list';
    selectedReportType: string = '';
    selectedReportStatus: string = '';
    currentReport: any = {
        title: '',
        content: '',
        type: 'financial',
        status: 'draft',
        author: '',
        createdDate: new Date(),
        updatedDate: new Date()
    };

    // Редактор - дополнительные свойства
    editorState = {
        isSaving: false,
        lastSaved: null as Date | null,
        autoSaveInterval: null as any,
        isEditorFocused: false,
        selectedText: '',
        clipboardContent: '',
        undoStack: [] as string[],
        redoStack: [] as string[],
        currentFontSize: 14,
        currentFontFamily: 'Arial'
    };

    // Таблицы в редакторе
    tableEditor = {
        showTableDialog: false,
        rows: 3,
        cols: 3,
        hasHeaders: true
    };

    // Изображения в редакторе
    imageUpload = {
        showImageDialog: false,
        imageUrl: '',
        imageAlt: '',
        imageWidth: 300,
        imageHeight: 200
    };

    // Калькулятор
    selectedCalculationType: string = '';
    calculatorData = {
        cost: {
            area: 0,
            pricePerSquare: 0,
            complexityFactor: 1,
            vat: 20
        },
        efficiency: {
            income: 0,
            expenses: 0,
            investments: 0,
            period: 12
        },
        maintenance: {
            equipmentCount: 0,
            costPerUnit: 0,
            frequency: 30,
            maintenanceType: 'preventive'
        },
        technical: {
            cameraCount: 0,
            cameraPrice: 0,
            serverCount: 0,
            serverPrice: 0,
            cableLength: 0,
            cablePricePerMeter: 0,
            installationType: 'basic',
            installationCost: 0
        }
    };
    
    calculationResult: {
        details: Array<{label: string, value: string}>,
        totalLabel: string,
        totalValue: string,
        type: string
    } | null = null;

    loading = {
        equipment: false
    };

    // Свойства для модального окна оборудования
    equipmentModalVisible = false;
    equipmentEditMode = false;

    private destroy$ = new Subject<void>();
    private roleAccess = {
        [UserRole.ADMIN]: ['dashboard', 'employees', 'facilities', 'equipment', 'news', 'reports', 'calculations', 'finances', 'settings', 'reviews', 'feedback'],
        [UserRole.MANAGER]: ['dashboard', 'employees', 'facilities', 'equipment', 'reports', 'finances'],
        [UserRole.EMPLOYEE]: ['dashboard', 'facilities', 'equipment'],
        [UserRole.GUEST]: ['dashboard']
    };

    // Сотрудники - расширенные свойства
    employeesView: 'cards' | 'list' = 'cards';
    selectedDepartment: string = '';
    selectedEmployeeStatus: string = '';

    // Оборудование - расширенные свойства
    equipmentView: 'cards' | 'list' = 'cards';
    selectedEquipmentCategory: string = '';
    selectedEquipmentStatus: string = '';

    // Новости - расширенные свойства
    newsView: 'cards' | 'list' = 'cards';
    selectedNewsAuthor: string = '';
    selectedNewsPeriod: string = '';

    // Объекты - расширенные свойства  
    facilitiesView: 'cards' | 'list' = 'cards';
    selectedFacilityType: string = '';
    selectedFacilityStatus: string = '';

    // Фильтры для отзывов
    selectedReviewRating: string = '';
    selectedReviewPeriod: string = '';
    selectedReviewStatus: string = '';

    // Фильтры для обратной связи
    selectedFeedbackStatus: string = '';
    selectedFeedbackPriority: string = '';

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
                console.log('Навигация к URL:', url);
                
                // Правильно обрабатываем URL для определения секции
                let section = 'dashboard';
                if (url === '/admin' || url === '/admin/') {
                    section = 'dashboard';
                } else {
                    const pathParts = url.split('/');
                    const lastPart = pathParts[pathParts.length - 1];
                    if (lastPart && lastPart !== 'admin') {
                        section = lastPart;
                    }
                }
                
                console.log('Определена секция:', section);
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
        
        // Если URL уже /admin, убеждаемся что отображается дашборд
        const currentUrl = this.router.url;
        if (currentUrl === '/admin' || currentUrl === '/admin/') {
            console.log('Инициализация дашборда при запуске');
            this.currentSection = 'dashboard';
            this.pageTitle = this.getPageTitle('dashboard');
        }
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
        console.log('Текущий пользователь при проверке доступа:', {
            id: currentUser?.id,
            username: currentUser?.username,
            role: currentUser?.role
        });
        
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

    /**
     * Оптимизированное переключение темы
     * 
     * Оптимизации для устранения лагов:
     * 1. requestAnimationFrame - синхронизация с циклом рендеринга браузера
     * 2. Временный класс .theme-switching - отключение анимаций во время переключения
     * 3. CSS переменные - один пересчет стилей вместо множественных
     * 4. Аппаратное ускорение через transform: translateZ(0)
     * 5. Уменьшенное время переходов с 0.3s до 0.15s
     */
    toggleTheme(): void {
        // Оптимизация: использование requestAnimationFrame для более плавного переключения
        requestAnimationFrame(() => {
            this.isDarkTheme = !this.isDarkTheme;
            localStorage.setItem('adminTheme', this.isDarkTheme ? 'dark' : 'light');
            
            // Добавляем временный класс для отключения анимаций во время переключения
            const container = document.querySelector('.admin-container');
            if (container) {
                container.classList.add('theme-switching');
                
                // Убираем класс через короткое время
                setTimeout(() => {
                    container.classList.remove('theme-switching');
                    // Обновляем стили таблиц в редакторе после завершения переключения
                    this.updateEditorTableStyles();
                }, 150);
            }
        });
    }

    switchToSection(section: string): void {
        console.log(`🔄 SWITCH: Переключение на раздел: ${section}`);
        
        // Получаем текущего пользователя напрямую из сервиса
        const currentUser = this.authService.currentUserValue;
        console.log('Текущий пользователь при переключении раздела:', {
            id: currentUser?.id,
            username: currentUser?.username,
            role: currentUser?.role
            // Токен НИКОГДА не логируем!
        });
        
        if (!currentUser) {
            console.log('Пользователь не авторизован, перенаправление на страницу входа');
            this.router.navigate(['/login']);
            return;
        }
        
        // Проверяем доступ к секции
        if (!this.hasAccessToSection(section)) {
            const roleStr = String(currentUser.role).toLowerCase();
            console.log(`Доступ к разделу ${section} запрещен для роли ${roleStr}`);
            this.router.navigate(['/forbidden']);
            return;
        }

        // Устанавливаем текущую секцию и заголовок
        this.currentSection = section;
        this.pageTitle = this.getPageTitle(section);
        
        // Загружаем данные для специфических секций
        if (section === 'employees') {
            console.log('Загружаем данные сотрудников...');
            this.loadEmployees();
        } else if (section === 'facilities') {
            console.log('Загружаем данные объектов...');
            this.loadFacilities();
        } else if (section === 'equipment') {
            console.log('Загружаем данные оборудования...');
            this.loadEquipment();
        } else if (section === 'feedback') {
            console.log('Загружаем данные обратной связи...');
            this.loadFeedbacks();
        } else if (section === 'settings') {
            console.log('Загружаем настройки...');
            this.loadSettings();
        } else if (section === 'dashboard') {
            console.log('Обновляем данные дашборда...');
            this.loadAllData();
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
            'finances': 'Финансы',
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
        this.equipmentService.getEquipment().subscribe({
            next: (equipment) => {
                this.equipments = equipment || [];
                this.filteredEquipments = equipment || [];
            },
            error: (error) => {
                console.error('Ошибка при загрузке оборудования:', error);
                this.equipments = [];
                this.filteredEquipments = [];
            }
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
        this.applyFacilityFilters();
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
        if (!equipment.id && this.selectedEquipment) {
            equipment.id = this.selectedEquipment.id;
        }
        this.equipmentService.updateEquipment(equipment.id, equipment).subscribe({
            next: () => {
                this.loadEquipment();
                this.selectedEquipment = null;
                this.showAddEquipmentModal = false;
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
            (equipment.type && equipment.type.toLowerCase().includes(query)) ||
            (equipment.location && equipment.location.toLowerCase().includes(query))
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

    // Методы калькулятора
    selectCalculationType(type: string): void {
        this.selectedCalculationType = type;
        this.calculationResult = null;
    }

    calculateCost(): void {
        const { area, pricePerSquare, complexityFactor, vat } = this.calculatorData.cost;
        
        if (!area || !pricePerSquare) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const basePrice = area * pricePerSquare;
        const complexityPrice = basePrice * Number(complexityFactor);
        const vatAmount = complexityPrice * (vat / 100);
        const totalPrice = complexityPrice + vatAmount;

        this.calculationResult = {
            details: [
                { label: 'Площадь', value: `${area} м²` },
                { label: 'Стоимость за м²', value: `${pricePerSquare.toLocaleString('ru-RU')} ₽` },
                { label: 'Базовая стоимость', value: `${basePrice.toLocaleString('ru-RU')} ₽` },
                { label: 'Коэффициент сложности', value: `×${complexityFactor}` },
                { label: 'Стоимость с учетом сложности', value: `${complexityPrice.toLocaleString('ru-RU')} ₽` },
                { label: 'НДС', value: `${vatAmount.toLocaleString('ru-RU')} ₽` }
            ],
            totalLabel: 'Итоговая стоимость',
            totalValue: `${totalPrice.toLocaleString('ru-RU')} ₽`,
            type: 'cost'
        };
    }

    calculateEfficiency(): void {
        const { income, expenses, investments, period } = this.calculatorData.efficiency;
        
        if (!income || !expenses || !investments || !period) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const profit = income - expenses;
        const roi = (profit / investments) * 100;
        const monthlyProfit = profit / period;
        const paybackPeriod = investments / monthlyProfit;

        this.calculationResult = {
            details: [
                { label: 'Доходы', value: `${income.toLocaleString('ru-RU')} ₽` },
                { label: 'Расходы', value: `${expenses.toLocaleString('ru-RU')} ₽` },
                { label: 'Прибыль', value: `${profit.toLocaleString('ru-RU')} ₽` },
                { label: 'Инвестиции', value: `${investments.toLocaleString('ru-RU')} ₽` },
                { label: 'Период', value: `${period} мес.` },
                { label: 'Месячная прибыль', value: `${monthlyProfit.toLocaleString('ru-RU')} ₽` },
                { label: 'Срок окупаемости', value: `${paybackPeriod.toFixed(1)} мес.` }
            ],
            totalLabel: 'ROI (Рентабельность инвестиций)',
            totalValue: `${roi.toFixed(2)}%`,
            type: 'efficiency'
        };
    }

    calculateMaintenance(): void {
        const { equipmentCount, costPerUnit, frequency, maintenanceType } = this.calculatorData.maintenance;
        
        if (!equipmentCount || !costPerUnit || !frequency) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const maintenanceMultiplier = {
            'preventive': 1,
            'corrective': 1.3,
            'emergency': 2
        };

        const multiplier = maintenanceMultiplier[maintenanceType as keyof typeof maintenanceMultiplier] || 1;
        const totalCostPerMaintenance = equipmentCount * costPerUnit * multiplier;
        const monthlyMaintenanceCost = totalCostPerMaintenance * (30 / frequency);
        const yearlyMaintenanceCost = monthlyMaintenanceCost * 12;

        const maintenanceTypeRus = {
            'preventive': 'Профилактическое',
            'corrective': 'Корректирующее',
            'emergency': 'Экстренное'
        };

        this.calculationResult = {
            details: [
                { label: 'Количество оборудования', value: `${equipmentCount} ед.` },
                { label: 'Стоимость за единицу', value: `${costPerUnit.toLocaleString('ru-RU')} ₽` },
                { label: 'Тип обслуживания', value: maintenanceTypeRus[maintenanceType as keyof typeof maintenanceTypeRus] },
                { label: 'Периодичность', value: `${frequency} дней` },
                { label: 'Коэффициент сложности', value: `×${multiplier}` },
                { label: 'Стоимость за одно ТО', value: `${totalCostPerMaintenance.toLocaleString('ru-RU')} ₽` },
                { label: 'Месячные расходы', value: `${monthlyMaintenanceCost.toLocaleString('ru-RU')} ₽` }
            ],
            totalLabel: 'Годовые расходы на ТО',
            totalValue: `${yearlyMaintenanceCost.toLocaleString('ru-RU')} ₽`,
            type: 'maintenance'
        };
    }

    calculateTechnical(): void {
        const { cameraCount, cameraPrice, serverCount, serverPrice, cableLength, cablePricePerMeter, installationType, installationCost } = this.calculatorData.technical;
        
        if (!cameraCount || !cameraPrice || !serverCount || !serverPrice || !cableLength || !cablePricePerMeter) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const installationMultiplier = {
            'basic': 1,
            'professional': 1.5,
            'premium': 2
        };

        const multiplier = installationMultiplier[installationType as keyof typeof installationMultiplier] || 1;
        const camerasCost = cameraCount * cameraPrice;
        const serversCost = serverCount * serverPrice;
        const cableCost = cableLength * cablePricePerMeter;
        const totalInstallationCost = installationCost * multiplier;
        const equipmentCost = camerasCost + serversCost + cableCost;
        const totalCost = equipmentCost + totalInstallationCost;

        const installationTypeRus = {
            'basic': 'Базовая установка',
            'professional': 'Профессиональная установка',
            'premium': 'Премиум установка'
        };

        this.calculationResult = {
            details: [
                { label: 'Количество камер', value: `${cameraCount} шт.` },
                { label: 'Стоимость камер', value: `${camerasCost.toLocaleString('ru-RU')} ₽` },
                { label: 'Количество серверов', value: `${serverCount} шт.` },
                { label: 'Стоимость серверов', value: `${serversCost.toLocaleString('ru-RU')} ₽` },
                { label: 'Длина провода', value: `${cableLength} м` },
                { label: 'Стоимость провода', value: `${cableCost.toLocaleString('ru-RU')} ₽` },
                { label: 'Стоимость оборудования', value: `${equipmentCost.toLocaleString('ru-RU')} ₽` },
                { label: 'Тип установки', value: installationTypeRus[installationType as keyof typeof installationTypeRus] },
                { label: 'Стоимость работ', value: `${totalInstallationCost.toLocaleString('ru-RU')} ₽` }
            ],
            totalLabel: 'Общая стоимость проекта',
            totalValue: `${totalCost.toLocaleString('ru-RU')} ₽`,
            type: 'technical'
        };
    }

    saveCalculation(): void {
        if (!this.calculationResult) return;

        const calculationName = prompt('Введите название для сохранения расчета:');
        if (!calculationName) return;

        const newCalculation: Calculation = {
            id: Date.now(),
            name: calculationName,
            type: this.calculationResult.type as 'cost' | 'efficiency' | 'maintenance' | 'technical',
            date: new Date(),
            result: parseFloat(this.calculationResult.totalValue.replace(/[^\d.-]/g, ''))
        };

        this.calculations.unshift(newCalculation);
        this.filteredCalculations = [...this.calculations];
        
        alert('Расчет успешно сохранен!');
    }

    // Методы для дашборда
    getEquipmentByStatus(status: string): Equipment[] {
        return this.equipments.filter(equipment => equipment.status === status);
    }

    getTotalRevenue(): number {
        // Примерный расчет выручки на основе стоимости объектов
        return this.facilities.reduce((total, facility) => total + (facility.cost || 0), 0);
    }

    getTotalExpenses(): number {
        // Примерный расчет расходов на основе обслуживания оборудования
        const maintenanceCosts = this.equipments.length * 50000; // 50к за единицу в год
        const employeeCosts = this.employees.length * 600000; // 600к зарплата в год
        return maintenanceCosts + employeeCosts;
    }

    getProfit(): number {
        return this.getTotalRevenue() - this.getTotalExpenses();
    }

    // Финансовые методы
    updateFinanceData(): void {
        // Обновление финансовых данных в зависимости от выбранного периода
        console.log('Обновление финансовых данных для периода:', this.selectedFinancePeriod);
    }

    getFinanceData(type: string): number {
        switch (type) {
            case 'revenue':
                return this.getTotalRevenue();
            case 'expenses':
                return this.getTotalExpenses();
            case 'profit':
                return this.getProfit();
            default:
                return 0;
        }
    }

    getROI(): number {
        const revenue = this.getTotalRevenue();
        const expenses = this.getTotalExpenses();
        if (expenses === 0) return 0;
        return Math.round((revenue - expenses) / expenses * 100);
    }

    setChartType(type: string): void {
        this.chartType = type;
    }

    getChartData(): any[] {
        return [
            { label: 'Янв', revenue: 85, expenses: 65 },
            { label: 'Фев', revenue: 75, expenses: 70 },
            { label: 'Мар', revenue: 90, expenses: 60 },
            { label: 'Апр', revenue: 95, expenses: 75 },
            { label: 'Май', revenue: 80, expenses: 55 },
            { label: 'Июн', revenue: 100, expenses: 80 }
        ];
    }

    getRevenueBreakdown(): any[] {
        return [
            { category: 'Аренда', amount: 2500000, percentage: 45, color: '#7c3aed' },
            { category: 'Услуги', amount: 1800000, percentage: 32, color: '#a855f7' },
            { category: 'Продажи', amount: 900000, percentage: 16, color: '#c084fc' },
            { category: 'Прочее', amount: 400000, percentage: 7, color: '#ddd6fe' }
        ];
    }

    getRecentTransactions(): any[] {
        return [
            {
                id: 1,
                date: new Date('2024-01-15'),
                description: 'Аренда офиса',
                category: 'Аренда',
                type: 'income',
                amount: 150000
            },
            {
                id: 2,
                date: new Date('2024-01-14'),
                description: 'Закупка оборудования',
                category: 'Оборудование',
                type: 'expense',
                amount: 85000
            },
            {
                id: 3,
                date: new Date('2024-01-13'),
                description: 'Консультационные услуги',
                category: 'Услуги',
                type: 'income',
                amount: 75000
            }
        ];
    }

    editTransaction(transaction: any): void {
        console.log('Редактирование транзакции:', transaction);
    }

    deleteTransaction(id: number): void {
        console.log('Удаление транзакции:', id);
    }

    getBudgets(): any[] {
        return [
            {
                id: 1,
                name: 'Операционные расходы',
                period: 'Месяц',
                limit: 500000,
                spent: 380000
            },
            {
                id: 2,
                name: 'Маркетинг',
                period: 'Квартал',
                limit: 300000,
                spent: 245000
            },
            {
                id: 3,
                name: 'Развитие',
                period: 'Год',
                limit: 1000000,
                spent: 1050000
            }
        ];
    }

    editBudget(budget: any): void {
        console.log('Редактирование бюджета:', budget);
    }

    deleteBudget(id: number): void {
        console.log('Удаление бюджета:', id);
    }

    clearCalculation(): void {
        this.calculationResult = null;
        this.calculatorData = {
            cost: {
                area: 0,
                pricePerSquare: 0,
                complexityFactor: 1,
                vat: 20
            },
            efficiency: {
                income: 0,
                expenses: 0,
                investments: 0,
                period: 12
            },
            maintenance: {
                equipmentCount: 0,
                costPerUnit: 0,
                frequency: 30,
                maintenanceType: 'preventive'
            },
            technical: {
                cameraCount: 0,
                cameraPrice: 0,
                serverCount: 0,
                serverPrice: 0,
                cableLength: 0,
                cablePricePerMeter: 0,
                installationType: 'basic',
                installationCost: 0
            }
        };
    }

    // Методы для работы с отчетами
    setReportsView(view: 'list' | 'cards' | 'editor'): void {
        this.reportsView = view;
        if (view === 'editor') {
            if (!this.currentReport.title) {
                this.currentReport = {
                    title: 'Новый отчет',
                    content: '<h1>Новый отчет</h1><p>Начните вводить содержание отчета...</p>',
                    type: 'financial',
                    status: 'draft',
                    author: this.userName || 'Администратор',
                    createdDate: new Date(),
                    updatedDate: new Date()
                };
            }
            
            // Устанавливаем содержимое в редактор после инициализации DOM
            setTimeout(() => {
                this.initializeEditor();
            }, 0);
        }
    }

    initializeEditor(): void {
        const editorElement = document.querySelector('.editor-content') as HTMLElement;
        if (editorElement && this.currentReport.content) {
            editorElement.innerHTML = this.currentReport.content;
            // Устанавливаем курсор в конец
            this.setCaretToEnd(editorElement);
            
            // Применяем стили темы
            setTimeout(() => {
                this.updateEditorTableStyles();
            }, 100);
        }
    }

    onCreateNewReport(): void {
        this.currentReport = {
            title: 'Новый отчет',
            content: '<h1>Новый отчет</h1><p>Начните вводить содержание отчета...</p>',
            type: 'financial',
            status: 'draft',
            author: this.userName || 'Администратор',
            createdDate: new Date(),
            updatedDate: new Date()
        };
        this.setReportsView('editor');
    }

    getFilteredReports(): Report[] {
        let filtered = this.filteredReports;
        
        if (this.selectedReportType) {
            filtered = filtered.filter(report => report.type === this.selectedReportType);
        }
        
        if (this.selectedReportStatus) {
            filtered = filtered.filter(report => report.status === this.selectedReportStatus);
        }
        
        return filtered;
    }

    filterReportsByType(): void {
        // Фильтрация уже выполняется в getFilteredReports()
    }

    filterReportsByStatus(): void {
        // Фильтрация уже выполняется в getFilteredReports()
    }

    getReportTypeName(type: string): string {
        const typeNames: { [key: string]: string } = {
            'financial': 'Финансовый',
            'operational': 'Операционный',
            'maintenance': 'Обслуживание',
            'analytics': 'Аналитика'
        };
        return typeNames[type] || type;
    }

    getReportStatusName(status: string): string {
        const statusNames: { [key: string]: string } = {
            'draft': 'Черновик',
            'published': 'Опубликован',
            'archived': 'В архиве'
        };
        return statusNames[status] || status;
    }

    onEditReportInEditor(report: Report): void {
        this.currentReport = {
            ...report,
            content: report.content || '<h1>' + report.title + '</h1><p>Содержание отчета...</p>'
        };
        this.setReportsView('editor');
    }

    onDownloadReport(report: Report): void {
        console.log('Скачивание отчета:', report.title);
        // Здесь можно добавить логику скачивания
    }

    onDuplicateReport(report: Report): void {
        const duplicatedReport = {
            ...report,
            title: report.title + ' (копия)',
            createdDate: new Date(),
            updatedDate: new Date()
        };
        this.reports.unshift(duplicatedReport as Report);
        this.filteredReports = [...this.reports];
        console.log('Отчет дублирован:', duplicatedReport.title);
    }

    toggleReportMenu(report: any): void {
        report.showMenu = !report.showMenu;
        // Закрываем другие меню
        this.reports.forEach(r => {
            if (r !== report) {
                (r as any).showMenu = false;
            }
        });
    }

    // Методы редактора отчетов
    saveReport(): void {
        if (!this.currentReport.title.trim()) {
            alert('Введите название отчета');
            return;
        }

        this.editorState.isSaving = true;
        
        // Обновляем данные отчета
        this.currentReport.author = this.userName || 'Неизвестен';
        this.currentReport.updatedDate = new Date();

        // Симуляция сохранения
        setTimeout(() => {
            console.log('Отчет сохранен:', this.currentReport);
            this.editorState.isSaving = false;
            this.editorState.lastSaved = new Date();
            
            // Добавляем в список отчетов если это новый отчет
            if (!this.reports.find(r => r.id === this.currentReport.id)) {
                this.currentReport.id = this.reports.length + 1;
                this.reports.unshift(this.currentReport);
                this.filteredReports = [...this.reports];
            }
            
            // Показываем уведомление об успешном сохранении
            this.showSaveNotification('Отчет успешно сохранен');
        }, 1000);
    }

    autoSaveReport(): void {
        if (this.currentReport.content.trim() && !this.editorState.isSaving) {
            this.currentReport.updatedDate = new Date();
            console.log('Автосохранение отчета');
            this.editorState.lastSaved = new Date();
        }
    }

    startAutoSave(): void {
        this.stopAutoSave();
        this.editorState.autoSaveInterval = setInterval(() => {
            this.autoSaveReport();
        }, 30000); // Автосохранение каждые 30 секунд
    }

    stopAutoSave(): void {
        if (this.editorState.autoSaveInterval) {
            clearInterval(this.editorState.autoSaveInterval);
            this.editorState.autoSaveInterval = null;
        }
    }

    showSaveNotification(message: string): void {
        // Создаем временное уведомление
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    previewReport(): void {
        if (!this.currentReport.content.trim()) {
            alert('Отчет пуст');
            return;
        }

        // Открываем предварительный просмотр в новом окне
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        if (previewWindow) {
            previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Предварительный просмотр: ${this.currentReport.title}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            max-width: 800px; 
                            margin: 0 auto; 
                            padding: 20px;
                            line-height: 1.6;
                        }
                        h1 { color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { background-color: #f5f5f5; font-weight: bold; }
                        .chart-placeholder { 
                            background: #f0f0f0; 
                            padding: 40px; 
                            text-align: center; 
                            border: 2px dashed #ccc;
                            margin: 20px 0;
                        }
                        .print-btn {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            padding: 10px 20px;
                            background: #6366f1;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                        @media print {
                            .print-btn { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <button class="print-btn" onclick="window.print()">Печать</button>
                    <h1>${this.currentReport.title}</h1>
                    <div style="margin-bottom: 20px; color: #666;">
                        <strong>Тип:</strong> ${this.getReportTypeName(this.currentReport.type)} | 
                        <strong>Статус:</strong> ${this.getReportStatusName(this.currentReport.status)} | 
                        <strong>Автор:</strong> ${this.currentReport.author} | 
                        <strong>Дата:</strong> ${new Date(this.currentReport.updatedDate).toLocaleDateString()}
                    </div>
                    <div>${this.currentReport.content}</div>
                </body>
                </html>
            `);
            previewWindow.document.close();
        }
    }

    exportReport(): void {
        if (!this.currentReport.content.trim()) {
            alert('Отчет пуст');
            return;
        }

        // Создаем HTML контент для экспорта
        const exportContent = `
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${this.currentReport.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #f5f5f5; }
                </style>
            </head>
            <body>
                <h1>${this.currentReport.title}</h1>
                <div style="margin-bottom: 20px; color: #666;">
                    <strong>Тип:</strong> ${this.getReportTypeName(this.currentReport.type)} | 
                    <strong>Статус:</strong> ${this.getReportStatusName(this.currentReport.status)} | 
                    <strong>Автор:</strong> ${this.currentReport.author} | 
                    <strong>Дата:</strong> ${new Date(this.currentReport.updatedDate).toLocaleDateString()}
                </div>
                <div>${this.currentReport.content}</div>
            </body>
            </html>
        `;

        // Создаем blob и ссылку для скачивания
        const blob = new Blob([exportContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.currentReport.title || 'report'}.html`;
        link.click();
        window.URL.revokeObjectURL(url);

        console.log('Отчет экспортирован');
    }

    formatText(command: string, value?: string): void {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            this.saveToUndoStack();
        }

        switch (command) {
            case 'fontSize':
                document.execCommand('fontSize', false, '7');
                const fontElements = document.getElementsByTagName('font');
                for (let i = 0; i < fontElements.length; i++) {
                    if (fontElements[i].size === '7') {
                        fontElements[i].removeAttribute('size');
                        fontElements[i].style.fontSize = value + 'px';
                    }
                }
                break;
            case 'fontName':
                document.execCommand('fontName', false, value);
                break;
            case 'foreColor':
                document.execCommand('foreColor', false, value);
                break;
            case 'backColor':
                document.execCommand('hiliteColor', false, value);
                break;
            default:
                document.execCommand(command, false, value);
        }
        
        this.onEditorContentChange({ target: { innerHTML: this.getCurrentEditorContent() } });
    }

    insertElement(elementType: string): void {
        this.saveToUndoStack();
        
        switch (elementType) {
            case 'table':
                this.showTableDialog();
                break;
            case 'image':
                this.showImageDialog();
                break;
            case 'chart':
                this.insertChart();
                break;
            case 'list':
                this.insertList();
                break;
            case 'hr':
                document.execCommand('insertHTML', false, '<hr>');
                break;
            case 'pageBreak':
                document.execCommand('insertHTML', false, '<div style="page-break-before: always;"></div>');
                break;
        }
        
        this.onEditorContentChange({ target: { innerHTML: this.getCurrentEditorContent() } });
    }

    showTableDialog(): void {
        this.tableEditor.showTableDialog = true;
    }

    insertTable(): void {
        let tableHTML = '<table border="1" style="width: 100%; border-collapse: collapse;">';
        
        if (this.tableEditor.hasHeaders) {
            tableHTML += '<thead><tr>';
            for (let j = 0; j < this.tableEditor.cols; j++) {
                tableHTML += `<th style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Заголовок ${j + 1}</th>`;
            }
            tableHTML += '</tr></thead>';
        }
        
        tableHTML += '<tbody>';
        const startRow = this.tableEditor.hasHeaders ? 0 : 0;
        for (let i = startRow; i < this.tableEditor.rows; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < this.tableEditor.cols; j++) {
                tableHTML += '<td style="padding: 12px; border: 1px solid #ddd;">Ячейка</td>';
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table><br>';
        
        document.execCommand('insertHTML', false, tableHTML);
        this.tableEditor.showTableDialog = false;
        
        // Применяем стили темы к новой таблице
        setTimeout(() => {
            this.updateEditorTableStyles();
        }, 100);
    }

    showImageDialog(): void {
        this.imageUpload.showImageDialog = true;
    }

    insertImage(): void {
        if (!this.imageUpload.imageUrl.trim()) {
            alert('Введите URL изображения');
            return;
        }
        
        const imageHTML = `<img src="${this.imageUpload.imageUrl}" 
                               alt="${this.imageUpload.imageAlt}" 
                               style="width: ${this.imageUpload.imageWidth}px; height: ${this.imageUpload.imageHeight}px; max-width: 100%;">`;
        
        document.execCommand('insertHTML', false, imageHTML);
        this.imageUpload.showImageDialog = false;
        this.resetImageDialog();
    }

    resetImageDialog(): void {
        this.imageUpload.imageUrl = '';
        this.imageUpload.imageAlt = '';
        this.imageUpload.imageWidth = 300;
        this.imageUpload.imageHeight = 200;
    }

    insertChart(): void {
        const chartHTML = `
            <div class="chart-placeholder" style="background: #f8fafc; border: 2px dashed #6366f1; padding: 40px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <i class="fas fa-chart-bar" style="font-size: 48px; color: #6366f1; margin-bottom: 16px; display: block;"></i>
                <h4 style="color: #6366f1; margin: 0;">График</h4>
                <p style="color: #64748b; margin: 8px 0 0 0;">Место для вставки графика</p>
            </div>
        `;
        document.execCommand('insertHTML', false, chartHTML);
    }

    insertList(): void {
        const listHTML = '<ul><li>Элемент списка 1</li><li>Элемент списка 2</li><li>Элемент списка 3</li></ul>';
        document.execCommand('insertHTML', false, listHTML);
    }

    saveToUndoStack(): void {
        const currentContent = this.getCurrentEditorContent();
        this.editorState.undoStack.push(currentContent);
        if (this.editorState.undoStack.length > 50) {
            this.editorState.undoStack.shift();
        }
        this.editorState.redoStack = [];
    }

    undo(): void {
        if (this.editorState.undoStack.length > 0) {
            const currentContent = this.getCurrentEditorContent();
            this.editorState.redoStack.push(currentContent);
            
            const previousContent = this.editorState.undoStack.pop();
            if (previousContent) {
                this.setEditorContent(previousContent);
                this.currentReport.content = previousContent;
            }
        }
    }

    redo(): void {
        if (this.editorState.redoStack.length > 0) {
            const currentContent = this.getCurrentEditorContent();
            this.editorState.undoStack.push(currentContent);
            
            const nextContent = this.editorState.redoStack.pop();
            if (nextContent) {
                this.setEditorContent(nextContent);
                this.currentReport.content = nextContent;
            }
        }
    }

    getCurrentEditorContent(): string {
        const editorElement = document.querySelector('.editor-content') as HTMLElement;
        return editorElement ? editorElement.innerHTML : this.currentReport.content;
    }

    setEditorContent(content: string): void {
        const editorElement = document.querySelector('.editor-content') as HTMLElement;
        if (editorElement && editorElement.innerHTML !== content) {
            // Сохраняем позицию курсора
            const caretPosition = this.saveCaretPosition();
            
            // Обновляем содержимое
            editorElement.innerHTML = content;
            
            // Восстанавливаем позицию курсора
            if (caretPosition) {
                try {
                    this.restoreCaretPosition(caretPosition);
                } catch (e) {
                    // Если не удалось восстановить позицию, устанавливаем курсор в конец
                    this.setCaretToEnd(editorElement);
                }
            }
        }
    }

    setCaretToEnd(element: HTMLElement): void {
        const range = document.createRange();
        const selection = window.getSelection();
        
        if (element.childNodes.length > 0) {
            range.setStartAfter(element.lastChild!);
        } else {
            range.setStart(element, 0);
        }
        
        range.collapse(true);
        
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    onEditorFocus(): void {
        this.editorState.isEditorFocused = true;
        this.startAutoSave();
    }

    onEditorBlur(): void {
        this.editorState.isEditorFocused = false;
    }

    loadTemplate(templateType: string): void {
        this.saveToUndoStack();
        
        let content = '';
        const currentDate = new Date().toLocaleDateString('ru-RU');
        
        switch (templateType) {
            case 'financial':
                content = `
                    <h1>Финансовый отчет</h1>
                    <div style="margin-bottom: 30px;">
                        <p><strong>Период:</strong> ${currentDate}</p>
                        <p><strong>Подготовил:</strong> ${this.currentReport.author}</p>
                    </div>
                    
                    <h2>Краткое резюме</h2>
                    <p>Общая информация о финансовом состоянии компании за отчетный период...</p>
                    
                    <h2>Доходы</h2>
                    <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="padding: 12px; font-weight: bold;">Источник дохода</th>
                                <th style="padding: 12px; font-weight: bold;">Сумма (₽)</th>
                                <th style="padding: 12px; font-weight: bold;">% от общего</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 12px;">Основная деятельность</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">0%</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Дополнительные услуги</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">0%</td>
                            </tr>
                            <tr style="background-color: #f9f9f9; font-weight: bold;">
                                <td style="padding: 12px;">Итого доходы</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">100%</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h2>Расходы</h2>
                    <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="padding: 12px; font-weight: bold;">Категория расходов</th>
                                <th style="padding: 12px; font-weight: bold;">Сумма (₽)</th>
                                <th style="padding: 12px; font-weight: bold;">% от общего</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 12px;">Операционные расходы</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">0%</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Административные расходы</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">0%</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Маркетинг и реклама</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">0%</td>
                            </tr>
                            <tr style="background-color: #f9f9f9; font-weight: bold;">
                                <td style="padding: 12px;">Итого расходы</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">100%</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h2>Финансовые показатели</h2>
                    <div class="chart-placeholder" style="background: #f8fafc; border: 2px dashed #6366f1; padding: 40px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h4 style="color: #6366f1; margin: 0;">График финансовых показателей</h4>
                        <p style="color: #64748b; margin: 8px 0 0 0;">Динамика доходов и расходов</p>
                    </div>
                    
                    <h2>Заключение</h2>
                    <p><strong>Прибыль за период:</strong> <span style="color: #10b981; font-weight: bold;">0 ₽</span></p>
                    <p>Выводы и рекомендации по результатам финансового анализа...</p>
                `;
                break;
                
            case 'operational':
                content = `
                    <h1>Операционный отчет</h1>
                    <div style="margin-bottom: 30px;">
                        <p><strong>Период:</strong> ${currentDate}</p>
                        <p><strong>Подготовил:</strong> ${this.currentReport.author}</p>
                    </div>
                    
                    <h2>Ключевые показатели эффективности</h2>
                    <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="padding: 12px; font-weight: bold;">Показатель</th>
                                <th style="padding: 12px; font-weight: bold;">Значение</th>
                                <th style="padding: 12px; font-weight: bold;">Цель</th>
                                <th style="padding: 12px; font-weight: bold;">Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 12px;">Обработанные заявки</td>
                                <td style="padding: 12px;">0</td>
                                <td style="padding: 12px;">100</td>
                                <td style="padding: 12px;">🔴 Не достигнута</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Среднее время обработки</td>
                                <td style="padding: 12px;">0 часов</td>
                                <td style="padding: 12px;">24 часа</td>
                                <td style="padding: 12px;">🟡 В процессе</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Уровень удовлетворенности</td>
                                <td style="padding: 12px;">0%</td>
                                <td style="padding: 12px;">95%</td>
                                <td style="padding: 12px;">🟢 Достигнута</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h2>Производительность команды</h2>
                    <div class="chart-placeholder" style="background: #f8fafc; border: 2px dashed #6366f1; padding: 40px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h4 style="color: #6366f1; margin: 0;">График производительности</h4>
                        <p style="color: #64748b; margin: 8px 0 0 0;">Динамика работы команды</p>
                    </div>
                    
                    <h2>Выявленные проблемы</h2>
                    <ul>
                        <li>Проблема 1: Описание и влияние на операции</li>
                        <li>Проблема 2: Описание и влияние на операции</li>
                        <li>Проблема 3: Описание и влияние на операции</li>
                    </ul>
                    
                    <h2>Принятые меры</h2>
                    <ol>
                        <li>Мера 1: Описание предпринятых действий</li>
                        <li>Мера 2: Описание предпринятых действий</li>
                        <li>Мера 3: Описание предпринятых действий</li>
                    </ol>
                    
                    <h2>Планы на следующий период</h2>
                    <p>Описание планов и целей на предстоящий период...</p>
                `;
                break;
                
            case 'analytics':
                content = `
                    <h1>Аналитический отчет</h1>
                    <div style="margin-bottom: 30px;">
                        <p><strong>Период анализа:</strong> ${currentDate}</p>
                        <p><strong>Аналитик:</strong> ${this.currentReport.author}</p>
                    </div>
                    
                    <h2>Цель анализа</h2>
                    <p>Описание целей и задач проведенного анализа...</p>
                    
                    <h2>Методология</h2>
                    <p>Описание используемых методов и подходов к анализу данных...</p>
                    
                    <h2>Источники данных</h2>
                    <ul>
                        <li>Внутренние системы учета</li>
                        <li>CRM система</li>
                        <li>Внешние источники</li>
                        <li>Опросы и исследования</li>
                    </ul>
                    
                    <h2>Ключевые тренды</h2>
                    <div class="chart-placeholder" style="background: #f8fafc; border: 2px dashed #6366f1; padding: 40px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h4 style="color: #6366f1; margin: 0;">График трендов</h4>
                        <p style="color: #64748b; margin: 8px 0 0 0;">Основные тенденции развития</p>
                    </div>
                    
                    <h2>Детальный анализ</h2>
                    <h3>Сегмент A</h3>
                    <p>Анализ первого сегмента данных...</p>
                    
                    <h3>Сегмент B</h3>
                    <p>Анализ второго сегмента данных...</p>
                    
                    <h3>Сегмент C</h3>
                    <p>Анализ третьего сегмента данных...</p>
                    
                    <h2>Выводы</h2>
                    <ol>
                        <li><strong>Основной вывод 1:</strong> Описание вывода и его значимости</li>
                        <li><strong>Основной вывод 2:</strong> Описание вывода и его значимости</li>
                        <li><strong>Основной вывод 3:</strong> Описание вывода и его значимости</li>
                    </ol>
                    
                    <h2>Рекомендации</h2>
                    <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="padding: 12px; font-weight: bold;">Рекомендация</th>
                                <th style="padding: 12px; font-weight: bold;">Приоритет</th>
                                <th style="padding: 12px; font-weight: bold;">Срок реализации</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 12px;">Рекомендация 1</td>
                                <td style="padding: 12px;">🔴 Высокий</td>
                                <td style="padding: 12px;">1 месяц</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Рекомендация 2</td>
                                <td style="padding: 12px;">🟡 Средний</td>
                                <td style="padding: 12px;">3 месяца</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Рекомендация 3</td>
                                <td style="padding: 12px;">🟢 Низкий</td>
                                <td style="padding: 12px;">6 месяцев</td>
                            </tr>
                        </tbody>
                    </table>
                `;
                break;
        }
        
        this.currentReport.content = content;
        this.currentReport.type = templateType;
        this.setEditorContent(content);
        
        // Применяем стили темы после загрузки шаблона
        setTimeout(() => {
            this.updateEditorTableStyles();
        }, 100);
    }

    onEditorContentChange(event: any): void {
        // Обновляем только модель, не DOM элемент
        const newContent = event.target.innerHTML;
        if (this.currentReport.content !== newContent) {
            this.currentReport.content = newContent;
            this.currentReport.updatedDate = new Date();
        }
    }

    onEditorInput(event: any): void {
        // Обработка ввода текста без потери позиции курсора
        this.currentReport.content = event.target.innerHTML;
        this.currentReport.updatedDate = new Date();
    }

    // Методы для работы с сотрудниками
    getActiveEmployeesCount(): number {
        return this.employees.filter(emp => (emp as any).status !== 'inactive').length;
    }

    getDepartmentsCount(): number {
        const departments = new Set(this.employees.map(emp => (emp as any).department).filter(dept => dept));
        return departments.size;
    }

    setEmployeesView(view: 'cards' | 'list'): void {
        this.employeesView = view;
    }

    getFilteredEmployees(): Employee[] {
        let filtered = this.filteredEmployees;
        
        // Фильтр по отделу
        if (this.selectedDepartment) {
            filtered = filtered.filter(emp => (emp as any).department === this.selectedDepartment);
        }
        
        // Фильтр по статусу
        if (this.selectedEmployeeStatus) {
            filtered = filtered.filter(emp => ((emp as any).status || 'active') === this.selectedEmployeeStatus);
        }
        
        return filtered;
    }

    filterEmployeesByDepartment(): void {
        // Фильтрация происходит в getFilteredEmployees()
    }

    filterEmployeesByStatus(): void {
        // Фильтрация происходит в getFilteredEmployees()
    }

    toggleEmployeeMenu(employee: any): void {
        employee.showMenu = !employee.showMenu;
        // Закрываем другие меню
        this.employees.forEach(emp => {
            if (emp !== employee) {
                (emp as any).showMenu = false;
            }
        });
    }

    onViewEmployee(employee: Employee): void {
        console.log('Просмотр сотрудника:', employee.name);
        // Здесь можно открыть модальное окно с детальной информацией
    }

    onSendMessage(employee: Employee): void {
        console.log('Отправка сообщения сотруднику:', employee.name);
        // Здесь можно открыть модальное окно для отправки сообщения
    }

    getEmployeeStatusName(status: string): string {
        const statusNames: { [key: string]: string } = {
            'active': 'Активен',
            'inactive': 'Неактивен',
            'vacation': 'В отпуске'
        };
        return statusNames[status] || 'Неизвестно';
    }

    // Методы для работы с оборудованием
    setEquipmentView(view: 'cards' | 'list'): void {
        this.equipmentView = view;
    }

    getFilteredEquipment(): Equipment[] {
        let filtered = this.filteredEquipments;
        
        // Фильтр по типу (вместо category)
        if (this.selectedEquipmentCategory) {
            filtered = filtered.filter(eq => eq.type === this.selectedEquipmentCategory);
        }
        
        // Фильтр по статусу
        if (this.selectedEquipmentStatus) {
            filtered = filtered.filter(eq => eq.status === this.selectedEquipmentStatus);
        }
        
        return filtered;
    }

    filterEquipmentByCategory(): void {
        // Фильтрация происходит в getFilteredEquipment()
    }

    filterEquipmentByStatus(): void {
        // Фильтрация происходит в getFilteredEquipment()
    }

    getEquipmentStatusName(status: string): string {
        const statusNames: { [key: string]: string } = {
            'active': 'Активно',
            'inactive': 'Неактивно',
            'maintenance': 'На обслуживании'
        };
        return statusNames[status] || 'Неизвестно';
    }

    getEquipmentTypes(): string[] {
        const types = new Set(this.equipments.map(eq => eq.type).filter(type => type));
        return Array.from(types);
    }

    onViewEquipment(equipment: Equipment): void {
        console.log('Просмотр оборудования:', equipment.name);
        // Здесь можно открыть модальное окно с детальной информацией
    }

    onScheduleMaintenance(equipment: Equipment): void {
        console.log('Планирование ТО для:', equipment.name);
        // Здесь можно открыть модальное окно для планирования ТО
    }

    onDuplicateEquipment(equipment: Equipment): void {
        const duplicatedEquipment = {
            ...equipment,
            id: 0, // Новый ID будет присвоен сервером
            name: equipment.name + ' (копия)'
        };
        delete (duplicatedEquipment as any).id; // Удаляем ID для создания новой записи
        this.equipments.unshift(duplicatedEquipment as Equipment);
        this.filteredEquipments = [...this.equipments];
        console.log('Оборудование дублировано:', duplicatedEquipment.name);
    }

    onExportEquipment(equipment: Equipment): void {
        console.log('Экспорт данных оборудования:', equipment.name);
        // Здесь можно добавить логику экспорта
    }

    toggleEquipmentMenu(equipment: any): void {
        equipment.showMenu = !equipment.showMenu;
        // Закрываем другие меню
        this.equipments.forEach(eq => {
            if (eq !== equipment) {
                (eq as any).showMenu = false;
            }
        });
    }

    // Методы для работы с новостями
    setNewsView(view: 'cards' | 'list'): void {
        this.newsView = view;
    }

    getFilteredNews(): News[] {
        let filtered = this.filteredNews;
        
        // Фильтр по автору
        if (this.selectedNewsAuthor) {
            filtered = filtered.filter(news => news.author === this.selectedNewsAuthor);
        }
        
        // Фильтр по периоду
        if (this.selectedNewsPeriod) {
            const today = new Date();
            filtered = filtered.filter(news => {
                const newsDate = new Date(news.date);
                switch (this.selectedNewsPeriod) {
                    case 'today':
                        return newsDate.toDateString() === today.toDateString();
                    case 'week':
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return newsDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return newsDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }
        
        return filtered;
    }

    filterNewsByAuthor(): void {
        // Фильтрация происходит в getFilteredNews()
    }

    filterNewsByPeriod(): void {
        // Фильтрация происходит в getFilteredNews()
    }

    getRecentNewsCount(): number {
        const today = new Date();
        return this.newsList.filter(news => {
            const newsDate = new Date(news.date);
            return newsDate.toDateString() === today.toDateString();
        }).length;
    }

    getReadTime(content: string): number {
        // Примерный расчет времени чтения (200 слов в минуту)
        const words = content.split(' ').length;
        return Math.max(1, Math.ceil(words / 200));
    }

    onViewNews(news: News): void {
        console.log('Просмотр новости:', news.title);
        // Здесь можно открыть модальное окно с детальной информацией
    }

    onDuplicateNews(news: News): void {
        const duplicatedNews = {
            ...news,
            title: news.title + ' (копия)',
            date: new Date()
        };
        this.newsList.unshift(duplicatedNews as News);
        this.filteredNews = [...this.newsList];
        console.log('Новость дублирована:', duplicatedNews.title);
    }

    onPublishNews(news: News): void {
        console.log('Публикация новости:', news.title);
        // Здесь можно добавить логику публикации
    }

    toggleNewsMenu(news: any): void {
        // Закрываем все другие меню
        this.newsList.forEach(n => {
            if (n.id !== news.id) {
                n.showMenu = false;
            }
        });
        
        // Переключаем текущее меню
        news.showMenu = !news.showMenu;
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С ОБЪЕКТАМИ =====

    getFacilitiesByStatus(status: string): Facility[] {
        return this.facilities.filter(facility => facility.status === status);
    }

    setFacilitiesView(view: 'cards' | 'list'): void {
        this.facilitiesView = view;
    }

    filterFacilitiesByType(): void {
        this.applyFacilityFilters();
    }

    filterFacilitiesByStatus(): void {
        this.applyFacilityFilters();
    }

    private applyFacilityFilters(): void {
        let filtered = [...this.facilities];

        // Фильтр по типу
        if (this.selectedFacilityType) {
            filtered = filtered.filter(facility => facility.type === this.selectedFacilityType);
        }

        // Фильтр по статусу
        if (this.selectedFacilityStatus) {
            filtered = filtered.filter(facility => facility.status === this.selectedFacilityStatus);
        }

        // Фильтр по поисковому запросу
        if (this.facilitySearchQuery) {
            const query = this.facilitySearchQuery.toLowerCase();
            filtered = filtered.filter(facility => 
                facility.name.toLowerCase().includes(query) ||
                facility.address.toLowerCase().includes(query) ||
                facility.type.toLowerCase().includes(query)
            );
        }

        this.filteredFacilities = filtered;
    }

    toggleFacilityMenu(facility: any): void {
        // Закрываем все другие меню
        this.facilities.forEach(f => {
            if (f.id !== facility.id) {
                f.showMenu = false;
            }
        });
        
        // Переключаем текущее меню
        facility.showMenu = !facility.showMenu;
    }

    onDuplicateFacility(facility: Facility): void {
        const duplicatedFacility: Facility = {
            ...facility,
            id: 0, // Новый ID будет присвоен сервером
            name: `${facility.name} (копия)`,
            status: 'inactive' // Копия создается в неактивном состоянии
        };

        this.facilityService.addFacility(duplicatedFacility).subscribe({
            next: (newFacility) => {
                this.facilities.push(newFacility);
                this.applyFacilityFilters();
                console.log('Объект дублирован:', newFacility);
            },
            error: (error) => {
                console.error('Ошибка при дублировании объекта:', error);
            }
        });

        // Закрываем меню
        facility.showMenu = false;
    }

    onExportFacility(facility: Facility): void {
        // Здесь будет логика экспорта объекта в JSON/CSV
        const dataStr = JSON.stringify(facility, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `facility_${facility.name.replace(/\s+/g, '_')}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        // Закрываем меню
        facility.showMenu = false;
        console.log('Объект экспортирован:', facility);
    }

    // Методы для работы с курсором
    saveCaretPosition(): Range | null {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            return selection.getRangeAt(0).cloneRange();
        }
        return null;
    }

    restoreCaretPosition(range: Range): void {
        if (range) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    // Метод для обновления стилей таблиц в редакторе при смене темы
    updateEditorTableStyles(): void {
        const editorElement = document.querySelector('.editor-content') as HTMLElement;
        if (!editorElement) return;

        const tables = editorElement.querySelectorAll('table');
        
        tables.forEach(table => {
            // Обновляем стили таблицы
            if (this.isDarkTheme) {
                table.style.background = 'rgba(30, 41, 59, 0.7)';
                table.style.border = '1px solid rgba(71, 85, 105, 0.4)';
                table.style.color = '#e2e8f0';
                
                // Обновляем заголовки
                const headers = table.querySelectorAll('th');
                headers.forEach(th => {
                    th.style.background = 'rgba(71, 85, 105, 0.8)';
                    th.style.color = '#f1f5f9';
                    th.style.border = '1px solid rgba(100, 116, 139, 0.4)';
                });
                
                // Обновляем ячейки
                const cells = table.querySelectorAll('td');
                cells.forEach(td => {
                    // Проверяем, является ли это заголовочной или итоговой строкой
                    const parentRow = td.parentElement;
                    const isHeaderRow = parentRow?.querySelector('th') !== null;
                    const isFirstRow = parentRow === table.querySelector('tr:first-child');
                    const isLastRow = parentRow === table.querySelector('tr:last-child');
                    const isBoldRow = parentRow?.style.fontWeight === 'bold' || 
                                    parentRow?.getAttribute('style')?.includes('font-weight: bold') ||
                                    parentRow?.getAttribute('style')?.includes('font-weight:bold');
                    const hasBackgroundStyle = parentRow?.getAttribute('style')?.includes('background');
                    
                    if (isHeaderRow || isFirstRow || isLastRow || isBoldRow || hasBackgroundStyle) {
                        td.style.background = 'rgba(71, 85, 105, 0.7)';
                        td.style.color = '#f1f5f9';
                        td.style.fontWeight = 'bold';
                    } else {
                        td.style.background = 'rgba(30, 41, 59, 0.5)';
                        td.style.color = '#e2e8f0';
                    }
                    td.style.border = '1px solid rgba(71, 85, 105, 0.4)';
                });
            } else {
                // Возвращаем светлую тему или убираем принудительные стили
                table.style.removeProperty('background');
                table.style.removeProperty('border');
                table.style.removeProperty('color');
                
                const headers = table.querySelectorAll('th');
                headers.forEach(th => {
                    th.style.removeProperty('background');
                    th.style.removeProperty('color');
                    th.style.removeProperty('border');
                });
                
                const cells = table.querySelectorAll('td');
                cells.forEach(td => {
                    td.style.removeProperty('background');
                    td.style.removeProperty('color');
                    td.style.removeProperty('border');
                    td.style.removeProperty('font-weight');
                });
            }
        });
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С ОТЗЫВАМИ =====

    getPositiveReviewsCount(): number {
        return this.reviews.filter(review => review.rating >= 4).length;
    }

    getNegativeReviewsCount(): number {
        return this.reviews.filter(review => review.rating <= 2).length;
    }

    getAverageRating(): number {
        if (this.reviews.length === 0) return 0;
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        return Number((sum / this.reviews.length).toFixed(1));
    }

    getFilteredReviews(): Review[] {
        let filtered = this.filteredReviews;
        
        // Фильтр по рейтингу
        if (this.selectedReviewRating) {
            const rating = parseInt(this.selectedReviewRating);
            filtered = filtered.filter(review => review.rating === rating);
        }
        
        // Фильтр по статусу
        if (this.selectedReviewStatus) {
            filtered = filtered.filter(review => (review as any).status === this.selectedReviewStatus);
        }
        
        // Фильтр по периоду
        if (this.selectedReviewPeriod) {
            const now = new Date();
            filtered = filtered.filter(review => {
                const reviewDate = new Date(review.date);
                switch (this.selectedReviewPeriod) {
                    case 'today':
                        return reviewDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return reviewDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return reviewDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }
        
        return filtered;
    }

    filterReviewsByRating(): void {
        // Фильтрация происходит в getFilteredReviews()
    }

    filterReviewsByDate(): void {
        // Фильтрация происходит в getFilteredReviews()
    }

    filterReviewsByStatus(): void {
        // Фильтрация происходит в getFilteredReviews()
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С ОБРАТНОЙ СВЯЗЬЮ =====

    getNewFeedbacksCount(): number {
        return this.feedbacks.filter(feedback => feedback.status === 'new').length;
    }

    getInProgressFeedbacksCount(): number {
        return this.feedbacks.filter(feedback => feedback.status === 'in_progress').length;
    }

    getResolvedFeedbacksCount(): number {
        return this.feedbacks.filter(feedback => feedback.status === 'resolved').length;
    }

    getFilteredFeedbacks(): Feedback[] {
        let filtered = this.feedbacks;
        
        // Фильтр по статусу
        if (this.selectedFeedbackStatus) {
            filtered = filtered.filter(feedback => feedback.status === this.selectedFeedbackStatus);
        }
        
        // Фильтр по приоритету
        if (this.selectedFeedbackPriority) {
            filtered = filtered.filter(feedback => feedback.priority === this.selectedFeedbackPriority);
        }
        
        return filtered;
    }

    filterFeedbackByStatus(): void {
        // Фильтрация происходит в getFilteredFeedbacks()
    }

    filterFeedbackByPriority(): void {
        // Фильтрация происходит в getFilteredFeedbacks()
    }

    useResponseTemplate(): void {
        const templates = [
            'Спасибо за ваше обращение! Мы рассмотрим ваш запрос в ближайшее время.',
            'Благодарим за обратную связь. Наш специалист свяжется с вами в течение рабочего дня.',
            'Вопрос принят в работу. Мы уведомим вас о результатах рассмотрения.',
            'Спасибо за доверие к нашей компании. Мы ценим ваше мнение и обязательно учтем его в работе.'
        ];
        
        const selectedTemplate = prompt('Выберите шаблон ответа:\n' + 
            templates.map((template, index) => `${index + 1}. ${template}`).join('\n\n') + 
            '\n\nВведите номер шаблона (1-4):');
        
        if (selectedTemplate) {
            const templateIndex = parseInt(selectedTemplate) - 1;
            if (templateIndex >= 0 && templateIndex < templates.length) {
                this.newResponse = templates[templateIndex];
            }
        }
    }

    // Добавляем доступ к Math для шаблонов
    Math = Math;
    Number = Number;
}