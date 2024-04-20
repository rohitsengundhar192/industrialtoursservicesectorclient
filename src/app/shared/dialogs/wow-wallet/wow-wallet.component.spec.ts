import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WowWalletComponent } from './wow-wallet.component';

describe('WowWalletComponent', () => {
  let component: WowWalletComponent;
  let fixture: ComponentFixture<WowWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WowWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WowWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
