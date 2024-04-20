import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedToursComponent } from './confirmed-tours.component';

describe('ConfirmedToursComponent', () => {
  let component: ConfirmedToursComponent;
  let fixture: ComponentFixture<ConfirmedToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmedToursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmedToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
