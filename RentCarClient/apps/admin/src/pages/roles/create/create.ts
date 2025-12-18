/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../../components/blank/blank';
import { BreadcrumbModel, BreadcrumbService } from '../../../services/breadcrumb';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgClass } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RoleModel, initialRole } from 'apps/admin/src/models/role.model';
import { HttpService } from 'apps/admin/src/services/http';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';


@Component({
  imports: [
    Blank,
    FormsModule,
    FormValidateDirective,
    NgClass,
    RouterLink
],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title:'Roller',
      icon: 'bi-buildings',
      url:'/roles'
    }
  ]);
  readonly pageTitle = computed(() => this.id() ? 'Rol Güncelle' : 'Rol Ekle');
  readonly pageIcon = computed(() => this.id() ? 'bi-pen' : 'bi-plus');
  readonly btnName = computed(() => this.id() ? 'Güncelle' : 'Kaydet');
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(this.#http.getResource<RoleModel>(`/rent/roles/${this.id()}`));

      this.breadcrumbs.update(prev => [...prev, {
          title:res.data!.name,
          icon:'bi-pen',
          url: `/roles/edit/${this.id()}`,
          isActive:true
        }]);
      this.#breadcrumb.reset(this.breadcrumbs());
      return res.data;
    }
  });

  readonly data = linkedSignal(() => this.result.value() ?? {...initialRole});
  readonly loading = linkedSignal(() => this.result.isLoading());

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute)
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);

  constructor(){
    this.#activated.params.subscribe(res =>{
      if(res['id']){
        this.id.set(res['id']);
      }else{
        this.breadcrumbs.update(prev => [...prev, {
          title:'Ekle',
          icon:'bi-plus',
          url:'/roles/add',
          isActive:true
        }]);
      this.#breadcrumb.reset(this.breadcrumbs());
      }
    })
  }

  save(form: NgForm){
    if(!form.valid)
      return;

    if(!this.id()){
    this.loading.set(true);
    this.#http.post<string>('/rent/roles',this.data(),(res) =>{
        this.#toast.showToast("Başarılı",res,"success");
        this.#router.navigateByUrl("/roles");
        this.loading.set(false);
    }, () => this.loading.set(false));
    }else{
    this.loading.set(true);
    this.#http.put<string>('/rent/roles',this.data(),(res) =>{
        this.#toast.showToast("Başarılı",res,"info");
        this.#router.navigateByUrl("/roles");
        this.loading.set(false);
    }, () => this.loading.set(false));
    }
  }

  changeStatus(status:boolean){
    // computed signal döndüğü nesne referansını doğrudan güncelle
    this.data().isActive = status;
  }
}
