import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';
// @ts-ignore
import * as countrycitystatejson from 'countrycitystatejson';
import { Observable, map, startWith } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { uniqBy } from 'lodash';
import { UserProfileComponentComponent } from 'src/app/shared/dialogs/user-profile-component/user-profile-component.component';

@Component({
  selector: 'app-review-booked-tickets',
  templateUrl: './review-booked-tickets.component.html',
  styleUrls: ['./review-booked-tickets.component.scss'],
})
export class ReviewBookedTicketsComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup: any = this._formBuilder.group({
    country: ['', Validators.required],
    city: ['', Validators.required],
  });
  get country(): any {
    return this.firstFormGroup.get('country');
  }
  get city(): any {
    return this.firstFormGroup.get('city');
  }
  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  tables: any;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  rowvalues: any;
  formValues: any;
  countries: Country[] = [];
  CountryfilteredOptions!: Observable<Country[]>;
  obtainedTourid: any;
  btnDisabled = true;
  city_1: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  radioticket_for_user_id: any;
  btnDisable: boolean = true;
  ticket_for_industrial_tour_site_id: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _tokenService: TokenService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _apiservice: ApiService,
    private _spiner: CustomSpinnerService,
    private authService: JwtauthService,
    private _snackbar: SnackBarService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    //Country Select
    this.countries = countrycitystatejson.getCountries();
    this.CountryfilteredOptions = this.firstFormGroup.controls[
      'country'
    ].valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this.countryfilter(name as string)
          : this.countries.slice();
      })
    );
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  cancelTicket() {
    this._apiservice
      .reviewcancelticketsdisplayupdate(
        this.country_code,
        this.customer_id,
        this.user_id_login,
        this.radioticket_for_user_id,
        this.ticket_for_industrial_tour_site_id
      )
      .subscribe((res) => {
        console.log(res, 'res');
        this._spiner.open();
        this._apiservice
          .reviewcancelticketsdisplayTable(
            this.country_code,
            this.customer_id,
            this.obtainedIndistralTripId
          )
          .subscribe((res) => {
            if (res.data?.get_result?.length == 0) {
              this._snackbar.success('Data Not Found');
            }

            if (res.data?.length == 0) {
              this._snackbar.success('Data Not Found');
            }
            if (res) {
              this._spiner.close();
            }
            this.details = res.data;
            this.dataSource.data = this.details;
          });
        this.btnDisable = true;
      });
  }
  //* --------------------------  Public methods  --------------------------*//
  radioBtnClick(e: any) {
    console.log(e, 'eeee');
    this.radioticket_for_user_id = e.info.ticket_for_user_id;
    this.ticket_for_industrial_tour_site_id =
      e.info.ticket_for_industrial_tour_site_id;
    this.btnDisable = false;
  }
  obtainedIndistralTripId: any;
  details: any;
  getNearestlocation(e: any) {
    this.obtainedIndistralTripId = e.industrial_tour_site_id;
    this._spiner.open();
    this._apiservice
      .reviewcancelticketsdisplayTable(
        this.country_code,
        this.customer_id,
        this.obtainedIndistralTripId
      )
      .subscribe((res) => {
        if (res.data?.get_result?.length == 0) {
          this._snackbar.success('Data Not Found');
        }

        if (res.data?.length == 0) {
          this._snackbar.success('Data Not Found');
        }
        if (res) {
          this._spiner.close();
        }
        this.details = res.data;
        this.dataSource.data = this.details;
      });
  }
  getCountryCode(e: any) {
    this.btnDisabled = false;
    const lowercaseCode = e.shortName.toLowerCase();
    console.log(lowercaseCode);
    if (lowercaseCode != undefined) {
      this._apiservice
        .getCityBasedonCountryCode(lowercaseCode, this.customer_id)
        .subscribe((res) => {
          this.obtainedTourid = res.data;
          console.log(this.obtainedTourid, 'tour');
        });
    }
  }

  imageuser_id: any;
  isrowselectedfirstreply(e: any) {
    const fileName = e.customer_image.split('.')[0]; // Split the string by '.' and take the first part
    this.imageuser_id = parseInt(fileName); // Parse the resulting string to an integer
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
  isrowselectedfirstreplyvol(e: any) {
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
  onAddressFormSubmit({ value, valid }: { value: any; valid: boolean }) {
    this.formValues = value;
  }
  // Filter by using Country
  displayCountry(user: any) {
    return user && user.name ? user.name : '';
  }
  private countryfilter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.countries.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  displayedColumns: any = ['col1', 'col2', 'col3', 'col4', 'col5'];
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

  //! -------------------------------  End  --------------------------------!//
}
export interface PeriodicElement {
  col1: string;
  col3: string;
  col4: string;
  col5: string;
}
