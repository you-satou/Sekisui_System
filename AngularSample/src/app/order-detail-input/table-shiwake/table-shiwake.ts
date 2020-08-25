import { OrderDetailInputComponent } from './../order-detail-input.component';
import { element } from 'protractor';
import { OrderDetailApprovalService } from './../../order-detail-approval/order-detail-service';
import { OrderDetailShiwake,OrderDetailSplit } from './../order-detail-input-interface';
import { Component, OnInit, ViewChild, Input, OnChanges, ViewEncapsulation, ElementRef } from '@angular/core';

@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailShiwakeTable extends OrderDetailInputComponent implements OnInit {

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

    displayColumn: string[]=[
      'display',
    ]

    dataSource :any;

    marginleftPx:number;


    // OnInit(){
    // this.marginleftPx = document.getElementById('shiwakeTbl').clientWidth + 20;

    //  }

    getTotalPlanAmount() {

      return this.shiwakeData.map(t => Number(t.orderPlanAmount)).reduce((acc, value) => acc + value, 0);
    }


}
