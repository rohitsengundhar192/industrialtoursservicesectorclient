import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';
import { Observable, map, startWith, Subscriber } from 'rxjs';
// @ts-ignore
import * as countrycitystatejson from 'countrycitystatejson';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CKEditorComponent } from 'ng2-ckeditor';
import * as moment from 'moment';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import * as Leaflet from 'leaflet';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CalanderPoupComponent } from './Tables/calander-poup/calander-poup.component';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { format } from 'date-fns';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
interface Food {
  value: string;
  viewValue: string;
}
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-schedule-new',
  templateUrl: './schedule-new.component.html',
  styleUrls: ['./schedule-new.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleNewComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup = this._formBuilder.group({
    city: ['', Validators.required],
    activity1: ['', Validators.required],
    country: ['', Validators.required],
    dressCode: [''],
    footWear: [''],
    cdk_editor: new FormControl(),
  });

  get city() {
    return this.firstFormGroup.get('city');
  }
  get activity1() {
    return this.firstFormGroup.get('activity');
  }
  get country() {
    return this.firstFormGroup.get('activity');
  }
  firstForm = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondForm = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  //* -----------------------  Decorated Methods  --------------------------*//

  countries: Country[] = [];
  CountryfilteredOptions!: Observable<Country[]>;

  city_1: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  @ViewChild('myckeditor') myckeditor!: CKEditorComponent;
  //* -----------------------  Variable Declaration  -----------------------*//
  ckeConfig!: any;
  readonlydata: boolean = true;
  selectedDate: any;
  today!: Date;
  obtainedCity: any;
  MakeEasyTourData: any;
  industrial_tour_site_name: any;
  transport_info_from_airport_to_tour_site: any;
  transport_info_from_bus_stop_to_tour_site: any;
  transport_info_from_railway_station_to_tour_site: any;
  no_of_participants_allowed_per_tour: any;
  no_of_volunteers_allowed_per_tour: any;
  minimum_age_permissible_of_visitors: any;
  industrial_tour_check_in_timeAMPM: any;
  industrial_tour_check_out_timeAMPM: any;

  industrial_tour_check_in_time: any;
  industrial_tour_check_out_time: any;
  food_availability: any;
  food_availability_show: any;
  selectedCity: string = '';
  isSelectDisabled: boolean = true;
  dress_code: any = [];
  selectedDressCode: any;
  dress_code_options: any;

  foot_wear: any = [];
  selectedFootWear: any;
  foot_wear_options: any;

  safety_hats: any = [];
  selectedsafetyHats: any;
  safety_hats_options: any;

  foot_wearYN: any = [];
  selectedFootWearYN: any;
  foot_wear_optionsYN: any;

  safety_hatsYN: any = [];
  selectedsafetyHatsYN: any;
  safety_hats_optionsYN: any;

  cloudIds: any;
  pushtable: any;
  bucketName: string = 'getwow-education';
  edu_travel_arrangements_info: any;
  obtainedTourID: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  faculty_rating_value: any = 0;
  ratingsData: any = 0;
  map_location_display_name: any;
  address_line_1: any;
  address_line_2: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _formBuilder: FormBuilder,
    public loginDialogRef: MatDialogRef<ScheduleNewComponent>,
    private _apiservice: ApiService,
    private dialog: MatDialog,
    private _dataShare: DataSharingService,
    private authService: JwtauthService
  ) {
    this.today = new Date();
  }

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    //country
    this.countries = countrycitystatejson.getCountries();
    this.CountryfilteredOptions = this.firstFormGroup.controls[
      'country'
    ].valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this.countryfilter(name as string)
          : this.countries.slice();
      })
    );

    this._dataShare.share_select_to_list_participants_data.subscribe((res) => {
      // console.log(res?.length, 'length');

      if (res && res.length > 0 && res.length < 21) {
        this.step3Complete = true;
        // console.log('Condition met. step3Complete set to true.');
      } else {
        this.step3Complete = false;
        // console.log('Condition not met. step3Complete set to false.');
      }
    });

    this._dataShare.share_select_to_list_volunteers_data.subscribe((res) => {
      if (res && res.length > 0 && res.length < 4) {
        this.step4Complete = true;
        // console.log('Condition met. step3Complete set to true.');
      } else {
        this.step4Complete = false;
        // console.log('Condition not met. step3Complete set to false.');
      }
    });
    //cdk editor:
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf',

      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        {
          name: 'paragraph',
          // groups: ['colors'],
        },
      ],
      removeButtons:
        'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Unlink,Anchor,Flash,orizontalRule,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About',
    };

    // //participants:
    // this._dataShare.share_select_to_list_participants_data.subscribe(
    //   (res) => {
    //     console.log(res.length,'part lenth');

    //     if (res.length > 0) {
    //       this.step3Complete = !this.step3Complete;
    //     }
    //   }
    // );

    // // //Volunteer:
    // this._dataShare.share_select_to_list_volunteers_length_data.subscribe(
    //   (res) => {
    //     if (res > 0) {
    //       this.step4Complete = !this.step4Complete;
    //     }
    //   }
    // );
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  popup: any;
  step1btnDisable: boolean = true;
  getCountryCode(e: any) {
    const lowercaseCode = e.shortName.toLowerCase();
    console.log(lowercaseCode);

    if (e.shortName != undefined) {
      this._apiservice
        .getTourBasedonCountryCodeScheduleTour(lowercaseCode, this.customer_id)
        .subscribe((res) => {
          console.log(res, 'ress`');

          this.obtainedCity = res.data;
        });
    }
  }
  ress: any;
  com: any;
  rosedatesToHighlight: any[] = [];
  getCampIdLocation(e: any) {
    // console.log(e, 'e,e');
    if (e != undefined) {
      this.step1Complete = true;
    }

    this.obtainedTourID = e.industrial_tour_site_id;
    this.map_location_display_name = e.map_location_display_name;
    this.address_line_1 = e.address_line_1;
    this.address_line_2 = e.address_line_2;

    this._dataShare.shareIndustrialTripIdSchdeuleNew(this.obtainedTourID);
    this._dataShare.shareMapDatascheduleNew(e);

    // this.popup = e.industrial_tour_site_name;
    if (this.obtainedTourID != undefined) {
      this.step1btnDisable = false;
      this._apiservice
        .getSelectedTourDataScheduleTour(this.obtainedTourID)
        .subscribe((res) => {
          this.MakeEasyTourData = res.data[0];

          if (this.MakeEasyTourData != undefined) {
            // this.industrial_tour_site_name =
            //   this.MakeEasyTourData.industrial_tour_site_name;
            this.transport_info_from_airport_to_tour_site =
              this.MakeEasyTourData.transport_info_from_airport_to_tour_site;
            this.transport_info_from_bus_stop_to_tour_site =
              this.MakeEasyTourData.transport_info_from_bus_stop_to_tour_site;
            this.transport_info_from_railway_station_to_tour_site =
              this.MakeEasyTourData.transport_info_from_railway_station_to_tour_site;

            this.no_of_participants_allowed_per_tour =
              this.MakeEasyTourData.no_of_participants_allowed_per_tour;
            this.no_of_volunteers_allowed_per_tour =
              this.MakeEasyTourData.no_of_volunteers_allowed_per_tour;
            this.minimum_age_permissible_of_visitors =
              this.MakeEasyTourData.minimum_age_permissible_of_visitors;
            this.edu_travel_arrangements_info =
              this.MakeEasyTourData.edu_customer_travel_arrangements_info;
            this.firstFormGroup.controls['cdk_editor'].setValue(
              this.edu_travel_arrangements_info
            );
            //For Food
            this.food_availability = this.MakeEasyTourData.food_availability;

            if (this.food_availability == 1) {
              this.food_availability_show =
                'Available - Participants do not have to make their own arrangements.';
            } else {
              this.food_availability_show =
                'Not Available - Participants have to make their own arrangements.';
            }

            //For Dress Code:
            this.dress_code_options = [
              { value: 1, label: 'Formal' },
              { value: 2, label: 'Casual' },
            ];
            this.dress_code = this.MakeEasyTourData.dress_code;
            if (this.dress_code == 1) {
              this.selectedDressCode = 1; // Set the default value for Formal
            } else {
              this.selectedDressCode = 2; // Set the default value for Casual
            }

            //For FootWear:
            this.foot_wear_options = [
              { value: 0, label: 'Shoes Required' },
              { value: 1, label: 'Shoes Not Required' },
            ];
            this.foot_wear =
              this.MakeEasyTourData.is_foot_wear_provided_by_the_company;
            if (this.foot_wear === 0) {
              this.selectedFootWear = 0; // Set the default value for Foot Wear
            } else {
              this.selectedFootWear = 1; // Set the default value for Foot Wear
            }

            //For FootWear Yes or No:
            this.foot_wear_optionsYN = [
              { value: 0, label: 'No' },
              { value: 1, label: 'Yes' },
            ];
            this.foot_wearYN =
              this.MakeEasyTourData.is_foot_wear_provided_by_the_company;
            if (this.foot_wearYN === 0) {
              this.selectedFootWearYN = 0; // Set the default value for Foot Wear
            } else {
              this.selectedFootWearYN = 1; // Set the default value for Foot Wear
            }

            //For safety hats:
            this.safety_hats_options = [
              { value: 0, label: 'Not Required' },
              { value: 1, label: 'Required' },
            ];
            this.safety_hats =
              this.MakeEasyTourData.are_safety_hats_provided_by_the_company;
            if (this.safety_hats === 0) {
              this.selectedsafetyHats = 0; // Set the default value for Safety Hats
            } else {
              this.selectedsafetyHats = 1; // Set the default value for Safety Hats
            }

            this._apiservice
              .getcalenderColor(
                this.country_code,
                this.customer_id,
                this.obtainedTourID
              )
              .subscribe((res) => {
                this.ress = res.data;

                for (let i = 0; i < this.ress.length; i++) {
                  this.com = this.ress[i].common_holidays;
                }

                for (let p = 0; p < this.com.length; p++) {
                  const element = this.com[p];
                  this.rosedatesToHighlight.push(element.common_holiday_date);
                }
              });
            //For safety hats Yes or NO:
            this.safety_hats_optionsYN = [
              { value: 0, label: 'No' },
              { value: 1, label: 'Yes' },
            ];
            this.safety_hatsYN =
              this.MakeEasyTourData.are_safety_hats_provided_by_the_company;
            if (this.safety_hatsYN === 0) {
              this.selectedsafetyHatsYN = 0; // Set the default value for Safety Hats
            } else {
              this.selectedsafetyHatsYN = 1; // Set the default value for Safety Hats
            }

            this.industrial_tour_check_in_time = this.formatTime(
              this.MakeEasyTourData.industrial_tour_check_in_time
            );
            this.industrial_tour_check_out_time = this.formatTime(
              this.MakeEasyTourData.industrial_tour_check_out_time
            );

            this.industrial_tour_check_in_timeAMPM = this.formatTimeAMPM(
              this.MakeEasyTourData.industrial_tour_check_in_time
            );
            this.industrial_tour_check_out_timeAMPM = this.formatTimeAMPM(
              this.MakeEasyTourData.industrial_tour_check_out_time
            );
          }
        });

      //Tour ratings
      this._apiservice
        .getSelectedTourRatings(
          this.country_code,
          this.customer_id,
          this.obtainedTourID
        )
        .subscribe((res) => {
          this.faculty_rating_value = res.data[0].performance_rating;

          console.log(this.faculty_rating_value, 'rating');

          if (this.faculty_rating_value == 0) {
            this.ratingsData = 0;
          } else if (this.faculty_rating_value == 1) {
            this.ratingsData = 3;
          } else {
            this.ratingsData = 5;
          }
        });
    }
  }

  selected_date: any;
  selected_date_Format: any;

  onSelect(e: any) {
    console.log(e.value._d, 'event object');
    const selectedDate = DateTime.fromJSDate(e.value._d);

    console.log(selectedDate, 'selected date');

    // this.selected_date = DateTime.fromJSDate(e.value._d).toFormat(
    //   'yyyy-MM-dd HH:mm:ss'
    // );
    // Get the current time
    const currentTime = DateTime.local();

    // Combine the date and time
    const selectedDateTime = selectedDate.set({
      hour: currentTime.hour,
      minute: currentTime.minute,
      second: currentTime.second,
      millisecond: currentTime.millisecond,
    });

    // Format the combined date and time
    this.selected_date = selectedDateTime.toFormat('yyyy-MM-dd HH:mm:ss');

    // Log the event object
    console.log(this.selected_date, 'event object');
    // const formattedDate = format(combinedDateTime, 'dd MMM yyyy');
    this.selected_date_Format = DateTime.fromJSDate(e.value._d).toFormat(
      'yyyy-MM-dd'
    );
    this.step2Complete = true;
  }

  formValues: any;

  onAddressFormSubmit({ value, valid }: { value: any; valid: boolean }) {
    this.formValues = value;
  }

  dateClass = (date: Date): MatCalendarCellCssClasses | any => {
    const momentDate = moment(date);
    const jsDate = momentDate.toDate();

    // Disable past dates
    if (momentDate.isBefore(moment(), 'day')) {
      return 'disabled-past-date';
    }

    // Check if the date is in the rosedatesToHighlight array
    const isHighlighted = this.rosedatesToHighlight
      .map((strDate: any) => moment(strDate).format('YYYY-MM-DD'))
      .some((d: any) => moment(d).isSame(jsDate, 'day'));

    // If the date is not in the rosedatesToHighlight array, disable it
    if (!isHighlighted) {
      return 'disabled-date';
    }

    // If the date is in the rosedatesToHighlight array, highlight it
    return 'rose-custom-date-class';
  };

  ObtainedParticipants: any;
  ObtainedVolunteer: any;
  schdeuleTour() {
    //participants:
    this._dataShare.share_select_to_list_participants_data.subscribe((res) => {
      this.ObtainedParticipants = res;
    });

    //Volunteer:
    this._dataShare.share_select_to_list_volunteers_data.subscribe((res) => {
      this.ObtainedVolunteer = res;
    });

    let body: any = {
      participantsDetails: this.ObtainedParticipants,
      volunteerDetails: this.ObtainedVolunteer,
    };

    console.log(this.selected_date);
    

    this._apiservice
      .scheduleTourInsert(
        this.country_code,
        this.customer_id,
        this.user_id_login,
        this.selected_date,
        this.obtainedTourID,
        body
      )
      .subscribe((ress) => {
        console.log(ress, 'inserted REsponse');
        this.onNoClick();
      });
  }
  //* ------------------------------ Helper Function -----------------------*//
  step1Complete: boolean = false;
  step2Complete = false;
  step3Complete = false;
  step4Complete = false;
  step5Complete = false;

  // ngDoCheck(): void {
  //   setTimeout(() => {
  //     this._dataShare.share_select_to_list_participants_data.subscribe(
  //       (res) => {
  //         console.log(res.length, 'ngdocheck');
  //         // if (res.length) {

  //         // }
  //       }
  //     );
  //   }, 10000);
  // }
  OpenCalander() {
    const dialogRef = this.dialog.open(CalanderPoupComponent, {
      width: '400px',
      height: '500px',
      disableClose: true,
      // data: this.selectCategory(),
      data: this.MakeEasyTourData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  // Filter by using Country
  displayCountry(user: any) {
    return user && user.name ? user.name : '';
  }
  private countryfilter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.countries.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  private formatTime(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    const formattedHours = parseInt(hours) % 12 || 12;
    const period = parseInt(hours) < 12 ? 'AM' : 'PM';
    return `${formattedHours}:${minutes} ${period}`;
  }
  formatTimeAMPM(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    // Use Intl.DateTimeFormat to format the time in the desired format
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);

    return formattedTime;
  }
  //map
  let_data: any;
  lng_data: any;
  topLeft: any;
  bottomLeft: any;
  topRight: any;
  bottomRight: any;
  sameTopLeft: any;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
      }),
    ],
    zoom: 10,
    center: { lat: 28.626137, lng: 79.821603 },
  };

  initialMarkers: any[] = [];

  initMarkers() {
    for (let index = 0; index < this.initialMarkers.length; index++) {
      const data = this.initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`${this.popup}`);
      this.map.flyTo(data.position);
      this.markers.push(marker);

      // Polygon
      var polygon: any[] = [
        [this.topLeft['x'], this.topLeft['y']],
        [this.bottomLeft['x'], this.bottomLeft['y']],
        [this.topRight['x'], this.topRight['y']],
        [this.bottomRight['x'], this.bottomRight['y']],
        [this.sameTopLeft['x'], this.sameTopLeft['y']],
      ];
      L.rectangle(polygon, {
        color: 'yellow',
        weight: 5,
        fillColor: 'blue',
      }).addTo(this.map);
    }
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  onMapReady($event: any) {
    this.map = $event;
    this.initMarkers();
    this.getCurrentPosition().subscribe((position: any) => {
      this.map.flyTo([position?.latitude, position?.longitude], 14);

      const iconRetinaUrl = 'assets/marker-icon-2x.png';
      const iconUrl = 'assets/marker-icon.png';
      const shadowUrl = 'assets/marker-shadow.png';
      const iconDefault = icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });
      Marker.prototype.options.icon = iconDefault;

      // const marker = L.marker(
      //   [position.latitude, position.longitude],
      //   {}
      // ).bindPopup('Current Location');
      // marker.addTo(this.map);
    });
  }

  setView() {
    this.getCurrentPosition().subscribe((position: any) => {
      this.map.flyTo([position.latitude, position.longitude], 14);

      const iconRetinaUrl = 'assets/marker-icon-2x.png';
      const iconUrl = 'assets/marker-icon.png';
      const shadowUrl = 'assets/marker-shadow.png';
      const iconDefault = icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });
      Marker.prototype.options.icon = iconDefault;

      // const marker = L.marker(
      //   [position.latitude, position.longitude],
      //   {}
      // ).bindPopup('Current Location');
      // marker.addTo(this.map);
    });
  }

  mapClicked($event: any) {}

  markerClicked($event: any, index: number) {}

  markerDragEnd($event: any, index: number) {}

  //! -------------------------------  End  --------------------------------!//
}
