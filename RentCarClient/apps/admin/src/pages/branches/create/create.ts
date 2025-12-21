/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../../components/blank/blank';
import { BreadcrumbModel, BreadcrumbService } from '../../../services/breadcrumb';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgClass } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BranchModel, initialBranch } from 'apps/admin/src/models/branch.model';
import { HttpService } from 'apps/admin/src/services/http';
import { FlexiToastService } from 'flexi-toast';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { httpResource } from '@angular/common/http';
import { FlexiSelectModule } from 'flexi-select';



@Component({
  imports: [
    Blank,
    FormsModule,
    FormValidateDirective,
    NgClass,
    NgxMaskDirective,
    RouterLink,
    FlexiSelectModule
],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title:'Şubeler',
      icon: 'bi-buildings',
      url:'/branches'
    }
  ]);
  readonly pageTitle = computed(() => this.id() ? 'Şube Güncelle' : 'Şube Ekle');
  readonly pageIcon = computed(() => this.id() ? 'bi-pen' : 'bi-plus');
  readonly btnName = computed(() => this.id() ? 'Güncelle' : 'Kaydet');
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(this.#http.getResource<BranchModel>(`/rent/branches/${this.id()}`));

      this.breadcrumbs.update(prev => [...prev, {
          title:res.data!.name,
          icon:'bi-pen',
          url: `/branches/edit/${this.id()}`,
          isActive:true
        }]);
      this.#breadcrumb.reset(this.breadcrumbs());
      return res.data;
    }
  });

  readonly data = linkedSignal(() => this.result.value() ?? {...initialBranch});
  readonly saving = signal(false);
  readonly loading = computed(() => {
    if (this.saving()) return true;
    return this.id() ? this.result.isLoading() : false;
  });
  readonly ilResult = httpResource<any[]>(() => "/il-lce.json");
  readonly iller = computed(() => this.ilResult.value() ?? []);
  readonly ilLoading = computed(() => this.ilResult.isLoading());
  readonly ilceler = signal<any[]>([]);

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
          url:'/branches/add',
          isActive:true
        }]);
      this.#breadcrumb.reset(this.breadcrumbs());
      }
    })

    effect(() => {
      const city = this.data().address.city;
      const illerList = this.iller();
      
      // Hem city hem de iller yüklendiğinde ilçeleri getir
      if (city && illerList.length > 0) {
        this.getIlceler();
      }
    })

  }

  save(form: NgForm){
    if(!form.valid)
      return;

    if(!this.id()){
    this.saving.set(true);
    this.#http.post<string>('/rent/branches',this.data(),(res) =>{
        this.#toast.showToast("Başarılı",res,"success");
        this.#router.navigateByUrl("/branches");
        this.saving.set(false);
    }, () => this.saving.set(false));
    }else{
    this.saving.set(true);
    this.#http.put<string>('/rent/branches',this.data(),(res) =>{
        this.#toast.showToast("Başarılı",res,"info");
        this.#router.navigateByUrl("/branches");
        this.saving.set(false);
    }, () => this.saving.set(false));
    }
  }

  changeStatus(status:boolean){
    this.data().isActive = status;
  }

  getIlceler(){
    const city = this.data().address.city;
    if (!city) return;
    
    const il = this.iller().find(i => i.il_adi === city);
    if (il && il.ilceler) {
      this.ilceler.set(il.ilceler);
    } else {
      this.ilceler.set([]);
    }
  }
}
