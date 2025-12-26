import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, RouterLink} from '@angular/router';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

import { OlympicService } from 'src/app/core/services/olympic.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Stat } from 'src/app/core/models/olympic.model';
import { Olympic, Participation } from '../../core/models/olympic.model';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: true,
  imports: [HeaderComponent, RouterLink, CommonModule ]
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart<"line", number[], number>;
  public titlePage: string = '';
  public stats: Stat[] = [];
  public error!: string;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {
  }

  ngOnInit() {
    let countryName: string | null = null;
    
    this.route.paramMap.subscribe((param: ParamMap) => {
      countryName = param.get('countryName');
    });
  
    this.olympicService.getOlympics().subscribe({
      next: (data: Olympic[]) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((country: Olympic) => country.country === countryName);
          if (!selectedCountry) {
            console.error('Pays non trouvé');
            return;
          }
          
          this.titlePage = selectedCountry.country;
          const participations: Participation[] = selectedCountry.participations;
          const totalEntries: number = participations.length;
          const years: number[] = participations.map((p: Participation) => p.year);
          const medals: number[] = participations.map((p: Participation) => p.medalsCount);
          const totalMedals:number = medals.reduce((sum: number, count: number) => sum + count, 0);
          const athletes: number[] = participations.map((p: Participation) => p.athleteCount);
          const totalAthletes: number = athletes.reduce((sum: number, count: number) => sum + count, 0);
          
          this.buildStats(totalEntries, totalMedals, totalAthletes);
          this.buildChart(years, medals);
        }
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.error = error.message;
      }
    });
  }

  buildChart(years: number[], medals: number[]) {
    const lineChart = new Chart("countryChart", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.lineChart = lineChart;
  }

  private buildStats(
    totalEntries: number,
    totalMedals: number,
    totalAthletes: number
  ): void {
    this.stats = [
      {
        label: 'Total number of participations',
        value: totalEntries
      },
      {
        label: 'Number of medals',
        value: totalMedals
      },
      {
        label: 'Total number of athletes',
        value: totalAthletes
      }
    ];
  }  
}
