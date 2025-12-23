import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { BreadcrumbModel } from '../../services/breadcrumb';
import Grid from '../../components/grid/grid';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from "@angular/router";
import { Common } from '../../services/common';

@Component({
  imports: [
    Grid,
    FlexiGridModule,
    RouterLink,
    RouterLink
],
  templateUrl: './roles.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Roles {
readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title:'Roller',
      icon: 'bi-clipboard2-check',
      url:'/roles',
      isActive: true
    }
  ]);

  readonly #common = inject(Common);

  checkPermission(permission:string){
    return this.#common.checkPermission(permission);
  }
}
