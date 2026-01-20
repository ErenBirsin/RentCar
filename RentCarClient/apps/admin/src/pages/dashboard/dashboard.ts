import { ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb';
import Blank from '../../components/blank/blank';
import { httpResource } from '@angular/common/http';
import { Result } from '../../models/result.model';
import Loading from '../../components/loading/loading';


@Component({
  imports: [
    Blank,
    Loading
  ],
  templateUrl: './dashboard.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Dashboard implements OnInit{
  readonly activeReservationCountResult = httpResource<Result<number>>(() => "/rent/dashboard/active-reservation-count");
  readonly activeReservationCount = computed(() => this.activeReservationCountResult.value()?.data ?? 0);
  readonly activeReservationCountLoading = computed(() => this.activeReservationCountResult.isLoading());

  readonly totalVehicleCountResult = httpResource<Result<number>>(() => "/rent/dashboard/total-vehicle-count");
  readonly totalVehicleCount = computed(() => this.totalVehicleCountResult.value()?.data ?? 0);
  readonly totalVehicleCountLoading = computed(() => this.totalVehicleCountResult.isLoading());

  readonly totalCustomerCountResult = httpResource<Result<number>>(() => "/rent/dashboard/total-customer-count");
  readonly totalCustomerCount = computed(() => this.totalCustomerCountResult.value()?.data ?? 0);
  readonly totalCustomerCountLoading = computed(() => this.totalCustomerCountResult.isLoading());

  readonly januaryRevenueResult = httpResource<Result<number>>(() => {
    const year = new Date().getFullYear();
    return `/rent/dashboard/monthly-revenue?year=${year}&month=1`;
  });
  readonly januaryRevenue = computed(() => this.januaryRevenueResult.value()?.data ?? 0);
  readonly januaryRevenueLoading = computed(() => this.januaryRevenueResult.isLoading());
  readonly januaryRevenueFormatted = computed(() =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
      .format(this.januaryRevenue())
  );
  readonly #breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
      this.#breadcrumb.setDashboard();

  }
}
