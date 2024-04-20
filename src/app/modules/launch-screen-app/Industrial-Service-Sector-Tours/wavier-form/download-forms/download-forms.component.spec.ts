import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFormsComponent } from './download-forms.component';

describe('DownloadFormsComponent', () => {
  let component: DownloadFormsComponent;
  let fixture: ComponentFixture<DownloadFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
