import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { AuthState } from '../services/auth.state';
import { FlexiToastService } from 'flexi-toast';

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
  readonly #toast = inject(FlexiToastService);
  readonly isLoggedIn = computed(() => !!this.#authState.token());

  logout(){
    this.#authState.clear();
    this.#toast.showToast('Başarılı', 'Başarılı bir şekilde çıkış yapıldı', 'info');
    this.#router.navigateByUrl('/login');
  }

}
