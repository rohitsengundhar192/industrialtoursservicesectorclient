import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { CephService } from 'src/app/shared/services/ceph/ceph.service';

import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss'],
})
export class ViewPdfComponent implements OnInit {
  pdfContent: any;
  constructor(
    private _datashare: DataSharingService,
    public loginDialogRef: MatDialogRef<ViewPdfComponent>,
    private _spiner: CustomSpinnerService,
    private _cephService: CephService,
    private authService: JwtauthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  fileid: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  bucketName: any;
  setImageorpdf: any;
  passdata: any;
  first_name: any;
  last_name: any;
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    // console.log(token, 'token');
    console.log(this.data, 'data');
    this.first_name = this.data.first_name;
    this.last_name = this.data.last_name;

    this.bucketName = `${this.country_code}-${this.customer_id}`;

    this._datashare.share_view_pdf_userid_data.subscribe((res) => {
      this.fileid = res;
      this.setImageorpdf = [];
      this.passdata = [];
      this._cephService
        .getFileMultipleFilesBasedOnKey(this.bucketName, this.fileid)
        .subscribe((res) => {
          this.setImageorpdf = res[0].name;
          const fileNameWithExtension = res[0].name;
          const [fileName, fileExtension] = fileNameWithExtension.split('.');
          this.setImageorpdf = `.${fileExtension}`;

          console.log(this.setImageorpdf, 'setimage');

          if (this.setImageorpdf == '.pdf') {
            this.passdata = 1;
            this._datashare.share_view_pdf_data.subscribe((res) => {
              this.pdfContent = res;
            });
          } else {
            this.passdata = 2;
            for (let k = 0; k < res.length; k++) {
              const element = res[k];
              this.imagedata.push({
                images: 'data:*;base64,' + res[k].file,
                file_name: res[k].name,
                gallery_cloud_file_id: res[k].name,
              });
            }
          }
        });
    });
  }
  onNoClick(): void {
    this.loginDialogRef.close(true);
  }

  fileFormat: any;
  imagedata: any[] = [];
  getfile() {
    this._spiner.open();
    this._cephService.getFile(this.bucketName, this.fileid).subscribe((res) => {
      // console.log(res);
      if (res) {
        this._spiner.close();
      }

      if (this.setImageorpdf == '.pdf') {
        console.log('pdf works');

        const blob = new Blob([res], { type: 'application/octet-stream' });
        const downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${this.country_code}-${this.customer_id}_${this.first_name}_${this.last_name}_user.pdf`;

        link.click();
      } else {
        console.log('image works');

        const blob = new Blob([res], { type: 'application/octet-stream' });
        const downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${this.country_code}_${this.customer_id}_${this.first_name}_${this.last_name}_user.${this.setImageorpdf}`;

        link.click();
      }
    });
  }
}
