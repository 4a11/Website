import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  isFeedbackModalOpen = false;
  isActivitiesExpanded = false;
  feedbackForm = {
    name: '',
    phone: '',
    email: '',
    message: '',
    privacyAccepted: false
  };
  isScrollButtonVisible = false;

  constructor() { }

  ngOnInit(): void {
    this.checkScroll();
    // Добавляем функцию сворачивания/разворачивания видов деятельности в глобальный объект window
    (window as any).toggleActivities = this.toggleActivities;
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    // Показываем кнопку, когда прокрутка больше 300px
    this.isScrollButtonVisible = window.pageYOffset > 300;
  }

  // Метод для прокрутки наверх страницы
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Функция для сворачивания/разворачивания списка видов деятельности
  toggleActivities(): void {
    const activitiesList = document.getElementById('activitiesList');
    const toggleButton = document.querySelector('.toggle-button');
    const toggleIcon = document.querySelector('.toggle-icon');
    const activitiesNote = document.querySelector('.activities-note');
    
    if (activitiesList && toggleButton && toggleIcon && activitiesNote) {
      if (activitiesList.classList.contains('collapsed')) {
        // Разворачиваем список
        activitiesList.classList.remove('collapsed');
        activitiesList.classList.add('expanded');
        toggleIcon.textContent = '−';
        toggleButton.innerHTML = '<span class="toggle-icon">−</span> Свернуть';
        activitiesNote.textContent = 'Показаны все виды деятельности. Нажмите "Свернуть" для скрытия.';
        this.isActivitiesExpanded = true;
        
        // Плавная прокрутка к нижней части списка
        setTimeout(() => {
          activitiesNote.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // Сворачиваем список
        activitiesList.classList.remove('expanded');
        activitiesList.classList.add('collapsed');
        toggleIcon.textContent = '+';
        toggleButton.innerHTML = '<span class="toggle-icon">+</span> Развернуть';
        activitiesNote.textContent = 'Показано 100+ видов деятельности. Нажмите "Развернуть все" для просмотра полного списка.';
        this.isActivitiesExpanded = false;
        
        // Прокрутка к началу списка
        setTimeout(() => {
          const activityHeader = document.querySelector('.activity-header');
          if (activityHeader) {
            activityHeader.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }

  openFeedbackModal() {
    this.isFeedbackModalOpen = true;
  }

  closeFeedbackModal() {
    this.isFeedbackModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.feedbackForm = {
      name: '',
      phone: '',
      email: '',
      message: '',
      privacyAccepted: false
    };
  }

  submitFeedback() {
    if (this.feedbackForm.privacyAccepted) {
      console.log('Отправка формы:', this.feedbackForm);
      this.resetForm();
      this.closeFeedbackModal();
      alert('Спасибо за обратную связь! Мы свяжемся с вами в ближайшее время.');
    }
  }
}
