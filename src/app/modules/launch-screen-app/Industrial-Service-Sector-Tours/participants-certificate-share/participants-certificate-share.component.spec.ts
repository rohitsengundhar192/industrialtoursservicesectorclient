import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsCertificateShareComponent } from './participants-certificate-share.component';

describe('ParticipantsCertificateShareComponent', () => {
  let component: ParticipantsCertificateShareComponent;
  let fixture: ComponentFixture<ParticipantsCertificateShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantsCertificateShareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantsCertificateShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
