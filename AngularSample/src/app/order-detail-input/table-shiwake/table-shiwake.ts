import { OrderDetailShiwake, OrderDetailSplit } from './../order-detail-input-interface';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailShiwakeTable implements OnInit {

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

    displayColumn: string[] = ['display'];

    dataSource: any;

    marginleftPx: number;

    getTotalPlanAmount() {

      return this.shiwakeData.map(t => Number(t.orderPlanAmount)).reduce((acc, value) => acc + value, 0);
    }

    ngOnInit() {}

}
