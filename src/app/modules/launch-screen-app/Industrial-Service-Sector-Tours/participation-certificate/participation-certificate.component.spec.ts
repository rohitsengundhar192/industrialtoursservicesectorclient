import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationCertificateComponent } from './participation-certificate.component';

describe('ParticipationCertificateComponent', () => {
  let component: ParticipationCertificateComponent;
  let fixture: ComponentFixture<ParticipationCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipationCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipationCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
