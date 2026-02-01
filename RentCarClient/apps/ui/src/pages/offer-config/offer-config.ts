import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReservationState } from '../services/reservation.state';
import { ExtraModel } from '@shared/lib/models/extra.model';
import { VehicleModel } from '@shared/lib/models/vehicle.model';

@Component({
  imports: [CommonModule],
  templateUrl: './offer-config.html',
  styleUrls: ['./offer-config.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class OfferConfig {
  readonly #reservationState = inject(ReservationState);
  readonly #router = inject(Router);

  readonly extrasResult = httpResource<any>(() => '/rent/odata/extras?$filter=IsActive eq true');
  readonly extrasData = computed(() => this.extrasResult.value()?.value ?? []);

  readonly protectionExtras = computed(() =>
    this.extrasData().filter((extra: any) =>
      extra.name.toLowerCase().includes('güvence') ||
      extra.name.toLowerCase().includes('hasar') ||
      extra.name.toLowerCase().includes('kış') ||
      extra.name.toLowerCase().includes('lastik')
    )
  );

  readonly driverExtras = computed(() =>
    this.extrasData().filter((extra: any) =>
      extra.name.toLowerCase().includes('sürücü') ||
      extra.name.toLowerCase().includes('genç') ||
      extra.name.toLowerCase().includes('banka') ||
      extra.name.toLowerCase().includes('depozito')
    )
  );

  readonly seatExtras = computed(() =>
    this.extrasData().filter((extra: any) =>
      extra.name.toLowerCase().includes('koltuk') ||
      extra.name.toLowerCase().includes('adaptör') ||
      extra.name.toLowerCase().includes('çocuk') ||
      extra.name.toLowerCase().includes('bebek')
    )
  );

  readonly reservation = computed(() => this.#reservationState.get()());
  readonly selectedExtras = signal<ExtraModel[]>([]);
  readonly vehicle = computed(() => this.reservation().vehicle);

  readonly protectionPackage = computed(() => ({
    name: this.reservation().protectionPackageName,
    price: this.reservation().protectionPackagePrice
  }));

  readonly total = computed(() => {
    const r = this.reservation();
    const totalVehicle = (r.vehicleDailyPrice ?? 0) * (r.totalDay ?? 1);
    const totalProtection = (r.protectionPackagePrice ?? 0) * (r.totalDay ?? 1);
    const totalExtra = this.selectedExtras().reduce((sum, extra) => sum + (extra.price ?? 0), 0) * (r.totalDay ?? 1);
    return totalVehicle + totalProtection + totalExtra;
  });

  toggleExtra(extra: ExtraModel) {
    const currentSelected = this.selectedExtras();
    const isSelected = currentSelected.some(e => e.id === extra.id);

    if (isSelected) {
      this.selectedExtras.set(currentSelected.filter(e => e.id !== extra.id));
    } else {
      this.selectedExtras.set([...currentSelected, extra]);
    }

    this.updateReservationExtras();
  }

  private updateReservationExtras() {
    const selectedExtras = this.selectedExtras();
    const reservationExtras = selectedExtras.map(extra => ({
      extraId: extra.id,
      extraName: extra.name,
      price: extra.price ?? 0
    }));

    this.#reservationState.reservation.update(prev => {
      const totalVehicle = (prev.vehicleDailyPrice ?? 0) * (prev.totalDay ?? 1);
      const totalProtection = (prev.protectionPackagePrice ?? 0) * (prev.totalDay ?? 1);
      const totalExtra = reservationExtras.reduce((sum, e) => sum + e.price, 0) * (prev.totalDay ?? 1);
      const total = totalVehicle + totalProtection + totalExtra;

      return {
        ...prev,
        reservationExtras,
        total
      };
    });
  }

  isExtraSelected(extraId: string): boolean {
    return this.selectedExtras().some(e => e.id === extraId);
  }

  goNext() {
    // TODO: customer-details sayfası oluşturulunca değiştirilecek
    this.#router.navigate(['/']);
  }

  getVehicleImage(vehicle: Partial<VehicleModel>) {
    const endpoint = "https://localhost:7161/images/";
    return endpoint + vehicle.imageUrl;
  }

  readonly vehicleSpecs = computed(() => {
    const v = this.vehicle() as Partial<VehicleModel>;
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

  readonly extrasTotal = computed(() => {
    return this.selectedExtras().reduce((sum, extra) => sum + (extra.price ?? 0), 0) * (this.reservation().totalDay ?? 1);
  });

  readonly vehicleTotal = computed(() => {
    return (this.reservation().vehicleDailyPrice ?? 0) * (this.reservation().totalDay ?? 1);
  });

  readonly protectionTotal = computed(() => {
    return (this.reservation().protectionPackagePrice ?? 0) * (this.reservation().totalDay ?? 1);
  });
}
