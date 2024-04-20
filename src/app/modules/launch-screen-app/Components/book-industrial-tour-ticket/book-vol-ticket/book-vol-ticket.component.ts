import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MapLeafletComponent } from '../popup/map-leaflet/map-leaflet.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
// @ts-ignore
import * as countrycitystatejson from 'countrycitystatejson';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';
import { uniqBy } from 'lodash';
import * as Leaflet from 'leaflet';
import { UserProfileComponentComponent } from 'src/app/shared/dialogs/user-profile-component/user-profile-component.component';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { WowWalletComponent } from 'src/app/shared/dialogs/wow-wallet/wow-wallet.component';
import { CKEditorComponent } from 'ng2-ckeditor';
import { VolWalletComponent } from 'src/app/shared/dialogs/vol-wallet/vol-wallet.component';

@Component({
  selector: 'app-book-vol-ticket',
  templateUrl: './book-vol-ticket.component.html',
  styleUrls: ['./book-vol-ticket.component.scss'],
})
export class BookVolTicketComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };
  //* -----------------------  Decorated Methods  --------------------------*//
  firstFormGroup: any = this._formBuilder.group({
    country: ['', Validators.required],
    city: ['', Validators.required],
    activity1: ['', Validators.required],
    sel1: ['', Validators.required],
    category: ['', Validators.required],
    cdk_editor: new FormControl(),
  });
  get country(): any {
    return this.firstFormGroup.get('country');
  }
  get city(): any {
    return this.firstFormGroup.get('city');
  }
  @Output() categoryId = new EventEmitter();
  @ViewChild('myckeditor') myckeditor!: CKEditorComponent;
  //* -----------------------  Variable Declaration  -----------------------*//
  ckeConfig!: any;
  user_category_id: any;
  category: any;
  countries: Country[] = [];
  CountryfilteredOptions!: Observable<Country[]>;
  city_1: any;
  showdata: boolean = true;
  btndisablecreate: any;
  rowvalues: any;
  locationName: any;
  tables: any;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  country_code: any;
  customer_id: any;
  user_id_login: any;
  customer_sub_domain_name: any;
  customer_logo_data: any;
  selectCategorylist: any;
  formValues: any;
  btnDisabled = true;
  obtainedTourid: any;
  obtainedIndistralTripId: any;
  btndisable_1 = true;
  contact_addstudents: any;
  details: any;
  obtainedCategoryId: any;
  obtainedCantegoryName: any;
  location: any;
  map_location_x: any;
  map_location_y: any;
  geo_data: any;
  let_data: any;
  lng_data: any;
  topLeft: any;
  bottomLeft: any;
  topRight: any;
  bottomRight: any;
  sameTopLeft: any;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  readonlydata: boolean = true;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _tokenService: TokenService,
    private _spiner: CustomSpinnerService,
    private _apiservice: ApiService,
    private authService: JwtauthService,
    private _snackbar: SnackBarService,
    private _dataShare: DataSharingService,
    private _snack: MatSnackBar
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

    if (this.country_code != undefined) {
      this.selectCategory();
    }

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

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf',

      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        {
          name: 'paragraph',
          // groups: ['colors'],
        },
      ],
      removeButtons:
        'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Unlink,Anchor,Flash,orizontalRule,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About',
    };
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  selectCategory() {
    // this._spiner.open();
    this._apiservice
      .getDropDownCategory(this.country_code, this.customer_id)
      .subscribe((res) => {
        if (res.statusCode == 400) {
          this._snackbar.error(res.message);
        }
        if (res) {
          // this._spiner.close();
        }
        this.selectCategorylist = res.data;
      });
  }
  selectedCategoryData(e: any) {
    this.obtainedCantegoryName = e?.user_category_name;
    this.obtainedCategoryId = e.user_category_id;
    // this.btnDisabled = false;
    this.btndisablecreate = true;
    this.showdata = false;
    this.obtainedTourid = [];
    this.btndisable_1 = true;
    this.dataSource.data = [];
    // this.firstFormGroup.get('cdk_editor').setValue('');
    this.firstFormGroup.get('country').setValue(null);
    // Mark the control as valid to remove the red error border
    this.firstFormGroup.get('country').markAsUntouched();
    this.firstFormGroup.get('country').markAsPristine();
  }

  //* --------------------------  Public methods  --------------------------*//
  getuser_id: any;
  ticketprice: any;
  wallet_transaction_id: any = 1;

  bookVolunteer(val: any) {
    this._apiservice.getVolunteerTicketPrice(val).subscribe((res) => {
      console.log(res, 'volr');

      this._spiner.close();
      if (res.data?.length == 0) {
        this._snackbar.success('Data Not Found');
        this._spiner.close();
      }
      if (res.data?.overall_result?.length == 0) {
        this._snackbar.success('Data Not Found');
        this._spiner.close();
      }
      if (res) {
        this._spiner.close();
      }
      this.ticketprice = res.data[0].volunteer_ticket_price;
      this._dataShare.shareTicketPriceId(this.ticketprice);

      console.log(this.ticketprice, 'ticker');

      if (this.getuser_id != 0) {
        this._snack.open('User already Booked', 'Ok', this.config);
        this.btndisable_1 = true;
        this.tables = [];
        this.getuser_id = [];
      } else if (+this.get_wow_amount >= +this.ticketprice) {
        this.openVOLWallet();
        // if (res != undefined) {
        //   this._apiservice
        //     .insertVolunteerTicket(
        //       this.country_code,
        //       this.customer_id,
        //       this.user_id_login,
        //       this.selectedRadioUserId,
        //       this.obtainedIndistralTripId,
        //       this.wallet_transaction_id
        //     )
        //     .subscribe((res) => {
        //       this.btndisable_1 = true;
        //       this._spiner.open();
        //       this._apiservice
        //         .gettableDataBookvolEntry(
        //           this.country_code,
        //           this.customer_id,
        //           this.obtainedIndistralTripId
        //         )
        //         .subscribe((res) => {
        //           this.contact_addstudents = res.data;
        //           console.log(this.contact_addstudents,'cont');

        //           if (res.data?.get_result?.length == 0) {
        //             this._snackbar.success('Data Not Found');
        //           }

        //           if (res.data?.length == 0) {
        //             this._snackbar.success('Data Not Found');
        //           }
        //           if (res) {
        //             this._spiner.close();
        //           }
        //           this.categoryId.emit(this.user_category_id);
        //           this.details = res.data;
        //           this.dataSource.data = this.details;
        //         });
        //       this.tables = [];
        //     });
        // }
      } else {
        this._snack.open('Insufficient fund', 'OK', this.config);
        this.btndisable_1 = true;
        this.tables = [];
        this.getuser_id = [];
      }
    });
  }
  getval(e: any) {}
  getNearestlocation(e: any) {
    this.locationName = e;
    console.log(this.locationName, 'location');

    this.obtainedIndistralTripId = e.industrial_tour_site_id;
    this.btndisablecreate = false;
    this.showdata = true;
    this.btndisable_1 = true;
    this._dataShare.shareTripId(this.locationName);
    this.firstFormGroup.controls['cdk_editor'].setValue(
      this.locationName.biz_customer_travel_arrangements_info
    );

    this._spiner.open();
    this._apiservice
      .gettableDataBookvolEntry(
        this.country_code,
        this.customer_id,
        this.obtainedIndistralTripId
      )
      .subscribe((res) => {
        this.contact_addstudents = res.data;
        console.log(this.contact_addstudents, 'cont');

        if (res.data?.get_result?.length == 0) {
          this._snackbar.success('Data Not Found');
        }

        if (res.data?.length == 0) {
          this._snackbar.success('Data Not Found');
        }
        if (res) {
          this._spiner.close();
        }
        this.categoryId.emit(this.user_category_id);
        this.details = res.data;
        this.dataSource.data = this.details;
      });

    this.geo_data = e;
    this.location = e;
    this.map_location_x = this.location?.camp_gps_coordinates?.x;
    this.map_location_y = this.location?.camp_gps_coordinates?.y;
    this.let_data = this.map_location_x;
    this.lng_data = this.map_location_y;
    this.rowvalues = this.locationName;
    console.log(this.rowvalues, 'tow');

    this.dataSource.data = [];
    this.tables = [];
  }

  openmap() {
    if (this.locationName?.industrial_tour_site_id != undefined) {
      const dialogRef = this.dialog.open(MapLeafletComponent, {
        disableClose: true,
        height: 'auto',
        width: '350px',
        minWidth: '350px',
        data: this.rowvalues,
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
  }
  onAddressFormSubmit({ value, valid }: { value: any; valid: boolean }) {
    this.formValues = value;
  }
  get_wow_amount: any;
  radioBtnDataShare: any;
  selectedRadioUserId: any;
  radioBtnData(element: any) {
    console.log(element, 'radio Data');
    this.radioBtnDataShare = element;
    this.btndisable_1 = false;
    this.getuser_id = element?.getdataincampdatatable?.length;
    console.log(this.getuser_id, 'get');
    this.get_wow_amount = element.userdetails.max_wallet_closing_balance_amount;
    console.log(this.get_wow_amount);

    this.selectedRadioUserId =
      element.userdetails.waiver_form_volunteer_user_id;
  }
  openVOLWallet() {
    const dialogRef = this.dialog.open(VolWalletComponent, {
      disableClose: true,
      height: '500px',
      width: '360px',
      minWidth: '250px',
      data: this.radioBtnDataShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result,'resutl');

      this.btndisable_1 = true;
      this.tables = [];
      this._spiner.open();
      this._apiservice
        .gettableDataBookvolEntry(
          this.country_code,
          this.customer_id,
          this.obtainedIndistralTripId
        )
        .subscribe((res) => {
          this.contact_addstudents = res.data;
          console.log(this.contact_addstudents, 'cont');

          if (res.data?.get_result?.length == 0) {
            this._snackbar.success('Data Not Found');
          }

          if (res.data?.length == 0) {
            this._snackbar.success('Data Not Found');
          }
          if (res) {
            this._spiner.close();
          }
          this.categoryId.emit(this.user_category_id);
          this.details = res.data;
          this.dataSource.data = this.details;
        });
    });
  }
  //* ------------------------------ Helper Function -----------------------*//
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

  getCountryCode(e: any) {
    const lowercaseCode = e.shortName.toLowerCase();
    console.log(lowercaseCode);
    this.btnDisabled = false;
    if (lowercaseCode != undefined) {
      this._apiservice
        .getCityBasedonCountryCode(lowercaseCode, this.customer_id)
        .subscribe((res) => {
          this.obtainedTourid = res.data;
          console.log(this.obtainedTourid, 'obtained');
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
  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  displayedColumns: string[] = ['col3', 'col5'];
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
  //! -------------------------------  End  --------------------------------!//
}

export interface PeriodicElement {
  col3: string;
  col5: string;
}
