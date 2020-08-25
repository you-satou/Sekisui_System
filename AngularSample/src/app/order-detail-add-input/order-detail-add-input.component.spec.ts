import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderSupplierSelectComponent } from '../order-supplier-select/order-supplier-select.component';
import { OrderDetailAddInputComponent } from './order-detail-add-input.component';

//OrderDetailAddInputComponent
describe('OrderDetailAddInputComponent', () => {
    let component: OrderDetailAddInputComponent;
    let fixture: ComponentFixture<OrderDetailAddInputComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [OrderDetailAddInputComponent]
      })
        .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(OrderDetailAddInputComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

//OrderJournalSelectComponent
describe('OrderJournalSelectComponent', () => {
    let component: OrderJournalSelectComponent;
    let fixture: ComponentFixture<OrderJournalSelectComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [OrderJournalSelectComponent]
      })
        .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(OrderJournalSelectComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  //OrderSupplierSelectComponent
  describe('OrderSupplierSelectComponent', () => {
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