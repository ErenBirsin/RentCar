import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path:'',
    loadComponent: () => import('./pages/layout/layout'),
    children:[
      {
        path: '',
        loadComponent:() => import('./pages/home/home')
      }
    ]
  }
];
