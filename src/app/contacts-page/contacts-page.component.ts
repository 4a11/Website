import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent implements OnInit {
  feedbackModalVisible = false;
  isScrollButtonVisible = false;
  
  feedbackData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false
  };

  constructor() { }

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    // Показываем кнопку, когда прокрутка больше 300px
    this.isScrollButtonVisible = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openFeedbackModal(): void {
    this.feedbackModalVisible = true;
  }

  closeFeedbackModal(): void {
    this.feedbackModalVisible = false;
    this.resetForm();
  }

  resetForm() {
    this.feedbackData = {
      name: '',
      email: '',
      phone: '',
      message: '',
      privacyAccepted: false
    };
  }

  submitFeedback(): void {
    if (this.feedbackData.name && this.feedbackData.email && this.feedbackData.message && this.feedbackData.privacyAccepted) {
      // Здесь можно добавить логику отправки данных на сервер
      console.log('Отправка сообщения:', this.feedbackData);
      
      this.resetForm();
      this.closeFeedbackModal();
      alert('Ваше сообщение успешно отправлено!');
    }
  }
}
