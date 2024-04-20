import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WavierFormComponent } from './wavier-form.component';

describe('WavierFormComponent', () => {
  let component: WavierFormComponent;
  let fixture: ComponentFixture<WavierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WavierFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WavierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
