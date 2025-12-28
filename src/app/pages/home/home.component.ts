import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ChartItem, Olympic, Stat } from 'src/app/core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import {
  ChartComponent,
  ChartClickEvent,
} from 'src/app/shared/components/chart/chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [HeaderComponent, SpinnerComponent, ChartComponent],
})
export class HomeComponent implements OnInit {
  public error!: string;
  public titlePage: string = 'Medals per Country';
  public stats: Stat[] = [];
  public isLoading = true;

  public chartLabels: string[] = [];
  public chartData: ChartItem[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {
    this.loadOlympicData();
  }

  private loadOlympicData(): void {
    this.olympicService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Olympic[]) => this.handleOlympicData(data),
        error: (error) => this.handleError(error),
      });
  }

  private handleOlympicData(data: Olympic[]): void {
    if (!data || data.length === 0) {
      this.isLoading = false;
      return;
    }

    const totalJOs: number = this.olympicService.getUniqueYears(data).length;
    const totalCountries: number = data.length;

    this.buildStats(totalCountries, totalJOs);

    this.chartData = data
    .map((country: Olympic) => ({
      label: country.country,
      value: this.olympicService.calculateTotalMedals(country.participations)
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

    this.isLoading = false;
  }

  private handleError(error: Error): void {
    this.error = error.message;
    this.isLoading = false;
  }

  private buildStats(totalCountries: number, totalJOs: number): void {
    this.stats = [
      {
        label: 'Number of countries',
        value: totalCountries,
      },
      {
        label: 'Number of JOs',
        value: totalJOs,
      },
    ];
  }

  public onCountryClick(event: ChartClickEvent): void {
    this.router.navigate(['country', event.item.label]);
  }

  public reloadPage(): void {
    window.location.reload();
  }
}
