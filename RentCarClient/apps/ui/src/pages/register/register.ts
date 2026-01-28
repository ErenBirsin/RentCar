import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';

@Component({
  imports: [
    RouterLink,
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

  readonly #http = inject(HttpService);
  readonly #router = inject(Router);

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  register(form: NgForm) {
    if (!form.valid) return;
    if (form.value.password !== form.value.confirmPassword) return;

    const body = { ...form.value };
    delete body.confirmPassword;

    this.loading.set(true);
    this.#http.post<string>(
      '/rent/customer-auth/register',
      body,
      () => {
        this.loading.set(false);
        this.#router.navigateByUrl('/login');
      },
      () => this.loading.set(false),
    );
  }
}
