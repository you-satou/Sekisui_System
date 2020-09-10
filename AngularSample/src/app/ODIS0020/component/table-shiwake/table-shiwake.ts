import { OrderDetailApprovalTable } from './../../../ODIS0010/component/oder-detail-approval-table';
import { ODIS0020OrderDetailList } from './../../entities/odis0020-OrderDetailList.entity';
import { OrderDetailInputComponent } from './../order-detail-input.component';
import { Component, OnInit, ViewChild, Input, OnChanges, ViewEncapsulation, ElementRef } from '@angular/core';

@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailShiwakeTable extends OrderDetailInputComponent implements OnInit {

  @Input() orderData: ODIS0020OrderDetailList[];

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
    'comment',
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
    'comment1',
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
    
      if(this.orderData != undefined || this.orderData != null){

        return this.orderData.map(t =>{
          if(t.orderPlanAmount != null || t.orderPlanAmount != ''){
            return Number(t.orderPlanAmount);
          }
        }).reduce((acc, value) => acc + value, 0);
      }
    }
    getOrderAmount() {
    
      if(this.orderData != undefined || this.orderData != null){

        return this.orderData.map(t =>{
          if(t.orderAmount != null || t.orderAmount != ''){
            return Number(t.orderAmount);
          }
        }).reduce((acc, value) => acc + value, 0);
      }
    }
    getRecievedAmount() {
    
      if(this.orderData != undefined || this.orderData != null){

        return this.orderData.map(
          t =>{if(t.recievedAmount != null || t.recievedAmount != ''){
              return Number(t.recievedAmount);
            }
          }).reduce((acc, value) => acc + value, 0);
      }
    }

  getPaymentAmount() {

    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(t => {
        if (t.paymentAmount != null || t.paymentAmount != '') { return Number(t.paymentAmount) }
      }).reduce((acc, value) => acc + value, 0);
    }
  }

  
    ngOnInit() {
    }
  
    getDetail($event, dataDetail){
  
      let shiwakeCode = dataDetail.journalCode;
  
    }


    moveToSliptDetailInput(){
      this.router.navigate(['/SplitDetailInput']);
    }

}
