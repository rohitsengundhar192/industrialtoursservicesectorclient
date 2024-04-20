import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingForConfirmationComponent } from './pending-for-confirmation.component';

describe('PendingForConfirmationComponent', () => {
  let component: PendingForConfirmationComponent;
  let fixture: ComponentFixture<PendingForConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingForConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingForConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
