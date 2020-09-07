import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrackYourProgressComponent} from './track-your-progress.component';

describe('TrackYourProgressComponent', () => {
  let component: TrackYourProgressComponent;
  let fixture: ComponentFixture<TrackYourProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrackYourProgressComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackYourProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
