import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthState } from '../services/auth.state';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [RouterLink],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly #authState = inject(AuthState);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);
  readonly isLoggedIn = computed(() => !!this.#authState.token());

  goToOfferSelect() {
    if (!this.isLoggedIn()) {
      this.#toast.showToast('Uyarı', 'Araçları görüntülemek için giriş yapmalısınız.', 'warning');
      this.#router.navigateByUrl('/login');
      return;
    }

    this.#router.navigateByUrl('/offer-select');
  }
}
