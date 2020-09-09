import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfCustomerComponent } from './type-of-customer.component';

describe('TypeOfCustomerComponent', () => {
  let component: TypeOfCustomerComponent;
  let fixture: ComponentFixture<TypeOfCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
