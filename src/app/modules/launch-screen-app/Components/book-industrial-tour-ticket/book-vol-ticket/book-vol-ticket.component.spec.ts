import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookVolTicketComponent } from './book-vol-ticket.component';

describe('BookVolTicketComponent', () => {
  let component: BookVolTicketComponent;
  let fixture: ComponentFixture<BookVolTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookVolTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookVolTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
