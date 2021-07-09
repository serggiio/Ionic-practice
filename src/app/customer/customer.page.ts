import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  id: any;
  email: String;
  avatar: String;
  firstName: String;
  lastName: String;
  validUser: Boolean = true;

  token = localStorage.getItem('token');
  
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private customerService: CustomerService, private http: HttpClient) { }

  ngOnInit() {
    console.log(this.token);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUser().subscribe(res => {
      console.log('RES');
      console.log('RES', res.data);
      this.email = res.data.email;
      this.avatar = res.data.avatar;
      this.firstName = res.data.first_name;
      this.lastName = res.data.last_name;
      this.validUser = true;

    }, err=>{
      console.log("ERROR")
      this.validUser = false;
    });

  }

  getUsers(){
    return this.http.get('https://reqres.in/api/users?page=2')
    .pipe(
      map((res:any) => {
        return res;
      })
    )
  }

  getUser(){
    return this.http.get('https://reqres.in/api/users/'+this.id)
    .pipe(
      map((res:any) => {
        return res;
      })
    )
  }

}
