import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerDisableComponent } from './layer-disable.component';

describe('LayerDisableComponent', () => {
  let component: LayerDisableComponent;
  let fixture: ComponentFixture<LayerDisableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerDisableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerDisableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
