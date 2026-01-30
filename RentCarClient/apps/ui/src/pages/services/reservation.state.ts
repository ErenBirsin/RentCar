import { Injectable, inject, signal } from '@angular/core';
import { ReservationModel, initialReservation } from '@shared/lib/models/reservation.model';
import { VehicleModel } from '@shared/lib/models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class ReservationState {
  readonly reservation = signal<ReservationModel>({ ...initialReservation });

  setVehicle(vehicle: VehicleModel){
    this.reservation.update(prev => ({
      ...prev,
      vehicleId: vehicle.id,
      vehicle: vehicle,
      vehicleDailyPrice: vehicle.dailyPrice
    }));
  }

  setPickupInfo(info: Partial<ReservationModel>){
    this.reservation.update(prev => ({ ...prev, ...info }));
  }

  clear(){
    this.reservation.set({ ...initialReservation });
  }

  get(){
    return this.reservation;
  }
}
