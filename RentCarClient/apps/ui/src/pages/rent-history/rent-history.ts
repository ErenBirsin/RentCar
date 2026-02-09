import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { HttpService } from '@shared/lib/services/http';
import { CustomerModel, initialCustomerModel } from '@shared/lib/models/customer.model';
import { AuthState } from '../services/auth.state';
import { RENT_BACKEND_ENDPOINT } from '@shared/lib/interceptors/http-interceptor';

type ReservationVehicleDto = {
  brand: string;
  model: string;
  modelYear: number;
  imageUrl: string;
  dailyPrice: number;
  plate: string;
};

type ReservationPickUpDto = {
  name: string;
};

type ReservationDto = {
  id: string;
  reservationNumber: string;
  pickUpDateTime: string;
  deliveryDateTime: string;
  totalDay: number;
  total: number;
  status: string;
  pickUp: ReservationPickUpDto;
  vehicle: ReservationVehicleDto;
};

@Component({
  imports: [CommonModule, RouterLink],
  templateUrl: './rent-history.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RentHistory {
  readonly #http = inject(HttpService);
  readonly #authState = inject(AuthState);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);

  readonly #backendBaseUrl = RENT_BACKEND_ENDPOINT;

  readonly loading = signal<boolean>(false);
  readonly listLoading = signal<boolean>(false);
  readonly customer = signal<CustomerModel>({ ...initialCustomerModel });
  readonly reservations = signal<ReservationDto[]>([]);

  readonly fullName = computed(() => this.customer().fullName || `${this.customer().firstName} ${this.customer().lastName}`.trim());

  readonly totalCount = computed(() => this.reservations().length);
  readonly totalDays = computed(() => this.reservations().reduce((acc, r) => acc + (r.totalDay ?? 0), 0));
  readonly totalAmount = computed(() => this.reservations().reduce((acc, r) => acc + (r.total ?? 0), 0));

  constructor() {
    this.loadCustomer();
    this.loadReservations();
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

  loadReservations() {
    this.listLoading.set(true);
    this.#http.get<ReservationDto[]>(
      '/rent/reservations/me',
      (res) => {
        this.reservations.set(res ?? []);
        this.listLoading.set(false);
      },
      () => {
        this.#toast.showToast('Hata', 'Kiralama geçmişi yüklenemedi', 'error');
        this.listLoading.set(false);
      }
    );
  }

  logout() {
    this.#authState.clear();
    this.#router.navigateByUrl('/login');
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

  getStatusBadgeClass(status: string | null | undefined): string {
    const s = (status ?? '').toString().trim().toLowerCase();

    if (!s) return 'bg-secondary';

    if (s.includes('teslim') || s.includes('tamam')) return 'bg-success';
    if (s.includes('bekliyor') || s.includes('pending') || s.includes('onay')) return 'bg-warning text-dark';
    if (s.includes('iptal') || s.includes('cancel')) return 'bg-danger';
    if (s.includes('aktif') || s.includes('active')) return 'bg-primary';

    return 'bg-secondary';
  }
}
