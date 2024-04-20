import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeCommentsComponent } from './iframe-comments.component';

describe('IframeCommentsComponent', () => {
  let component: IframeCommentsComponent;
  let fixture: ComponentFixture<IframeCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframeCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
