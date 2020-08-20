import { OrderDetailApprovalService } from './../../order-detail-approval/order-detail-service';
import { OrderDetailShiwake } from './../order-detail-input-interface';
import {Component, OnInit, ViewChild, Input, OnChanges} from '@angular/core';


@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
})

export class OrderDetailShiwakeTable {

   @Input() shiwakeData: OrderDetailShiwake[];

  displayedColumns: string[] = [
      'journalCode',
      'accountCode', 
      'journalName',
      'orderSupplier', 
      'orderPlanAmount',
    ];

    dataSource :any;
  
  constructor(){}

}
