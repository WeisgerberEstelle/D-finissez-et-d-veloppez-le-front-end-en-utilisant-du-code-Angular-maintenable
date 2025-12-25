import { Component, Input } from '@angular/core';
import { Stat } from 'src/app/core/models/olympic.model';

@Component({
	selector: 'app-stat-card',
	standalone: true,
	imports: [],
	templateUrl: './stat-card.component.html',
	styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
	@Input() stat!: Stat;
}
