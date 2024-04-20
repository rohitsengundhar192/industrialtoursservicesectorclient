import { Component, HostListener, OnInit } from '@angular/core';
import { DataSharingService } from '../shared/services/data-sharing/data-sharing.service';
import { delay, startWith } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  show: boolean = false;
  constructor(private data_sharing: DataSharingService) {}
  headerPosition: boolean = false;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.headerPosition = true;
    } else {
      this.headerPosition = false;
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.data_sharing.showTop_data
      .pipe(startWith(null), delay(0))
      .subscribe((res: boolean) => {
        let show = document.getElementById('show') as HTMLElement;

        if (res == true) {
          this.show = true;
          show.style.display = 'block';
          this.data_sharing.secondary(this.show);
        } else {
          show.style.display = 'none';
          this.show = false;
          this.data_sharing.secondary(this.show);
        }
      });
  }
}
