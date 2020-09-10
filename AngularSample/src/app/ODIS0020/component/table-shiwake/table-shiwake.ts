import { OrderDetailApprovalTable } from './../../../ODIS0010/component/oder-detail-approval-table';
import { ODIS0020OrderDetailList } from './../../entities/odis0020-OrderDetailList.entity';
import { OrderDetailInputComponent } from './../order-detail-input.component';
import { SupplierPatternService } from '../../../ODIS0050/services/supplier-pattern.service';
import { Component, OnInit, ViewChild, Input, OnChanges, ViewEncapsulation, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { MatTable } from '@angular/material';
import { AppComponent } from 'app/app.component';
import { CommonService } from 'app/common/common.service';
import { Router } from '@angular/router';
import { CommonComponent } from 'app/common/common.component';

@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailShiwakeTable extends OrderDetailInputComponent {

  @Input() orderData: ODIS0020OrderDetailList[];
  @Output() sendOrderData = new EventEmitter<ODIS0020OrderDetailList>();

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
    'orderPlanAmount',
    'display',
    'split',
    'orderSplitAmount',
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

  getTotalPlanAmount() {

    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(t => {
        if (t.orderPlanAmount != null || t.orderPlanAmount != '') {
          return Number(t.orderPlanAmount);
        }
      }).reduce((acc, value) => acc + value, 0);
    }
  }

  getOrderSplitAmount() {
    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(t => {
        if (t.orderSplitAmount != null || t.orderSplitAmount != '') {
          return Number(t.orderSplitAmount);
        }
      }).reduce((acc, value) => acc + value);
    }

  }

  getOrderAmount() {
    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(t => {
        if (t.orderAmount != null || t.orderAmount != '') {
          return Number(t.orderAmount);
        }
      }).reduce((acc, value) => acc + value, 0);
    }
  }
  getRecievedAmount() {
    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(
        t => {
          if (t.recievedAmount != null || t.recievedAmount != '') {
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



  /**
   * 
   * @param $event 
   * @param dataDetail 
   */
  getDetail($event, dataDetail) {
    
    this.setRowHightlight($event);

    if (dataDetail.orderSplitAmount === null || dataDetail.orderSplitAmount == undefined) {
      dataDetail.orderSplitAmount = dataDetail.orderPlanAmount;
    };
  }

  setRowHightlight(event: any){
        // テーブル 背景色 クリア
        var wTbody = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        for (var i = 0; i < wTbody.rows.length; i++) {
          // 行 取得
          var wTr = wTbody.rows[i];
          for (var j = 0; j < wTr.cells.length; j++) {
            // セル クリア
            var wTd = wTr.cells[j];
            wTd.style.backgroundColor = '';
          }
        }
        // 要素取得
        var wTr = event.target.parentElement.parentElement.parentElement.parentElement;
        // 背景色 変更
        for (var i = 0; i < wTr.cells.length; i++) {
          var wTd = wTr.cells[i];
          wTd.style.backgroundColor = '#CCFFFF';
        }

  }


  moveToSliptDetailInput() {
    this.router.navigate(['/SplitDetailInput']);
  }

  /**
   * 
   * @param $event 
   * 
   */
  onSelectHighLight($event, data: ODIS0020OrderDetailList) {
    this.comCompnt.CommonOnSelHight($event);
    this.sendOrderData.emit(data);
  }


}
