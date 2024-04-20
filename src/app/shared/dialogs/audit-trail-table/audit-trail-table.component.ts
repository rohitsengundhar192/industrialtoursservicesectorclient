import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { JwtauthService } from '../../services/api/jwtauth.service';
import { UserProfileComponentComponent } from '../user-profile-component/user-profile-component.component';
// import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
// import { UserProfileCardComponent } from 'src/app/shared/dialogs/user-profile-card/user-profile-card.component';

@Component({
  selector: 'app-audit-trail-table',
  templateUrl: './audit-trail-table.component.html',
  styleUrls: ['./audit-trail-table.component.scss'],
})
export class AuditTrailTableComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;
  @Input() data: any = [];
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  selection = new SelectionModel<any>(false, []);
  //* -----------------------  Variable Declaration  -----------------------*//
  clickedRow = new Set<any>();
  highlightedRows: any[] = [];
  pageLoading: boolean = false;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  dataSource: any = new MatTableDataSource<any>();
  audit_trail_type: any;
  audit_trail_type_schdeule!: string;
  datavalue: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _dataSharingService: DataSharingService,
    public _api_service: ApiService,
    private _spiner: CustomSpinnerService,
    private authService: JwtauthService,
    private dialog: MatDialog,
    private _tokenService: TokenService
  ) {
    this._dataSharingService.audit_trail_data.subscribe((res) => {
      this.audit_trail_type = res;
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit() {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    console.log(token, 'token');
    this.load();
    // //datashare
    // this._dataSharingService.audit_trail_data.subscribe((res) => {
    //   this.audit_trail_type = res;
    //   if (this.audit_trail_type == 1) {
    //     // this._spiner.open();
    //     this._api_service
    //       .getaudittrailaccesscontrolwowscreens(
    //         this.country_code,
    //         this.customer_id
    //       )
    //       .subscribe((res_book) => {
    //         if (res_book.data.length > 0) {
    //           // this._spiner.close();
    //         }
    //         this.dataSource.data = res_book.data;
    //       });
    //   } else if (this.audit_trail_type == 2) {
    //     // this._spiner.open();
    //     this._api_service
    //       .getaudittrailclaimrentalwavier(this.country_code, this.customer_id)
    //       .subscribe((res_schdeule) => {
    //         if (res_schdeule.data.length > 0) {
    //           // this._spiner.close();
    //         }
    //         this.dataSource.data = res_schdeule.data;
    //       });
    //   } else {
    //     // this._spiner.open();
    //     this._api_service
    //       .getaudittrailtimeshareforgetsterscreen(
    //         this.country_code,
    //         this.customer_id
    //       )
    //       .subscribe((res_audit) => {
    //         if (res_audit.data.length > 0) {
    //           // this._spiner.close();
    //         }
    //         this.dataSource.data = res_audit.data;
    //       });
    //   }
    // });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.translateMatPaginator(this.paginator);
  }
  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  time_share: any;
  load() {
    this._dataSharingService.audit_trail_data.subscribe((res) => {
      this.audit_trail_type = res;
      if (res === 'wavier_form') {
        // this._spiner.open();
        this._api_service
          .getAuditTrailForWavierForm(
            this.country_code,
            this.customer_id,
            this.currentPage,
            this.pageSize
          )
          .subscribe((res_audit) => {
            // console.log(res_audit,'au');

            if (res) {
              // this._spiner.close();
            }
            this.dataSource.data = res_audit.data;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = res_audit.data[0]?.count;
            }, 0);
            // this._dataSharingService.updateAuditTrailDataCamp(res_audit)
          });
      } else if (res === 'schedule_tour_book_tickets') {
        // this._spiner.open();
        // console.log(this.country_code,this.customer_id,'cu');

        this._api_service
          .getAuditTrailForScheduleTourandBookTicket(
            this.country_code,
            this.customer_id,
            this.currentPage,
            this.pageSize
          )
          .subscribe((res_schdeule) => {
            // console.log(res_schdeule,'sche');

            if (res_schdeule) {
              // this._spiner.close();
            }
            this.dataSource.data = res_schdeule.data;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = res_schdeule.data[0]?.count;
            }, 0);
          });
      } else if (res === 'book_camp') {
        //  this._spiner.open();
        this._api_service
          .getAuditTrailForBookIndustrialTourTicket(
            this.country_code,
            this.customer_id,
            this.currentPage,
            this.pageSize
          )
          .subscribe((res_book) => {
            // console.log(res_book,'boo');

            if (res_book) {
              // this._spiner.close();
            }
            this.dataSource.data = res_book.data;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = res_book.data[0]?.count;
            }, 0);
          });
      } else if (res === 'validate_complete') {
        //  this._spiner.open();
        this._api_service
          .getAuditTrailForValidateTourAndRatePhotos(
            this.country_code,
            this.customer_id,
            this.currentPage,
            this.pageSize
          )
          .subscribe((res_book) => {
            // console.log(res_book,'boo');

            if (res_book) {
              // this._spiner.close();
            }
            this.dataSource.data = res_book.data;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = res_book.data[0]?.count;
            }, 0);
          });
      }
    });
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  onRowClicked(row: any) {
    // this.value.emit(row);
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

  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'First';
    paginator._intl.itemsPerPageLabel = 'Records Per Page';
    paginator._intl.lastPageLabel = 'Last';
    paginator._intl.nextPageLabel = 'Next';
    paginator._intl.previousPageLabel = 'Previous';
  }
  displayedColumns: string[] = [
    'entry_by_user_name',
    'entry_type',
    'entry_date_time',
  ];

  ELEMENT_DATA: any[] = [];

  highlight(element: any) {
    element.highlighted = !element.highlighted;
    this.selection.toggle(element);
    // row.highlighted = !row.highlighted
  }

  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  @Output() customerChange: EventEmitter<any> = new EventEmitter<any>();

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.load();
  }
  showPageSizeOptions: boolean = true;

  /** Selects all rows if they are not all selected; otherwise clear selection. */

  @ViewChild('pdfTable1', { static: false }) pdfTable1!: ElementRef;
  public downloadAsPDF() {
    let jwt_token = localStorage.getItem('access_token');
    let token1 = this._tokenService.decodeJwtToken(jwt_token);
    // console.log(token1, 'token');

    let app_name: string = token1.user.registered_educational_institution_name;
    let districtStatePincode: string = `${token1.user.city_district_county} ${token1.user.state_province} ${token1.user.pin_code};`;
    let addressline1_adressline2: string = ` ${token1.user.address_line_1} ${token1.user.address_line_2};`;

    let customer_logo = ` ${environment.ceph_URL}/${token1.user.country_code}-${token1.user.customer_id}/${token1.user.customer_sub_domain_name}-icon-128x128.png;`;

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
        '</style>' +
        `</head>
          <body onload="window.print()">
          <style>
          .mat-column-select{display:none}
          </style>
            <div style="width:100%;  display: flex;flex-direction: row; margin-bottom:5px">
            <img style="width:100px;height:100px" src="${customer_logo}" alt="app-logo" />
              <div style=" display: flex;flex-direction: column; width:100%">
                <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600">GETster.TECH PVT.LTD</span>
                <span style="text-align: center;text-size:14px;color:black;font-weight:600">Existing Getster Profile - Audit Trail</span>
              </div>
            </div>` +
        printContents +
        '</body>' +
        `<footer style="position: fixed; bottom: 0; width: 100%;"><div style=" display: flex;flex-direction: column; width:100%">
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${addressline1_adressline2} </span>
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${districtStatePincode}</span>
      </div> </footer>` +
        '</html>'
    );
    popupWin.document.close();
  }
  //* ------------------------------ Helper Function -----------------------*//
  getCustomerProfileUrl(ceph_object_id: string) {
    let profileUrl =
      environment.ceph_URL +
      this.country_code +
      '-' +
      this.customer_id +
      '/' +
      ceph_object_id;
    return profileUrl;
  }
  imageuser_id: any;
  isrowselectedfirstreply(e: any) {
    console.log(e);

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
}
