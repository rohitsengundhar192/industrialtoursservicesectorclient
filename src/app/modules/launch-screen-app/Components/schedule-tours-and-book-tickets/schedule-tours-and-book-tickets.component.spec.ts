import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleToursAndBookTicketsComponent } from './schedule-tours-and-book-tickets.component';

describe('ScheduleToursAndBookTicketsComponent', () => {
  let component: ScheduleToursAndBookTicketsComponent;
  let fixture: ComponentFixture<ScheduleToursAndBookTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleToursAndBookTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleToursAndBookTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
