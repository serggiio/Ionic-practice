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
  directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  routeServiceResponse: any;
  mapTest: google.maps.Map;
  loading: any;
  //googleM: google;
  trackingStatus: boolean;
  currentLocation: any;

  watchLocation = null;

  placesData: any = [];

  mapMarkers = [];
  userMarker: any;

  @ViewChild('map') mapElement: ElementRef;


  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private placesService: PlacesService) { }


  async ngOnInit() {
    await this.startTracking();
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
    console.log('CONTINUAR', this.trackingStatus);
    //this.getCurrentLocation();
    this.watchPosition();

    
  }

  async stopTraking() {
    this.trackingStatus = false;
    console.log('PAUSAR', this.trackingStatus);
    await Geolocation.clearWatch({ id: this.watchLocation });
  }

  async getCurrentLocation() {
    this.currentLocation = await Geolocation.getCurrentPosition();
    console.log(this.currentLocation.coords);
  }

  watchPosition() {
    this.watchLocation = Geolocation.watchPosition({}, (position, err) => {
      console.log('new position: ', position);
      console.log('new position: err  ', err);
      
      if(position) {
        
        this.currentLocation = position.coords;
        //before add a marker delete all old markers
        if(this.userMarker !== undefined) {
          this.userMarker.setMap(null);
        }
        this.addLocation(
          position.coords.latitude,
          position.coords.longitude,
          google.maps.Animation.DROP,
          null,
          'user'

        )
      }

    });
  }

  deleteOldMarkers() {

      for(let n in this.mapMarkers){
        this.mapMarkers[n].setMap(null);
      }
  }

  addLocation(lat, lng, animation?, icon?, type?) {
    type = type || 'place';
    let location = new google.maps.LatLng(lat, lng);
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: "Hello World!",
      animation: animation || google.maps.Animation.BOUNCE,
      icon: icon || null

    });
    //this.mapMarkers.push(marker);
    (type == 'user') ? (this.userMarker = marker) : (this.mapMarkers.push(marker)); 

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
    //console.log(this.trackingStatus);
    //delete all markers before add a new one
    this.deleteOldMarkers();
    this.addLocation(data.latitude, data.longitude, google.maps.Animation.BOUNCE, data.mapIcon, 'place');

    this.displayRoute(data.latitude, data.longitude);
    /*if(this.trackingStatus) {
      //trackig activated, should mark route betwen markers
      this.displayRoute(data.latitude, data.longitude);

    }else {
      //this.addLocation(data.latitude, data.longitude, google.maps.Animation.BOUNCE, data.mapIcon)
      //traking desactivated, center map on place position



    }*/
  }

  displayRoute(originLat, originLng) {

    const waypts: google.maps.DirectionsWaypoint[] = [];
    //let directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsService
      .route({
        origin: new google.maps.LatLng(this.currentLocation.latitude, this.currentLocation.longitude),
        destination: new google.maps.LatLng(originLat, originLng),
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        console.log('respuesta de servicio::::');
        console.log(response);
        this.routeServiceResponse = response;
        
        this.directionsRenderer.setMap(null);

        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setOptions({suppressMarkers: true});
        this.directionsRenderer.setDirections(this.routeServiceResponse);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));

  }

  

}
