import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '@shared/lib/services/http';

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

  readonly #http = inject(HttpService);
  readonly #router = inject(Router);

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
          localStorage.setItem('response', res.token);
          this.#router.navigateByUrl('/');
        }
        this.loading.set(false);
      },
      () => this.loading.set(false),
    );
  }
}
