import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolWalletComponent } from './vol-wallet.component';

describe('VolWalletComponent', () => {
  let component: VolWalletComponent;
  let fixture: ComponentFixture<VolWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
