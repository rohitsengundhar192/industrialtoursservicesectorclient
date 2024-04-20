import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';
import { Observable, Subject, Subscriber, map, startWith } from 'rxjs';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import * as Leaflet from 'leaflet';
// @ts-ignore
import * as countrycitystatejson from 'countrycitystatejson';
import { CKEditorComponent } from 'ng2-ckeditor';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { CephService } from 'src/app/shared/services/ceph/ceph.service';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { MatDialog } from '@angular/material/dialog';
import { TourCalanderPopupComponent } from './tour-calander-popup/tour-calander-popup.component';
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-tour-sites',
  templateUrl: './tour-sites.component.html',
  styleUrls: ['./tour-sites.component.scss'],
  // standalone:true
})
export class TourSitesComponent implements OnInit {
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

  //* -----------------------  Decorated Methods  --------------------------*//

  countries: any[] = [];
  CountryfilteredOptions!: Observable<Country[]>;

  city_1: Food[] = [
    {
      value: '0',
      viewValue:
        'Not Available - Participants have to make their own arrangements.',
    },
    {
      value: '1',
      viewValue:
        'Available - Participants do not have to make their own arrangements.',
    },
  ];
  //* -----------------------  Variable Declaration  -----------------------*//
  obtainedTour: any;
  obtainedTourID: any;
  [x: string]: any;
  videoTotalDuration: number = 0;
  playCurrentTime: number = 0;
  pickTimeStamp: number = 0;
  pickTimeStampTitle: any = null;
  pickTimeStampDescription: any = null;
  posterSource: string = '';
  changeCurrentTimeStamp!: number;
  loopdata: any;
  timeStampDetails: any;
  popup: any;
  @ViewChild('myckeditor') myckeditor!: CKEditorComponent;
  ckeConfig!: any;
  edu_travel_arrangements_info: any;
  readonlydata: boolean = true;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  convert_lower_case_country_code: any[] = [];
  rating3!: number;
  user_details_x: any;
  user_details_y: any;
  industrial_tour_site_id: any;
  map_location_display_name: any;
  private map: any;
  iconUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png';
  theMarker = {};
  location_id_find: any;
  address_line_1: any;
  address_line_2: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _formBuilder: FormBuilder,
    private _apiservice: ApiService,
    private _spiner: CustomSpinnerService,
    private _snackbar: SnackBarService,
    private _dataShare: DataSharingService,
    private _cephService: CephService,
    private _headerTitle: HeaderTitleService,
    private authService: JwtauthService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    this._headerTitle.setTitle('Industrial / Service Sector Tour Sites');
    this._dataShare.update_showTop_data(false);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    // this.getCurrentPosition();
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

