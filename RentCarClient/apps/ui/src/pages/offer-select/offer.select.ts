import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpService } from '@shared/lib/services/http';
import { httpResource } from '@angular/common/http';
import { VehicleModel } from '@shared/lib/models/vehicle.model';
import { BranchModel } from '@shared/lib/models/branch.model';
import { initialReservation } from '@shared/lib/models/reservation.model';
import { ReservationState } from '../services/reservation.state';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, CommonModule],
  templateUrl: './offer.select.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class OfferSelect {
  readonly #http = inject(HttpService);
  readonly #router = inject(Router);

  // Form fields
  readonly pickUpLocationId = signal<string>('');
  readonly pickUpDate = signal<string>('');
  readonly pickUpTime = signal<string>('09:00');
  readonly deliveryDate = signal<string>('');
  readonly deliveryTime = signal<string>('09:00');

  // Filters
  readonly filterCategory = signal<string>('');
  readonly filterTransmission = signal<string>('');
  readonly filterBrand = signal<string>('');
  readonly filterSeatCount = signal<number | null>(null);
  readonly filterAutomaticOnly = signal<boolean>(false);

  readonly branchesResult = httpResource<any>(() => '/rent/odata/branches');
  readonly branchesData = computed(() => this.branchesResult.value()?.value ?? []);

  readonly branches = signal<BranchModel[]>([]);

  constructor(){
    this.loadBranches();
  }

  loadBranches(){
    this.#http.get<any>('/rent/odata/branches', (res) => {
      const list = res?.value ?? res ?? [];
      console.debug('loadBranches success:', list);
      this.branches.set(list);
    }, (err) => {
      console.error('loadBranches error:', err);
      this.branches.set([]);
    });
  }

  readonly categoriesResult = httpResource<any>(() => '/rent/odata/categories');
  readonly categoriesData = computed(() => this.categoriesResult.value()?.value ?? []);

  readonly vehicles = signal<VehicleModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly totalDay = signal<number>(1);


  readonly brands = computed(() => Array.from(new Set(this.vehicles().map(v => v.brand))).filter(Boolean));

  readonly timeOptions = computed(() => Array.from({ length: 31 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }));

  readonly selectedReservation = signal({ ...initialReservation });
  readonly selectedVehicle = signal<VehicleModel | undefined>(undefined);

  showVehicles(){
    if(!this.pickUpLocationId()) return;

    const payload = {
      branchId: this.pickUpLocationId(),
      pickUpDate: this.pickUpDate(),
      pickUpTime: this.pickUpTime(),
      deliveryDate: this.deliveryDate(),
      deliverTime: this.deliveryTime()
    };

    this.loading.set(true);
    this.calculateDayDifference();

    this.#http.post<VehicleModel[]>('/rent/reservations/vehicle-getall', payload, (res) => {
      this.vehicles.set(res ?? []);
      this.loading.set(false);
    }, () => this.loading.set(false));
  }

  calculateDayDifference(){
    if(!this.pickUpDate() || !this.deliveryDate()){
      this.totalDay.set(1);
      return;
    }

    const pickUpDateTime = new Date(`${this.pickUpDate()}T${this.pickUpTime()}`);
    const deliveryDateTime = new Date(`${this.deliveryDate()}T${this.deliveryTime()}`);
    const diffMs = deliveryDateTime.getTime() - pickUpDateTime.getTime();
    if(diffMs <= 0){
      this.totalDay.set(0);
      return;
    }
    const oneDayMs = 24 * 60 * 60 * 1000;
    const fullDays = Math.floor(diffMs / oneDayMs);
    const remainder = diffMs % oneDayMs;
    const totalDay = remainder > 0 ? fullDays + 1 : fullDays;
    this.totalDay.set(totalDay);
  }


  readonly filteredVehicles = computed(() => {
    const list = [...this.vehicles()];
    return list.filter(v => {
      if(this.filterCategory() && v.categoryName !== this.filterCategory())
        return false;
      if(this.filterTransmission() && v.transmission !== this.filterTransmission())
        return false;
      if(this.filterBrand() && v.brand !== this.filterBrand())
        return false;
      if(this.filterSeatCount() && v.seatCount !== this.filterSeatCount())
        return false;
      if(this.filterAutomaticOnly()){
        const tr = (v.transmission ?? '').toString().toLowerCase();
        if(!tr.includes('otomatik') && !tr.includes('automatic')) return false;
      }
        return true;
    });
  });

  getVehicleImage(vehicle: VehicleModel){
    const endpoint = "https://localhost:7161/images/";
    return endpoint + vehicle.imageUrl;
  }

  readonly #reservationState = inject(ReservationState);

  selectVehicle(vehicle: VehicleModel){

    this.#reservationState.setVehicle(vehicle);
    this.#reservationState.setPickupInfo({
      pickUpLocationId: this.pickUpLocationId(),
      pickUpDate: this.pickUpDate(),
      pickUpTime: this.pickUpTime(),
      deliveryDate: this.deliveryDate(),
      deliveryTime: this.deliveryTime(),
      totalDay: this.totalDay()
    });


    this.selectedVehicle.set(vehicle);

  }

  clearFilters(){
    this.filterCategory.set('');
    this.filterTransmission.set('');
    this.filterBrand.set('');
    this.filterSeatCount.set(null);
    this.filterAutomaticOnly.set(false);
  }

  goToProtectionPackages() {
    this.#router.navigate(['/protection-packages']);
  }

}
