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
      }
    ]
  }
];
