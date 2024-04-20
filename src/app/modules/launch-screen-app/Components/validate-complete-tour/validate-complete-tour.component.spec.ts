import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateCompleteTourComponent } from './validate-complete-tour.component';

describe('ValidateCompleteTourComponent', () => {
  let component: ValidateCompleteTourComponent;
  let fixture: ComponentFixture<ValidateCompleteTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateCompleteTourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateCompleteTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
