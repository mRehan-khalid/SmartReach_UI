import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { profileGuard } from './core/guards/profile.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./features/auth/auth.component')
                .then(m => m.AuthComponent),
    },
    {
        path: 'app',
        loadComponent: () =>
            import('./features/layout/main-layout/main-layout.component')
                .then(m => m.MainLayoutComponent),
        canActivate: [authGuard, profileGuard],
        loadChildren: () =>
            import('./features/campaigns/campaigns.routes')
                .then(m => m.CAMPAIGN_ROUTES)
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./features/profile/profile/profile.component')
                .then(m => m.ProfileComponent),
        canActivate: [authGuard],
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./features/home/home.component')
                .then(m => m.HomeComponent),
        canActivate: [authGuard, profileGuard],
    },
    {
        path: '**',
        redirectTo: 'auth'
    }
];
