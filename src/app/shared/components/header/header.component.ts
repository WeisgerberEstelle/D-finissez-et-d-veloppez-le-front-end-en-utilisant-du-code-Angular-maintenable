import { Component, Input } from '@angular/core';
import { StatCardComponent } from "../stat-card/stat-card.component";
import { Stat } from 'src/app/core/models/olympic.model';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	standalone: true,
	styleUrl: './header.component.scss',
 imports: [StatCardComponent, CommonModule]
})
export class HeaderComponent {
	@Input() title!: string;
	@Input() stats!: Stat[];
}
