import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { IframeService } from 'src/app/shared/services/iframe/iframe.service';

@Component({
  selector: 'app-iframe-comments',
  templateUrl: './iframe-comments.component.html',
  styleUrls: ['./iframe-comments.component.scss'],
})
export class IframeCommentsComponent implements OnInit, AfterViewInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('message') message!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('app_frame', { static: false }) appframe!: ElementRef;

  //* -----------------------  Variable Declaration  -----------------------*//

  // iframeSource: string = 'https://p18.getwow.community';
  //  iframeSource: string = 'https://p18.getwow.education/#/login-component';
  iframeSource: string = 'http://192.168.29.245:4201/';

  country_code: any;
  customer_id: any=102;
  login_id: any;
  wow_assignment_id: any;
  wow_class_stream_reference_id: any;
  user_category_allocation_id: any=13;
  other_id: any;
  reply_from_entry_creator_or_collaborator_user_id: any=3;
  wow_class_stream_type: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _iframeService: IframeService,
    public _dialogRef: MatDialogRef<IframeCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: JwtauthService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  async ngOnInit(): Promise<void> {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    console.log(token, 'token');
    this.country_code = token.user.country_code;
    // this.wow_assignment_id = token.user.wow_assignment_id;
    // this.user_category_allocation_id = token.user.user_category_allocation_id;
    // this.reply_from_entry_creator_or_collaborator_user_id =
    //   token.user.reply_from_entry_creator_or_collaborator_user_id;

    this.login_id = this.data.login_id;
    this.wow_class_stream_type = this.data.wow_class_stream_type;
    this.wow_class_stream_reference_id =
      this.data.wow_class_stream_reference_id;
    this.customer_id = this.data.customer_id;
  }
  ngAfterViewInit(): void {
    this.iframeLoaded();
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//

  iframeLoaded() {
    let iframe: HTMLIFrameElement = this.appframe
      .nativeElement as HTMLIFrameElement;
    iframe.src = String(this.iframeSource).toString();
    iframe.addEventListener('load', (e) => {
      let body = {
        dark: localStorage.getItem('dark') ?? false,
        customer_id: this.customer_id,
        country_code: this.country_code,
        wow_assignment_id: this.wow_assignment_id,
        login_id: this.login_id,
        wow_class_stream_reference_id: this.wow_class_stream_reference_id,
        user_category_allocation_id: this.user_category_allocation_id,
        reply_from_entry_creator_or_collaborator_user_id:
          this.reply_from_entry_creator_or_collaborator_user_id,
        wow_class_stream_type: this.wow_class_stream_type,
      };
      console.log(body, 'body');

      this.sendMessage(body, String(this.iframeSource).toString());
    });

    // Receive a message child to parent iframe
    window.addEventListener('message', (e) => {
      // console.log(e,'eee');
      
      if (e.origin == this.iframeSource) {
        if (e.data) {
          this._iframeService.getIframeMessages(e.data);
        }
      }
    });
  }
  sendMessage(body: any, targetOrigin: string) {
    let iframeEl: any = this.appframe.nativeElement as HTMLIFrameElement;
    iframeEl.contentWindow.postMessage(JSON.stringify(body), targetOrigin);
  }

  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
