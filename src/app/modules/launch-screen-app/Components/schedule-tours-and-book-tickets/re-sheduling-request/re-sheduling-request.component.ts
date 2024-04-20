import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { UserProfileComponentComponent } from 'src/app/shared/dialogs/user-profile-component/user-profile-component.component';

@Component({
  selector: 'app-re-sheduling-request',
  templateUrl: './re-sheduling-request.component.html',
  styleUrls: ['./re-sheduling-request.component.scss'],
})
export class ReShedulingRequestComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  tables: any;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  country_code: any;
  customer_id: any;
  user_id_login: any;
  btnDisable: boolean = true;
  ticket_for_industrial_tour_site_id: any;
  industrial_tour_trip_schedule_id: any;
  rescheduling_request_datetime: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _tokenService: TokenService,
    private dialog: MatDialog,
    private _apiservice: ApiService,
    private authService: JwtauthService,
    private _datashare: DataSharingService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    if (this.country_code != undefined) {
      this.getTableData();
    }
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  getTableData() {
    this._apiservice
      .getTableReschedulingTours(this.country_code, this.customer_id)
      .subscribe((res) => {
        console.log(res.data, 'res for re scheduling request');

        if (res != undefined) {
          let tableData: any[] = [];
          if (res) {
            for (let i = 0; i < res.data.length; i++) {
              let datass = res.data[i];
              let pushmaplocationname: any[] = [];
              this._apiservice
                .getMapLocationName(
                  this.country_code,
                  this.customer_id,
                  datass.ticket_for_industrial_tour_site_id
                )
                .subscribe((res) => {
                  pushmaplocationname.push(
                    res.data[0].map_location_display_name
                  );
                });

              console.log(datass, 'tasdf');

              let datas = {
                trip_datetime: datass.trip_datetime,
                map_location_display_name: pushmaplocationname,
                biz_location_id: datass.biz_location_id,
                participantsCount_type_0: datass.participantsCount_type_0,
                participantsCount_type_1: datass.participantsCount_type_1,
                visiting_customer_country_code:
                  datass.visiting_customer_country_code,
                visiting_customer_id: datass.visiting_customer_id,
                ticket_for_industrial_tour_site_id:
                  datass.ticket_for_industrial_tour_site_id,
                industrial_tour_trip_schedule_id:
                  datass.industrial_tour_trip_schedule_id,
                first_name: datass.first_name,
                last_name: datass.last_name,
                is_trip_rescheduled: datass.is_trip_rescheduled,
                rescheduling_request_datetime:
                  datass.rescheduling_request_datetime,
                institution_head_contact_person_first_name:
                  datass.institution_head_contact_person_first_name,
                institution_head_contact_person_last_name:
                  datass.institution_head_contact_person_last_name,
                  rescheduling_requested_by_user_id_of_industrial_tour_site:datass.rescheduling_requested_by_user_id_of_industrial_tour_site
              };

              tableData.push(datas);
            }
            console.log(tableData, 'table');
            this.dataSource.data = tableData;
          }
        }

        // this.dataSource.data = res.data;
      });
  }

  //* --------------------------  Public methods  --------------------------*//
  RadioBtnData(e: any) {
    console.log(e, 'ee');
    this.ticket_for_industrial_tour_site_id =
      e.ticket_for_industrial_tour_site_id;
    this.industrial_tour_trip_schedule_id = e.industrial_tour_trip_schedule_id;
    this.rescheduling_request_datetime = e.rescheduling_request_datetime;

    this.btnDisable = false;
  }
  AcceptUpdatebtn() {
    console.log('update');

    this._apiservice
      .updateAcceptRescheduleTrip(
        this.country_code,
        this.customer_id,
        this.industrial_tour_trip_schedule_id,
        this.ticket_for_industrial_tour_site_id,
        this.rescheduling_request_datetime,
        this.user_id_login
      )
      .subscribe((res) => {
        this.getTableData();
        this._datashare.reloadTableRescheduleAcceptConfirmedTours(1);
        this.btnDisable = true;
      });
  }
  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  displayedColumns: string[] = ['col1', 'col3', 'col4', 'col5', 'col6', 'col7'];
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
  //* ------------------------------ Helper Function -----------------------*//
  imageuser_id: any;
  isrowselectedfirstreply(e: any) {
    console.log(e,'e');
    
    this.imageuser_id = e.rescheduling_requested_by_user_id_of_industrial_tour_site;
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



  //another
  imageuser_id_ano: any;
  isrowselectedfirstreplyano(e: any) {
    console.log(e,'e');
    
    this.imageuser_id_ano = e.rescheduling_requested_by_user_id_of_industrial_tour_site;
  }
  openUserProfileano() {
    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: 'auto',
      minHeight: 'auto',
      width: '320px',

      data: {
        user_id: this.imageuser_id_ano,
        customer_id: this.customer_id,
        country_id: this.country_code,
      },
    };
    const dialogRef = this.dialog.open(UserProfileComponentComponent, config);
  }
  //! -------------------------------  End  --------------------------------!//
}
export interface PeriodicElement {
  col1: string;
  col3: string;
  col4: string;
  col5: string;
  col6: string;
}
