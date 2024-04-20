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
  selector: 'app-iframe-flashcard',
  templateUrl: './iframe-flashcard.component.html',
  styleUrls: ['./iframe-flashcard.component.scss']
})
export class IframeFlashcardComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('message') message!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('app_frame', { static: false }) appframe!: ElementRef;

  //* -----------------------  Variable Declaration  -----------------------*//

  // iframeSource: string = 'https://p22.getwow.community';
  iframeSource: string = 'http://192.168.29.245:4201/';
  country_code: any;
  customer_id: any=33;
  login_id: any;
  wow_assignment_id: any=1;
  wow_class_stream_reference_id: any=1;
  user_category_allocation_id: any=123;
  other_id: any;
  reply_from_entry_creator_or_collaborator_user_id: any=3;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _iframeService: IframeService,
    public _dialogRef: MatDialogRef<IframeFlashcardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customSpinnerService: CustomSpinnerService,
    private authService: JwtauthService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  async ngOnInit(): Promise<void> {
    // this.customer_id = 1
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    console.log(token, 'token');
    this.country_code = token.user.country_code;
    // this.customer_id = token.user.customer_id;
    // this.login_id = token.user.login_id;
    // this.wow_assignment_id = token.user.wow_assignment_id;
    // this.wow_class_stream_reference_id =
    //   token.user.wow_class_stream_reference_id;
    // this.user_category_allocation_id = token.user.user_category_allocation_id;
    // this.reply_from_entry_creator_or_collaborator_user_id =
    //   token.user.reply_from_entry_creator_or_collaborator_user_id;

    this.login_id = this.data.login_id;

    // this.country_id = token.user.country_code;
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
    // this._customSpinnerService.open();

    // Send a message to the child iframe
    iframe.addEventListener('load', (e) => {
      let body = {
        // access_token: localStorage.getItem('access_token'),
        dark: localStorage.getItem('dark') ?? false,
        // user_id: this.user_id,
        customer_id: this.customer_id,
        country_code: this.country_code,
        wow_assignment_id: this.wow_assignment_id,
        login_id: this.login_id,
        wow_class_stream_reference_id: this.wow_class_stream_reference_id,
        user_category_allocation_id: this.user_category_allocation_id,
        reply_from_entry_creator_or_collaborator_user_id:
          this.reply_from_entry_creator_or_collaborator_user_id,
      };
      console.log(body, 'body');

      this.sendMessage(body, String(this.iframeSource).toString());
      // this._customSpinnerService.close();
    });

    // Receive a message child to parent iframe
    window.addEventListener('message', (e) => {
      if (e.origin == this.iframeSource) {
        if (e.data) {
          this._iframeService.getIframeMessages(e.data);
        }
      }
    });
  }
  sendMessage(body: any, targetOrigin: string) {
    // Make sure you are sending a string, and to stringify JSON
    let iframeEl: any = this.appframe.nativeElement as HTMLIFrameElement;

    iframeEl.contentWindow.postMessage(JSON.stringify(body), targetOrigin);

    // iframeEl.contentWindow.postMessage(body, '*');
  }

  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
