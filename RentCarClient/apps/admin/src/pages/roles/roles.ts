import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { BreadcrumbModel } from '../../services/breadcrumb';
import Grid from '../../components/grid/grid';
import { FlexiGridModule } from 'flexi-grid';

@Component({
  imports: [
    Grid,
    FlexiGridModule
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
}
