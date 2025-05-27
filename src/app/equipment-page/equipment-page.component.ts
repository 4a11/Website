import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';

@Component({
  selector: 'app-equipment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipment-page.component.html',
  styleUrl: './equipment-page.component.css'
})
export class EquipmentPageComponent implements OnInit {
  feedbackModalVisible = false;
  equipment: Equipment[] = [];
  categories: string[] = [];
  selectedCategory = 'Все';
  searchQuery = '';
  
  feedbackData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false
  };

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadEquipment();
    this.loadCategories();
    this.subscribeToFilters();
  }

  private loadEquipment(): void {
    this.equipmentService.getEquipment().subscribe({
      next: (equipment) => {
        this.equipment = equipment;
      },
      error: (error) => console.error('Ошибка при загрузке оборудования:', error)
    });
  }

  private loadCategories(): void {
    this.categories = this.equipmentService.getCategories();
  }

  private subscribeToFilters(): void {
    this.equipmentService.getSelectedCategory().subscribe(category => {
      this.selectedCategory = category;
    });

    this.equipmentService.getSearchQuery().subscribe(query => {
      this.searchQuery = query;
    });
  }

  onCategorySelect(category: string): void {
    this.equipmentService.setSelectedCategory(category);
  }

  onSearch(): void {
    this.equipmentService.setSearchQuery(this.searchQuery);
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
}
