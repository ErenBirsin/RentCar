import { Route } from '@angular/router';
import { protectionPackagesGuard } from './guards/protection-packages.guard';

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
        path: 'confirm-reservation',
        loadComponent: () => import('./pages/confirm-reservation/confirm-reservation'),
      }
    ]
  }
];
