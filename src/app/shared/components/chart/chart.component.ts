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

export interface ChartClickEvent {
  index: number;
  label: string | number;
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
  @Input() labels: (string | number)[] = [];
  @Input() data: number[] = [];
  @Input() label: string = 'Data';

  @Output() chartClick = new EventEmitter<ChartClickEvent>();

  private chart?: Chart;
  ngAfterViewInit(): void {
    if (this.labels.length > 0 && this.data.length > 0) {
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

    const config: any = {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [{
          label: this.label,
          data: this.data,
          backgroundColor: this.type === 'pie' 
            ? CHART_COLORS.slice(0, this.labels.length)
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
        const points = this.chart!.getElementsAtEventForMode(e, 'point', { intersect: true }, true);
        if (points.length) {
          const index = points[0].index;
          const label = this.labels[index];
          this.chartClick.emit({ index, label });
        }
      };
    }

    this.chart = new Chart(ctx, config);
  }

  private isMobile(): boolean {
    return window.innerWidth <= 1000;
  }
  
}