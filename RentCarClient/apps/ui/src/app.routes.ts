import { Route } from '@angular/router';
import { protectionPackagesGuard } from './guards/protection-packages.guard';
import { customerAuthGuard } from './guards/customer-auth.guard';

export const appRoutes: Route[] = [
  {
    path:'',
    loadComponent: () => import('./pages/layout/layout'),
    children:[
      {
        path: '',
        loadComponent:() => import('./pages/home/home')
      },
      {
        path:'login',
        loadComponent:() => import('./pages/login/login')
      },
      {
        path:'register',
        loadComponent:() => import('./pages/register/register')
      },
      {
        path:'reset-password/:id',
        loadComponent:() => import('./pages/reset-password/reset-password')
      },
      {
        path:'change-password',
        loadComponent:() => import('./pages/change-password/change-password'),
        canActivate: [customerAuthGuard]
      },
      {
        path:'rent-history',
        loadComponent:() => import('./pages/rent-history/rent-history'),
        canActivate: [customerAuthGuard]
      },
      {
        path:'reservation-detail/:id',
        loadComponent:() => import('./pages/reservation-detail/reservation-detail'),
        canActivate: [customerAuthGuard]
      },
      {
        path:'contact',
        loadComponent:() => import('./pages/contact/contact')
      },
      {
        path:'offer-select',
        loadComponent:() => import('./pages/offer-select/offer.select')
      },
      {
        path: 'protection-packages',
        loadComponent: () => import('./pages/protection-packages/protection-packages'),
        canActivate: [protectionPackagesGuard]
      },
      {
        path: 'offer-config',
        loadComponent: () => import('./pages/offer-config/offer-config'),
        canActivate: [protectionPackagesGuard]
      },
      {
        path: 'customer-details',
        loadComponent: () => import('./pages/customer-details/customer-details'),
        canActivate: [protectionPackagesGuard]
      },
      {
        path: 'my-profile',
        loadComponent: () => import('./pages/my-profile/my-profile'),
        canActivate: [customerAuthGuard]
      },
      {
        path: 'confirm-reservation',
        loadComponent: () => import('./pages/confirm-reservation/confirm-reservation'),
      }
    ]
  }
];
