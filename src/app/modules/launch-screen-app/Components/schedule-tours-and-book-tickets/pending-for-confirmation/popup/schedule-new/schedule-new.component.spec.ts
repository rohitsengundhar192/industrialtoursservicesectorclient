import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleNewComponent } from './schedule-new.component';

describe('ScheduleNewComponent', () => {
  let component: ScheduleNewComponent;
  let fixture: ComponentFixture<ScheduleNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
