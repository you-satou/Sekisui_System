import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderJournalSelectComponent } from './order-journal-select.component';

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