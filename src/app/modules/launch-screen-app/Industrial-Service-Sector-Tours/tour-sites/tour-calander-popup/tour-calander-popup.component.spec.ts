import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCalanderPopupComponent } from './tour-calander-popup.component';

describe('TourCalanderPopupComponent', () => {
  let component: TourCalanderPopupComponent;
  let fixture: ComponentFixture<TourCalanderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourCalanderPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourCalanderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
