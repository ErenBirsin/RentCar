import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { HttpService } from '@shared/lib/services/http';
import { CustomerModel, initialCustomerModel } from '@shared/lib/models/customer.model';
import { AuthState } from '../services/auth.state';
import { RENT_BACKEND_ENDPOINT } from '@shared/lib/interceptors/http-interceptor';

type ReservationExtraDto = {
  extraId: string;
  extraName: string;
  price: number;
};

type PaymentInformationDto = {
  cartNumber: string;
  owner: string;
};

type ReservationVehicleDto = {
  id: string;
  brand: string;
  model: string;
  modelYear: number;
  imageUrl: string;
  dailyPrice: number;
  plate: string;
  fuelType?: string;
  transmission?: string;
  seatCount?: number;
  categoryName?: string;
};

type ReservationPickUpDto = {
  name: string;
  fullAddress?: string;
  phoneNumber?: string;
};

type ReservationCustomerDto = {
  fullName: string;
  identityNumber: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
};

type ReservationDto = {
  id: string;
  reservationNumber: string;
  pickUpDateTime: string;
  deliveryDateTime: string;
  totalDay: number;
  total: number;
  status: string;
  createdAt: string;
  pickUp: ReservationPickUpDto;
  customer: ReservationCustomerDto;
  vehicleDailyPrice: number;
  vehicle: ReservationVehicleDto;
  protectionPackageName: string;
  protectionPackagePrice: number;
  reservationExtras: ReservationExtraDto[];
  paymentInformation: PaymentInformationDto;
  note: string;
};

@Component({
  imports: [CommonModule, RouterLink],
  templateUrl: './reservation-detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReservationDetail {
  readonly #http = inject(HttpService);
  readonly #authState = inject(AuthState);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #toast = inject(FlexiToastService);

  readonly #backendBaseUrl = RENT_BACKEND_ENDPOINT;

  readonly loading = signal<boolean>(false);
  readonly reservationLoading = signal<boolean>(false);
  readonly customer = signal<CustomerModel>({ ...initialCustomerModel });
  readonly reservation = signal<ReservationDto | null>(null);

  readonly fullName = computed(() => this.customer().fullName || `${this.customer().firstName} ${this.customer().lastName}`.trim());

  readonly reservationId = computed(() => (this.#route.snapshot.paramMap.get('id') ?? '').trim());

  readonly vehicleImage = computed(() => {
    const r = this.reservation();
    if (!r) return '';
    return this.vehicleImageUrl(r.vehicle?.imageUrl);
  });

  readonly vehicleTotal = computed(() => {
    const r = this.reservation();
    if (!r) return 0;
    const days = r.totalDay ?? 0;
    const daily = r.vehicleDailyPrice ?? r.vehicle?.dailyPrice ?? 0;
    return days * daily;
  });

  readonly protectionTotal = computed(() => {
    const r = this.reservation();
    if (!r) return 0;
    return (r.protectionPackagePrice ?? 0) * (r.totalDay ?? 0);
  });

  readonly extrasTotal = computed(() => {
    const r = this.reservation();
    if (!r) return 0;
    const extras = r.reservationExtras ?? [];
    const sum = extras.reduce((acc, e) => acc + (e.price ?? 0), 0);
    return sum * (r.totalDay ?? 0);
  });

  readonly maskedIdentityNumber = computed(() => {
    const r = this.reservation();
    const raw = (r?.customer?.identityNumber ?? '').toString().replace(/\s/g, '');
    if (!raw) return '';
    if (raw.length <= 5) return raw;
    const prefix = raw.slice(0, 3);
    const suffix = raw.slice(-2);
    const masked = '*'.repeat(Math.max(0, raw.length - (prefix.length + suffix.length)));
    return `${prefix}${masked}${suffix}`;
  });

  readonly maskedCardNumber = computed(() => {
    const r = this.reservation();
    const last = (r?.paymentInformation?.cartNumber ?? '').toString().trim();
    if (!last) return '';
    return `**** **** **** ${last}`;
  });

  constructor() {
    this.loadCustomer();
    this.loadReservation();
  }

  loadCustomer() {
    this.loading.set(true);
    this.#http.get<CustomerModel>(
      '/rent/customers/me',
      (res) => {
        this.customer.set({ ...res });
        this.loading.set(false);
      },
      () => this.loading.set(false)
    );
  }

  loadReservation() {
    const id = this.reservationId();
    if (!id) {
      this.#toast.showToast('Hata', 'Rezervasyon bulunamadı', 'error');
      this.#router.navigateByUrl('/rent-history');
      return;
    }

    this.reservationLoading.set(true);
    this.#http.get<ReservationDto>(
      `/rent/reservations/me/${id}`,
      (res) => {
        this.reservation.set(res ?? null);
        this.reservationLoading.set(false);
      },
      () => {
        this.#toast.showToast('Hata', 'Rezervasyon detayı yüklenemedi', 'error');
        this.reservationLoading.set(false);
      }
    );
  }

  logout() {
    this.#authState.clear();
    this.#router.navigateByUrl('/login');
  }

  back() {
    this.#router.navigateByUrl('/rent-history');
  }

  vehicleImageUrl(imageUrl: string | null | undefined): string {
    const raw = (imageUrl ?? '').trim();
    if (!raw) return '';

    if (/^https?:\/\//i.test(raw)) return raw;

    let path = raw.replace(/\\/g, '/');

    const wwwrootIndex = path.toLowerCase().indexOf('wwwroot/');
    if (wwwrootIndex >= 0) {
      path = path.slice(wwwrootIndex + 'wwwroot/'.length);
    }

    path = path.replace(/\.\//g, '');

    if (path.includes(':')) {
      const segments = path.split('/');
      const last = segments.length > 0 ? segments[segments.length - 1] : '';
      const imagesPos = segments.findIndex((s: string) => s.toLowerCase() === 'images');
      path = imagesPos >= 0 ? `images/${segments.slice(imagesPos + 1).join('/')}` : last;
    }

    if (!path.includes('/') && path.includes('.')) {
      path = `images/${path}`;
    }

    const normalized = path.startsWith('/') ? path.slice(1) : path;
    return `${this.#backendBaseUrl}${normalized}`;
  }

  getStatusBannerClass(status: string | null | undefined): string {
    const s = (status ?? '').toString().trim().toLowerCase();
    if (!s) return 'status-banner';
    if (s.includes('teslim') || s.includes('tamam')) return 'status-banner delivered';
    if (s.includes('iptal') || s.includes('cancel')) return 'status-banner cancelled';
    if (s.includes('bekliyor') || s.includes('pending') || s.includes('onay')) return 'status-banner pending';
    return 'status-banner active';
  }

  getStatusTitle(status: string | null | undefined): string {
    const s = (status ?? '').toString().trim();
    return s || 'Durum Bilgisi Yok';
  }
}
