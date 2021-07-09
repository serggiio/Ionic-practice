import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  url = 'https://reqres.in/api/users?page=2';

  /*searchCustomers(): Observable<any> {
    return this.http.get(`${this.url}`).pipe(
      map(results => results['Search'])
    );
  }*/

  searchCustomers(): Observable<any> {
    return this.http.get<any>(this.url)
      .pipe(
        
      );
  }

  

}
