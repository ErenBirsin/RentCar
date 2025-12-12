import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../../components/blank/blank';
import { BreadcrumbModel, BreadcrumbService } from '../../../services/breadcrumb';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgClass } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import Loading from 'apps/admin/src/components/loading/loading';


@Component({
  imports: [
    Blank,
    FormsModule,
    FormValidateDirective,
    NgClass,
    Loading
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
  readonly loading = signal<boolean>(false);

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute)

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
      }

      this.#breadcrumb.reset(this.breadcrumbs());
    })
  }

}
