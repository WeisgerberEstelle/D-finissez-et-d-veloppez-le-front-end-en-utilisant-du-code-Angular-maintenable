import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Olympic } from '../models/olympic.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>('./assets/mock/olympic.json').pipe(
      catchError(error => {
        return throwError(() => new Error(`Unable to load olympic data: ${error.error}`));
      })
    );
  }
}
