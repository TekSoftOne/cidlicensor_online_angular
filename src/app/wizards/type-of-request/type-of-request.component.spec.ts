import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfRequestComponent } from './type-of-request.component';

describe('TypeOfRequestComponent', () => {
  let component: TypeOfRequestComponent;
  let fixture: ComponentFixture<TypeOfRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
