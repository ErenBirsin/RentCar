import { HttpInterceptorFn } from '@angular/common/http';

export const RENT_BACKEND_ENDPOINT = 'https://localhost:7161/';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const endpoint = RENT_BACKEND_ENDPOINT;
  const clone =req.clone({
      url:url.replace('/rent/', endpoint) // 'rent/api/users => https://localhost:7161/api/users
    });
  return next(clone);
};
