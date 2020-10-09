import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutProcessLayerComponent } from './checkout-process-layer.component';

describe('CheckoutProcessLayerComponent', () => {
  let component: CheckoutProcessLayerComponent;
  let fixture: ComponentFixture<CheckoutProcessLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutProcessLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProcessLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
