import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';

import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { IframeCommentsComponent } from '../../Components/iframe-comments/iframe-comments.component';
import { IframeResourcesComponent } from '../../Components/iframe-resources/iframe-resources.component';
import { IframeFlashcardComponent } from '../../Components/iframe-flashcard/iframe-flashcard.component';

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.scss'],
})
export class GuidelinesComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _headertitle: HeaderTitleService,
    private data_sharing: DataSharingService,
    private dialog: MatDialog
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    this._headertitle.setTitle(
      `Industrial / Service Sector Tours - Guidelines`
    );
    this.data_sharing.update_showTop_data(false);
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  resourcescomments(
    loginId: any,
    wow_class_stream_type: any,
    wow_class_stream_reference_id: any,
    customer_id: any
  ) {
    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: '350px',
      width: '682px',
      data: {
        login_id: loginId,
        wow_class_stream_type: wow_class_stream_type,
        wow_class_stream_reference_id: wow_class_stream_reference_id,
        customer_id: customer_id,
        access_token: 'token',
      },
    };
    const dialogRef = this.dialog.open(IframeCommentsComponent, config);
  }

  resourcesglobal(loginId: number) {
    console.log(loginId, 'log');

    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: '350px',
      width: '682px',
      data: { login_id: loginId, access_token: 'token' },
    };
    const dialogRef = this.dialog.open(IframeResourcesComponent, config);
  }

  //flashcard:
  flashglobal(loginId: number) {
    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: '350px',
      width: '682px',
      data: { login_id: loginId, access_token: 'token' },
    };
    const dialogRef = this.dialog.open(IframeFlashcardComponent, config);
  }
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