    this.countries = countrycitystatejson.getCountries();
    this.CountryfilteredOptions = this.firstFormGroup.controls[
      'country'
    ].valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        // console.log(value,'calue');

        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this.countryfilter(name as string)
          : this.countries.slice();
      })
    );

    //open load
    this._apiservice
      .getTourBasedonCountryCode(this.country_code, this.customer_id)
      .subscribe((res) => {
        this.obtainedTour = res.data;

        this.popup = this.obtainedTour[0].industrial_tour_site_name;

        this.firstFormGroup.controls['city'].patchValue(
          this.obtainedTour[0].industiral_tour_biz_customer_location_id
        );
        this.location_id_find = this.obtainedTour[0].industrial_tour_site_id;
        if (this.obtainedTour[0].industrial_tour_site_id != undefined) {
          this._apiservice
            .getSelectedTourData(
              this.country_code,
              this.customer_id,
              this.obtainedTour[0].industrial_tour_site_id
            )
            .subscribe((res) => {
              this.MakeEasyTourData = res.data[0];
              console.log(this.MakeEasyTourData);

              if (this.MakeEasyTourData != undefined) {
                this.industrial_tour_site_name =
                  this.MakeEasyTourData.industrial_tour_site_name;
                this.address_line_1 = this.MakeEasyTourData.address_line_1;
                this.address_line_2 = this.MakeEasyTourData.address_line_2;
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
                  this.MakeEasyTourData.edu_travel_arrangements_info;

                this.firstFormGroup.controls['cdk_editor'].setValue(
                  this.obtainedTour[0].biz_customer_travel_arrangements_info
                );
                //For Food
                this.food_availability =
                  this.MakeEasyTourData.food_availability;

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
                this.foot_wear = this.MakeEasyTourData.foot_wear;

                if (this.foot_wear === 0) {
                  this.selectedFootWear = 0; // Set the default value for Foot Wear
                  this.selectedProvidedByCompany = true; // Set the default value for "Shall be provided by the company"
                } else {
                  this.selectedFootWear = 1; // Set the default value for Foot Wear
                  this.selectedProvidedByCompany = false; // Set the default value for "Shall be provided by the company"
                }

                //For Foowear provided by company
                this.foot_wear_options_provided_com = [
                  { value: 0, label: 'No' },
                  { value: 1, label: 'Yes' },
                ];
                this.foot_wear_provided_com =
                  this.MakeEasyTourData.is_foot_wear_provided_by_the_company;

                if (this.foot_wear_provided_com === 0) {
                  this.selectedFootWearProvidedCom = 0; // Set the default value for Foot Wear
                } else {
                  this.selectedFootWearProvidedCom = 1; // Set the default value for Foot Wear
                }

                //For safety hats:
                this.safety_hats_options = [
                  { value: 0, label: 'Not Required' },
                  { value: 1, label: 'Required' },
                ];
                this.safety_hats = this.MakeEasyTourData.safety_hats;

                if (this.safety_hats === 0) {
                  this.selectedsafetyHats = 0; // Set the default value for Safety Hats
                  this.selectedProvidedByCompany_hats = true; // Set the default value for "Shall be provided by the company"
                } else {
                  this.selectedsafetyHats = 1; // Set the default value for Safety Hats
                  this.selectedProvidedByCompany_hats = true; // Set the default value for "Shall be provided by the company"
                }

                //For safety hats provided by company
                this.safety_hats_options_provided_com = [
                  { value: 0, label: 'No' },
                  { value: 1, label: 'Yes' },
                ];
                this.safety_hats_provided_com =
                  this.MakeEasyTourData.are_safety_hats_provided_by_the_company;

                if (this.safety_hats_provided_com === 0) {
                  this.selectedsafetyHatsProvidedCom = 0; // Set the default value for Safety Hats
                } else {
                  this.selectedsafetyHatsProvidedCom = 1; // Set the default value for Safety Hats
                }

                this.industrial_tour_check_in_time = this.formatTime(
                  this.MakeEasyTourData.industrial_tour_check_in_time
                );
                this.industrial_tour_check_out_time = this.formatTime(
                  this.MakeEasyTourData.industrial_tour_check_out_time
                );
                // For Image Display:
                let loopdata: any[] = [];
                this.cloudIds =
                  this.MakeEasyTourData.industrial_tour_site_cloud_file_storage_ids;

                const cloudIdsArray = this.cloudIds;

                const cloudIdslood = cloudIdsArray.map((fileName: string) => {
                  const match = fileName.match(/(\d+)(\.[^.]+)?$/);
                  return match ? parseInt(match[1], 10) : NaN;
                });

                for (let q = 0; q < cloudIdslood.length; q++) {
                  const gallery_cloud_file_id = cloudIdslood[q];

                  if (isNaN(gallery_cloud_file_id)) {
                    console.error(
                      'Invalid file name format:',
                      cloudIdsArray[q]
                    );
                  } else {
                    this._cephService
                      .getFileMultipleFilesBasedOnKeymanage(
                        this.bucketName,
                        gallery_cloud_file_id
                      )
                      .subscribe((res) => {
                        for (let k = 0; k < res.length; k++) {
                          const element = res[k];

                          this.imagedata.push({
                            images: 'data:*;base64,' + res[k].file,
                            file_name: res[k].name,
                          });
                        }
                      });
                  }
                }
                this.popup = this.MakeEasyTourData.map_location_display_name;
                //For map :
                this._apiservice
                  .getMapData(this.obtainedTour[0].industrial_tour_site_id)
                  .subscribe({
                    next: (res) => {
                      console.log(res, 're');

                      // this.spinner.close();
                      this.user_details_x =
                        res.data[0].industrial_tour_site_gps_coordinates.x;
                      this.user_details_y =
                        res.data[0].industrial_tour_site_gps_coordinates.y;
                      this.map.flyTo(
                        [this.user_details_x, this.user_details_y],
                        9
                      );
                      L.circle(
                        [this.user_details_x, this.user_details_y],
                        50000
                      ).addTo(this.map);
                      this.popup = L.popup({
                        closeOnClick: false,
                        autoClose: false,
                      }).setContent(this.popup);
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
                      // this.spinner.close();
                      this._snackbar.success('Data Not Found');
                    },
                  });

                //For Ratings:
                this.faculty_rating_value = [];
                this._apiservice
                  .getSelectedTourRatings(
                    this.country_code,
                    this.customer_id,
                    this.obtainedTour[0].industrial_tour_site_id
                  )
                  .subscribe((res) => {
                    if (res.data[0]?.performance_rating != undefined) {
                      this.faculty_rating_value =
                        res.data[0]?.performance_rating;
                      if (this.faculty_rating_value == 0) {
                        this.ratingsData = 0;
                      } else if (this.faculty_rating_value == 1) {
                        this.ratingsData = 3;
                      } else {
                        this.ratingsData = 5;
                      }
                    }
                  });
              }
            });

          this._apiservice
            .createTableIndustrialTour(
              this.country_code,
              this.customer_id,
              this.obtainedTour[0].industrial_tour_site_id
            )
            .subscribe((res) => {});
        }
      });
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  getCountryCode(e: any) {
    const lowercaseCode = e.shortName.toLowerCase();
    if (lowercaseCode != undefined) {
      this._apiservice
        .getTourBasedonCountryCode(lowercaseCode, this.customer_id)
        .subscribe((res) => {
          this.obtainedTour = res.data;
        });
    }
  }
  MakeEasyTourData: any;
  industrial_tour_site_name: any;
  transport_info_from_airport_to_tour_site: any;
  transport_info_from_bus_stop_to_tour_site: any;
  transport_info_from_railway_station_to_tour_site: any;
  no_of_participants_allowed_per_tour: any;
  no_of_volunteers_allowed_per_tour: any;
  minimum_age_permissible_of_visitors: any;
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

  foot_wear_provided_com: any = [];
  selectedFootWearProvidedCom: any;
  foot_wear_options_provided_com: any;

  safety_hats_provided_com: any = [];
  selectedsafetyHatsProvidedCom: any;
  safety_hats_options_provided_com: any;

  selectedProvidedByCompany: any;
  selectedProvidedByCompany_hats: any;
  cloudIds: any = [];
  pushtable: any;
  bucketName: string = 'getwow-education';
  getCampIdLocation(e: any) {
    this.imagedata = [];
    this.obtainedTourID = e.industrial_tour_site_id;
    this.popup = e.industrial_tour_site_name;
    if (this.obtainedTourID != undefined) {
      this._apiservice
        .getSelectedTourData(
          this.country_code,
          this.customer_id,
          this.obtainedTourID
        )
        .subscribe((res) => {
          this.MakeEasyTourData = res.data[0];
          console.log(this.MakeEasyTourData);

          if (this.MakeEasyTourData != undefined) {
            this.industrial_tour_site_name =
              this.MakeEasyTourData.industrial_tour_site_name;
            this.transport_info_from_airport_to_tour_site =
              this.MakeEasyTourData.transport_info_from_airport_to_tour_site;
            this.transport_info_from_bus_stop_to_tour_site =
              this.MakeEasyTourData.transport_info_from_bus_stop_to_tour_site;
            this.transport_info_from_railway_station_to_tour_site =
              this.MakeEasyTourData.transport_info_from_railway_station_to_tour_site;
            this.address_line_1 = this.MakeEasyTourData.address_line_1;
            this.address_line_2 = this.MakeEasyTourData.address_line_2;
            this.no_of_participants_allowed_per_tour =
              this.MakeEasyTourData.no_of_participants_allowed_per_tour;
            this.no_of_volunteers_allowed_per_tour =
              this.MakeEasyTourData.no_of_volunteers_allowed_per_tour;
            this.minimum_age_permissible_of_visitors =
              this.MakeEasyTourData.minimum_age_permissible_of_visitors;
            this.edu_travel_arrangements_info =
              this.MakeEasyTourData.edu_travel_arrangements_info;

            this.firstFormGroup.controls['cdk_editor'].setValue(
              e.biz_customer_travel_arrangements_info
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
            this.foot_wear = this.MakeEasyTourData.foot_wear;

            if (this.foot_wear === 0) {
              this.selectedFootWear = 0; // Set the default value for Foot Wear
              this.selectedProvidedByCompany = true; // Set the default value for "Shall be provided by the company"
            } else {
              this.selectedFootWear = 1; // Set the default value for Foot Wear
              this.selectedProvidedByCompany = false; // Set the default value for "Shall be provided by the company"
            }

            //For Foowear provided by company
            this.foot_wear_options_provided_com = [
              { value: 0, label: 'No' },
              { value: 1, label: 'Yes' },
            ];
            this.foot_wear_provided_com =
              this.MakeEasyTourData.is_foot_wear_provided_by_the_company;

            if (this.foot_wear_provided_com === 0) {
              this.selectedFootWearProvidedCom = 0; // Set the default value for Foot Wear
            } else {
              this.selectedFootWearProvidedCom = 1; // Set the default value for Foot Wear
            }

            //For safety hats:
            this.safety_hats_options = [
              { value: 0, label: 'Not Required' },
              { value: 1, label: 'Required' },
            ];
            this.safety_hats = this.MakeEasyTourData.safety_hats;

            if (this.safety_hats === 0) {
              this.selectedsafetyHats = 0; // Set the default value for Safety Hats
              this.selectedProvidedByCompany_hats = true; // Set the default value for "Shall be provided by the company"
            } else {
              this.selectedsafetyHats = 1; // Set the default value for Safety Hats
              this.selectedProvidedByCompany_hats = true; // Set the default value for "Shall be provided by the company"
            }

            //For safety hats provided by company
            this.safety_hats_options_provided_com = [
              { value: 0, label: 'No' },
              { value: 1, label: 'Yes' },
            ];
            this.safety_hats_provided_com =
              this.MakeEasyTourData.are_safety_hats_provided_by_the_company;

            if (this.safety_hats_provided_com === 0) {
              this.selectedsafetyHatsProvidedCom = 0; // Set the default value for Safety Hats
            } else {
              this.selectedsafetyHatsProvidedCom = 1; // Set the default value for Safety Hats
            }

            this.industrial_tour_check_in_time = this.formatTime(
              this.MakeEasyTourData.industrial_tour_check_in_time
            );
            this.industrial_tour_check_out_time = this.formatTime(
              this.MakeEasyTourData.industrial_tour_check_out_time
            );
            // For Image Display:
            let loopdata: any[] = [];
            this.cloudIds =
              this.MakeEasyTourData.industrial_tour_site_cloud_file_storage_ids;

            const cloudIdsArray = this.cloudIds;

            const cloudIdslood = cloudIdsArray.map((fileName: string) => {
              const match = fileName.match(/(\d+)(\.[^.]+)?$/);
              return match ? parseInt(match[1], 10) : NaN;
            });

            for (let q = 0; q < cloudIdslood.length; q++) {
              const gallery_cloud_file_id = cloudIdslood[q];

              if (isNaN(gallery_cloud_file_id)) {
                console.error('Invalid file name format:', cloudIdsArray[q]);
              } else {
                this._cephService
                  .getFileMultipleFilesBasedOnKeymanage(
                    this.bucketName,
                    gallery_cloud_file_id
                  )
                  .subscribe((res) => {
                    for (let k = 0; k < res.length; k++) {
                      const element = res[k];

                      this.imagedata.push({
                        images: 'data:*;base64,' + res[k].file,
                        file_name: res[k].name,
                      });
                    }
                  });
              }
            }

            this.popup = this.MakeEasyTourData.map_location_display_name;
            //For map :
            this._apiservice.getMapData(this.obtainedTourID).subscribe({
              next: (res) => {
                console.log(res, 're');
                // this.spinner.close();
                this.user_details_x =
                  res.data[0].industrial_tour_site_gps_coordinates.x;
                this.user_details_y =
                  res.data[0].industrial_tour_site_gps_coordinates.y;
                this.map.flyTo([this.user_details_x, this.user_details_y], 9);
                L.circle(
                  [this.user_details_x, this.user_details_y],
                  50000
                ).addTo(this.map);
                this.popup = L.popup({
                  closeOnClick: false,
                  autoClose: false,
                }).setContent(this.popup);
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
                // this.spinner.close();
                this._snackbar.success('Data Not Found');
              },
            });

            //For Ratings:
            this.faculty_rating_value = [];
            this._apiservice
              .getSelectedTourRatings(
                this.country_code,
                this.customer_id,
                this.obtainedTourID
              )
              .subscribe((res) => {
                if (res.data[0]?.performance_rating != undefined) {
                  this.faculty_rating_value = res.data[0]?.performance_rating;
                  console.log(this.faculty_rating_value, 'value');

                  if (this.faculty_rating_value == 0) {
                    this.ratingsData = 0;
                  } else if (this.faculty_rating_value == 1) {
                    this.ratingsData = 3;
                  } else {
                    this.ratingsData = 5;
                  }
                }
              });
          }
        });

      this._apiservice
        .createTableIndustrialTour(
          this.country_code,
          this.customer_id,
          this.obtainedTourID
        )
        .subscribe((res) => {});
    }
  }
  faculty_rating_value: any = 0;
  ratingsData: any = 0;
  marker: any;
  geo_data: any;
  location: any;
  map_location_x: any;
  map_location_y: any;
  private formatTime(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    const formattedHours = parseInt(hours) % 12 || 12;
    const period = parseInt(hours) < 12 ? 'AM' : 'PM';
    return `${formattedHours}:${minutes} ${period}`;
  }

  openCalander() {
    const dialogRef = this.dialog.open(TourCalanderPopupComponent, {
      disableClose: true,
      width: '400px',
      height: '400px',
      data: this.obtainedTourID || this.location_id_find,
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
  //* ------------------------------ Helper Function -----------------------*//
  imagedata: any[] = [];
  changedata: any;
  changedata_1: any;
  currentIndex: number = 0;
  private nextButtonClick = new Subject<void>();
  Change_image_Data = this.nextButtonClick.asObservable();

  trackByFn(index: number, item: any): any {
    return index; // or item.id or a unique identifier if available
  }

  appnext() {
    // Logic for moving to the next image
    if (this.currentIndex < this.imagedata.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Wrap around to the first image if at the end
    }

    this.changedata = this.imagedata[this.currentIndex];
    // Create a new object with the updated data
    const updatedData = {
      images: this.changedata.images,
      file_name: this.changedata.file_name,
    };

    // Replace the existing object in the array with the new one
    this.imagedata[this.currentIndex] = updatedData;

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  appprev() {
    // Logic for moving to the previous image
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.imagedata.length - 1; // Wrap around to the last image if at the beginning
    }

    this.changedata_1 = this.imagedata[this.currentIndex];
    // Create a new object with the updated data
    const updatedData = {
      images: this.changedata_1.images,
      file_name: this.changedata_1.file_name,
    };

    // Replace the existing object in the array with the new one
    this.imagedata[this.currentIndex] = updatedData;

    // Manually trigger change detection
    this.cdr.detectChanges();
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
  formValues: any;

  onAddressFormSubmit({ value, valid }: { value: any; valid: boolean }) {
    this.formValues = value;
  }

  ngAfterViewInit() {
    this.initMap();

    const result = this.countries.find((s: any) => s.name === 'India');
    if (result) {
      this.firstFormGroup.controls['country'].patchValue(result);

      // Manually trigger change detection
      this.cdr.detectChanges();
    }
  }

  // private getCurrentPosition(): void {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const currentLatitude = position.coords.latitude;
  //         const currentLongitude = position.coords.longitude;

  //         // Add a marker at the current position
  //         const marker = L.marker([currentLatitude, currentLongitude], {
  //           draggable: false,
  //           icon: L.icon({
  //             iconSize: [25, 41],
  //             iconUrl: this.iconUrl,
  //             iconAnchor: [16, 37],
  //             popupAnchor: [-3, -24],
  //           }),
  //         }).addTo(this.map);

  //         // Add a circle around the current position
  //         L.circle([currentLatitude, currentLongitude], {
  //           radius: 500, // Radius in meters
  //           color: 'blue',
  //           fillColor: '#3388ff',
  //           fillOpacity: 0.4,
  //         }).addTo(this.map);

  //         // Fly to the current position
  //         // this.map.flyTo([currentLatitude, currentLongitude], 13);

  //         // Optionally, you can open a popup on the marker
  //         // const popup = L.popup({
  //         //   closeOnClick: false,
  //         //   autoClose: false,
  //         // }).setContent('Current Location');

  //         // marker.bindPopup(popup).openPopup();
  //       },
  //       (error) => {}
  //     );
  //   } else {
  //   }
  // }

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
  //! -------------------------------  End  --------------------------------!//
}
