import { BreadcrumbService } from './../../../services/breadcrumb';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-breadcrumb',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './breadcrumb.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Breadcrumb {
  readonly breadcrumb = inject(BreadcrumbService);
}
