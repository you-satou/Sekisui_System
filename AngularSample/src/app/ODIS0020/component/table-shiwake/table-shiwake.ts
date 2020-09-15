import { ODIS0020OrderDetailList } from './../../entities/odis0020-OrderDetailList.entity';
import { DataEmitter } from './../order-detail-input.component';
import { Component, ViewChild, Input, ViewEncapsulation, Output, EventEmitter, OnInit, ViewContainerRef } from '@angular/core';
import { MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { CommonComponent } from 'app/common/common.component';
import { Const } from 'app/common/const';
import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from '../../../ODIS0060/entities/odis0060.entity';
import { SplitOrderDetailService } from '../../../ODIS0060/services/split-detail-input-service';

@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailShiwakeTable implements OnInit {

  @Input() orderData: ODIS0020OrderDetailList[];
  @Output() sendOrderData = new EventEmitter<DataEmitter>();
  @ViewChild(MatTable, { static: false }) tableShiwake: MatTable<any>;

  
  dataEmitter = new DataEmitter();

  /**
   * テーブルヘッダーのカラムを定義する。
   */
  mainHeaderColumns: string[] = [
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

  /**
   * ヘッダーサーブの定義
   */
  subHeaderColumns: string[] = [
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
  ];

  /**
   * 行のカラムの定義
   */
  bodyColumns: string[] = [
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


  constructor(
    private router: Router,
    private comCompnt: CommonComponent,
    private viewRef: ViewContainerRef,
    private service: SplitOrderDetailService,
  ) { }

  ngOnInit() { }

  /**
   * 発注予定金額の合計
   */ 
  getTotalPlanAmount() {

    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData.map(t => {
        if (t.orderPlanAmount != null || t.orderPlanAmount != '') {
          return Number(t.orderPlanAmount);
        }
      }).reduce((acc, value) => acc + value, 0);
    }
  }
  /**
   * 発注分割金額の合計
   */
  getOrderSplitAmount() {
    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(t => {
        if (t.orderSplitAmount != null || t.orderSplitAmount != '') {
          return Number(t.orderSplitAmount);
        }
      }).reduce((acc, value) => acc + value);
    }
  }

  /**
  *  発注金額の合計
  */
  getOrderAmount() {
    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(t => {
        if (t.orderAmount != null || t.orderAmount != '') {
          return Number(t.orderAmount);
        }
      }).reduce((acc, value) => acc + value, 0);
    }
  }

  /**
  *  受入金額の合計
  */
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

  /**
  *  支払金額の合計
  */
  getPaymentAmount() {
    if (this.orderData != undefined || this.orderData != null) {

      return this.orderData.map(t => {
        if (t.paymentAmount != null || t.paymentAmount != '') { return Number(t.paymentAmount) }
      }).reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   * 発注金額を設定する
   * @param $event 
   * @param dataDetail 
   */
  getDisplayData($event, dataDetail) {

    this.setRowHightlight($event);

    if (dataDetail.orderSplitAmount === null ||
      dataDetail.orderSplitAmount === undefined ||
      dataDetail.orderSplitAmount === '') {
      dataDetail.orderSplitAmount = dataDetail.orderPlanAmount;
      let rowIndex = this.orderData.indexOf(dataDetail);
      this.dataEmitter.id = rowIndex;
      this.dataEmitter.action = Const.Action.T0002;
      this.dataEmitter.selected = true;
      this.dataEmitter.data = dataDetail;
      this.sendOrderData.emit(this.dataEmitter);
    };
  }

  /**
   * 反映ボタンを押下する時行の背景色を変える。
   * @param event 
   */
  setRowHightlight(event: any) {
    // テーブル 背景色 クリア
    var wTbody = this.viewRef.element.nativeElement.querySelector('tbody');
    for (var i = 0; i < wTbody.rows.length; i++) {
      // 行 取得
      var wTr = wTbody.rows[i];
      for (var j = 0; j < wTr.cells.length; j++) {
        // セル クリア
        var wTd = wTr.cells[j];
        wTd.style.backgroundColor = Const.HighLightColour.None;
      }
    }
    // 要素取得
    var wTr = event.target.parentElement.parentElement.parentElement.parentElement;
    // 背景色 変更
    for (var i = 0; i < wTr.cells.length; i++) {
      var wTd = wTr.cells[i];
      wTd.style.backgroundColor = Const.HighLightColour.Selected;
    }

  }

  /**
   * 分割明細画面に移動する
   */
  moveToSliptDetailInput() {
    this.router.navigate([Const.UrlSetting.U0006]);
  }

  /**
   * 選択された行の背景色を変える。
   * @param $event 
   */
  onSelectHighLight($event, data: ODIS0020OrderDetailList) {

    this.comCompnt.CommonOnSelHight($event);

    // パラメータを設定。
    let rowIndex = this.orderData.indexOf(data);
    this.dataEmitter.id = rowIndex;
    this.dataEmitter.action = Const.Action.T0001;
    this.dataEmitter.selected = true;
    this.dataEmitter.data = data;

    //　親コンポーネントにデータを送る。
    this.sendOrderData.emit(this.dataEmitter);
  }

  addSplitDetail($event, selectedItem: ODIS0020OrderDetailList[]) {
    var temp1: SplitOrderDetailShiwake[] = [
      {
        journalCode: selectedItem['journalCode'],
        accountCode: selectedItem['accountCode'],
        journalName: selectedItem['journalName'],
        orderSuplierCode: selectedItem['orderSuplierCode'],
        orderSuplierName: selectedItem['orderSuplierName'],
        orderPlanAmount: selectedItem['orderPlanAmount'],
      }
    ]
    this.service.setSplitTable(temp1);

    var temp2: SplitOrderDetailSplit[] = [
      {
        orderPlanAmount: selectedItem['orderSplitAmount'],
        comment: selectedItem['comment'],
        requestDate: selectedItem['requestDate'],
        requester: selectedItem['requester'],
        approvalDate_lv1: selectedItem['approvalDate_lv1'],
        approvalPerson_lv1: selectedItem['approvalPerson_lv1'],
        approvalDate_lv2: selectedItem['approvalDate_lv2'],
        approvalPerson_lv2: selectedItem['approvalPerson_lv2'],
        orderDate: selectedItem['orderDate'],
        orderAmount: selectedItem['orderAmount'],
        recievedDate: selectedItem['recievedDate'],
        recievedAmount: selectedItem['recievedAmount'],
        paymentDate: selectedItem['paymentDate'],
        paymentAmount: selectedItem['paymentAmount'],
      }
    ]
    this.service.setDetailTable(temp2);
  }

}

