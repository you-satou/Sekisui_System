import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSplitApprovalMasterComponent } from './order-split-approval-master.component';

describe('OrderSplitApprovalMasterComponent', () => {
  let component: OrderSplitApprovalMasterComponent;
  let fixture: ComponentFixture<OrderSplitApprovalMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSplitApprovalMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSplitApprovalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
