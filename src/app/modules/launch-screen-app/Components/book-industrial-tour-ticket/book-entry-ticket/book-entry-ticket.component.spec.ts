import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEntryTicketComponent } from './book-entry-ticket.component';

describe('BookEntryTicketComponent', () => {
  let component: BookEntryTicketComponent;
  let fixture: ComponentFixture<BookEntryTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookEntryTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookEntryTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
