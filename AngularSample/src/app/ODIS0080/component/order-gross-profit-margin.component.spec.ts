import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderGrossProfitMarginComponent } from './order-gross-profit-margin.component';

describe('ODIS0080Component', () => {
  let component: OrderGrossProfitMarginComponent;
  let fixture: ComponentFixture<OrderGrossProfitMarginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderGrossProfitMarginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderGrossProfitMarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
