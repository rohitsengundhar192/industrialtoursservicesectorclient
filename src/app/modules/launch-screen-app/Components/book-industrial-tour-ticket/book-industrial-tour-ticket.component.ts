import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/shared/dialogs/login/login.component';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';


@Component({
  selector: 'app-book-industrial-tour-ticket',
  templateUrl: './book-industrial-tour-ticket.component.html',
  styleUrls: ['./book-industrial-tour-ticket.component.scss']
})
export class BookIndustrialTourTicketComponent implements OnInit {

  //* --------------------------  Start  -----------------------------------*//

    //* -----------------------  Decorated Methods  --------------------------*//

    //* -----------------------  Variable Declaration  -----------------------*//
    hidecontent: boolean = false;
    country_code: any;
    customer_id: any;
    user_id_login: any;
    user_registration_login_approval_status:any;
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(public dialog: MatDialog,
      private _dataShare: DataSharingService,
      private _headerTitle: HeaderTitleService,
      private authService:JwtauthService,
      private data_sharing:DataSharingService) {}

    //* -------------------------  Lifecycle Hooks  --------------------------*//
    ngOnInit(): void {
      this._headerTitle.setTitle('Book Industrial Tour Tickets');
      this._dataShare.update_showTop_data(false);
      let one: any = localStorage.getItem('access_token');
      let token: any = this.authService.decodeJwtToken(one);
      this.country_code = token.user.country_code;
      this.customer_id = token.user.customer_id;
      this.user_id_login = token.user.user_id;
      this.user_registration_login_approval_status = token.user.user_registration_login_approval_status;
      this.data_sharing.updateAuditTrailData('book_camp');
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
