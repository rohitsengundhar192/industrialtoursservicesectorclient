import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';

@Component({
  selector: 'app-request-confirmation',
  templateUrl: './request-confirmation.component.html',
  styleUrls: ['./request-confirmation.component.scss'],
})
export class RequestConfirmationComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  map_location_display_name: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  ticket_for_industrial_tour_site_id: any;
  Apidata: any;
  showdata:boolean=false;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _formBuilder: FormBuilder,
    public loginDialogRef: MatDialogRef<RequestConfirmationComponent>,

    public dialogRef: MatDialogRef<RequestConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public requestdata: any,
    private authService: JwtauthService,
    private _apiservice: ApiService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    console.log(this.requestdata, 'read');

    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    if (this.requestdata.ticket_for_industrial_tour_site_id != undefined) {
      this._apiservice
        .getRequestConfirmation(
          this.country_code,
          this.customer_id,
          this.requestdata.ticket_for_industrial_tour_site_id
        )
        .subscribe((res) => {
          this.Apidata = res.data;
          console.log(this.Apidata, 'reeee');
          this.showdata = true;
        });
    }

    this.map_location_display_name =
      this.requestdata.map_location_display_name[0];
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//

  //* ------------------------------ Helper Function -----------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  //! -------------------------------  End  --------------------------------!//
}
