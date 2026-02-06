import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';
import { AuthState } from '../services/auth.state';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [
    RouterLink,
    FormsModule,
  ],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  readonly loading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly email = signal<string>('');

  readonly modalCloseBtn = viewChild<ElementRef<HTMLButtonElement>>('modalCloseBtn');

  readonly #http = inject(HttpService);
  readonly #router = inject(Router);
  readonly #authState = inject(AuthState);
  readonly #toast = inject(FlexiToastService);

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  login(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.#http.post<{ token: string | null }>(
      '/rent/customer-auth/login',
      form.value,
      (res) => {
        if (res?.token) {
          this.#authState.setToken(res.token);
          this.#router.navigateByUrl('/');
        }
        this.loading.set(false);
      },
      () => this.loading.set(false),
    );
  }

  forgotPassword() {
    if (!this.email()) {
      this.#toast.showToast('Uyarı!', 'Lütfen e-posta adresinizi giriniz', 'warning');
      return;
    }

    this.#http.post<string>(
      `/rent/customer-auth/forgot-password/${this.email()}`,
      {},
      (res) => {
        this.#toast.showToast('Başarılı', res, 'info');
        this.modalCloseBtn()?.nativeElement.click();
      }
    );
  }
}
