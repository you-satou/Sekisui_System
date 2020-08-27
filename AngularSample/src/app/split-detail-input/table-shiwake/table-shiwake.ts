import { SplitOrderDetailService } from './../split-detail-input-service';
import { SplitOrderDetailShiwake,SplitOrderDetailSplit } from './../split-detail-input-interface';
import {Component, OnInit, ViewChild, Input, OnChanges} from '@angular/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'split-shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
})

export class SplitOrderDetailShiwakeTable {

   @Input() shiwakeData: SplitOrderDetailShiwake[];
   @Input() bunkatsuData: SplitOrderDetailSplit[];

  testichok: number = 10;

  shiwakeColumns: string[] = [
      'journalCode',
      'accountCode',
      'journalName',
      'orderSupplierCode',
      'orderSupplierName',
      'orderPlanAmount',
    ];

    bunkatsuColumnsName: string[] = [
      'requestDate',
      'requester',
      'approvalDate_lv1',
      'approvalPerson_lv1',
      'approvalDate_lv2',
      'approvalPerson_lv2',
    ];



    headerColspan: string[] = [
      'no',
      'orderPlanAmount',
      'comment',
      'irai',
      'shounin_1',
      'shounin_2',
      'order',
      'recieved',
      'payment',
    ]


    rows: string[] = [
      'index',
      'orderPlanAmount1',
      'comment1',
      'requestDate',
      'requester',
      'approvalDate_lv1',
      'approvalPerson_lv1',
      'approvalDate_lv2',
      'approvalPerson_lv2',
      'orderDate',
      'orderAmount',
      'recievedDate',
      'recievedAmount',
      'paymentDate',
      'paymentAmount',
    ];

    dataSource :any;
    sum: number = 0;

  constructor() {}

ngOnChanges(changes: any): void {
  //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //Add '${implements OnChanges}' to the class.
  this.sum = this.bunkatsuData.map(data =>Number(data.orderPlanAmount)).reduce((acc, value)=> (acc+value));
  this.testichok = this.testichok;
}

addNewRow(){
  this.testichok = 20;
  alert(this.testichok);
}

}
