import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	standalone: true,
	styleUrl: './header.component.scss'
})
export class HeaderComponent {
	@Input() title: string = '';
}
