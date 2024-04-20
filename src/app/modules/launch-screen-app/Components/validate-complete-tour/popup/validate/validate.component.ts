import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { CephService } from 'src/app/shared/services/ceph/ceph.service';

interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss'],
})
export class ValidateComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  city_1: Food[] = [
    { value: '0', viewValue: '1' },
    { value: '1', viewValue: '2' },
    { value: '2', viewValue: '3' },
  ];
  //* -----------------------  Variable Declaration  -----------------------*//
  ratingsData: any = 0;
  faculty_rating_value: any;
  cloudIds: any;
  bucketName: string = 'getwow-education';
  country_code: any;
  customer_id: any;
  user_id_login: any;
  industrial_tour_trip_schedule_id: any;
  ticket_for_industrial_tour_site_id: any;
  cloudId: any;
  btndisable: boolean = true;
  industrial_tour_photos_upload_cloud_file_storage_ids: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<ValidateComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: any,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _cephService: CephService,
    private cdr: ChangeDetectorRef,
    private _apiservice: ApiService,
    private authService: JwtauthService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    // For Image Display:
    this.ticket_for_industrial_tour_site_id =
      this.imageData.ticket_for_industrial_tour_site_id;
    this.industrial_tour_trip_schedule_id =
      this.imageData.industrial_tour_trip_schedule_id;
    this.industrial_tour_photos_upload_cloud_file_storage_ids =
      this.imageData.industrial_tour_photos_upload_cloud_file_storage_ids;

    let loopdata: any[] = [];
    this.cloudIds =
      this.imageData.industrial_tour_photos_upload_cloud_file_storage_ids;
    for (let q = 0; q < this.cloudIds.length; q++) {
      let gallery_cloud_file_id = this.cloudIds[q];
      let [fileName, fileExtension] = gallery_cloud_file_id.split('.');
      this._cephService
        .getFileMultipleFilesBasedOnKeymanage(this.bucketName, fileName)
        .subscribe((res) => {
          for (let k = 0; k < res.length; k++) {
            const element = res[k];
            this.imagedata.push({
              images: 'data:*;base64,' + res[k].file,
              file_name: res[k].name,
            });
          }
        });
    }
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  acceptData() {
    let body: any = {
      cloudID: this.industrial_tour_photos_upload_cloud_file_storage_ids,
    };

    this._apiservice
      .updateViewPhotosValidate(
        this.country_code,
        this.customer_id,
        this.user_id_login,
        this.industrial_tour_trip_schedule_id,
        this.ticket_for_industrial_tour_site_id,
        body
      )
      .subscribe((ress) => {
        this.onNoClick();
      });
  }
  //* --------------------------  Public methods  --------------------------*//
  optionData(res: any) {
    this.faculty_rating_value = res.value;
    this.btndisable = false;
    if (this.faculty_rating_value == 0) {
      this.ratingsData = 1;
    } else if (this.faculty_rating_value == 1) {
      this.ratingsData = 3;
    } else {
      this.ratingsData = 5;
    }
  }
  imagedata: any[] = [];
  changedata: any;
  changedata_1: any;
  currentIndex: number = 0;
  private nextButtonClick = new Subject<void>();
  Change_image_Data = this.nextButtonClick.asObservable();

  trackByFn(index: number, item: any): any {
    return index;
  }

  appnext() {
    if (this.currentIndex < this.imagedata.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }

    this.changedata = this.imagedata[this.currentIndex];
    const updatedData = {
      images: this.changedata.images,
      file_name: this.changedata.file_name,
    };
    this.imagedata[this.currentIndex] = updatedData;
    this.cdr.detectChanges();
  }

  appprev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.imagedata.length - 1; // Wrap around to the last image if at the beginning
    }

    this.changedata_1 = this.imagedata[this.currentIndex];
    const updatedData = {
      images: this.changedata_1.images,
      file_name: this.changedata_1.file_name,
    };
    this.imagedata[this.currentIndex] = updatedData;
    this.cdr.detectChanges();
  }
  //* ------------------------------ Helper Function -----------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  //! -------------------------------  End  --------------------------------!//
}
