import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Olympic, Participation } from '../models/olympic.model';

@Injectable({
  providedIn: 'root'
})
export class OlympicService {
  private apiUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  getOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.apiUrl).pipe(
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
    return participations.reduce((sum, p) => sum + p.medalsCount, 0);
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