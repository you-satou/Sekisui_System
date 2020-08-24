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


  totalOrderAmount: number;
  totalRecievedAmount: number;
  totalPaymentAmount: number;
  totalOrderPlanAmount: Number;
   
  columnsSpan: string[] = [
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
  ];

  detailColumns: string[] = [
    'journalCode',
    'accountCode',
    'journalName',
    'orderSupplierCode',
    'orderSupplierName',
    'orderPlanAmount1',
    'display',
    'split',
    'orderPlanAmount2',
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
    'orderSupplierDate',
    'orderSupplierAmount',
    'recievedDate',
    'recievedAmount',
    'paymentDate',
    'paymentAmount',
  ];

  headerColumns: string[] = [
    'shiwakeCode',
    'keiriCode',
    'shiwakeName',
    'hacchuSaki',
    'hacchuKingaku',
    'hanei',
    'bunkatsu',
    'yoteiKigaku',
    'irai',
    'shounin_lv1',
    'shounin_lv2',
    'hacChu',
    'ukeIre',
    'shiHarai',

  ];

  dataSource: any;
  marginleftPx: number;

  getTotalPlanAmount() {
    
    return this.shiwakeData.map(t => Number(t.orderPlanAmount)).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount(){

    this.shiwakeData.forEach( data =>{
      this.totalRecievedAmount += Number(data.recievedAmount);
      this.totalOrderAmount += Number(data.orderAmount); 
      this.totalPaymentAmount += Number(data.paymentAmount); 
    }

    )
  }


  ngOnInit() {
    this.getTotalAmount();
  }

  getDetail($event, dataDetail){

    let shiwakeCode = dataDetail.journalCode;

    
    alert(dataDetail.journalCode);

  }

}
