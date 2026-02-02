import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { ReservationState } from '../services/reservation.state';

@Component({
  imports: [CommonModule],
  templateUrl: './confirm-reservation.html',
  styleUrls: ['./confirm-reservation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ConfirmReservation {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #reservationState = inject(ReservationState);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly reservation = computed(() => this.#reservationState.get()());
  readonly reservationNumber = signal<string>('');
  readonly vehicle = computed(() => this.reservation().vehicle);
  readonly total = computed(() => this.reservation().total || 0);
  readonly branchesResult = httpResource<any>(() => '/rent/odata/branches');
  readonly branchesData = computed(() => this.branchesResult.value()?.value ?? []);

  readonly getBranchName = computed(() => {
    const branchId = this.reservation().pickUpLocationId;
    if (!branchId) return '';
    const branch = this.branchesData().find((b: any) => b.id === branchId);
    return branch?.name || '';
  });

  readonly vehicleSpecs = computed(() => {
    const v = this.vehicle() as any;
    if (!v) return [];

    return [
      { icon: 'bi-people-fill', label: `${v.seatCount} Kişi` },
      { icon: 'bi-gear-fill', label: v.tractionType || 'Manuel' },
      { icon: 'bi-fuel-pump-fill', label: `${v.fuelConsumption} L/100km` },
      { icon: 'bi-speedometer2', label: `${v.kilometer?.toLocaleString()} km` },
      { icon: 'bi-palette-fill', label: v.color || 'Bilinmiyor' }
    ];
  });

  readonly kmInfo = computed(() => {
    const totalDays = this.reservation().totalDay || 1;
    return `Toplam ${totalDays * 200} km kullanım hakkı bulunmaktadır.`;
  });

  readonly protectionPackage = computed(() => ({
    name: this.reservation().protectionPackageName,
    price: this.reservation().protectionPackagePrice
  }));

  readonly extrasTotal = computed(() => {
    const extras = this.reservation().reservationExtras || [];
    return extras.reduce((sum, e) => sum + (e.price || 0), 0) * (this.reservation().totalDay || 1);
  });

  readonly vehicleTotal = computed(() => {
    return (this.reservation().vehicleDailyPrice || 0) * (this.reservation().totalDay || 1);
  });

  readonly protectionTotal = computed(() => {
    return (this.reservation().protectionPackagePrice || 0) * (this.reservation().totalDay || 1);
  });

  constructor() {
    this.#route.queryParams.subscribe(params => {
      if (params['reservationNumber']) {
        this.reservationNumber.set(params['reservationNumber']);
      }
      this.isLoading.set(false);
    });
  }

  goHome() {
    this.#router.navigate(['/']);
  }

  readonly defaultReservationNumber = computed(() => {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `RNT-${year}-${random}`;
  });

  printReservation() {
    window.print();
  }
}
