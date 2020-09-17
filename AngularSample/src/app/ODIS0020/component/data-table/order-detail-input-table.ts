import { style } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { ODIS0020OrderShiwake } from "../../entities/odis0020-OrderDetailList.entity";
import { DataEmitter } from "../order-detail-input.component";
import { Component, ViewChild, Input, ViewEncapsulation, Output, EventEmitter, OnInit, ViewContainerRef, HostBinding } from "@angular/core";
import { MatTable } from "@angular/material";
import { Router } from "@angular/router";
import { CommonComponent } from "app/common/common.component";
import { Const } from "app/common/const";
import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from "../../../ODIS0060/entities/odis0060.entity";
import { SplitOrderDetailService } from "../../../ODIS0060/services/split-detail-input-service";
import { exit } from 'process';

@Component({
  selector: "shiwake-table",
  styleUrls: ["order-detail-input-table.css"],
  templateUrl: "./order-detail-input-table.html",
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailShiwakeTable implements OnInit {
  @Input() orderData: ODIS0020OrderShiwake[];
  @Output() sendOrderData = new EventEmitter<DataEmitter>();
  @ViewChild(MatTable, { static: false }) tableShiwake: MatTable<any>;

  systemDate: Date = new Date();
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

  constructor(
    private router: Router,
    private comCompnt: CommonComponent,
    private viewRef: ViewContainerRef,
    private service: SplitOrderDetailService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {

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
    let rowIndx = this.orderData.indexOf(data);
    this.setRowHightlight(rowIndx);

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
  setRowHightlight(rowIndex: number) {
    var wTbody = this.viewRef.element.nativeElement.querySelector("tbody");
    for (var i = 0; i < wTbody.rows.length; i++) {

      if (i === rowIndex) {
        var wTr = wTbody.rows[i];
        for (var j = 0; j < wTr.cells.length; j++) {
          var wTd = wTr.cells[j];
          wTd.style.backgroundColor = Const.HighLightColour.Selected;
        }
      }
      else {
        var wTr = wTbody.rows[i];
        for (var j = 0; j < wTr.cells.length; j++) {
          var wTd = wTr.cells[j];
          wTd.style.backgroundColor = Const.HighLightColour.None;
        }
      }
    }
  }

  /**
   * 分割明細画面に移動する
   * @param $event
   * @param data
   */
  moveToSliptDetailInput($event, selectedItem: ODIS0020OrderShiwake) {
    try {
      var shiwakeDt: SplitOrderDetailShiwake[] = [];
      let splitDt: SplitOrderDetailSplit[] = [];

      // this.orderData.forEach(odrDt => {

      //   if(odrDt.id === selectedItem.id ){

      //     let tmp1 = new SplitOrderDetailShiwake();

      //     tmp1.tabIndex = selectedItem.tabIndex;
      //     tmp1.id = selectedItem.id;
      //     tmp1.journalCode = selectedItem.journalCode;
      //     tmp1.accountCode = selectedItem.accountCode;
      //     tmp1.journalName = selectedItem.journalName;
      //     tmp1.orderSuplierCode = selectedItem.orderSuplierCode;
      //     tmp1.orderSuplierName = selectedItem.orderSuplierName;
      //     tmp1.orderPlanAmount = selectedItem.orderPlanAmount;

      //     temp1.push(tmp1);

      //   }
      // });

      let cnt: number = 0;
      for (const odrDt of this.orderData) {
        if (odrDt.id === selectedItem.id && cnt === 0) {
          let tmp = new SplitOrderDetailShiwake();

          tmp.tabIndex = odrDt.tabIndex;
          tmp.id = odrDt.id;
          tmp.journalCode = odrDt.journalCode;
          tmp.accountCode = odrDt.accountCode;
          tmp.journalName = odrDt.journalName;
          tmp.orderSuplierCode = odrDt.orderSuplierCode;
          tmp.orderSuplierName = odrDt.orderSuplierName;
          tmp.orderPlanAmount = odrDt.orderPlanAmount;

          shiwakeDt.push(tmp);
          cnt++;
          break;
        }

      }

      this.orderData.forEach(dt => {
        if (dt.id === selectedItem.id) {
          let tmp = new SplitOrderDetailSplit();

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

          splitDt.push(tmp);
        }
      });

      this.service.setSplitTable(shiwakeDt);
      this.service.setDetailTable(splitDt);

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

  /**
   * 依頼ボタンを実行する
   * @param event 
   * @param dt 
   */
  setResquest(event: any, dt: ODIS0020OrderShiwake) {
    let rowIndex = this.orderData.indexOf(dt);

    this.setRowHightlight(rowIndex);

    let btn: HTMLButtonElement = null;
    if (event.target.nodeName === 'SPAN') {
      btn = event.target.parentElement;
    }
    else {
      btn = event.target;
    }

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.requestDate = requestTime;

    //TODO: ログイン情報を取得
    dt.requester = '積水　次郎';

    // 承認一回目のボタンを活動化する.
    let tr = btn.parentElement.parentElement;

    //承認１ボタンのインデックスは「13」
    let btnShounin = tr.children[13].getElementsByTagName('button');
    btnShounin[0].removeAttribute('disabled');


    // 処理後ボタンを　削除する。
    btn.remove();

    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    // btn.setAttribute('disabled','disabled');
    // btn.style.display = 'none';


  }

  /**
   * 承認１を実行する
   * @param event 
   * @param dt 
   */
  setApprovaFirstLevel(event: any, dt: ODIS0020OrderShiwake) {
    let rowIndex = this.orderData.indexOf(dt);
    this.setRowHightlight(rowIndex);

    let btn: HTMLButtonElement = null;
    if (event.target.nodeName === 'SPAN') {
      btn = event.target.parentElement;
    }
    else {
      btn = event.target;
    }

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_lv1 = requestTime;

    //TODO: ログイン情報を取得
    dt.approvalPerson_lv1 = '積水　次郎';

    // 承認一回目のボタンを活動化する
    let tr = btn.parentElement.parentElement;
    //承認１ボタンのインデックスは「15」
    let btnShounin = tr.children[15].getElementsByTagName('button');
    btnShounin[0].removeAttribute('disabled');




    // 処理後ボタンを　削除する。
    btn.remove();

    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    // btn.setAttribute('disabled','disabled');
    // btn.style.display = 'none';

  }

  /**
 * 承認２を実行する
 * @param event 
 * @param dt 
 */
  setApprovaNextLevel(event: any, dt: ODIS0020OrderShiwake) {
    let rowIndex = this.orderData.indexOf(dt);
    this.setRowHightlight(rowIndex);

    let btn: HTMLButtonElement = null;
    if (event.target.nodeName === 'SPAN') {
      btn = event.target.parentElement;
    }
    else {
      btn = event.target;
    }

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_lv2 = requestTime;
    dt.approvalPerson_lv2 = '積水　次郎';


    // 処理後ボタンを　削除する。
    btn.remove();

    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    // btn.setAttribute('disabled','disabled');
    // btn.style.display = 'none';
  }
  cnt: number = 0;
  ngAfterViewInit(): void {
    this.cnt++;
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    console.log(this.cnt);

    console.log(this.orderData)

    this.setTableButtonDisplay(this.orderData);
  }

  setTableButtonDisplay(dt: ODIS0020OrderShiwake[]) {

    dt.forEach(element => {

      let ind = dt.indexOf(element);
      if (element.requester != '' ||
        element.requester != null) {

        let skBody = this.viewRef.element.nativeElement.querySelector('tbody');

        for (var rIndex = 2; rIndex < skBody.rows.length; rIndex++) {

          let tr = skBody.rows[ind];
          let btn: HTMLButtonElement;
          btn = tr.cells[11].getElementsByTagName('button');
          btn[0].setAttribute('disabled', 'disabled');
          btn[0].style.display = 'none';
        };

      }
      if (element.approvalPerson_lv1 != '' ||
        element.approvalPerson_lv1 != null ||
        element.approvalPerson_lv1 != undefined) {

        let skBody = this.viewRef.element.nativeElement.querySelector('tbody');

        for (var rIndex = 2; rIndex < skBody.rows.length; rIndex++) {

          let tr = skBody.rows[ind];
          let btn: HTMLButtonElement;
          btn = tr.cells[13].getElementsByTagName('button');
          btn[0].setAttribute('disabled', 'disabled');
          btn[0].style.display = 'none';
        };

      }
      if (element.approvalPerson_lv2 != '' ||
        element.approvalPerson_lv2 != null ||
        element.approvalPerson_lv2 != undefined) {

        let skBody = this.viewRef.element.nativeElement.querySelector('tbody');

        for (var rIndex = 2; rIndex < skBody.rows.length; rIndex++) {

          let tr = skBody.rows[ind];
          let btn: HTMLButtonElement;
          btn = tr.cells[15].getElementsByTagName('button');
          btn[0].setAttribute('disabled', 'disabled');
          btn[0].style.display = 'none';
        };

      }


    });

  }






}
