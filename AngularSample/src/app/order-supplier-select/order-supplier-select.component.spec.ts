import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSupplierSelectComponent } from './order-supplier-select.component';

describe('OrderJournalSelectComponent', () => {
    let component: OrderSupplierSelectComponent;
    let fixture: ComponentFixture<OrderSupplierSelectComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [OrderSupplierSelectComponent]
      })
        .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(OrderSupplierSelectComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });