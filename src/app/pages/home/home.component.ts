import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ChartItem, ChartType, Olympic, Stat } from 'src/app/core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import {
  ChartComponent,
  ChartClickEvent,
} from 'src/app/shared/components/chart/chart.component';
import { PageStateComponent } from 'src/app/shared/components/page-state/page-state.component';
import { PageState } from 'src/app/core/models/page-state.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [HeaderComponent, ChartComponent, PageStateComponent],
})
export class HomeComponent implements OnInit {
  public error: string | null = null;
  public titlePage: string = 'Medals per Country';
  public stats: Stat[] = [];
  public pageState: PageState = 'loading';
  public chartData: ChartItem[] = [];
  public readonly chartType: ChartType = 'pie';

  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.loadOlympicData();
  }

  private loadOlympicData(): void {
    this.olympicService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Olympic[]) => this.handleOlympicData(data),
        error: () => this.handleError(),
      });
  }

  private handleOlympicData(data: Olympic[]): void {
    if (!data?.length) {
      this.pageState = 'empty';
      return;
    }
  
    const totalJOs = this.olympicService.getUniqueYears(data).length;
    const totalCountries = data.length;
  
    this.buildStats(totalCountries, totalJOs);
    this.chartData = this.buildChartData(data);
    this.pageState = 'success';
  }

  private handleError(): void {
    this.error = 'Unable to retrieve medal distribution by country';
    this.pageState = 'error';
  }

  private buildStats(totalCountries: number, totalJOs: number): void {
    this.stats = [
      {
        label: 'Number of countries',
        value: totalCountries,
      },
      {
        label: 'Number of Olympic Games',
        value: totalJOs,
      },
    ];
  }

  private buildChartData(data: Olympic[]): ChartItem[] {
    return data
      .map((country) => ({
        id: country.id,
        label: country.country,
        value: this.olympicService.calculateTotalMedals(country.participations),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  public onCountryClick(event: ChartClickEvent): void {
    this.router.navigate(['country', event.item.id]);
  }

  public reloadData(): void {
    this.pageState = 'loading';
    this.error = null;
    this.loadOlympicData();
  }
}
