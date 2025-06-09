export interface Feedback {
    id: number;
    author: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    date: Date;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    responses: FeedbackResponse[];
}

export interface FeedbackResponse {
    id: number;
    feedbackId: number;
    author: string;
    message: string;
    date: Date;
    isAdmin: boolean;
} 