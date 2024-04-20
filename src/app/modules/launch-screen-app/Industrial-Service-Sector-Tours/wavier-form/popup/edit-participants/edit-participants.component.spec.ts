import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParticipantsComponent } from './edit-participants.component';

describe('EditParticipantsComponent', () => {
  let component: EditParticipantsComponent;
  let fixture: ComponentFixture<EditParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
