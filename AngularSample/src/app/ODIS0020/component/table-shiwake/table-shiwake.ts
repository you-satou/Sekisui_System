import { ODIS0020OrderDetailList, ODIS0020OrderShiwake, ODIS0020OrderSplitSub } from "./../../entities/odis0020-OrderDetailList.entity";
import { DataEmitter } from "./../order-detail-input.component";
import { Component, ViewChild, Input, ViewEncapsulation, Output, EventEmitter, OnInit, ViewContainerRef } from "@angular/core";
import { MatTable, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { CommonComponent } from "app/common/common.component";
import { Const } from "app/common/const";
import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from "../../../ODIS0060/entities/odis0060.entity";
import { SplitOrderDetailService } from "../../../ODIS0060/services/split-detail-input-service";

@Component({
  selector: "shiwake-table",
  styleUrls: ["table-shiwake.css"],
  templateUrl: "./table-shiwake.html",
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailShiwakeTable implements OnInit {
  @Input() orderData: ODIS0020OrderShiwake[];
  @Output() sendOrderData = new EventEmitter<DataEmitter>();
  @ViewChild(MatTable, { static: false }) tableShiwake: MatTable<any>;

  dataEmitter = new DataEmitter();

  /**
   * テーブルヘッダーのカラムを定義する。
   */
  mainHeaderColumns: string[] = [
    "shiwakeCode",
    "keiriCode",
    "shiwakeName",
    "hacchuSaki",
    "hacchuKingaku",
    "hanei",
    "bunkatsu",
    "yoteiKigaku",
    "comment1",
    "irai",
    "shounin_lv1",
    "shounin_lv2",
    "hacChu",
    "ukeIre",
    "shiHarai",
  ];

  /**
   * ヘッダーサーブの定義
   */
  subHeaderColumns: string[] = [
    "requestDate",
    "requester",
    "approvalDate_lv1",
    "approvalPerson_lv1",
    "approvalDate_lv2",
    "approvalPerson_lv2",
  ];

  /**
   * 行のカラムの定義
   */
  bodyColumns: string[] = [
    "journalCode",
    "accountCode",
    "journalName",
    "orderSupplierCode",
    "orderSupplierName",
    "orderPlanAmount",
    "display",
    "split",
    "orderSplitAmount",
    "comment",
    "requestDate",
    "requester",
    "approvalDate_lv1",
    "approvalPerson_lv1",
    "approvalDate_lv2",
    "approvalPerson_lv2",
    "orderSupplierDate",
    "orderSupplierAmount",
    "recievedDate",
    "recievedAmount",
    "paymentDate",
    "paymentAmount",
  ];

  display : String;

  constructor(
    private router: Router,
    private comCompnt: CommonComponent,
    private viewRef: ViewContainerRef,
    private service: SplitOrderDetailService
  ) { }

  ngOnInit() {

    this.display = 'none';
   }

  // resourceData(data: ODIS0020OrderSplitSub[]) {
  //   return new MatTableDataSource<ODIS0020OrderSplitSub>(data);
  // }

  isExsted(element: ODIS0020OrderShiwake, action: string) {
    console.log(action);
    switch (action) {
      case 'irai':
        if (element.requester != '' ||
          element.requester != null ||
          element.requester != undefined) {
          return true;
        }
        return false;
      case 'shounin1':
        if (element.approvalPerson_lv1 != '' ||
          element.approvalPerson_lv1 != null ||
          element.approvalPerson_lv1 != undefined) {
          return true;
        }
        return false;
      case 'shounin2':
        if (element.approvalPerson_lv2 != '' ||
          element.approvalPerson_lv2 != null ||
          element.approvalPerson_lv2 != undefined) {
          return true;
        }
        return false;
    }

  }
  /**
   * 発注予定金額の合計
   */
  getTotalPlanAmount() {
    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData
        .map((t) => {
          if (t.orderPlanAmount != null || t.orderPlanAmount != "") {
            return Number(t.orderPlanAmount);
          }
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }
  /**
   * 発注分割金額の合計
   */
  getOrderSplitAmount() {
    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData
        .map((t) => {
          if (
            t.orderSplitAmount != null ||
            t.orderSplitAmount != ""
          ) {
            return Number(t.orderSplitAmount);
          }
        })
        .reduce((acc, value) => acc + value);
    }
  }

  /**
   *  発注金額の合計
   */
  getOrderAmount() {
    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData
        .map((t) => {
          if (
            t.orderAmount != null ||
            t.orderAmount != ""
          ) {
            return Number(t.orderAmount);
          }
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   *  受入金額の合計
   */
  getRecievedAmount() {
    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData
        .map((t) => {
          if (
            t.recievedAmount != null ||
            t.recievedAmount != ""
          ) {
            return Number(t.recievedAmount);
          }
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   *  支払金額の合計
   */
  getPaymentAmount() {
    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData
        .map((t) => {
          if (
            t.recievedAmount != null ||
            t.recievedAmount != ""
          ) {
            return Number(t.recievedAmount);
          }
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }
  /**
   * 発注金額を設定する
   * @param $event
   * @param dataDetail
   */
  getDisplayData($event, data: ODIS0020OrderShiwake) {
    this.setRowHightlight($event);
    if (data.orderPlanAmount == '' ||
      data.orderPlanAmount == null ||
      data.orderPlanAmount == undefined
    ) {
      return;
    }
    data.orderSplitAmount = data.orderPlanAmount;

  }

  /**
   * 反映ボタンを押下する時行の背景色を変える。
   * @param event
   */
  setRowHightlight(event: any) {
    // テーブル 背景色 クリア
    var wTbody = this.viewRef.element.nativeElement.querySelector("tbody");
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
    var wTr = event.target.parentElement.parentElement.parentElement;
    // 背景色 変更
    for (var i = 0; i < wTr.cells.length; i++) {
      var wTd = wTr.cells[i];
      wTd.style.backgroundColor = Const.HighLightColour.Selected;
    }
  }

  /**
   * 分割明細画面に移動する
   * @param $event
   * @param data
   */
  moveToSliptDetailInput($event, selectedItem: ODIS0020OrderShiwake) {
    try {
        let rowIndex = this.orderData.indexOf(selectedItem);

      //　選択した以降は重要データがあるかどうかをチェック

      var temp1: SplitOrderDetailShiwake[] = [];
      let tmp1 = new SplitOrderDetailShiwake();

      tmp1.tabIndex = selectedItem.tabIndex;
      tmp1.id = selectedItem.id;
      tmp1.journalCode = selectedItem.journalCode;
      tmp1.accountCode = selectedItem.accountCode;
      tmp1.journalName = selectedItem.journalName;
      tmp1.orderSuplierCode = selectedItem.orderSuplierCode;
      tmp1.orderSuplierName = selectedItem.orderSuplierName;
      tmp1.orderPlanAmount = selectedItem.orderPlanAmount;

      temp1.push(tmp1);

      let temp2: SplitOrderDetailSplit[] = [];

      this.orderData.forEach(dt => {
        
        if(dt.id == selectedItem.id){
          var tmp = new SplitOrderDetailSplit();

          tmp.orderPlanAmount = dt.orderSplitAmount;
          tmp.comment = dt.comment;
          tmp.requestDate = dt.requestDate;
          tmp.requester = dt.requester;
          tmp.approvalDate_lv1 = dt.approvalDate_lv1;
          tmp.approvalPerson_lv1 = dt.approvalPerson_lv1;
          tmp.approvalDate_lv2 = dt.approvalDate_lv2;
          tmp.approvalPerson_lv2 = dt.approvalPerson_lv2;
          tmp.orderDate = dt.orderDate;
          tmp.orderAmount = dt.orderAmount;
          tmp.recievedDate = dt.recievedDate;
          tmp.recievedAmount = dt.recievedAmount;
          tmp.paymentDate = dt.paymentDate;
          tmp.paymentAmount = dt.paymentAmount;
    
          temp2.push(tmp);
        }
      });

      console.log(temp2);
      this.service.setSplitTable(temp1);
      this.service.setDetailTable(temp2);

      this.router.navigate([Const.UrlSetting.U0006]);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 選択された行の背景色を変える。
   * @param $event
   */
  onSelectHighLight($event, data: ODIS0020OrderShiwake) {
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
}
