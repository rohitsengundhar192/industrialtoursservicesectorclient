import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/shared/dialogs/login/login.component';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';

@Component({
  selector: 'app-schedule-tours-and-book-tickets',
  templateUrl: './schedule-tours-and-book-tickets.component.html',
  styleUrls: ['./schedule-tours-and-book-tickets.component.scss'],
})
export class ScheduleToursAndBookTicketsComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  hidecontent: boolean = false;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  user_registration_login_approval_status: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public dialog: MatDialog,
    private _headerTitle: HeaderTitleService,
    private authService: JwtauthService,
    private data_sharing: DataSharingService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    this._headerTitle.setTitle('Schedule Industrial Tours');
    this.data_sharing.update_showTop_data(false);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    this.user_registration_login_approval_status =
      token.user.user_registration_login_approval_status;
    this.data_sharing.updateAuditTrailData('schedule_tour_book_tickets');
    if (this.user_registration_login_approval_status === 3) {
      // console.log('showing html content');
      this.hidecontent = false; // Show the HTML content
    } else {
      // console.log('open dialogue');
      this.hidecontent = true; // Hide the HTML content

      const dialogRef = this.dialog.open(LoginComponent, {
        disableClose: true,
        height: 'auto',
        width: '350px',
        minWidth: '350px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.hidecontent = this.user_registration_login_approval_status !== 3;
      });
    }
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  ngOnDestroy() {
    if (this.data_sharing.updateAuditTrailData) {
      this.data_sharing.updateAuditTrailData(undefined);
    }
  }
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
