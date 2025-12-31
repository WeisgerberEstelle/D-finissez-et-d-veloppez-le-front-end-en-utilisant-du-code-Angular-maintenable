import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  ViewChild, 
  ElementRef, 
  AfterViewInit, 
  OnDestroy
} from '@angular/core';
import {
  Chart,
  ChartConfiguration
} from 'chart.js/auto';
import { CHART_COLORS, CHART_CONFIG } from '../../../core/constants/chart.constants';
import { ChartItem, ChartType } from 'src/app/core/models/olympic.model';
import { MOBILE_BREAKPOINT } from 'src/app/core/constants/app.constants';

export interface ChartClickEvent {
  index: number;
  item: ChartItem;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() type: ChartType = 'line';
  @Input() chartData: ChartItem[] = [];
  @Input() label: string = 'Medals';
  @Input() xAxisLabel?: string;
  @Input() yAxisLabel?: string;

  @Output() chartClick = new EventEmitter<ChartClickEvent>();

  private chart?: Chart;

  ngAfterViewInit(): void {
    if (this.chartData.length > 0) {
      this.buildChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    if (!this.chartCanvas) return;
  
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
  
    this.chart?.destroy();
    
    const config = this.type === 'pie' 
      ? this.createPieChartConfig() 
      : this.createLineChartConfig();

    this.chart = new Chart(ctx, config);
  }

  private getCommonChartData(): { labels: (string|number)[]; data: number[] } {
    return {
      labels: this.chartData.map(d => d.label),
      data: this.chartData.map(d => d.value)
    };
  }

  private getCommonOptions(): Partial<ChartConfiguration['options']> {
    return {
      responsive: CHART_CONFIG.responsive,
      maintainAspectRatio: true,
      aspectRatio: this.getAspectRatio()
    };
  }

  private getAspectRatio(): number {
    const isMobile = this.isMobile();
    return isMobile
      ? CHART_CONFIG.aspectRatio[this.type].mobile
      : CHART_CONFIG.aspectRatio[this.type].default;
  }

  private createPieChartConfig(): ChartConfiguration {
    const { labels, data } = this.getCommonChartData();

    return {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: this.label,
          data,
          backgroundColor: CHART_COLORS.slice(0, labels.length),
          hoverOffset: 4
        }]
      },
      options: {
        ...this.getCommonOptions(),
        onClick: (event, elements) => {
          if (elements.length) {
            const index = elements[0].index;
            const item = this.chartData[index];
            this.chartClick.emit({ index, item });
          }
        }
      }
    };
  }

  private createLineChartConfig(): ChartConfiguration {
    const { labels, data } = this.getCommonChartData();

    return {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: this.label,
          data,
          backgroundColor: CHART_COLORS[0]
        }]
      },
      options: {
        ...this.getCommonOptions(),
        scales: this.getAxesConfiguration(),
      }
    };
  }

  private isMobile(): boolean {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  public get chartDescription(): string {
    return this.getChartDescription();
  }

  public getChartDescription(): string {
    if (!this.chartData || this.chartData.length === 0) {
      return 'No data available.';
    }

    const total = this.chartData.reduce((sum, item) => sum + item.value, 0);
    const descriptions = this.chartData
      .map(item => `${item.label}: ${item.value}`)
      .join(', ');

    return `${this.label} chart showing total of ${total} across ${this.chartData.length} countries. ${descriptions}.`;
  }

  private getAxesConfiguration() {
    return {
      x: {
        title: {
          display: !!this.xAxisLabel,
          text: this.xAxisLabel || '',
          font: {
            size: CHART_CONFIG.axesFontSize,
          }
        }
      },
      y: {
        title: {
          display: !!this.yAxisLabel,
          text: this.yAxisLabel || '',
          font: {
            size:CHART_CONFIG.axesFontSize
          }
        }
      }
    };
  }
}