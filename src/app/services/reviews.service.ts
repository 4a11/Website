import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Review {
  id: number;
  name: string;
  text: string;
  date: string;
  rating: number;
  animationDelay?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly STORAGE_KEY = 'reviews';
  private reviews: Review[] = [];
  private reviewsSubject = new BehaviorSubject<Review[]>([]);

  constructor() {
    this.loadReviews();
  }

  private loadReviews(): void {
    const savedReviews = localStorage.getItem(this.STORAGE_KEY);
    if (savedReviews) {
      this.reviews = JSON.parse(savedReviews);
    } else {
      // Если нет сохраненных отзывов, используем начальные данные
      this.reviews = [
        {
          id: 1,
          name: 'Александр Петров',
          text: 'Отличная компания! Установили систему видеонаблюдения быстро и профессионально. Все работает отлично уже больше года.',
          date: '2024-03-15',
          rating: 5
        },
        {
          id: 2,
          name: 'Елена Иванова',
          text: 'Заказывала установку домофона. Сделали все очень аккуратно, проконсультировали по всем вопросам. Рекомендую!',
          date: '2024-03-10',
          rating: 5
        },
        {
          id: 3,
          name: 'Дмитрий Сидоров',
          text: 'Обратился для установки охранной сигнализации в офисе. Все сделали в срок, цены адекватные. Отдельное спасибо за подробную консультацию.',
          date: '2024-03-05',
          rating: 4
        }
      ];
      this.saveToLocalStorage();
    }
    this.reviewsSubject.next(this.reviews);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reviews));
  }

  getReviews(): Observable<Review[]> {
    return this.reviewsSubject.asObservable();
  }

  addReview(review: Omit<Review, 'id' | 'date'>): void {
    const newReview: Review = {
      id: Math.max(...this.reviews.map(r => r.id), 0) + 1,
      ...review,
      date: new Date().toISOString().split('T')[0]
    };
    
    this.reviews = [newReview, ...this.reviews];
    this.saveToLocalStorage();
    this.reviewsSubject.next(this.reviews);
  }
} 