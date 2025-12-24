import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import Grid from '../../components/grid/grid';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';
import { BreadcrumbModel } from '../../services/breadcrumb';

@Component({
  imports: [
    Grid,
    FlexiGridModule,
    RouterLink
  ],
  templateUrl: './users.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Users {
readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title:'Kullanıcılar',
      icon: 'bi-people',
      url:'/users',
      isActive: true
    }
  ]);

  readonly #common = inject(Common);

  checkPermission(permission:string){
    return this.#common.checkPermission(permission);
  }
}
