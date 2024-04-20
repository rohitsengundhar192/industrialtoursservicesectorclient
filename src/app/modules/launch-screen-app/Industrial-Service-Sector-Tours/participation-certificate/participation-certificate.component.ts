import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as saveAs from 'file-saver';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-participation-certificate',
  templateUrl: './participation-certificate.component.html',
  styleUrls: ['./participation-certificate.component.scss'],
})
export class ParticipationCertificateComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('content1') content1!: ElementRef;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  //* -----------------------  Variable Declaration  -----------------------*//
  ELEMENT_DATA: PeriodicElement[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  //others
  restable: any;
  showdata: boolean = false;
  showdatatopchange: boolean = false;
  inst_name: any;
  inst_add1: any;
  inst_add2: any;
  inst_city: any;
  inst_state: any;
  inst_pin: any;
  inst_customer_logo: any;
  customer_sub_domain_name: any;
  direct_stu_login_ln: any;
  direct_stu_login_fn: any;
  direct_stu_login_dob: any;
  token_data: any;
  decrypt_token: any;
  cardUrl: any;
  names: any;
  country_code: any;
  customer_id: any;
  // user_id_login: any;
  user_id_static: any;
  loaddatabasedoncategory: any;
  tables: any;
  first_stu: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _tokenService: TokenService,
    private authService: JwtauthService,
    private spinner: CustomSpinnerService,
    private data_sharing: DataSharingService,
    private _apiservice: ApiService,
    private _snackbar: SnackBarService,
    private sanitizer: DomSanitizer
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    this.data_sharing.update_showTop_data(true);

    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.token_data = token.user;
    console.log(this.token_data, 'token');

    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_static = token.user.user_id;
    this.inst_add1 = token.user.address_line_1;
    this.inst_add2 = token.user.address_line_2;
    this.inst_city = token.user.city_district_county;
    this.inst_state = token.user.state_province;
    this.inst_pin = token.user.pin_code;
    this.customer_sub_domain_name = token.user.customer_sub_domain_name;
    // this.data_sharing.update_show_side(true);
    this.inst_name = token.user.registered_educational_institution_name;
    this.inst_customer_logo = ` ${environment.ceph_URL}${token.user.country_code}-${token.user.customer_id}/${token.user.customer_sub_domain_name}-icon-128x128.png`;

    this._apiservice
      .parent_child_select_new(
        this.country_code,
        this.customer_id,
        this.user_id_static
      )
      .subscribe((res) => {
        // console.log(res, 'ressed');

        this.loaddatabasedoncategory = res.data.catalog;
        this.data_sharing.ActivityCertificateTopStu(res.data);
        // this.direct_stu_login_fn = res.data[0].student_info.firstName;
        // this.direct_stu_login_ln = res.data[0].student_info.LastName;

        this._apiservice
          .ClassOneToEightUrl(
            this.country_code,
            this.customer_id,
            this.user_id_static,
            this.map_location_display_name,
            this.ticket_booking_datetime,
            // this.address,
            this.sharelocationid,
            this.token_data
          )
          .subscribe({
            next: (res: any) => {
              this.cardUrl = res.data;
              // console.log(this./cardUrl, 'card');
            },
          });

        // console.log(this.loaddatabasedoncategory, 'load');

        if (this.loaddatabasedoncategory === 'student') {
          this.data_sharing.update_showTop_data(false);

          this.cardUrl = [];
          if (this.user_id_static !== undefined) {
            this._apiservice
              .ClassOneToEightUrl(
                this.country_code,
                this.customer_id,
                this.user_id_static,
                this.map_location_display_name,
                this.ticket_booking_datetime,
                // this.address,
                this.sharelocationid,
                this.token_data
              )
              .subscribe({
                next: (res: any) => {
                  this.cardUrl = res.data;
                  // console.log(this.cardUrl, 'card');
                },
              });

            let tableData: any[] = [];
            this._apiservice
              .student_data(
                this.country_code,
                this.customer_id,
                this.user_id_static
              )
              .subscribe((res) => {
                this.stu_data = res.data;
                tableData = [];
                this.booking_date = [];

                if (this.stu_data.length > 0) {
                  if (res.data) {
                    this.showdata = true;
                    this.restable = res.data[0].countt;
                    this.dataSource.data = res.data;
                  }

                  this.first_stu = this.stu_data;
                  // console.log(this.first_stu[0], 'first');

                  if (res) {
                    this._apiservice
                      .first_student_data(
                        this.country_code,
                        this.customer_id,
                        this.user_id_static
                      )
                      .subscribe((res) => {
                        if (res.statusCode != 200) {
                          this._snackbar.success('Data not found');
                        } else {
                          this.names = res?.data[0];
                          // console.log(this.names, 'names');
                        }
                      });
                  }
                } else {
                  this._snackbar.success('Data Not Found');
                }
              });
          }
        } else if (this.loaddatabasedoncategory === 'teacher') {
          console.log('Teacher specific code');
          this.data_sharing.update_showTop_data(true);
        } else if (this.loaddatabasedoncategory === 'parent') {
          console.log('parent specific code');
          this.data_sharing.update_showTop_data(true);
        }
      });

    this.data_sharing.Activity_certificate_data_material.subscribe((res) => {
      this.booking_date = [];
      this.showdatatopchange = false;

      console.log(res, 'table from by click show header student data');

      if (res != undefined) {
        let tableData: any[] = [];
        if (res) {
          for (let i = 0; i < res.length; i++) {
            let datass = res[i];
            let pushmaplocationname: any[] = [];
            let pushmaplocationid: any[] = [];
            this._apiservice
              .getMapLocationName(
                this.country_code,
                this.customer_id,
                datass.industrial_tour_site_id
              )
              .subscribe((res) => {
                // console.log(res.data[0], 'remap name');

                pushmaplocationname.push(res.data[0].map_location_display_name);
                pushmaplocationid.push(res.data[0].biz_location_id);
              });

            // console.log(datass, 'tasdf');

            let datas = {
              ticket_for_user_id: datass.ticket_for_user_id,
              trip_datetime: datass.trip_datetime,
              map_location_display_name: pushmaplocationname,
              location_id: pushmaplocationid,
              biz_location_id: datass.biz_location_id,
              industrial_tour_site_id: datass.industrial_tour_site_id,
            };

            tableData.push(datas);
          }
          // console.log(tableData, 'table');
          this.dataSource.data = tableData;
        }
      } else {
        this.dataSource.data = [];
      }
    });

    this.data_sharing.Activity_certificate_data.subscribe((res) => {
      this.stu_data = res;
      // console.log(res, 'r');

      this.first_stu = this.stu_data;
      if (res) {
        this._apiservice
          .first_student_data(
            this.country_code,
            this.customer_id,
            this.first_stu
          )
          .subscribe((res) => {
            if (res.statusCode != 200) {
              this._snackbar.success('Data not found');
            } else {
              this.names = res?.data[0];
              // console.log(this.names.customer_image, 'names');

              var fileName = this.names.customer_image;
              var parts = fileName.split('.');
              var numberOnly = parts[0];
              this.user_user_id = parts[0];

              if (this.user_user_id != undefined) {
                // this.getUrl();
              }
            }
          });
      }
    });

    // this.generatePDF();

    // this.getUrl();
  }
  user_user_id: any;
  //* ----------------------------  APIs Methods  --------------------------*//
  stu_data: any;
  booking_date: any;
  getTable() {
    let tableData: any[] = [];
    this._apiservice
      .table_student_data(
        this.country_code,
        this.customer_id,
        this.user_id_static,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res) => {
        this.stu_data = res.data;
        // console.log(this.stu_data, 'stu');
        // this.dataSource.data = this.stu_data;

        if (res.data != undefined) {
          let tableData: any[] = [];
          if (res) {
            for (let i = 0; i < res.data.length; i++) {
              let datass = res.data[i];
              let pushmaplocationname: any[] = [];
              let pushmaplocationid: any[] = [];
              this._apiservice
                .getMapLocationName(
                  this.country_code,
                  this.customer_id,
                  datass.industrial_tour_site_id
                )
                .subscribe((res) => {
                  // console.log(res.data[0], 'remap name');

                  pushmaplocationname.push(
                    res.data[0].map_location_display_name
                  );
                  pushmaplocationid.push(res.data[0].biz_location_id);
                });

              // console.log(datass, 'tasdf');

              let datas = {
                ticket_for_user_id: datass.ticket_for_user_id,
                trip_datetime: datass.trip_datetime,
                map_location_display_name: pushmaplocationname,
                location_id: pushmaplocationid,
                biz_location_id: datass.biz_location_id,
                industrial_tour_site_id: datass.industrial_tour_site_id,
              };

              tableData.push(datas);
            }
            // console.log(tableData, 'table');
            this.dataSource.data = tableData;
          }
        } else {
          this.dataSource.data = [];
        }

        if (this.stu_data.length > 0) {
          // if (res.data) {
          //   this.showdata = true;
          //   this.restable = res.data[0].countt;
          //   this.dataSource.data = res.data;
          //   setTimeout(() => {
          //     this.paginator.pageIndex = this.currentPage;
          //     this.paginator.length = this.restable;
          //   }, 0);
          // }

          this.first_stu = this.stu_data;
          // console.log(this.first_stu[0], 'first');

          if (res) {
            this._apiservice
              .first_student_data(
                this.country_code,
                this.customer_id,
                this.user_id_static
              )
              .subscribe((res) => {
                if (res.statusCode != 200) {
                  this._snackbar.success('Data not found');
                } else {
                  this.names = res?.data[0];
                  // console.log(this.names, 'names');
                }
              });
          }
        }
      });
  }
  //* --------------------------  Public methods  --------------------------*//
  map_location_display_name: any;
  ticket_booking_datetime: any;
  ticket_for_industrial_tour_site_id: any;
  tour_site_learning_outcome: any;
  address_line_1: any;
  address_line_2: any;
  city_district_county: any;
  country: any;
  state_province: any;
  pin_code: any;
  sanitizedContent!: SafeHtml;
  sharelocationid: any;
  radioBtnData(e: any) {
    // console.log(e, 'eee8');

    this.map_location_display_name = e.map_location_display_name;
    this.ticket_booking_datetime = e.trip_datetime;
    this.ticket_for_industrial_tour_site_id = e.industrial_tour_site_id;
    this.sharelocationid = e.location_id[0];

    // console.log(this.cardUrl, 'card after press radio');

    this._apiservice
      .ClassOneToEightUrl(
        this.country_code,
        this.customer_id,
        this.user_id_static,
        this.map_location_display_name,
        this.ticket_booking_datetime,
        // this.address,
        this.sharelocationid,
        this.token_data
      )
      .subscribe({
        next: (res: any) => {
          this.cardUrl = res.data;
          // console.log(this.cardUrl, 'card after press radio');
        },
      });

    this._apiservice
      .getMapData(this.ticket_for_industrial_tour_site_id)
      .subscribe((res) => {
        this.tour_site_learning_outcome =
          res.data[0].tour_site_learning_outcome;

        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
          this.tour_site_learning_outcome
        );
      });

    this._apiservice
      .getAddressForTouristId(this.country_code, this.customer_id)
      .subscribe((res) => {
        // console.log(res, 'data');
        this.address_line_1 = res.data[0].address_line_1;
        this.address_line_2 = res.data[0].address_line_2;
        this.city_district_county = res.data[0].city_district_county;
        this.state_province = res.data[0].state_province;
        this.country = res.data[0].country;
        this.pin_code = res.data[0].pin_code;

        this.address = `${this.address_line_1}-${this.address_line_2}-${this.city_district_county}-${this.state_province}-${this.country}-${this.pin_code}`;
      });
  }

  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  // ngDoCheck(): void {
  //   console.log(this.cardUrl, 'card');
  // }
  displayedColumns: any = ['col1', 'col2', 'col3'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  rowValue: any[] = [];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.translateMatPaginator(this.paginator);
  }

  table_json_data: any;

  onRowClicked(row: any) {}

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    let tableData: any[] = [];
    this._apiservice
      .student_data(this.country_code, this.customer_id, this.user_id_static)
      .subscribe((res) => {
        this.stu_data = res.data;
        this.booking_date = [];

        this.dataSource.data = this.stu_data;
      });
  }
  showPageSizeOptions: boolean = true;

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

  public downloadAsPDF() {
    let pageIndex: number = Number(this.paginator.pageIndex);
    let pageSize: number = Number(this.paginator.pageSize);

    let currentPageEnd = pageSize * (pageIndex + 1);
    let currentPageStart = currentPageEnd - (pageSize - 1);
    let jwt_token = localStorage.getItem('access_token');
    let token1 = this._tokenService.decodeJwtToken(jwt_token);
    // console.log(token1, 'token');

    let app_name: string = token1.user.registered_educational_institution_name;
    let districtStatePincode: string = `${token1.user.city_district_county} ${token1.user.state_province} ${token1.user.pin_code};`;
    let addressline1_adressline2: string = ` ${token1.user.address_line_1} ${token1.user.address_line_2};`;

    let customer_logo = ` ${environment.ceph_URL}${token1.user.country_code}-${token1.user.customer_id}/${token1.user.customer_sub_domain_name}-icon-128x128.png`;
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
    var printContents = document.getElementById('pdfTable')!.innerHTML;
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

          <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
          <img style="width:100px;height:100px" src="${customer_logo}" alt="app-logo" />                 <div style=" display: flex;flex-direction: column; width:100%">
            <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">GETster.TECH PVT.LTD</span>
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">USERs WITH VALID ENTRY TICKET</span>
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
  pdfDownload() {
    // this.spinner.open();
    // let DATA = this.content.nativeElement;
    // console.log(DATA, 'data');

    // const doc = new jsPDF('p', 'pt', 'a4');
    // const options = {
    //   background: 'white',
    //   scale: 3,
    // };

    // html2canvas(DATA, options)
    //   .then((canvas) => {
    //     const img = canvas.toDataURL('image/PNG');
    //     const bufferX = 0;
    //     const bufferY = 0;
    //     const imgProps = (doc as any).getImageProperties(img);
    //     const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //     doc.addImage(
    //       img,
    //       'PNG',
    //       bufferX,
    //       bufferY,
    //       pdfWidth,
    //       pdfHeight,
    //       undefined,
    //       'FAST'
    //     );
    //     return doc;
    //   })
    //   .then((docResult) => {
    //     const pdfBlob = docResult.output('blob');
    //     const pdfFilename = `${new Date().toISOString()}_tutorial.pdf`;

    //     // Save the PDF using the file-saver library
    //     saveAs(pdfBlob, pdfFilename);
    //     this.spinner.close();
    //   });

    // Preload the image
    const img = new Image();
    img.src =
      'https://cephapi.getwow.biz/api/storage/' +
      this.country_code +
      '-' +
      this.customer_id +
      '/' +
      this.customer_sub_domain_name +
      '-icon-128x128.png';

    // Wait for the image to load
    img.onload = () => {
      // Once the image is loaded, proceed with pdf generation
      const DATA = this.content1.nativeElement;

      // Increase PDF width
      const pdfWidth = DATA.offsetWidth + 10; // Adjust the value as needed

      const doc = new jsPDF({
        orientation: 'portrait', // or 'landscape'
        unit: 'pt',
        format: [pdfWidth, 595], // Adjust the height (595 is A4 height)
      });

      // Define the position and dimensions of the image
      const imgX = 20; // Adjust X position as needed
      const imgY = 20; // Adjust Y position as needed
      const imgWidth = 60; // Adjust image width as needed
      const imgHeight = 60; // Adjust image height as needed

      // Add the image to PDF
      doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

      // Add the rest of the content
      doc.html(DATA, {
        callback: (doc) => {
          doc.save(`${this.country_code}_${this.customer_id}_user.pdf`);
          this.spinner.close();
        },
      });
    };
  }

  shareUrlviashare: any;
  address: any;
  do() {
    this._apiservice
      .ClassOneToEightUrl(
        this.country_code,
        this.customer_id,
        this.user_id_static,
        this.map_location_display_name,
        this.ticket_booking_datetime,
        // this.address,
        this.sharelocationid,
        this.token_data
      )
      .subscribe({
        next: (res: any) => {
          this.shareUrlviashare = res.data;
          // console.log(this.shareUrlviashare, 'card');
        },
      });

    if (navigator['share']) {
      navigator['share']({
        title: 'Activity Completion Certificate',
        text: 'Check out ACtivity Certificate — it rocks!',
        url: this.shareUrlviashare,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }
  //! -------------------------------  End  --------------------------------!//
}
export interface PeriodicElement {
  col1: number;
  col2: number;
  col3: string;
  col4: string;
}
