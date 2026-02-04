import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { AuthState } from '../services/auth.state';

@Component({
  imports: [
    RouterModule,
    RouterOutlet,
    RouterLink],
  templateUrl: './layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout {

  readonly #authState = inject(AuthState);
  readonly #router = inject(Router);
  readonly isLoggedIn = computed(() => !!this.#authState.token());

  logout(){
    this.#authState.clear();
    this.#router.navigateByUrl('/login');
  }

}
