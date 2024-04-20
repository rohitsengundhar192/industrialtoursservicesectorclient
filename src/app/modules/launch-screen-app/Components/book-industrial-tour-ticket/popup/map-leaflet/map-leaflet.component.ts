import { Component, Inject, Input, OnInit, Optional } from '@angular/core';

import * as L from 'leaflet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-map-leaflet',
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.scss'],
})
export class MapLeafletComponent implements OnInit {
  user_details_x: any;
  user_details_y: any;
  industrial_tour_site_id: any;
  map_location_display_name:any;
  constructor(
    private apiService: ApiService,
    private spinner: CustomSpinnerService,
    private snackbar: SnackBarService,
    private dataSharing: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public mapData: any,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log(data,'da');
  }

  ngOnInit(): void {
    console.log(this.mapData, 'mapData');
    this.industrial_tour_site_id = this.mapData.industrial_tour_site_id;
    this.map_location_display_name = this.mapData.map_location_display_name;

    if (this.industrial_tour_site_id != undefined) {
      this.mapApi();
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  //Map To Show Institute Location
  private map: any;
  iconUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png';
  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 10,
    });
    const mapLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    mapLayer.addTo(this.map);
  }
  theMarker = {};
  popup: any;
  mapApi() {
    this.spinner.open();
    this.apiService.getMapData(this.industrial_tour_site_id).subscribe({
      next: (res) => {
        console.log(res);

        this.spinner.close();
        this.user_details_x = res.data[0].industrial_tour_site_gps_coordinates.x;
        this.user_details_y = res.data[0].industrial_tour_site_gps_coordinates.y;
        this.map.flyTo([this.user_details_x, this.user_details_y], 9);
        L.circle([this.user_details_x, this.user_details_y], 50000).addTo(
          this.map
        );
        this.popup = L.popup({
          closeOnClick: false,
          autoClose: false,
        }).setContent(this.map_location_display_name);
        L.marker([this.user_details_x, this.user_details_y], {
          draggable: false,
          icon: L.icon({
            iconSize: [25, 41],
            iconUrl: this.iconUrl,
            iconAnchor: [16, 37],
            popupAnchor: [-3, -24],
          }),
        })
          .addTo(this.map)
          .bindPopup(this.popup)
          .openPopup();
      },
      error: () => {
        this.spinner.close();
        this.snackbar.success('Data Not Found');
      },
    });
  }
}
