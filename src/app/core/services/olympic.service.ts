import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic, Participation } from '../models/olympic.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class OlympicService {
  private olympics: Olympic[] = [];

  constructor(private dataService: DataService) {}

  getOlympics(): Observable<Olympic[]> {
    if (this.olympics.length > 0) {
      return of(this.olympics);
    }

    return this.dataService.getOlympics().pipe(
      tap(data => {
        this.olympics = data;
      }),
      catchError(error => {
        return throwError(() => new Error(`Unable to load olympic data: ${error.error}`));
      })
    );
  }

  getUniqueYears(olympics: Olympic[]): number[] {
    const allYears = olympics.flatMap(o => o.participations.map(p => p.year));
    return [...new Set(allYears)].sort((a, b) => a - b);
  }

  calculateTotalMedals(participations: Participation[]): number {
    return participations.reduce((sum, p) => sum + (p.medalsCount ?? 0), 0);
  }

  getCountryByName(countryName: string): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map(olympics => olympics.find(o => o.country === countryName))
    );
  }

  countryExists(countryName: string): Observable<boolean> {
    return this.getCountryByName(countryName).pipe(
      map(country => !!country)
    );
  }

  calculateTotalAthletes(participations: Participation[]): number {
    return participations.reduce((sum, p) => sum + p.athleteCount, 0);
  }

  getTotalEntries(participations: Participation[]): number {
    return participations.length;
  }
}