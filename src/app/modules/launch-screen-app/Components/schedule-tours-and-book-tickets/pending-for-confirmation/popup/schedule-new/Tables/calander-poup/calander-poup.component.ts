import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';

@Component({
  selector: 'app-calander-poup',
  templateUrl: './calander-poup.component.html',
  styleUrls: ['./calander-poup.component.scss'],
})
export class CalanderPoupComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup = this._formBuilder.group({
    calender: ['', Validators.required],
  });
  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  selected!: Date | null;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  industrial_tour_site_id: any = 1;
  ress: any;
  com: any;
  datesToHighlight: any[] = [];
  minDate!: Date;
  reddatesToHighlight: any[] = [];
  greendatesToHighlight: any[] = [];
  rosedatesToHighlight: any[] = [];
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<CalanderPoupComponent>,
    private _apiService: ApiService,
    private authService: JwtauthService,
    private _formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    const today = this.dateAdapter.today();
    const tomorrow = this.dateAdapter.addCalendarDays(today, 1); // Get the day after today
    this.minDate = tomorrow;
  }

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this._apiService
      .getcalenderColor(
        this.country_code,
        this.customer_id,
        this.industrial_tour_site_id
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

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//

  //* ------------------------------ Helper Function -----------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  //! -------------------------------  End  --------------------------------!//
}