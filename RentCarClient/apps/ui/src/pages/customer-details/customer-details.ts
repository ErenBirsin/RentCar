import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { httpResource } from '@angular/common/http';
import { ReservationState } from '../services/reservation.state';
import { CustomerModel } from '@shared/lib/models/customer.model';

@Component({
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './customer-details.html',
  styleUrls: ['./customer-details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CustomerDetails {
  readonly #reservationState = inject(ReservationState);
  readonly #router = inject(Router);

  // Form verileri
  readonly customerForm = signal({
    firstName: '',
    lastName: '',
    identityNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    drivingLicenseIssuanceDate: '',
    fullAddress: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cvv: ''
  });

  readonly showErrors = signal(false);
  readonly reservation = computed(() => this.#reservationState.get()());
  readonly vehicle = computed(() => this.reservation().vehicle);
  readonly total = computed(() => this.reservation().total || 0);

  readonly isFormValid = computed(() => {
    const form = this.customerForm();
    return form.firstName &&
           form.lastName &&
           form.identityNumber &&
           form.dateOfBirth &&
           form.phoneNumber &&
           form.email &&
           form.drivingLicenseIssuanceDate &&
           form.cardNumber &&
           form.cardMonth &&
           form.cardYear &&
           form.cvv;
  });

  updateField(field: string, value: string) {
    this.customerForm.update(prev => ({
      ...prev,
      [field]: value
    }));
  }

  completeReservation() {
    console.log('Butona tıklandı!');
    console.log('Form valid mi:', this.isFormValid());
    console.log('Form verileri:', this.customerForm());

    if (!this.isFormValid()) {
      this.showErrors.set(true);
      return;
    }

    const customerData: any = {
      firstName: this.customerForm().firstName,
      lastName: this.customerForm().lastName,
      fullName: `${this.customerForm().firstName} ${this.customerForm().lastName}`,
      identityNumber: this.customerForm().identityNumber,
      dateOfBirth: this.customerForm().dateOfBirth,
      phoneNumber: this.customerForm().phoneNumber,
      email: this.customerForm().email,
      drivingLicenseIssuanceDate: this.customerForm().drivingLicenseIssuanceDate,
      fullAddress: this.customerForm().fullAddress
    };

    this.#reservationState.reservation.update(prev => ({
      ...prev,
      customer: customerData
    }));

    // TODO: Backend'e rezervasyon gönder
    alert('Rezervasyonunuz başarıyla oluşturuldu!');
    this.#router.navigate(['/']);
  }

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

  readonly branchesResult = httpResource<any>(() => '/rent/odata/branches');
  readonly branchesData = computed(() => this.branchesResult.value()?.value ?? []);

  readonly getBranchName = computed(() => {
    const branchId = this.reservation().pickUpLocationId;
    if (!branchId) return '';
    const branch = this.branchesData().find((b: any) => b.id === branchId);
    return branch?.name || '';
  });

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

  readonly months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  readonly years = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push((currentYear + i).toString());
    }
    return years;
  });
}
