import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { NgxMaskDirective } from 'ngx-mask';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [
    RouterLink,
    NgClass,
    NgxMaskDirective,
    FormsModule,
  ],
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Register {
  readonly loading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');

  readonly passwordRequirements = computed(() => {
    const pwd = this.password();
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

  readonly strengthProgress = computed(() => (this.passwordStrength().level / 4) * 100);

  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onIdentityNumberInput(input: HTMLInputElement) {
    input.value = input.value.replace(/\D/g, '').slice(0, 11);
  }

  onPhoneNumberInput(input: HTMLInputElement) {
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
  }

  register(form: NgForm) {
    if (!form.valid) {
      this.#toast.showToast('Uyarı!', 'Zorunlu alanları doldurmadınız', 'warning');
      return;
    }
    if (form.value.password !== form.value.confirmPassword) {
      this.#toast.showToast('Uyarı!', 'Şifreler eşleşmiyor', 'warning');
      return;
    }

    const body = { ...form.value };
    delete body.confirmPassword;

    this.loading.set(true);
    this.#http.post<string>(
      '/rent/customer-auth/register',
      body,
      () => {
        this.loading.set(false);
        this.#toast.showToast('Başarılı', 'Hesabınız oluşturuldu', 'success');
        this.#router.navigateByUrl('/login');
      },
      () => {
        this.loading.set(false);
        this.#toast.showToast('Hata', 'Kayıt işlemi başarısız. Lütfen bilgileri kontrol edip tekrar deneyin.', 'error');
      },
    );
  }
}
