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
        category: '',
        status: 'active',
        inventoryNumber: '',
        location: '',
        responsiblePerson: '',
        purchaseDate: new Date(),
        lastMaintenance: new Date(),
        nextMaintenance: new Date(),
        features: []
    };

    categories = ['Компьютеры', 'Принтеры', 'Сетевое оборудование', 'Другое'];
    statuses = ['active', 'inactive', 'maintenance'];

    ngOnInit(): void {
        if (this.equipmentToEdit) {
            this.equipment = {
                ...this.equipmentToEdit,
                purchaseDate: new Date(this.equipmentToEdit.purchaseDate),
                lastMaintenance: new Date(this.equipmentToEdit.lastMaintenance),
                nextMaintenance: new Date(this.equipmentToEdit.nextMaintenance)
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

    addFeature(): void {
        if (!this.equipment.features) {
            this.equipment.features = [];
        }
        this.equipment.features.push({ name: '', value: '' });
    }

    removeFeature(index: number): void {
        if (this.equipment.features) {
            this.equipment.features = this.equipment.features.filter((_, i) => i !== index);
        }
    }
} 