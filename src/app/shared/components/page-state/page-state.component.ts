import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PageState } from 'src/app/core/models/page-state.model';

@Component({
  selector: 'app-page-state',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './page-state.component.html',
  styleUrls: ['./page-state.component.scss']
})
export class PageStateComponent {
  @Input() state: PageState = 'success';
  @Input() errorMessage: string | null = null;
  @Input() emptyMessage: string = 'No data available';
  @Input() showBackButton: boolean = false;
  @Input() showReloadButton: boolean = false;
  @Input() backRoute: string = '';
  
  @Output() reload = new EventEmitter<void>();
}