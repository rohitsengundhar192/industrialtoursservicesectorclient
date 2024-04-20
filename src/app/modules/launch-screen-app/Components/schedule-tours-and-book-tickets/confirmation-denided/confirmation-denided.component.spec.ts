import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDenidedComponent } from './confirmation-denided.component';

describe('ConfirmationDenidedComponent', () => {
  let component: ConfirmationDenidedComponent;
  let fixture: ComponentFixture<ConfirmationDenidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationDenidedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDenidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
