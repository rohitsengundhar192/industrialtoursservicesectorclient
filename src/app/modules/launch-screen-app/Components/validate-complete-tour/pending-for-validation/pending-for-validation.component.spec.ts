import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingForValidationComponent } from './pending-for-validation.component';

describe('PendingForValidationComponent', () => {
  let component: PendingForValidationComponent;
  let fixture: ComponentFixture<PendingForValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingForValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingForValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
