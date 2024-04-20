import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailDialogueComponent } from './audit-trail-dialogue.component';

describe('AuditTrailDialogueComponent', () => {
  let component: AuditTrailDialogueComponent;
  let fixture: ComponentFixture<AuditTrailDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTrailDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditTrailDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
