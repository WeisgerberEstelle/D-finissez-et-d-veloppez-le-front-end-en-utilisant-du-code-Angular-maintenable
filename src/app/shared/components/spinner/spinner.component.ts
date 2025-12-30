import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() size = 100;
  @Input() stroke = 10;
  @Input() color = '#0b868f';
  @Input() center = true;
}
