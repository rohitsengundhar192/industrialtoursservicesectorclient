import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderTitleService {
  public title = new BehaviorSubject('Industrial / Service Sector Tours - Guidelines');

  constructor() {}

  setTitle(title: string) {
    this.title.next(title);
  }


}
