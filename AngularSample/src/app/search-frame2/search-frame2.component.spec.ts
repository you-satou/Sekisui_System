import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFrameComponent2 } from './search-frame2.component';

describe('SearchFrameComponent2', () => {
  let component: SearchFrameComponent2;
  let fixture: ComponentFixture<SearchFrameComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFrameComponent2]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFrameComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
