import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsService, Review } from '../services/reviews.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  private reviewsSubscription: Subscription | null = null;
  hoverRating = 0;
  
  newReview = {
    name: '',
    text: '',
    rating: 5,
    privacyAccepted: false
  };

  modalVisible = false;
  feedbackModalVisible = false;
  
  feedbackData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false
  };

  private readonly STORAGE_KEY = 'reviews';

  constructor(private reviewsService: ReviewsService) {}

  ngOnInit(): void {
    this.reviewsSubscription = this.reviewsService.getReviews().subscribe(
      reviews => this.reviews = reviews
    );
  }

  ngOnDestroy(): void {
    if (this.reviewsSubscription) {
      this.reviewsSubscription.unsubscribe();
    }
  }

  private resetReviewForm(): void {
    this.newReview = {
      name: '',
      text: '',
      rating: 5,
      privacyAccepted: false
    };
    this.hoverRating = 0;
  }

  private hasUnsavedChanges(): boolean {
    return this.newReview.name !== '' || 
           this.newReview.text !== '' || 
           this.newReview.rating !== 5 ||
           this.newReview.privacyAccepted;
  }

  openModal(): void {
    this.resetReviewForm();
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  submitReview(): void {
    if (this.newReview.name && this.newReview.text && this.newReview.privacyAccepted) {
      this.reviewsService.addReview({
        name: this.newReview.name,
        text: this.newReview.text,
        rating: this.newReview.rating
      });
      
      this.closeModal();
    }
  }

  openFeedbackModal(): void {
    this.feedbackModalVisible = true;
  }

  closeFeedbackModal(): void {
    this.feedbackModalVisible = false;
  }

  submitFeedback(): void {
    if (this.feedbackData.name && this.feedbackData.email && this.feedbackData.message && this.feedbackData.privacyAccepted) {
      // Здесь можно добавить логику отправки данных на сервер
      console.log('Отправка сообщения:', this.feedbackData);
      
      // Очищаем форму
      this.feedbackData = {
        name: '',
        email: '',
        phone: '',
        message: '',
        privacyAccepted: false
      };

      this.closeFeedbackModal();
      alert('Ваше сообщение успешно отправлено!');
    }
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reviews));
  }
}
