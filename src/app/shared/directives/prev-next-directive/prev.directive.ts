import { Directive, ElementRef, HostListener } from '@angular/core';
import { ImageDataService } from '../../services/Image-data/image-data.service';
import { DataSharingService } from '../../services/data-sharing/data-sharing.service';

@Directive({
  selector: '[appPrev]'
})
export class PrevDirective {

  constructor(private el:ElementRef,private imageDataService:ImageDataService,private _datashare :DataSharingService){

  }

  @HostListener('click')
  prevFunc(){

    const previousImageData = this.imageDataService.getPreviousImageData();
    console.log(previousImageData,'prev');

    this._datashare.ChangeImagePrevious(previousImageData);
    var elm = this.el.nativeElement.parentElement.parentElement.children[0];
    var item = elm.getElementsByClassName("item");
    elm.prepend(item[item.length - 1]);
  }

}
