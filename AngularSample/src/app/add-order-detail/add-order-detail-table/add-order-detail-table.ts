import { AddOrderDetailComponent } from './../add-order-detail.component';
import { element } from 'protractor';
import { SplitOrderDetailService } from './../../split-detail-input/split-detail-input-service';
import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from './../../split-detail-input/split-detail-input-interface';
import { Component, OnInit, ViewChild, Input, OnChanges, ViewEncapsulation, ElementRef } from '@angular/core';

@Component({
  selector: 'add-order-detail-table',
  styleUrls: ['add-order-detail-table.css'],
  templateUrl: './add-order-detail-table.html',
  encapsulation: ViewEncapsulation.None,
})

export class AddOrderDetailShiwakeTable extends AddOrderDetailComponent implements OnInit {

  @Input() shiwakeData: SplitOrderDetailShiwake[];
  @Input() bunkatsuData: SplitOrderDetailSplit[];


  totalOrderAmount: number;
  totalRecievedAmount: number;
  totalPaymentAmount: number;
  totalOrderPlanAmount: Number;
   
  shiwakeColumns: string[] = [
    'journalCode',
    'accountCode',
    'journalName',
    'orderSupplierCode',
    'orderSupplierName',
    'orderPlanAmount',
  ];

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

      return this.bunkatsuData.map(t => Number(t.orderPlanAmount)).reduce((acc, value) => acc + value, 0);
    }

    getTotalAmount(){

      this.bunkatsuData.forEach( data =>{
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
