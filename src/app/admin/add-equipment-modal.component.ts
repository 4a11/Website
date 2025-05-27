import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
    @Input() equipmentToEdit: Equipment | null = null;
    @Input() isDarkTheme: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() equipmentAdded = new EventEmitter<Equipment>();
    @Output() equipmentUpdated = new EventEmitter<Equipment>();

    equipment: Partial<Equipment> = {
        name: '',
        type: '',

        if (this.equipmentToEdit) {
            this.equipment = {
                ...this.equipmentToEdit,
                purchase_date: new Date(this.equipmentToEdit.purchase_date),
                last_maintenance_date: new Date(this.equipmentToEdit.last_maintenance_date),
                next_maintenance_date: new Date(this.equipmentToEdit.next_maintenance_date)
            };
        }
    }

    onSubmit(): void {
        if (this.equipmentToEdit) {
            this.equipmentUpdated.emit({
                ...this.equipmentToEdit,
                ...this.equipment
            } as Equipment);
        } else {

        }
        this.onClose();
    }

    onClose(): void {
        this.close.emit();
    }

    addFeature() {
        const feature = prompt('Введите характеристику оборудования:');
        if (feature) {
            this.equipment.features = [...this.equipment.features, feature];
        }
    }

    removeFeature(index: number) {
        this.equipment.features = this.equipment.features.filter((_, i) => i !== index);
    }
} 