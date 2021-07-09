import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from "./../services/customer.service";
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  
  customerData:any = [];
  permission: boolean;
  users: any = [];
  dat = '';
  searchUser:any;
  
  varTest = {
    "data": [
      {
        "id": 7,
        "email": "michael.lawson@reqres.in",
        "first_name": "Michael",
        "last_name": "Lawson",
        "avatar": "https://reqres.in/img/faces/7-image.jpg"
      },
      {
        "id": 8,
        "email": "lindsay.ferguson@reqres.in",
        "first_name": "Lindsay",
        "last_name": "Ferguson",
        "avatar": "https://reqres.in/img/faces/8-image.jpg"
      },
      {
        "id": 9,
        "email": "tobias.funke@reqres.in",
        "first_name": "Tobias",
        "last_name": "Funke",
        "avatar": "https://reqres.in/img/faces/9-image.jpg"
      },
      {
        "id": 10,
        "email": "byron.fields@reqres.in",
        "first_name": "Byron",
        "last_name": "Fields",
        "avatar": "https://reqres.in/img/faces/10-image.jpg"
      },
      {
        "id": 11,
        "email": "george.edwards@reqres.in",
        "first_name": "George",
        "last_name": "Edwards",
        "avatar": "https://reqres.in/img/faces/11-image.jpg"
      },
      {
        "id": 12,
        "email": "rachel.howell@reqres.in",
        "first_name": "Rachel",
        "last_name": "Howell",
        "avatar": "https://reqres.in/img/faces/12-image.jpg"
      }
    ],
  };

  constructor(private router: Router, private customerService: CustomerService, private http: HttpClient, 
    public toastController: ToastController, public alertController: AlertController) { }

  ngOnInit() {
    this.permission = true;
    //this.getCursos();
    console.log('get usuarios');
    this.getUsers().subscribe(res => {
      console.log('RES', res.data[0].email);
      this.dat = res.data[0].email;
      this.users = res.data;
      this.searchUser = this.users;
    });
    
  }
  
  goToHome(){
    this.router.navigate(['/home'])
  }

  getCursos(){
    this.customerService.searchCustomers()
    .pipe(
      tap(customers => console.log('Customers', customers.data)),
      catchError(error => {
        console.log('Error_ ', error);
        //return of([]);
        //catch and replace
        return EMPTY;
      })
    )
      .subscribe((customers: any) =>  {
        this.customerData = customers.data;
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

  checkEvent(event){
    console.log(event.currentTarget.checked);
    (event.currentTarget.checked) ? (this.permission = true) : (this.permission = false)

  }

  async showToast(data) {
    console.log(data);
    const toast = await this.toastController.create({
      message: 'Contacto: ' + data.email,
      duration: 500,
      position: 'bottom'
    });
    toast.present();      
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar registros ?',
      message: 'Eliminar todos los registros?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No se eliminaran los registros');
          }
        },
        {
          text: 'Si',
          handler: () => {
            console.log('Se limino todo');
            if(this.permission) {
              this.permission = false;
              document.getElementById('checkPermission').click();
            }
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  searchCustomer(event) {
    const text = event.target.value;
    console.log(text);
    this.searchUser = this.users;

    if(text && text.trim() != '') {
      this.searchUser = this.searchUser.filter((user: any) => {
        return (user.first_name.toLowerCase().indexOf(text.toLowerCase()) > -1 ) 
      })
    }

  }

}
