import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourSitesComponent } from './tour-sites.component';

describe('TourSitesComponent', () => {
  let component: TourSitesComponent;
  let fixture: ComponentFixture<TourSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourSitesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
