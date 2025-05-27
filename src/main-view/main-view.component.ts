import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ReviewsService, Review } from '../app/services/reviews.service';
import { Subscription } from 'rxjs';
import { OrderService } from '../app/services/order.service';
import { Order } from '../app/models/order.model';

interface FeedbackForm {
  name: string;
  phone: string;
  email: string;
  message: string;
  privacyAccepted: boolean;
}

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class MainViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('portfolioSlider') portfolioSlider!: ElementRef;
  @ViewChild('feedbackFormElement') feedbackFormElement!: NgForm;

  // Массив элементов портфолио
  portfolioItems = [
    {
      image: 'assets/portfolio/project1.jpg',
      title: 'Умное зеркало',
      description: 'Установка подсветки для зеркала в квартире'
    },
    {
      image: 'assets/portfolio/project2.jpg',
      title: 'Система контроля и управлением доступа',
      description: 'Полная автоматизация частного дома с интеграцией систем безопасности и видеонаблюдения'
    },
    {
      image: 'assets/portfolio/project3.jpg',
      title: 'Система контроля и управлением доступа',
      description: 'Полная автоматизация частного дома с интеграцией систем безопасности и видеонаблюдения'
    },
    {
      image: 'assets/portfolio/project4.jpg',
      title: 'Монтаж встроеной подсветки',
      description: 'Установка встроенной подсветки на сцене '
    },
    {
      image: 'assets/portfolio/project5.jpg',
      title: 'Монтаж встроеной подсветки',
      description: 'Установка встроенной подсветки на сцене '
    },
    {
      image: 'assets/portfolio/project6.jpg',
      title: 'Устоновка стеклянного потолка со светильниками',
      description: 'Комплексное оснащение учебного заведения системами безопасности и контроля'
    },
    {
      image: 'assets/portfolio/project7.jpg',
      title: 'Устоновка стеклянного потолка со светильниками',
      description: 'Комплексное оснащение учебного заведения системами безопасности и контроля'
    },
    {
      image: 'assets/portfolio/project8.jpg',
      title: 'Защищённый монтажный щиток для систем видеонаблюдения',
      description: 'Защищённый монтажный щиток для систем видеонаблюдения, обеспечивающий безопасное хранение и организованное размещение оборудования'
    },
    {
      image: 'assets/portfolio/project9.jpg',
      title: 'Защищённый монтажный щиток для систем видеонаблюдения',
      description: 'Профессиональный коммутационный ящик, в котором размещается сетевое и записывающее оборудование для систем безопасности'
    },
    {
      image: 'assets/portfolio/project10.jpg',
      title: 'Защищённый монтажный щиток для систем видеонаблюдения',
      description: 'Это технический шкаф (кросс-бокс), используемый для компактного и защищённого хранения устройств, связанных с работой камер видеонаблюдения'
    },
    {
      image: 'assets/portfolio/project11.jpg',
      title: 'Система видеонаблюдения',
      description: 'Система видеонаблюдения, которая обеспечивает контроль и мониторинг объекта'
    },
    {
      image: 'assets/portfolio/project12.jpg',
      title: 'Система видеонаблюдения',
      description: 'Система видеонаблюдения, которая обеспечивает контроль и мониторинг объекта'
    },
    {
      image: 'assets/portfolio/project13.jpg',
      title: 'Система контроля и управлением доступа',
      description: 'Установка систем контроля доступа в частном доме'
    },
    {
      image: 'assets/portfolio/project14.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Монтаж встроенной подсветки потолка в квартире'
    },
    {
      image: 'assets/portfolio/project15.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Монтаж встроенной подсветки контура комнаты в квартире '
    },
    {
      image: 'assets/portfolio/project16.jpg',
      title: 'Тёплый пол',
      description: 'Установка системы теплого пола в квартире'
    },
    {
      image: 'assets/portfolio/project17.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Профессиональный монтаж скрытой LED-подсветки для тумб под раковину'
    },
    {
      image: 'assets/portfolio/project18.jpg',
      title: 'Электро щиток',
      description: 'Аккуратно собранный электрощит — чистая компоновка и профессиональный монтаж'
    },
    {
      image: 'assets/portfolio/project19.jpg',
      title: 'Видео наблюдение',
      description: 'Чистый монтаж камер: ни лишних проводов, ни слепых зон'
    },
    {
      image: 'assets/portfolio/project20.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Профессиональный монтаж скрытой LED-подсветки'
    },
    {
      image: 'assets/portfolio/project21.jpg',
      title: 'Монтаж встроенной подсветк',
      description: 'Профессиональный монтаж скрытой LED-подсветки в сауне'
    }
  ];

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private currentIndex = 0;
  private autoScrollInterval: any;
  private isTransitioning = false;
  private items: HTMLElement[] = [];
  private touchStartX = 0;
  private touchEndX = 0;
  private dragThreshold = 50; // Минимальное расстояние для свайпа
  private animationFrame: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private itemWidth = 0;
  private visibleItemsCount = 0;

  private reviewsSubscription: Subscription | null = null;
  reviews: Review[] = [];
  displayedReviews: Review[] = [];
  currentReviewIndex = 0;
  private reviewsPerPage = window.innerWidth >= 1400 ? 4 : 
                          window.innerWidth >= 1200 ? 3 : 
                          window.innerWidth >= 768 ? 2 : 1;
  private reviewInterval: any;

  modalVisible = false;
  newReview = {
    name: '',
    text: '',
    rating: 5
  };

  // Координаты для карты
  private readonly mapCoordinates = {
    lat: 56.90743,
    lon: 62.34465,
    address: 'Россия, Свердловская область, Сухой Лог, Уральская улица, 1Ж'
  };

  isScrollButtonVisible = false;

  orderForm = {
    service: '',
    customService: '',
    name: '',
    email: '',
    phone: ''
  };

  // Добавляем массив с идентификаторами услуг
  readonly services = [
    { id: 'video', name: 'Видеонаблюдение' },
    { id: 'electrical', name: 'Сборка электрощитков' },
    { id: 'access', name: 'Система контроля и управлением доступа' },
    { id: 'security', name: 'Охранная система' },
    { id: 'network', name: 'Сети связи и оптоволокно' },
    { id: 'installation', name: 'Электромонтажные работы' }
  ];

  isFeedbackModalOpen = false;
  feedbackForm: FeedbackForm = {
    name: '',
    phone: '',
    email: '',
    message: '',
    privacyAccepted: false
  };

  constructor(
    private ngZone: NgZone, 
    private router: Router,
    private reviewsService: ReviewsService,
    private orderService: OrderService
  ) {
    this.resizeObserver = new ResizeObserver(this.handleResize);
  }

  ngOnInit(): void {
    this.setupIntersectionObserver();
    this.subscribeToReviews();
    this.startReviewRotation();
    this.checkScroll();
  }

  private subscribeToReviews(): void {
    this.reviewsSubscription = this.reviewsService.getReviews().subscribe(reviews => {
      this.reviews = reviews;
      this.updateDisplayedReviews();
    });
  }

  private updateDisplayedReviews(): void {
    this.ngZone.run(() => {
      const startIndex = this.currentReviewIndex % this.reviews.length;
      this.displayedReviews = [];
      
      for (let i = 0; i < this.reviewsPerPage; i++) {
        const index = (startIndex + i) % this.reviews.length;
        if (this.reviews[index]) {
          const review = { ...this.reviews[index] };
          // Уменьшаем задержку анимации для каждого отзыва
          review['animationDelay'] = `${i * 100}ms`;
          this.displayedReviews.push(review);
        }
      }
    });
  }

  private startReviewRotation(): void {
    this.ngZone.runOutsideAngular(() => {
      this.reviewInterval = setInterval(() => {
        this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
        this.updateDisplayedReviews();
      }, 60000); // Увеличиваем интервал ротации до 1 минуты (60000 мс)
    });
  }

  ngAfterViewInit(): void {
    if (this.portfolioSlider) {
        // Получаем все элементы слайдера
        this.items = Array.from(this.portfolioSlider.nativeElement.getElementsByClassName('portfolio-item'));
        
        // Клонируем элементы для бесконечной прокрутки
        const itemsToClone = Math.ceil(window.innerWidth / (this.items[0]?.offsetWidth || 300));
        
        // Клонируем элементы в начало и конец
        for (let i = 0; i < itemsToClone; i++) {
            // Клонируем последние элементы в начало
            const endClone = this.items[this.items.length - 1 - i].cloneNode(true) as HTMLElement;
            endClone.classList.add('clone');
            this.portfolioSlider.nativeElement.insertBefore(endClone, this.portfolioSlider.nativeElement.firstChild);
            
            // Клонируем первые элементы в конец
            const startClone = this.items[i].cloneNode(true) as HTMLElement;
            startClone.classList.add('clone');
            this.portfolioSlider.nativeElement.appendChild(startClone);
        }

        // Обновляем массив элементов с клонами
        this.items = Array.from(this.portfolioSlider.nativeElement.getElementsByClassName('portfolio-item'));
        
        // Устанавливаем начальную позицию (пропускаем клонированные элементы)
        this.currentIndex = itemsToClone;
        this.scrollToIndex(this.currentIndex, false);

        // Настраиваем наблюдателей
        this.setupObservers();
        
        // Инициализируем размеры
        this.updateDimensions();
        
        // Добавляем слушатель окончания анимации
        this.portfolioSlider.nativeElement.addEventListener('transitionend', this.handleTransitionEnd);
        
        // Запускаем автоматическую прокрутку
        this.ngZone.runOutsideAngular(() => {
            this.startAutoScroll();
        });
    }
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset['src']) {
              img.setAttribute('src', img.dataset['src']);
              img.removeAttribute('data-src');
              this.intersectionObserver?.unobserve(img);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
  }

  private setupObservers(): void {
    // Наблюдаем за изменением размера слайдера
    if (this.resizeObserver && this.portfolioSlider) {
      this.resizeObserver.observe(this.portfolioSlider.nativeElement);
    }

    // Настраиваем ленивую загрузку для изображений
    const images = Array.from(this.portfolioSlider.nativeElement.getElementsByTagName('img')) as HTMLImageElement[];
    images.forEach(img => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(img);
      }
    });
  }

  private optimizeImages(): void {
    const images = Array.from(this.portfolioSlider.nativeElement.getElementsByTagName('img')) as HTMLImageElement[];
    images.forEach(img => {
      // Добавляем loading="lazy" для нативной ленивой загрузки
      img.loading = 'lazy';
      
      // Добавляем srcset для отзывчивых изображений
      const originalSrc = img.getAttribute('src') || '';
      img.setAttribute('srcset', `
        ${originalSrc} 300w,
        ${originalSrc} 600w,
        ${originalSrc} 900w
      `);
      img.setAttribute('sizes', '(max-width: 768px) 300px, (max-width: 1200px) 600px, 900px');
    });
  }

  private updateDimensions(): void {
    if (!this.portfolioSlider) return;

    const container = this.portfolioSlider.nativeElement;
    const firstItem = this.items[0];
    if (!firstItem) return;

    this.itemWidth = firstItem.offsetWidth + 20; // 20px - gap
    const containerWidth = container.offsetWidth;
    this.visibleItemsCount = Math.floor(containerWidth / this.itemWidth);
  }

  private handleResize = (): void => {
    this.ngZone.run(() => {
      this.updateDimensions();
      this.scrollToIndex(this.currentIndex);
    });
  };

  ngOnDestroy(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
    if (this.reviewInterval) {
      clearInterval(this.reviewInterval);
    }
    if (this.reviewsSubscription) {
      this.reviewsSubscription.unsubscribe();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private handleTransitionEnd = () => {
    const track = this.portfolioSlider.nativeElement;
    const totalItems = this.items.length;
    const itemsToClone = Math.ceil(window.innerWidth / (this.items[0]?.offsetWidth || 300));

    // Если достигли конца, перепрыгиваем в начало
    if (this.currentIndex >= totalItems - itemsToClone) {
        this.currentIndex = itemsToClone;
        this.scrollToIndex(this.currentIndex, false);
    }
    // Если достигли начала, перепрыгиваем в конец
    else if (this.currentIndex <= itemsToClone - 1) {
        this.currentIndex = totalItems - itemsToClone - 1;
        this.scrollToIndex(this.currentIndex, false);
    }

    this.isTransitioning = false;
  }

  private startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isDragging && document.hasFocus()) {
        this.ngZone.run(() => this.slideNext());
      }
    }, 5000);
  }

  slidePrev(): void {
    if (this.isDragging || this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentIndex--;
    this.scrollToIndex(this.currentIndex);
  }

  slideNext(): void {
    if (this.isDragging || this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentIndex++;
    this.scrollToIndex(this.currentIndex);
  }

  private scrollToIndex(index: number, withAnimation: boolean = true): void {
    if (!this.portfolioSlider || !this.itemWidth) return;
    
    const track = this.portfolioSlider.nativeElement;
    
    if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
    }
    
    this.animationFrame = requestAnimationFrame(() => {
        track.style.transition = withAnimation ? 'transform 0.5s ease' : 'none';
        track.style.transform = `translateX(-${index * this.itemWidth}px)`;
    });
  }

  startDragging(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    const track = this.portfolioSlider.nativeElement;
    
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    this.scrollLeft = matrix.m41;
    
    if (event instanceof MouseEvent) {
      this.startX = event.pageX;
    } else {
      this.touchStartX = event.touches[0].pageX;
    }
    
    track.style.transition = 'none';
  }

  onDragging(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    
    const track = this.portfolioSlider.nativeElement;
    const currentX = event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
    const diff = currentX - (event instanceof MouseEvent ? this.startX : this.touchStartX);
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.animationFrame = requestAnimationFrame(() => {
      track.style.transform = `translateX(${this.scrollLeft + diff}px)`;
    });
  }

  stopDragging(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const track = this.portfolioSlider.nativeElement;
    track.style.transition = 'transform 0.5s ease';
    
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    const currentPosition = matrix.m41;
    
    this.currentIndex = Math.round(Math.abs(currentPosition) / this.itemWidth);
    this.scrollToIndex(this.currentIndex);
  }

  // Метод для прокрутки к форме заказа
  scrollToOrderForm() {
    const orderFormElement = document.getElementById('orderForm');
    if (orderFormElement) {
      orderFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Метод для прокрутки наверх страницы
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Методы для работы с отзывами
  navigateToReviews(): void {
    this.router.navigate(['/about-page']);
  }

  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  submitReview(): void {
    if (this.newReview.name && this.newReview.text) {
      this.reviewsService.addReview({
        name: this.newReview.name,
        text: this.newReview.text,
        rating: this.newReview.rating
      });

      // Очищаем форму
      this.newReview = {
        name: '',
        text: '',
        rating: 5
      };

      this.closeModal();
    }
  }

  // Метод для открытия карты в новом окне
  openMap(): void {
    const url = `https://yandex.ru/maps/?text=${encodeURIComponent(this.mapCoordinates.address)}`;
    window.open(url, '_blank');
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    // Показываем кнопку, когда прокрутка больше 300px
    this.isScrollButtonVisible = window.pageYOffset > 300;
  }

  onServiceChange(value: string): void {
    if (value !== 'other') {
      this.orderForm.customService = '';
    }
  }

  submitOrder(): void {
    if (!this.orderForm.service) {
      alert('Пожалуйста, выберите услугу');
      return;
    }

    if (this.orderForm.service === 'other' && !this.orderForm.customService) {
      alert('Пожалуйста, опишите вашу проблему');
      return;
    }

    if (!this.orderForm.name || !this.orderForm.email || !this.orderForm.phone) {
      alert('Пожалуйста, заполните все обязательные поля!');
      return;
    }

    // Создаем объект заказа
    const order: Order = {
      service: this.orderForm.service === 'other' ? this.orderForm.customService : this.orderForm.service,
      name: this.orderForm.name,
      email: this.orderForm.email,
      phone: this.orderForm.phone,
      date: new Date(),
      status: 'new'
    };

    // Отправка заказа в базу данных
    this.orderService.createOrder(order).subscribe({
      next: () => {
        alert('Заявка успешно отправлена!');
        // Очистка формы
        this.orderForm = {
          service: '',
          customService: '',
          name: '',
          email: '',
          phone: ''
        };
      },
      error: (error) => {
        alert('Произошла ошибка при отправке заявки');
        console.error('Error:', error);
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    const newReviewsPerPage = window.innerWidth >= 1400 ? 4 : 
                             window.innerWidth >= 1200 ? 3 : 
                             window.innerWidth >= 768 ? 2 : 1;
                             
    if (this.reviewsPerPage !== newReviewsPerPage) {
      this.reviewsPerPage = newReviewsPerPage;
      this.updateDisplayedReviews();
    }
  }

  // Добавляем метод для ручного переключения отзывов
  nextReviews(): void {
    if (this.reviewInterval) {
      clearInterval(this.reviewInterval);
    }
    this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
    this.updateDisplayedReviews();
    this.startReviewRotation();
  }

  prevReviews(): void {
    if (this.reviewInterval) {
      clearInterval(this.reviewInterval);
    }
    this.currentReviewIndex = (this.currentReviewIndex - 1 + this.reviews.length) % this.reviews.length;
    this.updateDisplayedReviews();
    this.startReviewRotation();
  }

  // Метод для перехода к конкретной услуге
  navigateToService(serviceId: string): void {
    this.router.navigate(['/services-page']).then(() => {
      // Даем небольшую задержку для загрузки страницы
      setTimeout(() => {
        const element = document.getElementById(serviceId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }
      }, 100);
    });
  }

  openFeedbackModal(): void {
    this.isFeedbackModalOpen = true;
  }

  closeFeedbackModal(): void {
    this.isFeedbackModalOpen = false;
    this.resetFeedbackForm();
  }

  resetFeedbackForm(): void {
    this.feedbackForm = {
      name: '',
      phone: '',
      email: '',
      message: '',
      privacyAccepted: false
    };
  }

  submitFeedback(): void {
    if (this.feedbackForm.name && this.feedbackForm.phone && 
        this.feedbackForm.email && this.feedbackForm.message && 
        this.feedbackForm.privacyAccepted) {
      // Здесь можно добавить логику отправки данных на сервер
      console.log('Отправка сообщения:', this.feedbackForm);
      
      this.resetFeedbackForm();
      this.closeFeedbackModal();
      alert('Ваше сообщение успешно отправлено!');
    } else {
      alert('Пожалуйста, заполните все обязательные поля и примите условия обработки персональных данных');
    }
  }
}
