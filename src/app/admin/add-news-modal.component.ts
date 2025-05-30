import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { News } from '../models/news.model';

@Component({
    selector: 'app-add-news-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-news-modal.component.html',
    styleUrls: ['./add-news-modal.component.css']
})
export class AddNewsModalComponent implements OnInit {
    @Input() newsToEdit: News | null = null;
    @Input() isDarkTheme: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() newsAdded = new EventEmitter<News>();
    @Output() newsUpdated = new EventEmitter<News>();

    news: News = {
        id: 0,
        title: '',
        content: '',
        author: '',
        date: new Date()
    };

    ngOnInit() {
        if (this.newsToEdit) {
            this.news = { ...this.newsToEdit };
        }
    }

    onSubmit() {
        if (this.newsToEdit) {
            this.newsUpdated.emit(this.news);
        } else {
            this.newsAdded.emit(this.news);
        }
    }

    onClose() {
        this.close.emit();
    }
}
