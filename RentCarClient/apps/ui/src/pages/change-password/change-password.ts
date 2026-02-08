import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, computed, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { HttpService } from '@shared/lib/services/http';
import { CustomerModel, initialCustomerModel } from '@shared/lib/models/customer.model';
import { AuthState } from '../services/auth.state';

@Component({
  imports: [NgClass, FormsModule, RouterLink],
  templateUrl: './change-password.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChangePassword {
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);
  readonly #authState = inject(AuthState);

  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);

  readonly customer = signal<CustomerModel>({ ...initialCustomerModel });
  readonly fullName = computed(() => this.customer().fullName || `${this.customer().firstName} ${this.customer().lastName}`.trim());

  readonly currentPassword = signal<string>('');
  readonly newPassword = signal<string>('');
  readonly confirmPassword = signal<string>('');

  readonly logoutAllDevices = signal<boolean>(true);

  readonly currentPasswordEl = viewChild<ElementRef<HTMLInputElement>>('currentPasswordEl');
  readonly newPasswordEl = viewChild<ElementRef<HTMLInputElement>>('newPasswordEl');
  readonly confirmPasswordEl = viewChild<ElementRef<HTMLInputElement>>('confirmPasswordEl');

  readonly passwordRequirements = computed(() => {
    const pwd = this.newPassword();
    return {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  });

  readonly passwordStrength = computed(() => {
    const requirements = this.passwordRequirements();
    const validCount = Object.values(requirements).filter(Boolean).length;

    if (validCount === 0) return { level: 0, text: 'Zayıf', class: '' };
    if (validCount <= 2) return { level: validCount, text: 'Zayıf', class: 'weak' };
    if (validCount <= 3) return { level: validCount, text: 'Orta', class: 'medium' };
    if (validCount <= 4) return { level: validCount, text: 'İyi', class: 'medium' };
    return { level: validCount, text: 'Güçlü', class: 'strong' };
  });

  readonly isNewPasswordValid = computed(() => Object.values(this.passwordRequirements()).every(Boolean));

  readonly passwordsMatch = computed(() => {
    const pwd = this.newPassword();
    const confirmPwd = this.confirmPassword();
    return pwd.length > 0 && confirmPwd.length > 0 && pwd === confirmPwd;
  });

  readonly isFormValid = computed(() => {
    return !!(this.currentPassword() && this.isNewPasswordValid() && this.passwordsMatch());
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
        this.loading.set(false);
      },
      () => this.loading.set(false)
    );
  }

  toggleCurrentPassword() {
    const input = this.currentPasswordEl()?.nativeElement;
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  toggleNewPassword() {
    const input = this.newPasswordEl()?.nativeElement;
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  toggleConfirmPassword() {
    const input = this.confirmPasswordEl()?.nativeElement;
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (!this.isFormValid() || this.saving()) {
      this.#toast.showToast('Uyarı!', 'Zorunlu alanları doldurmadınız', 'warning');
      return;
    }

    this.saving.set(true);

    const payload = {
      currentPassword: this.currentPassword(),
      newPassword: this.newPassword(),
      logoutAllDevices: this.logoutAllDevices(),
    };

    this.#http.put<string>(
      '/rent/customers/me/change-password',
      payload,
      (res) => {
        this.#toast.showToast('Başarılı', res, 'success');
        this.saving.set(false);
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
        this.#router.navigateByUrl('/my-profile');
      },
      () => this.saving.set(false)
    );
  }

  logout() {
    this.#authState.clear();
    this.#router.navigateByUrl('/login');
  }
}
