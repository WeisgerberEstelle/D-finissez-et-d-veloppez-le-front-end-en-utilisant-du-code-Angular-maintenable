import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic, Stat } from 'src/app/core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [HeaderComponent]
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<"pie", number[], string>;
  public error!:string
  public titlePage: string = "Medals per Country";
  public stats: Stat[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(private router: Router, private olympicService: OlympicService ) { }

  ngOnInit() {
    this.loadOlympicData();
  }

  private loadOlympicData(): void {
    this.olympicService.getOlympics().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data: Olympic[]) => this.handleOlympicData(data),
      error: (error) => this.handleError(error)
    });
  }

  private handleOlympicData(data: Olympic[]): void {  
    if (!data || data.length === 0) {
      return;
    }

    const totalJOs = this.olympicService.getUniqueYears(data).length;
    const countries: string[] = data.map((country: Olympic) => country.country);
    const totalCountries = countries.length;
    this.buildStats(totalCountries, totalJOs);
    
    const sumOfAllMedalsYears = data.map((country: Olympic) => 
      this.olympicService.calculateTotalMedals(country.participations)
    );
    this.buildPieChart(countries, sumOfAllMedalsYears);
  }

  private handleError(error: any): void {
    this.error = error.message;
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    this.pieChart = pieChart;
  }

  private buildStats(totalCountries: number, totalJOs: number): void {
    this.stats = [
      {
        label: 'Number of countries',
        value: totalCountries
      },
      {
        label: 'Number of JOs',
        value: totalJOs
      }
    ];
  }  
}

