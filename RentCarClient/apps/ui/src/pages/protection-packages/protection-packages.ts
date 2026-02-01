import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ProtectionPackageModel } from '@shared/lib/models/protection-package.model';
import { ReservationState } from '../services/reservation.state';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  templateUrl: './protection-packages.html',
  styleUrls: ['./protection-packages.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProtectionPackages {
  readonly #reservationState = inject(ReservationState);
  readonly #router = inject(Router);

  readonly protectionPackageResult = httpResource<any>(() => '/rent/odata/protection-packages?$orderby=OrderNumber');
  readonly protectionPackagesData = computed(() => this.protectionPackageResult.value()?.value ?? []);

  readonly selectedId = computed(() => this.#reservationState.get()().protectionPackageId);
  readonly selectedPackageName = computed(() => this.#reservationState.get()().protectionPackageName);

  selectProtectionPackage(pkg: ProtectionPackageModel){
    this.#reservationState.reservation.update(prev => {
      const currentlySelected = prev.protectionPackageId === pkg.id;
      const protectionPackageId = currentlySelected ? '' : pkg.id;
      const protectionPackagePrice = currentlySelected ? 0 : (pkg.price ?? 0);
      const protectionPackageName = currentlySelected ? '' : pkg.name;

      const totalVehicle = (prev.vehicleDailyPrice ?? 0) * (prev.totalDay ?? 1);
      const totalProtectionpackage = protectionPackagePrice * (prev.totalDay ?? 1);
      const totalExtra = (prev.reservationExtras ?? []).reduce((s,e) => s + (e.price ?? 0), 0);
      const total = totalVehicle + totalProtectionpackage + totalExtra;

      return {
        ...prev,
        protectionPackageId,
        protectionPackagePrice,
        protectionPackageName,
        total
      };
    });
  }

  readonly total = computed(() => {
    const r = this.#reservationState.get()();
    const totalVehicle = (r.vehicleDailyPrice ?? 0) * (r.totalDay ?? 1);
    const totalProtection = (r.protectionPackagePrice ?? 0) * (r.totalDay ?? 1);
    const totalExtra = (r.reservationExtras ?? []).reduce((s,e) => s + (e.price ?? 0), 0);
    return totalVehicle + totalProtection + totalExtra;
  });

  goNext(){
    if(!this.#reservationState.get()().protectionPackageId){
      alert('Lütfen bir güvence paketi seçiniz.');
      return;
    }
    // TODO: navigate to next step (extras / price details). Şimdilik placeholder olarak offer-select'e dönüyoruz.
    this.#router.navigate(['/offer-config']);
  }
}
