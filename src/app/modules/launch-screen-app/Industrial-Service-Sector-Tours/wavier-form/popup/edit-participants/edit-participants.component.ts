import { ApiService } from 'src/app/shared/services/api/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';

import { environment } from 'src/environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { map } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { UserProfileComponentComponent } from 'src/app/shared/dialogs/user-profile-component/user-profile-component.component';

@Component({
  selector: 'app-edit-participants',
  templateUrl: './edit-participants.component.html',
  styleUrls: ['./edit-participants.component.scss'],
})
export class EditParticipantsComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  firstFormGroup = this._formBuilder.group({
    sel1: new FormControl('', Validators.required),
    sel2: new FormControl('', Validators.required),
    sel3: new FormControl('', Validators.required),
    sel4: new FormControl('', Validators.required),
  });

  get sel1() {
    return this.firstFormGroup.get('sel1');
  }
  get sel2(): any {
    return this.firstFormGroup.get('sel2');
  }
  get sel3(): any {
    return this.firstFormGroup.get('sel3');
  }
  get sel4(): any {
    return this.firstFormGroup.get('sel4');
  }

  //* -----------------------  Variable Declaration  -----------------------*//
  login_status = true;
  user_category_id: any;
  details: any;
  listofUserId: string[] = [];
  form!: FormGroup;
  searchContact: any;
  getAllUser: any;
  contact_list: any;
  s: any;
  category: any[] = [];
  searchText!: string;
  array_1: any[] = [];
  user_id: any;
  submit_status = false;
  country_code: any;
  customer_id: any;
  data_Val_data: any;
  user_id_login: any;
  category_id: any;
  contact_addstudents: any;
  category_name: any;
  open_auth_category: any;
  open_vol_category: any;
  open_auth_id: any;
  open_vol_id: any;
  participants_user_category: any;
  user_category_id_now: any;
  nottaggeduser: any;

  selected_user_id: any;
  push_Data: any[] = [];
  waiver_form_id: any;
  category_auth_alone:any;
  //* ---------------------------  Constructor  ----------------------------*//

  constructor(
    public loginDialogRef: MatDialogRef<EditParticipantsComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private api_service: ApiService,
    private _dataShare: DataSharingService,
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

    this.selected_user_id = [this.data];

    this.open_vol_category = this.data.voluteer_info.vol_category;
    this.open_auth_category = this.data.auth.auth_category;
    this.open_auth_id = this.data.authorizer_id;
    this.open_vol_id = this.data.volunteer_id;
    this.participants_user_category = this.data.category;
    this.user_category_id_now = this.data.cat;
    this.waiver_form_id = this.data.waiver_form_id;
    // console.log(this.waiver_form_id, 'dat');
    this.selectCategory();
    this.selectCategoryAuth();
    this.firstFormGroup.controls['sel1'].patchValue(
      this.data.voluteer_info.category_vol
    );
    this.firstFormGroup.controls['sel3'].patchValue(
      this.data.auth.category_aut
    );

    this.firstFormGroup.controls['sel2'].patchValue(
      this.data.voluteer_info.first_name
    );
    this.firstFormGroup.controls['sel4'].patchValue(this.data.auth.first_name);

    this.category_id = this.data.user_category_id;
    console.log(this.data,'data');
    
    this.category_name = this.data.user_category_name;
    if (this.user_category_id_now != undefined) {
      this.api_service
        .getAddParticipantspopup(
          this.country_code,
          this.customer_id,
          this.user_category_id_now
        )
        .subscribe((res) => {
          this.contact_addstudents = res.data;

          this.data_for_checked();

          let pushdata: any[] = [];
          for (let i = 0; i < this.contact_addstudents.length; i++) {
            const element = this.contact_addstudents[i];
            this.nottaggeduser = element;
            pushdata.push(this.nottaggeduser.user_id);
          }
          this.datapush.push(...pushdata);
        });
    }

    this.api_service
      .getDropDownCategoryVolAuth(this.country_code, this.customer_id,this.user_category_id_now)
      .subscribe((data) => {
        this.s = data.data;
      });

    // this._dataShare.datasouce_table_change_data.subscribe((res) => {
    //   this.data_Val_data = res;
    // });

    this.addparticipantsdisable = false;
    this.api_service
      .getAddVolPopup(
        this.country_code,
        this.customer_id,
        this.open_vol_category
      )
      .subscribe((res) => {
        // this._spiner.close();
        this.selectvolunteerlist = res.data;
      });

    this.api_service
      .getAddAuthPopup(
        this.country_code,
        this.customer_id,
        this.open_auth_category
      )
      .subscribe((res) => {
        // this._spiner.close();
        this.selectedauthorizerlist = res.data;
      });
  }

  onNoClick(): void {
    this.loginDialogRef.close();
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  onsubmit() {
    this.loginDialogRef.close({ data: { login_status: this.login_status } });
    this.api_service
      .getDropDownCategoryVolAuth(this.country_code, this.customer_id,this.category_id)
      .subscribe((data_1) => {
        this.category = data_1;
      });
  }
  selectCategory() {
    // this._spiner.open();
    this.api_service
      .getDropDownCategoryVolAuth(this.country_code, this.customer_id,this.user_category_id_now)
      .subscribe((data_1) => {
        if (data_1) {
          // this._spiner.close();
        }
        this.category = data_1.data;
      });
  }
  selectCategoryAuth() {
    // this._spiner.open();
    this.api_service
      .getDropDownCategoryAuthAlone(this.country_code, this.customer_id,this.user_category_id_now)
      .subscribe((data_1) => {
        if (data_1) {
          // this._spiner.close();
        }
        this.category_auth_alone = data_1.data;
      });
  }

  select() {
    // this._spiner.open();
    // this.api_service
    //   .data_table_not_display(
    //     this.country_code,
    //     this.customer_id,
    //     this.user_category_id.user_category_id
    //   )
    //   .subscribe((data) => {
    //     if (data) {
    //       this._spiner.close();
    //     }
    //     this.details = data.data;
    //     this.contact_list = this.details;
    //   });
  }
  disablebtn: boolean = true;
  check_add_user(data: any) {
    this.array_1.push(data);

    if (this.submit_status == false) {
      this.submit_status = !this.submit_status;
    }
  }
  add_participants() {
    // if (this.submit_status == true) {
    //   this.submit_status = !this.submit_status;
    // }
    // for (let i = 0; i < this.array_1.length; i++) {
    //   const element = this.array_1[i];
    //   this.api_service
    //     .addParticipants(
    //       this.country_code,
    //       this.customer_id,
    //       this.user_id_login,
    //       element.user_id
    //     )
    //     .subscribe((res) => {
    //       if (res.statusCode == 201) {
    //         // this._snackbar.success(res.message);
    //       } else {
    //         // this._snackbar.error(res.message);
    //       }
    //       this.select();
    //     });
    // }
  }

  row: any;
  cantegory_name: any;
  addparticipantsdisable: boolean = true;
  selectvolunteerlist: any[] = [];

  selectgetdatavolunteer(e: any) {
    this.addparticipantsdisable = false;
    this.cantegory_name = e.user_category_name;
    this.category_id = e.user_category_id;

    // this._spiner.open();

    this.api_service
      .getAddVolPopup(this.country_code, this.customer_id, this.category_id)
      .subscribe((res) => {
        // this._spiner.close();
        this.selectvolunteerlist = res.data;
      });
  }
  waiver_form_volunteer_user_id: any;
  selectvolun(e: any) {
    this.waiver_form_volunteer_user_id = e.user_id;
  }
  selectedauthorizerlist: any[] = [];
  selectgetdataauthorizer(e: any) {
    this.addparticipantsdisable = false;
    this.cantegory_name = e.user_category_name;
    this.category_id = e.user_category_id;

    this._spiner.open();

    this.api_service
      .getAddAuthPopup(this.country_code, this.customer_id, this.category_id)
      .subscribe((res) => {
        this._spiner.close();
        this.selectedauthorizerlist = res.data;
      });
  }
  waiver_form_authorized_by_user_id: any;
  selectauth(e: any) {
    this.waiver_form_authorized_by_user_id = e.user_id;
  }
  //* --------------------------  Public methods  --------------------------*//

  //* ------------------------------ Helper Function -----------------------*//
  addUserToGroup(userId: any) {
    if (this.listofUserId.length == 0) {
      this.listofUserId.push(userId.user_id);
    } else {
      const isExist = this.listofUserId.includes(userId.user_id);
      if (isExist == true) {
        let index = this.listofUserId.indexOf(userId.user_id);
        this.listofUserId.splice(index, 1);
      } else {
        this.listofUserId.push(userId.user_id);
      }
    }
  }
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
  datatopush: any[] = [];
  data_for_checked() {
    let filterdata = (user_id: any) => {
      for (let i = 0; i < this.selected_user_id.length; i++) {
        if (this.selected_user_id[i].user_id == user_id) {
          return 0;
        }
      }
      return -1;
    };

    for (let p = 0; p < this.contact_addstudents.length; p++) {
      if (filterdata(this.contact_addstudents[p].user_id) == 0)
        this.selection.select(this.contact_addstudents[p]);
    }
  }
  datapush: any[] = [];

  flr_user() {
    let api_data = this.selected_user_id;
    let all_data: any[] = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      const element = this.selection.selected[i];
      all_data.push(element.user_id);
    }
    let flr = (user_id: any) => {
      for (let index = 0; index < api_data.length; index++) {
        if (api_data[index].user_id == user_id) {
          return 0;
        }
      }
      return -1;
    };

    let data_for_insert: any[] = [];
    let data_for_skip: any[] = [];

    for (let i = 0; i < all_data.length; i++) {
      // console.log(flr(all_data[i]), 'all');

      if (flr(all_data[i]) == -1) {
        data_for_insert.push(all_data[i]);
      }
      if (flr(all_data[i]) == 0) {
        data_for_skip.push(all_data[i]);
      }
    }

    //to remove data
    let data_for_remove: any[] = [];
    let flr_for_delete = (user_id: any) => {
      for (let index = 0; index < data_for_skip.length; index++) {
        if (data_for_skip[index] == user_id) {
          return 0;
        }
      }
      return -1;
    };
    for (let i = 0; i < api_data.length; i++) {
      if (flr_for_delete(api_data[i].user_id) == -1) {
        data_for_remove.push(api_data[i].user_id);
      }
    }
    return {
      data_for_insert,
      data_for_remove,
      data_for_skip,
    };
  }
  dataremove: any;
  fin_vol_id: any;
  fin_auth_id: any;
  fin_vol_cat: any;
  checkeduserid_id: any;
  Update() {
    let selectedVol = this.sel2.value;
    this.selectvolunteerlist.map((res) => {
      if (res.first_name == selectedVol) {
        this.fin_vol_id = res.user_id;
      }
    });
    let selectedauth = this.sel4.value;
    this.selectedauthorizerlist.map((res) => {
      if (res.first_name == selectedauth) {
        this.fin_auth_id = res.user_id;
      }
    });
    let selectedvolcategory = this.sel4.value;
    this.category.map((res) => {
      if (res == selectedvolcategory) {
        this.fin_vol_cat = res;
      }
    });
    let pushhh: any[] = [];
    this.checkeduserid_id = this.selection.selected.map((item) => item.user_id);
    let body: any = {
      country_code: this.country_code,
      customer_id: this.customer_id,
      waiver_form_uploaded_by_user_id: this.user_id_login,
      waiver_form_volunteer_user_id: this.fin_vol_id,
      waiver_form_authorized_by_user_id: this.fin_auth_id,
      waiver_form_for_participant_user_id: this.checkeduserid_id,
      waiver_form_id: this.waiver_form_id,
      login_id: this.user_id_login,
    };
    // console.log(body, 'body');
    this.api_service.updateeditparticipants(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this._snackbar.success(res.message);
        this.onNoClick();
      } else {
        this._snackbar.error(res.message);
      }
    });
  }

  searchWords: any;
  //mat-select-students
  get searchWord() {
    return this.contact_addstudents.filter((conversation: any) => {
      return (
        conversation.first_name
          .toLowerCase()
          .includes(this.searchWords.toLowerCase()) |
        conversation.last_name
          .toLowerCase()
          .includes(this.searchWords.toLowerCase())
      );
    });
  }
  openedChange(opened: boolean) {
    if (opened === true) {
      this.searchWords = null;
    }
  }
  changedata(checked: any) {
    // let use_ids:any
    this.checkeduserid = this.selection.selected.map((item) => item.user_id);
    if (this.checkeduserid.length > 0) {
      this.disablebtn = false;
    } else {
      this.disablebtn = true;
    }
  }
  //! -------------------------------  End  --------------------------------!//
  //checkbox
  selection = new SelectionModel<any>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.contact_addstudents.length;
    return numSelected === numRows;
  }

  checkeduserid: any;
  selectAllChecked: boolean = false;
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.contact_addstudents.forEach((row: any) =>
        this.selection.select(row)
      );
    }
  }
}
