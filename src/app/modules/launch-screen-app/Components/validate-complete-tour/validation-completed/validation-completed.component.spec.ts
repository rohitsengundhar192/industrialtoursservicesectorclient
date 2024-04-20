import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationCompletedComponent } from './validation-completed.component';

describe('ValidationCompletedComponent', () => {
  let component: ValidationCompletedComponent;
  let fixture: ComponentFixture<ValidationCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
