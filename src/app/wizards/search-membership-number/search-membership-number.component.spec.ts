import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMembershipNumberComponent } from './search-membership-number.component';

describe('SearchMembershipNumberComponent', () => {
  let component: SearchMembershipNumberComponent;
  let fixture: ComponentFixture<SearchMembershipNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMembershipNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMembershipNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
