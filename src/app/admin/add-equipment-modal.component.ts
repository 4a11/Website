import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Equipment } from '../models/equipment.model';

@Component({
    selector: 'app-add-equipment-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-equipment-modal.component.html',
    styleUrls: ['./add-equipment-modal.component.css']
})
export class AddEquipmentModalComponent implements OnInit {
    @Input() equipmentToEdit?: Equipment;
    @Output() equipmentAdded = new EventEmitter<Equipment>();
    @Output() equipmentUpdated = new EventEmitter<Equipment>();
    @Output() close = new EventEmitter<void>();

    equipment: Partial<Equipment> = {
        name: '',
        type: '',
        status: 'active',
        location: '',
        cost: 0,
        purchase_date: new Date().toISOString().split('T')[0],
        description: ''
    };

    types = ['Компьютер', 'Принтер', 'МФУ', 'Сетевое оборудование', 'Сервер', 'Другое'];
    statuses = ['active', 'inactive', 'maintenance'];

    ngOnInit(): void {
        if (this.equipmentToEdit) {
            this.equipment = {
                ...this.equipmentToEdit,
                purchase_date: this.equipmentToEdit.purchase_date || new Date().toISOString().split('T')[0]
            };
        }
    }

    onSubmit(): void {
        if (this.equipmentToEdit) {
            this.equipmentUpdated.emit({
                ...this.equipmentToEdit,
                ...this.equipment as Equipment
            });
        } else {
            this.equipmentAdded.emit(this.equipment as Equipment);
        }
        this.onClose();
    }

    onClose(): void {
        this.close.emit();
    }
} 