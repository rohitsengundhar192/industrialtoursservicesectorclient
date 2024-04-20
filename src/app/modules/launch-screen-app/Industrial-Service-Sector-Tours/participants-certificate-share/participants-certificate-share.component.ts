import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';


@Component({
  selector: 'app-participants-certificate-share',
  templateUrl: './participants-certificate-share.component.html',
  styleUrls: ['./participants-certificate-share.component.scss']
})
export class ParticipantsCertificateShareComponent implements OnInit  {
  inst_name: any;
  inst_add1: any;
  inst_add2: any;
  inst_city: any;
  inst_state: any;
  inst_pin: any;
  inst_customer_logo: any;
  customer_sub_domain_name: any;
  user_id_login: any;
  country_code: any;
  customer_id: any;
  user_id: any;
  names: any;

  //table
  showdatatopchange: boolean = false;
  booking_date: any;
  array: any;
  showdata: any;
  camp_site: any;
  decrypt_token: any;
  constructor(
    private data_sharing: DataSharingService,
    private route: ActivatedRoute,
    private _apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (res) => {
        this.decrypt_token = res;
        this._apiService
          .decryptCode(this.decrypt_token.token)
          .subscribe((res: any) => {
            console.log(res, 'de');

            this.country_code = res.split(',')[0];
            this.customer_id = res.split(',')[1];
            this.user_id = res.split(',')[2];

            if (this.country_code != undefined) {
              this.namesdata();
              this.instidata();
              this.tabledata();
            }
          });
      },
    });

    this.data_sharing.update_showTop_data(false);
    // this.data_sharing.update_show_side(false);
  }

  namesdata() {
    this._apiService
      .first_student_data(this.country_code, this.customer_id, this.user_id)
      .subscribe((res) => {
        if (res.statusCode != 200) {
        } else {
          this.names = res?.data[0];
          // console.log(this.names, 'names');
        }
      });
  }
  currentPage: number = 0;
  pageSize: number = 5;
  activity_name: any;
  camp_name: any;
  actitvity_date: any;
  tabledata() {
    this._apiService
      .table_student_data(
        this.country_code,
        this.customer_id,
        this.user_id,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res) => {
        if (res != undefined) {
          this.showdatatopchange = false;
          this.activity_name = res.data[0].camp_site_name[0].activity_name;
          this.camp_name = res.data[0].camp_site_name[0].camp_site_name;
          this.actitvity_date =
            res.data[0].booking_date[0].ticket_booking_datetime;
        }
      });
  }

  instidata() {
    this._apiService.institutiondata(this.customer_id).subscribe((res) => {
      console.log(res,'res for insti data');
      
      this.inst_add1 = res.data[0].address_line_1;
      this.inst_add2 = res.data[0].address_line_2;
      this.inst_city = res.data[0].city_district_county;
      this.inst_state = res.data[0].state_province;
      this.inst_pin = res.data[0].pin_code;
      this.customer_sub_domain_name = res.data[0].sub_domain_name;
      // this.data_sharing.update_show_side(true);
      this.inst_name = res.data[0].registered_educational_institution_name;
      this.inst_customer_logo = ` ${'https://cephapi.getwow.biz/api/storage/'}${
        this.country_code
      }-${this.customer_id}/${this.customer_sub_domain_name}-icon-128x128.png`;
    });
  }
}
