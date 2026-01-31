import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ReservationState } from '../pages/services/reservation.state';
import { ReservationApiService } from '@shared/lib/services/reservation-api';
import { FlexiToastService } from 'flexi-toast';

export const protectionPackagesGuard: CanActivateFn = () => {
  const rs = inject(ReservationState);
  const router = inject(Router);
  const api = inject(ReservationApiService);
  const toast = inject(FlexiToastService);

  const reservation = rs.get()();

  const payload = {
    vehicleId: reservation.vehicleId || null,
    pickUpLocationId: reservation.pickUpLocationId || null,
    pickUpDate: reservation.pickUpDate || null,
    pickUpTime: reservation.pickUpTime || null,
    deliveryDate: reservation.deliveryDate || null,
    deliveryTime: reservation.deliveryTime || null
  };

  return api.checkSelection(payload)
    .then(res => {
      if (res && res.hasSelectedVehicle) return true;
      toast.showToast('Uyarı', 'Lütfen önce bir araç seçiniz.', 'warning');
      return router.createUrlTree(['/offer-select']);
    })
    .catch(() => {
      toast.showToast('Hata', 'Sunucu ile doğrulama başarısız oldu.', 'error');
      return router.createUrlTree(['/offer-select']);
    });
};
