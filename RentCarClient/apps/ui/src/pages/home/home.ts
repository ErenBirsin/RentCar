import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthState } from '../services/auth.state';

@Component({
  imports: [RouterLink],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly #authState = inject(AuthState);
  readonly isLoggedIn = computed(() => !!this.#authState.token());
}
