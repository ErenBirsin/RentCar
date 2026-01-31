import { Injectable, inject } from '@angular/core';
import { HttpService } from './http';

@Injectable({ providedIn: 'root' })
export class ReservationApiService {
  readonly #http = inject(HttpService);

  checkSelection(payload: any): Promise<{ hasSelectedVehicle: boolean; vehicleId?: string; message?: string }>{
    return new Promise((resolve, reject) => {
      this.#http.post<{ hasSelectedVehicle: boolean; vehicleId?: string; message?: string }>(
        '/rent/reservations/check-selection',
        payload,
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }
}
