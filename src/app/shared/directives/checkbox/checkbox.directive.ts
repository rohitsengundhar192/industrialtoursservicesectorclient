import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appCheckbox]',
})
export class CheckboxDirective {
  @Input() isChecked = false;

  @HostBinding('class.checked') get checked() {
    return this.isChecked;
  }
}
