import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

import { OlympicService } from 'src/app/core/services/olympic.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Stat } from 'src/app/core/models/olympic.model';
import { Olympic, Participation } from '../../core/models/olympic.model';
import { CHART_COLORS } from '../../core/constants/chart.constants';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent, 
    RouterLink, 
    CommonModule, 
    SpinnerComponent,
    ChartComponent
  ],
})
export class CountryComponent implements OnInit {
  public titlePage: string = '';
  public stats: Stat[] = [];
  public error!: string;
  public isLoading = true;

  public chartLabels: number[] = [];
  public chartData: number[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  ngOnInit() {
    this.loadCountryData();
  }

  private loadCountryData(): void {
    let countryName: string | null = null;

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param: ParamMap) => {
        countryName = param.get('countryName');

        if (countryName) {
          this.fetchCountryDetails(countryName);
        }
      });
  }

  private fetchCountryDetails(countryName: string): void {
    this.olympicService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Olympic[]) => this.handleCountryData(data, countryName),
        error: (error) => this.handleError(error),
      });
  }

  private handleCountryData(data: Olympic[], countryName: string): void {
    if (!data || data.length === 0) {
      this.isLoading = false;
      return;
    }

    const selectedCountry = data.find(
      (country: Olympic) => country.country === countryName
    );

    if (!selectedCountry) {
      this.error = 'Country not found';
      this.isLoading = false;
      return;
    }

    this.titlePage = selectedCountry.country;
    const participations: Participation[] = selectedCountry.participations;
    const totalEntries: number = this.olympicService.getTotalEntries(participations);
    const totalMedals: number = this.olympicService.calculateTotalMedals(participations);
    const totalAthletes: number = this.olympicService.calculateTotalAthletes(participations);
    this.buildStats(totalEntries, totalMedals, totalAthletes);

    this.chartLabels = participations.map((p: Participation) => p.year);
    this.chartData = participations.map((p: Participation) => p.medalsCount);
    this.isLoading = false;
  }

  private buildStats(
    totalEntries: number,
    totalMedals: number,
    totalAthletes: number
  ): void {
    this.stats = [
      {
        label: 'Total number of participations',
        value: totalEntries,
      },
      {
        label: 'Number of medals',
        value: totalMedals,
      },
      {
        label: 'Total number of athletes',
        value: totalAthletes,
      },
    ];
  }

  private handleError(error: any): void {
    this.error = error.message;
    this.isLoading = false;
  }
}
