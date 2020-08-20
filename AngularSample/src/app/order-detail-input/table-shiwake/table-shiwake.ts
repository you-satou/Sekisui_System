import { OrderDetailApprovalService } from './../../order-detail-approval/order-detail-service';
import { OrderDetailShiwake,OrderDetailSplit } from './../order-detail-input-interface';
import {Component, OnInit, ViewChild, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
})

export class OrderDetailShiwakeTable {

   @Input() shiwakeData: OrderDetailShiwake[];
   @Input() bunkatsuData: OrderDetailSplit[];

  shiwakeColumns: string[] = [
      'journalCode',
      'accountCode',
      'journalName',
      'orderSupplier',
      'orderPlanAmount',
    ];

    bunkatsuColumns: string[] = [
      'bunkatsu',
      'orderPlanAmount',
      'requested',
      'approval_lv1',
      'approval_lv2',
      'orderSupplier',
      'recieved',
      'payment',
    ];

    dataSource :any;

  constructor() {}

}
