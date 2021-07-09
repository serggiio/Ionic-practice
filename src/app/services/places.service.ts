import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private http: HttpClient) { }

  url = 'assets/api/locations.json';

  getPlaces(): Observable<any> {
    return this.http.get<any>(this.url)
      .pipe(
        
      );
  }

}
