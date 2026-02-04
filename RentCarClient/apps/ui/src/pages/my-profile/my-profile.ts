import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '@shared/lib/services/http';
import { Router, RouterLink } from '@angular/router';
import { CustomerModel, initialCustomerModel } from '@shared/lib/models/customer.model';
import { AuthState } from '../services/auth.state';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [CommonModule, RouterLink],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MyProfile {
  readonly #http = inject(HttpService);
  readonly #authState = inject(AuthState);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);

  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly customer = signal<CustomerModel>({ ...initialCustomerModel });

  readonly form = signal({
    email: '',
    phoneNumber: '',
    fullAddress: '',
  });

  readonly fullName = computed(() => this.customer().fullName || `${this.customer().firstName} ${this.customer().lastName}`.trim());

  readonly maskedIdentityNumber = computed(() => {
    const raw = (this.customer().identityNumber ?? '').toString().replace(/\s/g, '');
    if (!raw) return '';

    // TC Kimlik No: 11 hane. Güvenlik için sadece ilk 3 ve son 2 haneyi göster.
    if (raw.length <= 5) return raw;

    const prefix = raw.slice(0, 3);
    const suffix = raw.slice(-2);
    const masked = '*'.repeat(Math.max(0, raw.length - (prefix.length + suffix.length)));
    return `${prefix}${masked}${suffix}`;
  });

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.#http.get<CustomerModel>(
      '/rent/customers/me',
      (res) => {
        this.customer.set({ ...res });
        this.form.set({
          email: res.email ?? '',
          phoneNumber: res.phoneNumber ?? '',
          fullAddress: res.fullAddress ?? '',
        });
        this.loading.set(false);
      },
      () => this.loading.set(false)
    );
  }

  readonly isFormValid = computed(() => {
    const f = this.form();
    return !!(f.email && f.phoneNumber && f.fullAddress);
  });

  startEdit() {
    const c = this.customer();
    this.form.set({
      email: c.email ?? '',
      phoneNumber: c.phoneNumber ?? '',
      fullAddress: c.fullAddress ?? '',
    });
    this.isEditing.set(true);
  }

  cancelEdit() {
    const c = this.customer();
    this.form.set({
      email: c.email ?? '',
      phoneNumber: c.phoneNumber ?? '',
      fullAddress: c.fullAddress ?? '',
    });
    this.isEditing.set(false);
  }

  updateField(field: 'email' | 'phoneNumber' | 'fullAddress', value: string) {
    this.form.update(prev => ({ ...prev, [field]: value }));
  }

  save() {
    if (!this.isFormValid() || this.saving()) return;
    this.saving.set(true);

    const payload = {
      email: this.form().email,
      phoneNumber: this.form().phoneNumber,
      fullAddress: this.form().fullAddress,
    };

    this.#http.put<string>(
      '/rent/customers/me',
      payload,
      () => {
        this.isEditing.set(false);
        this.saving.set(false);
        this.#toast.showToast('Başarılı', 'Profil bilgileri güncellendi', 'success');
        this.load();
      },
      () => this.saving.set(false),
    );
  }

  logout() {
    this.#authState.clear();
    this.#router.navigateByUrl('/login');
  }
}
