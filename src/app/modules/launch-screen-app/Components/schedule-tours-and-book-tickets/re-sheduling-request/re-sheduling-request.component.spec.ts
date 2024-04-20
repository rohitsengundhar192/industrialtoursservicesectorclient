import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReShedulingRequestComponent } from './re-sheduling-request.component';

describe('ReShedulingRequestComponent', () => {
  let component: ReShedulingRequestComponent;
  let fixture: ComponentFixture<ReShedulingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReShedulingRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReShedulingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
