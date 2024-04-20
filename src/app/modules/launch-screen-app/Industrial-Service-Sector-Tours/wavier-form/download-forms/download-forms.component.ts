import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserProfileComponentComponent } from 'src/app/shared/dialogs/user-profile-component/user-profile-component.component';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { AddParticipantsComponent } from '../popup/add-participants/add-participants.component';
import { EditParticipantsComponent } from '../popup/edit-participants/edit-participants.component';
import { DeleteConfirmDialogComponent } from 'src/app/shared/dialogs/delete-confirm-dialog/delete-confirm-dialog.component';
import { DatePipe } from '@angular/common';
import * as saveAs from 'file-saver';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-download-forms',
  templateUrl: './download-forms.component.html',
  styleUrls: ['./download-forms.component.scss'],
})
export class DownloadFormsComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup = new FormGroup({
    sel1: new FormControl('', Validators.required),
  });
  @ViewChild('reportContent') reportContent!: ElementRef;
  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  selectCategorylist: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  institutionname: any;
  institutionaddress1: any;
  institutionaddress2: any;
  city_district_county: any;
  state_province: any;
  customer_logo: any;
  customer_logo_data: any;
  customer_sub_domain_name: any;
  tables: any;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  obtainedUserCategoryId: any;
  rowvalues: any;
  addparticipantsdisable: boolean = true;
  btndisable = true;
  rowvalueshare: any;
  waiver_form_for_participant_user_id: any;
  btndisable1 = true;
  pipe = new DatePipe('en-US');
  today = new Date();
  changedDate: any;

  pdf_first_name: any;
  pdf_last_name: any;
  pdf_user_category: any;

  pdf_vol_fname: any;
  pdf_vol_lname: any;
  pdf_vol_caterogy: any;

  pdf_auth_fname: any;
  pdf_auth_lname: any;
  pdf_auth_caterogy: any;
  pdf_user_age: any;
  get_user_id: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public dialog: MatDialog,
    private authService: JwtauthService,
    private _tokenService: TokenService,
    private _spiner: CustomSpinnerService,
    private _apiservice: ApiService,
    private _snackbar: SnackBarService,
    private _dataShare: DataSharingService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    this.customer_sub_domain_name = token.user.customer_sub_domain_name;
    this.customer_logo_data = `${environment.ceph_URL}${token.user.country_code}-${token.user.customer_id}/${token.user.customer_sub_domain_name}-icon-128x128.png`;
    console.log(this.customer_logo_data, 'cus');

    this.institutionname = token.user.registered_educational_institution_name;
    this.institutionaddress1 = token.user.address_line_1;
    this.institutionaddress2 = token.user.address_line_2;
    this.city_district_county = token.user.city_district_county;
    this.state_province = token.user.state_province;
    this.customer_logo = ` ${environment.ceph_URL}/${token.user.country_code}-${token.user.customer_id}/${token.user.customer_sub_domain_name}-icon-128x128.png;`;

    if (this.country_code != undefined) {
      this.selectCategory();
    }
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  selectCategory() {
    this._spiner.open();
    this._apiservice
      .getDropDownCategory(this.country_code, this.customer_id)
      .subscribe((res) => {
        if (res.statusCode == 400) {
          this._snackbar.error(res.message);
        }
        if (res) {
          this._spiner.close();
        }
        this.selectCategorylist = res.data;
      });
  }

  passcategoryIdName: any;
  selectedCategoryData(e: any) {
    this.addparticipantsdisable = false;
    this.passcategoryIdName = e;
    this.rowvalues = e;
    this.obtainedUserCategoryId = e.user_category_id;
    this.btndisable1 = true;
    this.btndisable = true;

    this._spiner.open();
    this._apiservice
      .gettableDataDownloadForms(
        this.country_code,
        this.customer_id,
        this.obtainedUserCategoryId,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res) => {
        if (res.data == undefined) {
          // this._snackbar.success('Data Not Found');
          this.dataSource.data = [];
          this._spiner.close();
        }

        if (res.data.length != 0) {
          this._spiner.close();
          this.dataSource.data = res.data;
        } else {
          // this._snackbar.success('Data Not Found');
          this.dataSource.data = [];
          this._spiner.close();
        }
      });
  }

  //* --------------------------  Public methods  --------------------------*//
  radioClickTable(element: any) {
    this.btndisable = false;
    this.rowvalueshare = element;
    this.waiver_form_for_participant_user_id = element.user_id;
    if (element.volunteer_id != null && element.authorizer_id != null)
      this.btndisable1 = false;
    else this.btndisable1 = true;

    this._dataShare.shareDatatoPdf(this.rowvalueshare);

    this.pdf_first_name = this.rowvalueshare.first_name;
    this.pdf_last_name = this.rowvalueshare.last_name;
    this.pdf_user_category = this.rowvalueshare.category;
    this.pdf_vol_fname = this.rowvalueshare.voluteer_info.first_name;
    this.pdf_vol_lname = this.rowvalueshare.voluteer_info.last_name;
    this.pdf_vol_caterogy = this.rowvalueshare.voluteer_info.category_vol;

    this.pdf_auth_fname = this.rowvalueshare.auth.first_name;
    this.pdf_auth_lname = this.rowvalueshare.auth.last_name;
    this.pdf_auth_caterogy = this.rowvalueshare.auth.category_aut;

    this.pdf_user_age = this.rowvalueshare.age;
    this.addparticipantsdisable = true;
  }
  openAddParticipants() {
    const dialogRef = this.dialog.open(AddParticipantsComponent, {
      width: '400px',
      height: '600px',
      disableClose: true,
      data: this.passcategoryIdName,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.addparticipantsdisable = true;
      this.tables = [];
      this.btndisable = true;
      this._spiner.open();
      this._apiservice
        .gettableDataDownloadForms(
          this.country_code,
          this.customer_id,
          this.obtainedUserCategoryId,
          this.currentPage,
          this.pageSize
        )
        .subscribe((res) => {
          if (res.data == undefined) {
            this.dataSource.data = [];
            this._spiner.close();
          }

          if (res.data.length != 0) {
            this._spiner.close();
            this.dataSource.data = res.data;
          } else {
            this.dataSource.data = [];
            this._spiner.close();
          }
        });
    });
  }

  openEditvol() {
    const dialogRef = this.dialog.open(EditParticipantsComponent, {
      disableClose: true,
      width: '400px',
      height: '400px',
      data: this.rowvalueshare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.tables = [];
      this.btndisable = true;
      this._spiner.open();
      this._apiservice
        .gettableDataDownloadForms(
          this.country_code,
          this.customer_id,
          this.obtainedUserCategoryId,
          this.currentPage,
          this.pageSize
        )
        .subscribe((res) => {
          if (res.data == undefined) {
            // this._snackbar.success('Data Not Found');
            this.dataSource.data = [];
            this._spiner.close();
          }

          if (res.data.length != 0) {
            this._spiner.close();
            this.dataSource.data = res.data;
          } else {
            // this._snackbar.success('Data Not Found');
            this.dataSource.data = [];
            this._spiner.close();
          }
        });
      // this.btndisable1 = true;
      // if (result?.data != undefined) {

      // }
    });
  }
  deleteParticipants() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '150px',
      minWidth: '350px',
      data: this.rowvalues,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res == 1) {
        this._apiservice
          .deleteuserWavierDetails(
            this.country_code,
            this.customer_id,
            this.waiver_form_for_participant_user_id,
            this.user_id_login
          )
          .subscribe((res) => {
            this.btndisable = true;
            this.btndisable1 = true;
            this._spiner.open();
            this._apiservice
              .gettableDataDownloadForms(
                this.country_code,
                this.customer_id,
                this.obtainedUserCategoryId,
                this.currentPage,
                this.pageSize
              )
              .subscribe((res) => {
                if (res.data == undefined) {
                  // this._snackbar.success('Data Not Found');
                  this.dataSource.data = [];
                  this._spiner.close();
                }

                if (res.data.length != 0) {
                  this._spiner.close();
                  this.dataSource.data = res.data;
                } else {
                  // this._snackbar.success('Data Not Found');
                  this.dataSource.data = [];
                  this._spiner.close();
                }
              });
          });
      }
    });
  }
  changeFormat(_today: any) {
    let ChangedFormat = this.pipe.transform(this.today, 'yy-M-d hh:mm:ss ');
    this.changedDate = ChangedFormat;

    this.pdfDownload();
  }

  //* ------------------------------ Helper Function -----------------------*//
  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  displayedColumns: string[] = ['col1', 'col3', 'col4', 'col5'];
  onRowClicked(row: any) {}
  dataSource: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  rowValue: any[] = [];

  table_json_data: any;

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this._spiner.open();
    this._apiservice
      .gettableDataDownloadForms(
        this.country_code,
        this.customer_id,
        this.obtainedUserCategoryId,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res) => {
        if (res.data == undefined) {
          // this._snackbar.success('Data Not Found');
          this.dataSource.data = [];
          this._spiner.close();
        }

        if (res.data.length != 0) {
          this._spiner.close();
          this.dataSource.data = res.data;
        } else {
          // this._snackbar.success('Data Not Found');
          this.dataSource.data = [];
          this._spiner.close();
        }
      });
  }
  loadData() {}
  showPageSizeOptions: boolean = true;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.translateMatPaginator(this.paginator);
  }

  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'First';
    paginator._intl.itemsPerPageLabel = 'Records Per Page';
    paginator._intl.lastPageLabel = 'Last';
    paginator._intl.nextPageLabel = 'Next';
    paginator._intl.previousPageLabel = 'Previous';
  }

  exportReport(fileName: any): void {
    /* pass here the table id */
    let element = document.getElementById('excel_table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  onPrint() {
    window.print();
  }

  @ViewChild('pdfTable1', { static: false }) pdfTable1!: ElementRef;
  public downloadAsPDF11() {
    let pageIndex: number = Number(this.paginator.pageIndex);
    let pageSize: number = Number(this.paginator.pageSize);

    let currentPageEnd = pageSize * (pageIndex + 1);
    let currentPageStart = currentPageEnd - (pageSize - 1);
    // let category = this.cantegory_name;

    let jwt_token = localStorage.getItem('access_token');
    let token1 = this._tokenService.decodeJwtToken(jwt_token);
    // console.log(token1, 'token');

    let app_name: string = token1.user.registered_educational_institution_name;
    let districtStatePincode: string = `${token1.user.city_district_county} ${token1.user.state_province} ${token1.user.pin_code};`;
    let addressline1_adressline2: string = ` ${token1.user.address_line_1} ${token1.user.address_line_2};`;

    // let customer_logo = ` ${environment.ceph_URL}/${token1.user.country_code}-${token1.user.customer_id}/${token1.user.customer_sub_domain_name}-icon-128x128.png;`;
    let customer_logo = ` ${environment.ceph_URL}${token1.user.country_code}-${token1.user.customer_id}/${token1.user.customer_sub_domain_name}-icon-128x128.png`;
    // console.log(customer_logo, 'cust');

    const htmlToPrint =
      '' +
      '<style type="text/css">' +
      '.pageFooter {' +
      '    display: table-footer-group;' +
      '    counter-increment: page;' +
      '}' +
      '.pageFooter:after {' +
      '   content: "Page " counter(page)' +
      '}' +
      '</style>';
    var printContents = document.getElementById('pdfTable1')!.innerHTML;
    let popupWin: any = window.open(
      'Angular Large Table to pdf',
      '_blank',
      'width=768,height=auto'
    );

    popupWin.document.write(
      '<html><head>' +
        '<link rel="stylesheet" href="' +
        'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"/>' +
        '<style type="text/css">' +
        '.pageFooter {' +
        '    display: table-footer-group;' +
        '    counter-increment: page;' +
        '}' +
        '.pageFooter:after {' +
        '   content: "Page Number" counter(page)' +
        '}' +
        '.mat-table {' +
        '   width: 85%' +
        '}' +
        '.mat-radio-container {' +
        '   display: none' +
        '}' +
        '</style>' +
        `</head>

        <body onload="window.print()">
        <style>
        .mat-column-select{display:none}
        .matCellDef,th,td,img{
          height: 50px;
          width: 50px;
          padding-left:10px;

        }
        </style>

          <div style=" display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
          <img style="width:100px;height:100px" src="${customer_logo}" alt="app-logo" />
          <div style=" display: flex;flex-direction: column; width:100%">
            <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">GETster.TECH PVT.LTD</span>
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">VOLUNTEERs AND AUTHORIZERs DATA FOR USERs REGISTERED UNDER USER CATEGORY: </span>
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase"> </span>
            <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${
          this.paginator.length
        } ) ${
          this.filterValue.length >= 1
            ? `(Filtered by -" ${this.filterValue} )`
            : ''
        } (${DateTime.local().toFormat('yyyy-MM-dd TT')})</span>
          </div>
          </div>

          ` +
        printContents +
        '</body>' +
        `
          <footer style="position: fixed; bottom: 0; width: 100%;">
          <div style=" display: flex;flex-direction: column; width:100%; align-items:center">
          <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${addressline1_adressline2} </span>
          <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${districtStatePincode}</span>
          </div>
          </footer>
        ` +
        '</html>'
    );
    popupWin.document.close();
  }

  imageuser_id: any;
  isrowselectedfirstreply(e: any) {
    // console.log(e.user_id);

    this.imageuser_id = e.user_id;
  }
  openUserProfile() {
    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: 'auto',
      minHeight: 'auto',
      width: '320px',

      data: {
        user_id: this.imageuser_id,
        customer_id: this.customer_id,
        country_id: this.country_code,
      },
    };
    const dialogRef = this.dialog.open(UserProfileComponentComponent, config);
  }

  imageuser_id_vol: any;
  isrowselectedvolreply(e: any) {
    // console.log(e.user_id);

    this.imageuser_id_vol = e.user_id;
  }
  openUserProfilevol() {
    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: 'auto',
      minHeight: 'auto',
      width: '320px',

      data: {
        user_id: this.imageuser_id_vol,
        customer_id: this.customer_id,
        country_id: this.country_code,
      },
    };
    const dialogRef = this.dialog.open(UserProfileComponentComponent, config);
  }

  imageuser_id_auth: any;
  isrowselectedauthreply(e: any) {
    // console.log(e.user_id);

    this.imageuser_id_auth = e.user_id;
  }
  openUserProfileauth() {
    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: 'auto',
      minHeight: 'auto',
      width: '320px',

      data: {
        user_id: this.imageuser_id_auth,
        customer_id: this.customer_id,
        country_id: this.country_code,
      },
    };
    const dialogRef = this.dialog.open(UserProfileComponentComponent, config);
  }
  //! -------------------------------  End  --------------------------------!//

  content_data_article_1: any = ` <p style=" text-align: justify; font-size: 16px; line-height: 1.5">  &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;
  &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;       I (the above-mentioned Parent/Guardian) hereby give my permission for the above-mentioned participant to participate in the leadership, team building, and outdoor activities of the camps operated by getWOW.camp team/employees of GETster.TECH Pvt Ltd (Hereafter referred to as Camp Operator). I understand that these camp activities could include play and outdoor activities around and near the camp and walks in the woods where in there could be insects and slippery and jagged surfaces among other dangers and risks. I also understand that outdoor activities may occur in the hot sun and in the rain. I agree to see that the above-mentioned participant is appropriately attired for outdoor camp activities. In case there is overnight camping, I shall ensure that the above-mentioned participant carries a blanket, a night stay clothes / winter clothing, blanket/pillow, toiletries, a set of new clothes for the next day, etc. <br>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  Even though adequate measures are implemented by the Camp Operator in order to ensure the safety of all participants in various camp activities, I understand that there is an inconsequential likelihood of injury, and/or accident to the participants. In the event of any illness, injury, and/or accident, I authorize the Camp Volunteer / Camp Guide or any of the above-mentioned educational institution / Camp Operator employees to act on my behalf. They may approve any and all non-emergency or emergency treatments and are authorized to sign any and all medical releases or required form(s) on my behalf. In the event of an emergency, I understand that I will be notified of the situation as soon as practicable. I agree to pay any necessary expenses incurred in the medical treatment of my child, including, but not limited to all transportation costs to and from a medical facility, and, if necessary, transportation to my home or medical facility of choice.  <br>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

  </p>

  `;

  content_data_article_4: any = `
  <p style="text-align: justify; font-family: Roboto, Arial, sans-serif; font-size: 14px; margin-bottom: 10px;">
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; I (the above-mentioned Parent/Guardian) hereby give my permission for the above-mentioned participant to participate in the Outdoor Educational Camp operated by the getWOW.camp team/employees of GETster.TECH Pvt Ltd (Hereafter referred to as Camp Operator). I understand that these camp activities could include play and outdoor activities and participation involves inherent risks, including but not limited to accidents, injuries or sickness, caused by factors such as weather conditions, environmental factors, and physical activities.
  I agree to inform the participant to adhere to the safety guidelines and instructions provided by the camp organizers, staff and volunteers and be appropriately attired for outdoor camp activities. I will provide any medications, allergy information or health conditions that may affect my child's participation in the Camp.
</p>


<p style="text-align: justify; font-family: Roboto, Arial, sans-serif; font-size: 14px; margin-bottom: 10px;">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  In the event of any illness, injury, and/or accident, I authorize the Camp Volunteer / Camp Guide or any of the above-mentioned educational institution / Camp Operator employees to administer first aid, and seek medical attention or hospitalization as deemed necessary. I understand that every effort will be made to contact me in the event of an emergency and that I will be notified of the situation as soon as possible. I agree to pay any necessary expenses incurred in the process.
I understand that the above-mentioned educational institution / Camp Operator may, at their sole discretion, dismiss any camp participant for inappropriate, in-disciplinary, disrespectful, or dangerous behavior at any time. In this event, I understand that I will not receive a refund of camp fees for unattended days. If my child breaks or damages any property as a result of their direct or indirect behavior, I hereby agree to pay for its repair or replacement.
</p>



<p style="text-align: justify; font-family: Roboto, Arial, sans-serif; font-size: 14px; margin-bottom: 10px;">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  I understand that while participating in this activity, my child may be photographed. I agree to allow their photo, video, or film to be used for any legitimate purpose by the activity holders, producers, sponsors and organizers.  I hereby assume these risks and, knowing them, hereby give my child permission to participate. I agree to indemnify, hold harmless and promise not to sue the above-mentioned educational institution  / Camp Operator, both their trustees, officers, employees, volunteers, or other entities or persons from any and all liabilities or claims made as a result of participation in this activity.
</p>



<p style="text-align: justify; font-family: Roboto, Arial, sans-serif; font-size: 14px; margin-bottom: 10px;">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; The above-mentioned educational institution has the right to change the camp Volunteer or the Authorized Institution Head / HOD at any point of time subsequent to the receipt of the signed waiver form and the validity of the form shall be for up to 12 months from the date of your signature.
</p>
`;

  content_data_article_2: any = ` <p style=" text-align: justify; font-size: 16px; line-height: 1.5">  &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp; I understand that the above-mentioned educational institution / Camp Operator may, at their sole discretion, dismiss any camp participant for inappropriate, disrespectful, or dangerous behavior at any time. In this event, I understand that I will not receive a refund of camp fees for unattended days. If my child breaks or damages any property as a result of their direct or indirect behavior, I hereby agree to pay for its repair or replacement. I understand that the risks associated with camp activities, could result in injury and/or death to my child (though unlikely that such events might occur). I hereby assume these risks and, knowing them, hereby give my child permission to participate. I understand that the above-mentioned educational institution / Camp Operator are both not liable for any injuries or other occurrences due to indoor and outdoor camp activities or related risks, and/or the actions or omissions of the above-mentioned educational institution / Camp Operator, both their camp volunteers, employees, trustees, directors, officers, or any other entities being released.  <br>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; I acknowledge that this Accident Waiver and Release of Liability Form will be used by the event holders, sponsors, and organizers of the activity in which my child may participate and that it will govern the actions and responsibilities at said activity. In consideration of my application and permitting my child to participate in this activity, I hereby:  <br>
  WAIVE, RELEASE, AND DISCHARGE from any and all liability, including but not limited to, liability arising from the negligence or fault of the above-mentioned educational institution  / Camp Operator, both their trustees, officers, employees, camp guides, camp volunteers, entities, or other persons released, for my child’s death, disability, personal injury, property damage, property theft, or actions of any kind which may hereafter occur to them including their traveling to and from this activity;  <br>
  INDEMNIFY, HOLD HARMLESS, AND PROMISE NOT TO SUE the above-mentioned educational institution  / Camp Operator, both their trustees, officers, employees, volunteers, or other entities or persons released from any and all liabilities or claims made as a result of participation in this activity, whether caused by the negligence of release or otherwise.


  </p>

  `;

  content_data_article_3: any = ` <p style=" text-align: justify; font-size: 16px; line-height: 1.5">  &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;   <br>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  I understand that while participating in this activity, my child may be photographed. I agree to allow their photo, video, or film to be used for any legitimate purpose by the activity holders, producers, sponsors, organizers and assigns. This Camp Participation Consent and Accident Waiver and Release of Liability Form shall be construed broadly to provide a release and waiver to the maximum extent permissible under applicable law. The above-mentioned educational institution / Camp Operator, their Trustees, directors, officers, and all their employees acting officially or otherwise are hereby released from any and all claims, demands, actions, or causes of action on account of any injury to my child that may occur. This release binds my heirs, executors, administrators, and/or assigns.  <br>
  &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp;  &nbsp;  The above-mentioned educational institution has the right to change the camp Volunteer or the Authorized Institution Head / HOD at any point of time subsequent to the receipt of the signed waiver form and the validity of the form shall be for up to 12 months from the date of your signature.
  <br>


  </p>

  `;

  @ViewChild('content') content!: ElementRef;
  pdfDownload() {
    // Preload the image
    // const img = new Image();
    // img.src =
    //   'https://cephapi.getwow.biz/api/storage/' +
    //   this.country_code +
    //   '-' +
    //   this.customer_id +
    //   '/' +
    //   this.customer_sub_domain_name +
    //   '-icon-128x128.png';

    // Wait for the image to load
    // img.onload = () => {
    // Once the image is loaded, proceed with pdf generation
    const DATA = this.content.nativeElement;

    // Increase PDF width
    const pdfWidth = DATA.offsetWidth + 10; // Adjust the value as needed

    const doc = new jsPDF({
      orientation: 'portrait', // or 'landscape'
      unit: 'pt',
      format: [pdfWidth, 595], // Adjust the height (595 is A4 height)
    });

    const imgX = 20; // Adjust X position as needed
    const imgY = 20; // Adjust Y position as needed
    const imgWidth = 60; // Adjust image width as needed
    const imgHeight = 60; // Adjust image height as needed
    doc.html(DATA, {
      callback: (doc) => {
        doc.save(
          `${this.country_code}_${this.customer_id}_${this.pdf_first_name}_${this.pdf_last_name}_user.pdf`
        );
      },
    });

    this._spiner.open();
    this._dataShare.download_datetime_function_data.subscribe((res: any) => {
      let user_id = res.user_id;
      let current_date_time = 'Asia/Kolkata';
      this._apiservice
        .updateDownloadpdf(
          this.country_code,
          this.customer_id,
          this.waiver_form_for_participant_user_id,
          current_date_time,
          this.user_id_login
        )
        .subscribe((res) => {
          if (res) {
            this._spiner.close();
          }

          this._spiner.open();
          this._apiservice
            .gettableDataDownloadForms(
              this.country_code,
              this.customer_id,
              this.obtainedUserCategoryId,
              this.currentPage,
              this.pageSize
            )
            .subscribe((res) => {
              if (res.data == undefined) {
                this.dataSource.data = [];
                this._spiner.close();
              }

              if (res.data.length != 0) {
                this._spiner.close();
                this.dataSource.data = res.data;
              } else {
                this.dataSource.data = [];
                this._spiner.close();
              }
              this.btndisable1 = true;
              this.btndisable = true;
            });
        });
    });
  }
}
export interface PeriodicElement {
  col1: string;
  col3: string;
  col4: string;
  col5: string;
}
