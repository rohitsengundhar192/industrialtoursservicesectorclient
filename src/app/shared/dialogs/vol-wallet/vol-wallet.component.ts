import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CustomSpinnerService } from '../../services/custom-spinner/custom-spinner.service';
import { TokenService } from '../../services/api/token.service';
import { DataSharingService } from '../../services/data-sharing/data-sharing.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api/api.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs';

@Component({
  selector: 'app-vol-wallet',
  templateUrl: './vol-wallet.component.html',
  styleUrls: ['./vol-wallet.component.scss']
})
export class VolWalletComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('message') message!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('app_frame', { static: false }) appframe!: ElementRef;

  //* -----------------------  Variable Declaration  -----------------------*//

  iframeSource!: string;
  user_id: any;
  customer_id!: number;
  country_code!: string;
  dark!: string;
  app_name!: string;
  time_zone_iana_string!: string;
  debitamount: any;
  obtaineduserid: any;
  ticketprice: any;
  trip_id: any;
  camp_name: any = 'venkraft';
  selected_userid: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public _dialogRef: MatDialogRef<VolWalletComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data_get: any,
    private _customSpinnerService: CustomSpinnerService,
    private _tokenService: TokenService,
    private _datashare: DataSharingService,
    private _snack: MatSnackBar,
    private api_service: ApiService
  ) {}
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  async ngOnInit(): Promise<void> {
    this.iframeSource = environment.wow_wallet_pop_up;
    let jwt_token = localStorage.getItem('access_token');
    let token = this._tokenService.decodeJwtToken(jwt_token);
    // console.log(token, 'toke');

    this.customer_id = token.user.customer_id;
    this.country_code = token.user.country_code;
    this.user_id = token.user.user_id;
    this.app_name = token.user.customer_sub_domain_name;
    this.time_zone_iana_string = token.user.time_zone_iana_string;

    console.log(this.data_get, 'tass');
    this.selected_userid = this.data_get.userdetails.waiver_form_volunteer_user_id;
    console.log(this.selected_userid,'sel');
    

    // this._datashare.share_wow_wmount_id_data.subscribe((res) => {
    //   this.debitamount = res.getwowbalanceamount || res.getgetbalanceamount;
    //   // console.log(this.debitamount, 'deb');
    // });

    this._datashare.share_ticket_price_id_Data.subscribe((res) => {
      this.ticketprice = res;
      // console.log(this.ticketprice, 'tic price');
    });
    this._datashare.share_trip_id_data.subscribe((res) => {
      console.log(res, 'trip det');
      this.trip_id = res.industiral_tour_biz_customer_location_id;
      this.camp_name = res.camp_site_name;
    });
  }
  ngAfterViewInit(): void {
    this.iframeLoaded();
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  wallet_transaction_id: any;
  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };
  // user_id_login: any = 7;

  // getcampid: any=1;
  //* --------------------------  Public methods  --------------------------*//

  iframeLoaded() {
    let iframe: HTMLIFrameElement = this.appframe
      .nativeElement as HTMLIFrameElement;
    iframe.src = String(this.iframeSource).toString();
    this._customSpinnerService.open();

    let jwt_token = localStorage.getItem("access_token");
    let is_dark = localStorage.getItem("dark") == "true" ? true : false;

    // Send a message to the child iframe
    iframe.addEventListener("load", (e) => {
      let value: any = {

        // ------------------  static details ------------------------
        access_token: jwt_token,
        dark: is_dark,
        googleTranslate: localStorage.getItem("googleTranslate"),
        payment_type: 3, //payment type
        transaction_by_app_id: 7, // app id
        transaction_app_type: 0, // app type

        // ---------------  purchase wow details ---------------------

        debit_entry_amount:  parseInt(this.ticketprice), //amount
        transaction_type: 15,
        
        // ---------------- wow app details ---------------------------
        purchase_wow_id: this.trip_id, //camp id
        purchase_wow_name: 'Venkraft Paper Mill - 1',
        purchase_ticket_type: 1, //make dynamic ticket based on wow or volunteer
        purchase_for_user_id: this.selected_userid, //make user id dynamic

      };      

      this.sendMessage(value, String(this.iframeSource).toString());
      this._customSpinnerService.close();
    });

    // Receive a message child to parent iframe
    window.addEventListener("message", (e) => {
      if (e.origin === this.iframeSource) {
        if (e.data) {
          const transaction_details = JSON.parse(e.data);
          const is_iframe_closed = JSON.parse(e.data);
          if (is_iframe_closed.is_iframe_closed == true) {
            this._dialogRef.close();
          }
        }
      }
    });
  }

  closeDialog() {
    this._dialogRef.close({ event: 'close' });
  }

  sendMessage(body: any, targetOrigin: string) {
    // Make sure you are sending a string, and to stringify JSON
    let iframeEl = this.appframe.nativeElement as HTMLIFrameElement;
    iframeEl.contentWindow?.postMessage(JSON.stringify(body), targetOrigin);
    // iframeEl.contentWindow.postMessage(body, '*');
  }

  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
