import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailTableComponent } from './audit-trail-table.component';

describe('AuditTrailTableComponent', () => {
  let component: AuditTrailTableComponent;
  let fixture: ComponentFixture<AuditTrailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTrailTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditTrailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
