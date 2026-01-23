import { httpResource } from '@angular/common/http';
import { BreadcrumbModel, BreadcrumbService } from './../../../services/breadcrumb';
import { ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Result } from '@shared/lib/models/result.model';
import { RoleModel, initialRole } from '@shared/lib/models/role.model';
import Blank from 'apps/admin/src/components/blank/blank';

@Component({
  imports: [
    Blank,
  ],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);

  readonly result = httpResource<Result<RoleModel>>(() => `/rent/roles/${this.id()}`);
  readonly data = computed(() =>this.result.value()?.data ?? initialRole);
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>("Rol Detay");

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor(){
    this.#activated.params.subscribe(res => {
      this.id.set(res['id']);
    });

    effect(() =>{
      const breadCrumbs: BreadcrumbModel[] = [
          {
            title:'Roller',
            icon:'bi-clipboard2-check',
            url:'/roles'
          }
      ]

      if(this.data()){
        this.breadcrumbs.set(breadCrumbs);
        this.breadcrumbs.update(prev => [...prev, {
          title:this.data().name,
          icon:'bi-zom-in',
          url: `/roles/detail/${this.id()}`,
          isActive:true
        }]);
      this.#breadcrumb.reset(this.breadcrumbs());
      }
    })
  }
}
