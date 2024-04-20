import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';
import { Observable, map, startWith, Subscriber } from 'rxjs';
// @ts-ignore
import * as countrycitystatejson from 'countrycitystatejson';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CKEditorComponent } from 'ng2-ckeditor';
import * as moment from 'moment';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import * as Leaflet from 'leaflet';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { format } from 'date-fns';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { CalanderPoupComponent } from '../schedule-new/Tables/calander-poup/calander-poup.component';
import { DatePipe, formatDate } from '@angular/common';
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
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.scss'],
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
export class ScheduleEditComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup = this._formBuilder.group({
    city: [''],
    activity1: ['', Validators.required],
    country: ['', Validators.required],
    dressCode: [''],
    footWear: [''],
    cdk_editor: new FormControl(),
    dateTime: [''],
    location: new FormControl(),
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
    patchdate: ['', Validators.required],
  });
  isLinear = false;
  //* -----------------------  Decorated Methods  --------------------------*//

  countries: any[] = [];
  CountryfilteredOptions!: any;

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
  industrial_tour_trip_id: any;
  industrial_tour_trip_schedule_id: any;
  ticket_for_industrial_tour_site_id: any;
  pin_code: any;
  state_province: any;
  city_district_country: any;
  btnDisabled: boolean = true;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _formBuilder: FormBuilder,
    public loginDialogRef: MatDialogRef<ScheduleEditComponent>,
    private _apiservice: ApiService,
    private dialog: MatDialog,
    private _dataShare: DataSharingService,
    private authService: JwtauthService,
    private _datashare: DataSharingService,
    private cdr: ChangeDetectorRef,

    public dialogRef: MatDialogRef<ScheduleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any
  ) {}

  NGObtainedTripID: any;
  NGObtainedCountryCode: any;
  NGObtainedDate: any;
  locationnamefind: any;
  selectedatetoshow: any;
  ress: any;
  com: any;
  rosedatesToHighlight: any[] = [];
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    this.locationname();
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
    //participants:
    this._dataShare.share_edit_select_to_list_participants_data.subscribe(
      (res) => {
        // if (res?.length > 0) {
        //   this.step3Complete = true;
        // }

        if (res && res.length > 0 && res.length < 21) {
          this.step3Complete = true;
        } else {
          this.step3Complete = false;
        }
      }
    );

    //Volunteer:
    this._dataShare.share_edit_select_to_list_volunteers_data.subscribe(
      (res) => {
        // if (res?.length > 0) {
        //   this.step4Complete = true;
        // }
        if (res && res.length > 0 && res.length < 4) {
          this.step4Complete = true;
        } else {
          this.step4Complete = false;
        }
      }
    );
    console.log(this.editdata, 'edit');

    if (this.editdata.ticket_for_industrial_tour_site_id != null) {
      this.firstFormGroup.controls['location'].patchValue(
        this.editdata.ticket_for_industrial_tour_site_id
      );
      this.location_id_find = this.editdata.ticket_for_industrial_tour_site_ids;

      // this.disable_location = false;
      this.selected_location = this.firstFormGroup.controls['location'].value;
    } else {
      this.firstFormGroup.controls['location'].patchValue('null');

      this.selected_location = null;
      this.location_id_find = null;
    }

    this.map_location_display_name = this.editdata.map_location_display_name;

    this.NGObtainedTripID = this.editdata.ticket_for_industrial_tour_site_id;
    this.NGObtainedCountryCode = this.editdata.customer_country_code;
    this.NGObtainedDate = this.editdata.trip_datetime;

    this.industrial_tour_trip_schedule_id =
      this.editdata.industrial_tour_trip_schedule_id;
    this.ticket_for_industrial_tour_site_id =
      this.editdata.ticket_for_industrial_tour_site_id;

    this._dataShare.shareIndustrialTripIdSchdeuleEdit(this.editdata);

    this.firstFormGroup.controls['country'].setValue(
      this.NGObtainedCountryCode
    );
    // this.firstFormGroup.controls['city'].patchValue(this.NGObtainedTripID);

    this.firstFormGroup.controls['city'].patchValue(this.NGObtainedTripID);
    this.location_id_find = this.NGObtainedTripID;

    this._apiservice
      .getMapLocationName(
        this.country_code,
        this.customer_id,
        this.NGObtainedTripID
      )
      .subscribe((res) => {
        this.address_line_1 = res.data[1].address_line_1;
        this.address_line_2 = res.data[1].address_line_2;
        this.city_district_country = res.data[1].city_district_country;
        this.state_province = res.data[1].state_province;
        this.pin_code = res.data[1].pin_code;
      });

    //get calander color
    this._apiservice
      .getcalenderColor(
        this.country_code,
        this.customer_id,
        this.NGObtainedTripID
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

        console.log(this.rosedatesToHighlight, 'rose');
      });

    // Set Date:
    const date = new Date(this.NGObtainedDate);
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US'); // Adjust the format
    if (formattedDate != undefined) {
      this.secondForm.controls['patchdate'].patchValue(formattedDate);
      this.selectedatetoshow = formattedDate;
      this.step2Complete = !this.step2Complete;
    }
    this.industrial_tour_trip_id = this.editdata.industrial_tour_trip_id;
    //Get Trip:
    if (this.NGObtainedCountryCode != undefined) {
      this._apiservice
        .getTourBasedonCountryCodeScheduleTour(
          this.NGObtainedCountryCode,
          this.customer_id
        )
        .subscribe((res) => {
          this.obtainedCity = res.data;
        });
    }

    //Get data from Trip Data:

    this._apiservice
      .getSelectedTourDataScheduleTour(this.NGObtainedTripID)
      .subscribe((res) => {
        this.MakeEasyTourData = res.data[0];
        console.log(this.MakeEasyTourData, 'maketourdata');

        this._dataShare.shareMapDatascheduleNew(this.MakeEasyTourData);
        if (this.MakeEasyTourData != undefined) {
          this.step1Complete = !this.step1Complete;
          // this.industrial_tour_site_name =
          //   this.MakeEasyTourData.industrial_tour_site_name;
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

          //For safety hats Yes or NO:
          this.safety_hats_optionsYN = [
            { value: 0, label: 'Not Required' },
            { value: 1, label: 'Required' },
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

        this._apiservice
          .getSelectedTourRatings(
            this.country_code,
            this.customer_id,
            this.ticket_for_industrial_tour_site_id
          )
          .subscribe((res) => {
            this.faculty_rating_value = res.data[0].performance_rating;
            if (this.faculty_rating_value == 0) {
              this.ratingsData = 0;
            } else if (this.faculty_rating_value == 1) {
              this.ratingsData = 3;
            } else {
              this.ratingsData = 5;
            }
          });
      });

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

    if (this.editdata.visiting_customer_country_code != null) {
      this.firstFormGroup.controls['country'].patchValue(
        this.editdata.visiting_customer_country_code
      );
      this.location_id_find = this.editdata.visiting_customer_country_code;

      // this.disable_location = false;
      this.selected_location = this.firstFormGroup.controls['country'].value;
    } else {
      this.firstFormGroup.controls['country'].patchValue('null');

      this.selected_location = null;
      this.location_id_find = null;
    }

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

    //enable table next previous btn
    this._dataShare.share_edit_select_to_list_participants_data.subscribe(
      (res) => {
        if (res?.length > 0) {
          this.step3Complete = true;
        }
      }
    );

    this._dataShare.share_edit_select_to_list_volunteers_data.subscribe(
      (res) => {
        if (res?.length > 0) {
          this.step4Complete = true;
        }
      }
    );
  }
  location_id_find: any;
  selected_location: any;
  location_id(e: any) {
    this.location_id_find = e.location_id;
    this.selected_location = this.location_id_find;
  }

  ngAfterViewInit(): void {
    const result = this.countries.find((s: any) => s.name === 'India');
    if (result) {
      this.firstFormGroup.controls['country'].patchValue(result);

      // Manually trigger change detection
      this.cdr.detectChanges();
    }
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

  //* ----------------------------  APIs Methods  --------------------------*//
  locationname() {
    this._apiservice
      .getTourBasedonCountryCode(this.country_code, this.customer_id)
      .subscribe((res) => {
        this.locationnamefind = res.data;
      });
  }
  //* --------------------------  Public methods  --------------------------*//
  step1Complete = false;
  step2Complete = false;
  step3Complete = false;
  step4Complete = false;
  step5Complete = false;
  toggleStepComplete(stepNumber: number) {
    // Toggle the completion state based on the step number
    // if (stepNumber === 1) {
    //   this.step1Complete = !this.step1Complete;
    // } else if (stepNumber === 2) {
    //   this.step2Complete = !this.step2Complete;
    // } else if (stepNumber === 3) {
    //   this.step3Complete = !this.step3Complete;
    // } else if (stepNumber === 4) {
    //   this.step4Complete = !this.step4Complete;
    // } else if (stepNumber === 5) {
    //   this.step5Complete = !this.step5Complete;
    // }
  }
  popup: any;
  step1btnDisable: boolean = true;
  getCountryCode(e: any) {
    const lowercaseCode = e.shortName.toLowerCase();
    if (e.shortName != undefined) {
      this._apiservice
        .getTourBasedonCountryCodeScheduleTour(lowercaseCode, this.customer_id)
        .subscribe((res) => {
          this.obtainedCity = res.data;
        });
    }
  }

  address_line_1: any;
  address_line_2: any;
  map_location_display_name: any;
  getCampIdLocation(e: any) {
    this.obtainedTourID = e.industrial_tour_site_id;
    this.map_location_display_name = e.map_location_display_name;
    this.address_line_1 = e.address_line_1;
    this.address_line_2 = e.address_line_2;
    this.step1Complete = !this.step1Complete;
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
            this.step1Complete = !this.step1Complete;
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

            //For safety hats Yes or NO:
            this.safety_hats_optionsYN = [
              { value: 0, label: 'Not Required' },
              { value: 1, label: 'Required' },
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
          if (this.faculty_rating_value == 0) {
            this.ratingsData = 0;
          } else if (this.faculty_rating_value == 1) {
            this.ratingsData = 3;
          } else {
            this.ratingsData = 5;
          }
        });

      //get calander color:

      //get calander color
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

          console.log(this.rosedatesToHighlight, 'rose');
        });

      this._apiservice
        .getMapLocationName(
          this.country_code,
          this.customer_id,
          this.obtainedTourID
        )
        .subscribe((res) => {
          // console.log(res, 'NGObtainedTripIDobtained');
          this.address_line_1 = res.data[1].address_line_1;
          this.address_line_2 = res.data[1].address_line_2;
          this.city_district_country = res.data[1].city_district_country;
          this.state_province = res.data[1].state_province;
          this.pin_code = res.data[1].pin_code;
        });
    }
  }
  ratingsData: any = 0;
  faculty_rating_value: any;
  selected_date: any;
  selected_date_Format: any;
  // onSelect(e: any) {
  //   // Get the current time
  //   const currentTime = new Date();
  //   // Set the date part from the selected date and the time part from the current time
  //   const combinedDateTime = new Date(
  //     e.value.getFullYear(),
  //     e.value.getMonth(),
  //     e.value.getDate(),
  //     currentTime.getHours(),
  //     currentTime.getMinutes(),
  //     currentTime.getSeconds()
  //   );
  //   // Using date-fns to format the combined date and time
  //   this.selected_date = format(combinedDateTime, 'yyyy-MM-dd HH:mm:ss');
  //   const formattedDate = format(combinedDateTime, 'dd MMM yyyy');
  //   this.selected_date_Format = formattedDate;
  //   console.log(this.selected_date,this.selected_date_Format,'formD');

  //   this.selectedatetoshow = formattedDate;
  // }

  onSelect(e: any) {
    console.log(e.value._d, 'event object');

    const selectedDate = DateTime.fromJSDate(e.value._d);

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

    // this.selected_date = DateTime.fromJSDate(e.value._d).toFormat(
    //   'yyyy-MM-dd HH:mm:ss'
    // );
    // const formattedDate = format(combinedDateTime, 'dd MMM yyyy');
    this.selected_date_Format = DateTime.fromJSDate(e.value._d).toFormat(
      'yyyy-MM-dd'
    );
    this.selectedatetoshow = this.selected_date_Format;
    console.log(this.selected_date, this.selected_date_Format, 'formD');
    // this.step2Complete = true;
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
  schdeuleEditTour() {
    //participants:
    this._dataShare.share_edit_select_to_list_participants_data.subscribe(
      (res) => {
        this.ObtainedParticipants = res;
      }
    );

    //Volunteer:
    this._dataShare.share_edit_select_to_list_volunteers_data.subscribe(
      (res) => {
        this.ObtainedVolunteer = res;
      }
    );
    let seleteDateFormat: any = this.firstFormGroup.controls['dateTime'].value;
    // Create a Date object for the current date and time
    let currentDate = new Date();

    // Format the current time as a string
    let formattedCurrentTime = `${currentDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${currentDate
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    // Concatenate the selected date and the formatted current time
    let resultTime = `${seleteDateFormat} ${formattedCurrentTime}`;

    // this.selected_date = format(seleteDate, 'yyyy-MM-dd HH:mm:ss');

    let body: any = {
      participantsDetails: this.ObtainedParticipants,
      volunteerDetails: this.ObtainedVolunteer,
      // selected_date:
      //   this.selected_date || this.secondForm.controls['patchdate'].value,
      // obtainedTourID: this.obtainedTourID | this.industrial_tour_trip_schedule_id,
      // industrial_tour_trip_id: this.industrial_tour_trip_id,
    };

    console.log(body);
    

    this._apiservice
      .updateScheduleTour(
        this.country_code,
        this.customer_id,
        this.user_id_login,
        this.selected_date || this.secondForm.controls['patchdate'].value,
        this.industrial_tour_trip_schedule_id,
        this.ticket_for_industrial_tour_site_id,
        body
      )
      .subscribe((ress) => {
        // this.onNoClick();
      });
  }
  //* ------------------------------ Helper Function -----------------------*//
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
