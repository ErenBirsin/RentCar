import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { httpResource } from '@angular/common/http';
import { ReservationState } from '../services/reservation.state';
import { HttpService } from '@shared/lib/services/http';
import { FlexiToastService } from 'flexi-toast';
import { AuthState } from '../services/auth.state';
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
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #authState = inject(AuthState);

  readonly loggedInCustomer = signal<CustomerModel | null>(null);

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

  readonly personalInfoLocked = computed(() => !!this.loggedInCustomer()?.id);

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
    const token = this.#authState.token();
    if (!token) {
      this.#toast.showToast('Uyarı', 'Araç kiralayabilmek için giriş yapmalısınız.', 'warning');
      this.#router.navigateByUrl('/login');
      return;
    }

    console.log('Butona tıklandı!');
    console.log('Form valid mi:', this.isFormValid());
    console.log('Form verileri:', this.customerForm());

    if (!this.isFormValid()) {
      this.showErrors.set(true);
      return;
    }

    const logged = this.loggedInCustomer();
    if (logged?.identityNumber && this.customerForm().identityNumber && logged.identityNumber !== this.customerForm().identityNumber) {
      this.#toast.showToast(
        'Uyarı',
        'Kişisel bilgiler (TC) giriş yaptığınız hesapla uyuşmuyor. Lütfen kendi hesap bilgilerinizle devam edin.',
        'warning'
      );
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
    this.createReservation();
  }
  createReservation() {
    const reservation = this.reservation();

    const reservationData = {
      pickUpLocationId: reservation.pickUpLocationId,
      pickUpDate: reservation.pickUpDate,
      pickUpTime: reservation.pickUpTime,
      deliveryDate: reservation.deliveryDate,
      deliveryTime: reservation.deliveryTime,
      vehicleId: reservation.vehicleId,
      vehicleDailyPrice: reservation.vehicleDailyPrice,
      protectionPackageId: reservation.protectionPackageId,
      protectionPackagePrice: reservation.protectionPackagePrice,
      reservationExtras: reservation.reservationExtras || [],
      note: reservation.note || '',
      creditCartInformation: {
        CartNumber: this.customerForm().cardNumber,
        Owner: `${this.customerForm().firstName} ${this.customerForm().lastName}`,
        Expiry: `${this.customerForm().cardMonth}/${this.customerForm().cardYear}`,
        CCV: this.customerForm().cvv
      },
      total: reservation.total,
      totalDay: reservation.totalDay
    };

    this.#http.post<string>(
      '/rent/reservations/me',
      reservationData,
      (res) => {
        const reservationNumber = res || this.generateReservationNumber();
        this.#router.navigate(['/confirm-reservation'], {
          queryParams: { reservationNumber }
        });
      },
      () => {
        this.#toast.showToast('Hata', 'Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
      }
    );
  }

  generateReservationNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `RNT-${year}-${random}`;
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

  constructor() {
    const token = this.#authState.token();
    if (token) {
      this.#http.get<CustomerModel>('/rent/customers/me', (res) => {
        this.loggedInCustomer.set(res);
        this.customerForm.update(prev => ({
          ...prev,
          firstName: res.firstName ?? prev.firstName,
          lastName: res.lastName ?? prev.lastName,
          identityNumber: res.identityNumber ?? prev.identityNumber,
          phoneNumber: res.phoneNumber ?? prev.phoneNumber,
          email: res.email ?? prev.email,
          fullAddress: res.fullAddress ?? prev.fullAddress,
          dateOfBirth: res.dateOfBirth ?? prev.dateOfBirth,
          drivingLicenseIssuanceDate: res.drivingLicenseIssuanceDate ?? prev.drivingLicenseIssuanceDate,
        }));
      });
    }
  }

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
