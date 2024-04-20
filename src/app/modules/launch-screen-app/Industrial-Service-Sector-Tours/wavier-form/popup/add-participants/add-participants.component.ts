import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthService } from 'src/app/shared/services/api/jwtauth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-add-participants',
  templateUrl: './add-participants.component.html',
  styleUrls: ['./add-participants.component.scss'],
})
export class AddParticipantsComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup = this._formBuilder.group({
    sel1: new FormControl('', Validators.required),
    sel2: new FormControl('', Validators.required),
    sel3: new FormControl('', Validators.required),
    sel4: new FormControl('', Validators.required),
  });
  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  searchWords: any;
  category: any;
  selectvolunteerlist: any;
  selectedauthorizerlist: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  category_id: any;
  category_name: any;
  waiver_form_volunteer_user_id: any;
  waiver_form_authorized_by_user_id: any;
  row: any;
  cantegory_name: any;
  addparticipantsdisable: boolean = true;
  disablebtn: boolean = true;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<AddParticipantsComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogueData: any,
    private authService: JwtauthService,
    private _apiservice: ApiService,
    private _snackbar: SnackBarService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    console.log(this.dialogueData,'di');
    

    this.category_id = this.dialogueData.user_category_id;
    this.category_name = this.dialogueData.user_category_name;

    console.log(this.category_id, 'cate');

    //Display Participants:
    if (this.category_id != undefined) {
      this._apiservice
        .getAddParticipantspopup(
          this.country_code,
          this.customer_id,
          this.category_id
        )
        .subscribe((res) => {
          this.contact_addstudents = res.data;
          // console.log(this.contact_addstudents.length, 'cont');
          if (this.contact_addstudents.length == 0) {
            this._snackbar.success('Data Not Found');
          }
        });

      //Call category for volunteer and authorizer
      this.selectCategoryVolAuth();
      this.selectCategoryAuthAlone();
    }
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  save() {
    let body: any = {
      country_code: this.country_code,
      customer_id: this.customer_id,
      waiver_form_uploaded_by_user_id: this.user_id_login,
      waiver_form_volunteer_user_id: this.waiver_form_volunteer_user_id,
      waiver_form_authorized_by_user_id: this.waiver_form_authorized_by_user_id,
      waiver_form_for_participant_user_id: this.checkeduserid,
      login_id: this.user_id_login,
    };

    this._apiservice.insertAdduserDownloadForms(body).subscribe((res) => {
      if (res.statusCode == 200) {
        this._snackbar.success(res.message);
        this.onNoClick();
      } else {
        this._snackbar.error(res.message);
      }
    });
    this.loginDialogRef.close({ event: true, data: 'true' });
  }

  selectgetdatavolunteer(e: any) {
    this.addparticipantsdisable = false;
    this.cantegory_name = e.user_category_name;
    this.category_id = e.user_category_id;
    this._apiservice
      .getAddVolPopup(this.country_code, this.customer_id, this.category_id)
      .subscribe((res) => {
        this.selectvolunteerlist = res.data;
      });
  }

  selectgetdataauthorizer(e: any) {
    this.addparticipantsdisable = false;
    this.cantegory_name = e.user_category_name;
    this.category_id = e.user_category_id;
    this._apiservice
      .getAddAuthPopup(this.country_code, this.customer_id, this.category_id)
      .subscribe((res) => {
        this.selectedauthorizerlist = res.data;
      });
  }

  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
  }
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
  changedata(e: any) {
    this.checkeduserid = this.selection.selected.map((item) => item.user_id);
    console.log(this.checkeduserid);

    if (this.checkeduserid.length > 0) {
      this.disablebtn = false;
    } else {
      this.disablebtn = true;
    }
  }

  selectCategoryVolAuth() {
    this._apiservice
      .getDropDownCategoryVolAuth(
        this.country_code,
        this.customer_id,
        this.category_id
      )
      .subscribe((data_1) => {
        this.category = data_1.data;
      });
  }

  category_auth_alone: any;
  selectCategoryAuthAlone() {
    this._apiservice
      .getDropDownCategoryAuthAlone(
        this.country_code,
        this.customer_id,
        this.category_id
      )
      .subscribe((data_1) => {
        this.category_auth_alone = data_1.data;
      });
  }
  selectvolun(e: any) {
    this.waiver_form_volunteer_user_id = e.user_id;
  }
  selectauth(e: any) {
    this.waiver_form_authorized_by_user_id = e.user_id;
  }
  //* ------------------------------ Helper Function -----------------------*//
  contact_addstudents: any;
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
  //! -------------------------------  End  --------------------------------!//
}
