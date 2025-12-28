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
import Chart from 'chart.js/auto';
import { CHART_COLORS, CHART_CONFIG } from '../../../core/constants/chart.constants';
import { ChartItem } from 'src/app/core/models/olympic.model';

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

  @Input() type: 'line' | 'pie' = 'line';
  @Input() chartData: ChartItem[] = [];
  @Input() label: string = 'Medals';

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

  public buildChart(): void {

    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.chart?.destroy();

    const labels = this.chartData.map(chartItem => chartItem.label);
    const data = this.chartData.map(chartItem => chartItem.value);

    const config: any = {
      type: this.type,
      data: {
        labels,
        datasets: [{
          label: this.label,
          data,
          backgroundColor: this.type === 'pie' 
            ? CHART_COLORS.slice(0, labels.length)
            : CHART_COLORS[0]
        }]
      },
      options: {
        responsive: CHART_CONFIG.responsive,
        maintainAspectRatio: true,
        aspectRatio: this.isMobile()
          ? CHART_CONFIG.aspectRatio[this.type].mobile
          : CHART_CONFIG.aspectRatio[this.type].default
      }      
    };

    if (this.type === 'pie') {
      config.data.datasets[0].hoverOffset = 4;
      config.options.onClick = (e: any) => {
        const points = this.chart!.getElementsAtEventForMode(
          e,
          'point',
          { intersect: true },
          true
        );

        if (points.length) {
          const index = points[0].index;
          const item = this.chartData[index];
          this.chartClick.emit({ index, item });
        }
      };
    }

    this.chart = new Chart(ctx, config);
  }

  private isMobile(): boolean {
    return window.innerWidth <= 1000;
  }
}