import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OlympicService } from 'src/app/core/services/olympic.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ChartItem, ChartType, Stat } from 'src/app/core/models/olympic.model';
import { Olympic, Participation } from '../../core/models/olympic.model';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { PageState } from 'src/app/core/models/page-state.model';
import { PageStateComponent } from 'src/app/shared/components/page-state/page-state.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent, 
    RouterLink, 
    CommonModule, 
    PageStateComponent,
    ChartComponent
  ],
})
export class CountryComponent implements OnInit {
  public titlePage: string = '';
  public stats: Stat[] = [];
  public error: string | null = null;
  public pageState: PageState = 'loading';
  public readonly chartLabel: string = 'Number of medals';
  public readonly xAxisLabel: string = 'Dates';
  public readonly chartType: ChartType = 'line';
  public chartData: ChartItem[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCountryData();
  }

  private loadCountryData(): void {
    let countryId: number | null = null;

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param: ParamMap) => {
        countryId = Number(param.get('countryId'));

        if (!countryId) {
          this.router.navigateByUrl('/not-found');
          return;
        }
        this.fetchCountryDetails(countryId);
      });
  }

  private fetchCountryDetails(countryId: number): void {
    this.olympicService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Olympic[]) => this.handleCountryData(data, countryId),
        error: () => this.handleError(),
      });
  }

  private handleCountryData(data: Olympic[], countryId: number): void {
    if (!data || data.length === 0) {
      this.pageState = 'empty';
      return;
    }

    const selectedCountry = data.find(
      (country: Olympic) => country.id === countryId
    );

    if (!selectedCountry) {
      this.router.navigateByUrl('/not-found');
      return;
    }

    this.titlePage = selectedCountry.country;
    const participations: Participation[] = selectedCountry.participations;
    const totalEntries: number = this.olympicService.getTotalEntries(participations);
    const totalMedals: number = this.olympicService.calculateTotalMedals(participations);
    const totalAthletes: number = this.olympicService.calculateTotalAthletes(participations);
    this.buildStats(totalEntries, totalMedals, totalAthletes);
    this.chartData = participations.map((p: Participation) => ({
      id: p.id,
      label: p.year,
      value: p.medalsCount
    }));
    
    this.pageState = 'success';
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

  private handleError(): void {
    this.error = 'Unable to retrieve country statistics';
    this.pageState = 'error';
  }
}
