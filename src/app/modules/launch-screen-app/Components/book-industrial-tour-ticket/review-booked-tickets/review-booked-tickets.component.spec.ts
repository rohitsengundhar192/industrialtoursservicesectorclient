import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBookedTicketsComponent } from './review-booked-tickets.component';

describe('ReviewBookedTicketsComponent', () => {
  let component: ReviewBookedTicketsComponent;
  let fixture: ComponentFixture<ReviewBookedTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewBookedTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewBookedTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
