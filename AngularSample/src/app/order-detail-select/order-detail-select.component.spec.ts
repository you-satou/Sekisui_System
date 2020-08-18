import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailSelectComponent } from './order-detail-select.component';

describe('OrderDetailSelectComponent', () => {
  let component: OrderDetailSelectComponent;
  let fixture: ComponentFixture<OrderDetailSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
