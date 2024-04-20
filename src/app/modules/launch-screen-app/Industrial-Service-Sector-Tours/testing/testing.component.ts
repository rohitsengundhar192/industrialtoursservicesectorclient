import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TestingComponent implements OnInit {
  //* ---------------------------  Constructor  ----------------------------*//
  @ViewChild('action') scanner!: any;
  allow_access_camera: boolean = true;
  public handle(action: any, fn: string): void {
    action[fn]().subscribe((res: boolean) => console.log(fn + ': ' + res));
  }

  public onError(e: any): void {
    alert(e);
  }

  display_camera() {
    this.allow_access_camera = !this.allow_access_camera;
  }
  passdata: number = 1;
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {}

  //* ----------------------------  APIs Methods  --------------------------*//

  constructor(private fb: FormBuilder, private _snackbar: SnackBarService) {}

  ngDoCheck() {}
  numbers: any;
  scanData: any;
  //* ------------------------------ Helper Function -----------------------*//
  onEvent(e: any) {
    if (e) {
      this.numbers = e;
      this.scanData = this.numbers.data;

      if (this.scanData.match(/^[0-9]+$/)) {
        if (this.scanData != undefined) {
          //Get api customer Register
        } else {
          this.scanner.stop();

          this._snackbar.success(
            'Selected Screen Id and Scan Data are Mismatched'
          );
        }
      } else {
        // Code to execute when this.screen_id is neither 55 nor 65
        this.scanner.stop();

        this._snackbar.success('Please Check Your QR-Code');
      }
    }
  }
  //! -------------------------------  End  --------------------------------!//
}
