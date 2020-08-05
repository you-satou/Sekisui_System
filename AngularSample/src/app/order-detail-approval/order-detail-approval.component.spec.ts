import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailApprovalComponent } from './order-detail-approval.component';

describe('OrderDetailApprovalComponent', () => {
  let component: OrderDetailApprovalComponent;
  let fixture: ComponentFixture<OrderDetailApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
