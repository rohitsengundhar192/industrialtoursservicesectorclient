import { Directive, ElementRef, HostListener } from '@angular/core';
import { ImageDataService } from '../../services/Image-data/image-data.service';
import { DataSharingService } from '../../services/data-sharing/data-sharing.service';

@Directive({
  selector: '[appNext]',
})
export class NextDirective {
  constructor(
    private el: ElementRef,
    private imageDataService: ImageDataService,
    private _datashare: DataSharingService
  ) {}

  @HostListener('click')
  nextFunc() {
    const nextImageData = this.imageDataService.getNextImageData();
    console.log(nextImageData, 'next');

    this._datashare.ChangeImage(nextImageData);

    var elm = this.el.nativeElement.parentElement.parentElement.children[0];
    var item = elm.getElementsByClassName('item');
    elm.append(item[0]);
  }
}
