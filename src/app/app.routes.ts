import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { MainViewComponent } from '../main-view/main-view.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ServicesPageComponent } from './services-page/services-page.component';
import { CompanyPageComponent } from './company-page/company-page.component';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { EquipmentPageComponent } from './equipment-page/equipment-page.component';
import { LoginComponent } from './auth/login/login.component';
import { ForbiddenComponent } from './auth/forbidden/forbidden.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { UserRole } from './services/auth.service';
import { FeedbackFormComponent } from './features/feedback/components/feedback-form/feedback-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/admin', pathMatch: 'full' },

    { path: 'admin', component: AdminComponent },
    { path: 'admin/employees', component: AdminComponent },
    { path: 'admin/facilities', component: AdminComponent },
    { path: 'admin/reports', component: AdminComponent },
    { path: 'admin/settings', component: AdminComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forbidden', component: ForbiddenComponent },
    { 
        path: 'admin', 
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [UserRole.ADMIN, UserRole.MANAGER] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminComponent },
            { 
                path: 'employees', 
                component: AdminComponent,
                data: { section: 'employees' }
            },
            { 
                path: 'facilities', 
                component: AdminComponent,
                data: { section: 'facilities' }
            },
            { 
                path: 'equipment', 
                component: AdminComponent,
                data: { section: 'equipment' }
            },
            { 
                path: 'news', 
                component: AdminComponent,
                data: { section: 'news' }
            },
            { 
                path: 'reports', 
                component: AdminComponent,
                data: { section: 'reports' }
            },
            { 
                path: 'calculations', 
                component: AdminComponent,
                data: { section: 'calculations' }
            },
            { 
                path: 'reviews', 
                component: AdminComponent,
                data: { section: 'reviews' }
            },
            { 
                path: 'settings', 
                component: AdminComponent,
                data: { section: 'settings' }
            },
            { 
                path: 'feedback', 
                component: AdminComponent,
                data: { section: 'feedback' }
            }
        ]
    },
    {
        path: 'admin/admin-section',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [UserRole.ADMIN] }
    },

    { path: 'main-view', component: MainViewComponent },
    { path: 'about-page', component: AboutPageComponent },
    { path: 'services-page', component: ServicesPageComponent },
    { path: 'company-page', component: CompanyPageComponent },
    { path: 'contacts-page', component: ContactsPageComponent },
    { path: 'equipment-page', component: EquipmentPageComponent },
    { path: 'feedback', component: FeedbackFormComponent, title: 'Обратная связь' },
    { path: '**', component: NotFoundComponent }
];
