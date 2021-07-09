import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { PlacesService } from "./../services/places.service";

import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import { google } from 'google-maps';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

//declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: google.maps.Map;
  mapTest: google.maps.Map;
  loading: any;
  googleM: google;
  trackingStatus: boolean;
  currentLocation: any;

  watchLocation = null;

  placesData: any = [];

  @ViewChild('map') mapElement: ElementRef;


  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private placesService: PlacesService) { }


  ngOnInit() {
    //await this.platform.ready();
    //await this.loadMap();
    this.trackingStatus = false;
    this.getDataLIst();

  }

  ionViewWillEnter() {
    this.loadMap();
  }

  loadMap() {
    
    let latLng = new google.maps.LatLng(51.9036442, 7.6673267);

    let mapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  startTracking() {
    this.trackingStatus = true;
    //this.getCurrentLocation();
    this.watchPosition();

    
  }

  stopTraking() {
    Geolocation.clearWatch({ id: this.watchLocation }).then(() => {
      this.trackingStatus = false;
    });
  }

  async getCurrentLocation() {
    this.currentLocation = await Geolocation.getCurrentPosition();
    console.log(this.currentLocation.coords);
  }

  watchPosition() {
    this.watchLocation = Geolocation.watchPosition({}, (position, err) => {
      console.log('new position: ', position);
      if(position) {
        this.addLocation(
          position.coords.latitude,
          position.coords.longitude
        )
      }

    });
  }

  addLocation(lat, lng, animation?, icon?) {
    let location = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      position: location,
      map: this.map,
      title: "Hello World!",
      animation: animation || google.maps.Animation.DROP,
      icon: icon || null

    });
    this.map.setCenter(location);
    this.map.setZoom(13);
  }

  getDataLIst() {
    this.placesService.getPlaces()
    .pipe(
      tap(places => console.log('Lugares', places)),
      catchError(error => {
        console.log('Error_ ', error);
        //return of([]);
        //catch and replace
        return EMPTY;
      })
    )
      .subscribe((places: any) =>  {
        this.placesData = places;
      });
  }

  //ion infinite scroll method
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.placesData.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  routeService(data) {
    console.log(this.trackingStatus);
    if(this.trackingStatus) {
      //trackig activated, should mark route betwen markers
    }else {
      this.addLocation(data.latitude, data.longitude, google.maps.Animation.BOUNCE, data.mapIcon)
      //traking desactivated, center map on place position



    }
  }

  

}
