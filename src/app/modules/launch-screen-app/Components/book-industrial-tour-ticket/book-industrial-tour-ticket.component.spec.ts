import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIndustrialTourTicketComponent } from './book-industrial-tour-ticket.component';

describe('BookIndustrialTourTicketComponent', () => {
  let component: BookIndustrialTourTicketComponent;
  let fixture: ComponentFixture<BookIndustrialTourTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookIndustrialTourTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIndustrialTourTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
