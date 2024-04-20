import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeResourcesComponent } from './iframe-resources.component';

describe('IframeResourcesComponent', () => {
  let component: IframeResourcesComponent;
  let fixture: ComponentFixture<IframeResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeResourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframeResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
