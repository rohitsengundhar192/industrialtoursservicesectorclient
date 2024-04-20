import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeFlashcardComponent } from './iframe-flashcard.component';

describe('IframeFlashcardComponent', () => {
  let component: IframeFlashcardComponent;
  let fixture: ComponentFixture<IframeFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeFlashcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframeFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
