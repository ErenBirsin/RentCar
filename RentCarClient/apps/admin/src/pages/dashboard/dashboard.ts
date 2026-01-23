import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb';
import Blank from '../../components/blank/blank';
import { httpResource } from '@angular/common/http';
import { Result } from '@shared/lib/models/result.model';
import Loading from '../../components/loading/loading';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartData {
  data: any[];
  borderColor: string[];
}

interface DailyRevenuePoint {
  date: string;
  total: number;
}

interface ReservationStatusPoint {
  status: string;
  count: number;
}

interface MonthlyRevenuePoint {
  month: string; // yyyy-MM
  total: number;
}

@Component({
  imports: [
    Blank,
    Loading
  ],
  templateUrl: './dashboard.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Dashboard implements OnInit, AfterViewInit{
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

  readonly revenueRange = signal<'7d' | '30d' | '3m' | '12m'>('7d');

  readonly dailyRevenueResult = httpResource<Result<DailyRevenuePoint[]>>(() => {
    const range = this.revenueRange();
    const days = range === '30d' ? 30 : 7;
    return `/rent/dashboard/daily-revenue?days=${days}`;
  });
  readonly dailyRevenue = computed(() => this.dailyRevenueResult.value()?.data ?? []);
  readonly dailyRevenueLoading = computed(() => this.dailyRevenueResult.isLoading());

  readonly monthlyRevenueSeriesResult = httpResource<Result<MonthlyRevenuePoint[]>>(() => {
    const range = this.revenueRange();
    const months = range === '12m' ? 12 : 3;
    return `/rent/dashboard/monthly-revenue-series?months=${months}`;
  });
  readonly monthlyRevenueSeries = computed(() => this.monthlyRevenueSeriesResult.value()?.data ?? []);
  readonly monthlyRevenueSeriesLoading = computed(() => this.monthlyRevenueSeriesResult.isLoading());

  readonly revenueChartData = computed<ChartData>(() => {
    const range = this.revenueRange();
    const color = 'rgba(54, 162, 235, 1)';

    if (range === '7d' || range === '30d') {
      const points = this.dailyRevenue();
      return {
        data: points.map(p => {
          const d = new Date(p.date);
          const label = Number.isNaN(d.getTime())
            ? p.date
            : new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit' }).format(d);
          return { date: label, total: p.total ?? 0 };
        }),
        borderColor: points.map(() => color)
      };
    }

    const points = this.monthlyRevenueSeries();
    return {
      data: points.map(p => {
        const d = new Date(`${p.month}-01T00:00:00`);
        const label = Number.isNaN(d.getTime())
          ? p.month
          : new Intl.DateTimeFormat('tr-TR', { month: 'short', year: '2-digit' }).format(d);
        return { date: label, total: p.total ?? 0 };
      }),
      borderColor: points.map(() => color)
    };
  });

  readonly revenueLoading = computed(() => {
    const range = this.revenueRange();
    return (range === '7d' || range === '30d')
      ? this.dailyRevenueLoading()
      : this.monthlyRevenueSeriesLoading();
  });

  readonly reservationStatusSummaryResult = httpResource<Result<ReservationStatusPoint[]>>(() => `/rent/dashboard/reservation-status-summary`);
  readonly reservationStatusSummary = computed(() => this.reservationStatusSummaryResult.value()?.data ?? []);
  readonly reservationStatusSummaryLoading = computed(() => this.reservationStatusSummaryResult.isLoading());
  readonly reservationStatusChartData = computed<ChartData>(() => {
    const points = this.reservationStatusSummary();
    const palette = [
      'rgba(54, 162, 235, 1)',  // blue
      'rgba(255, 205, 86, 1)',  // yellow
      'rgba(75, 192, 192, 1)',  // green
      'rgba(255, 99, 132, 1)',  // red
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ];

    return {
      data: points.map((p, idx) => ({
        date: p.status,
        total: p.count ?? 0
      })),
      borderColor: points.map((_, idx) => palette[idx % palette.length])
    };
  });

  readonly chartCanvas1 = viewChild.required<ElementRef<HTMLCanvasElement>>('revenueChartCanvas');
  readonly chartCanvas2 = viewChild.required<ElementRef<HTMLCanvasElement>>('reservationStatusChartCanvas');

  readonly chart1 = signal<Chart | null>(null);
  readonly chart2 = signal<Chart | null>(null);

  readonly #breadcrumb = inject(BreadcrumbService);

  readonly res1 = signal<ChartData>({ data: [], borderColor: [] });
  readonly res2 = signal<ChartData>({ data: [], borderColor: [] });

  ngOnInit(): void {
      this.#breadcrumb.setDashboard();

  }
  ngAfterViewInit(): void {
    this.initRevenueChart();
    this.initReservationStatusChart();
  }

  private initRevenueChart(): void {
    if (this.revenueLoading()) {
      setTimeout(() => this.initRevenueChart(), 200);
      return;
    }

    const data = this.revenueChartData();
    this.res1.set(data);
    const range = this.revenueRange();
    const title =
      range === '7d' ? 'Son 7 Gün Gelir Dağılımı' :
      range === '30d' ? 'Son 30 Gün Gelir Dağılımı' :
      range === '3m' ? 'Son 3 Ay Gelir Dağılımı' :
      'Son 12 Ay Gelir Dağılımı';

    const label =
      (range === '3m' || range === '12m')
        ? 'Aylık Gelir (₺)'
        : 'Günlük Kazanç Dağılımı (₺)';

    const chart = this.createChart(this.chart1(), this.chartCanvas1(),'bar', data, label, title);
    this.chart1.set(chart);
  }

  onRevenueRangeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as '7d' | '30d' | '3m' | '12m';
    this.revenueRange.set(value);
    this.initRevenueChart();
  }

  private initReservationStatusChart(): void {
    if (this.reservationStatusSummaryLoading()) {
      setTimeout(() => this.initReservationStatusChart(), 200);
      return;
    }

    const data = this.reservationStatusChartData();
    this.res2.set(data);
    const chart2 = this.createChart(this.chart2(), this.chartCanvas2(), 'doughnut', data, "Rezervasyon Durumu", "Rezervasyon Durumu Dağılımı", "");
    this.chart2.set(chart2);
  }

  createChart(
    chart: Chart | null,
    canvas: any,
    type: ChartType,
    res: ChartData,
    label: string,
    text: string,
    symbol = ' ₺') {
    if (chart) {
      chart.destroy();
    }

    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return null;

    const config: ChartConfiguration = {
      type: type,
      data: {
        labels: res.data.map(item => item.date),
        datasets: [{
          label: label,
          data: res.data.map(item => item.total),
          backgroundColor:res.borderColor,
          borderColor: res.borderColor,
          borderWidth: 2,
          fill: type === 'line' ? false : true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: text
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: type !== 'doughnut' ? {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + symbol;
              }
            }
          }
        } : {}
      }
    };

    return new Chart(ctx, config);
  }
}
