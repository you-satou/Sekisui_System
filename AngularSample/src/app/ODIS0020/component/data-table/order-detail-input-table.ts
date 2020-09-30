import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import { ODIS0020OrderShiwake } from "../../entities/odis0020-OrderDetailList.entity";
import { DataEmitter } from "../../services/odis0020-DataEmitter.service";
import { Component, ViewChild, Input, ViewEncapsulation, Output, EventEmitter, OnInit, ViewContainerRef, HostBinding } from "@angular/core";
import { MatTable } from "@angular/material";
import { CommonComponent } from "app/common/common.component";
import { Const } from "app/common/const";
import { ODIS0060SplitDetailService } from 'app/ODIS0060/services/split-detail-input-service';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake } from 'app/ODIS0060/entities/odis0060-SplitDetail.entity';

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

  private readonly OrderDetailTableData: string = 'ODIS0020DataTable';

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
    "receivedDate",
    "receivedAmount",
    "paymentDate",
    "paymentAmount",
  ];

  constructor(
    private comCompnt: CommonComponent,
    private viewRef: ViewContainerRef,
    private odis0060Service: ODIS0060SplitDetailService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() { }

  /**
   * 発注予定金額の合計
   */
  getTotalPlanAmount() {
    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData
        .map((t) => {
          if (t.orderPlanAmount != null ||
              t.orderPlanAmount != "") {
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
          if ( t.orderSplitAmount != null ||
               t.orderSplitAmount != "") {
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
          if ( t.orderAmount != null ||
               t.orderAmount != "") {
            return Number(t.orderAmount);
          }
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   *  受入金額の合計
   */
  getReceivedAmount() {
    if (this.orderData != undefined || this.orderData != null) {
      return this.orderData
        .map((t) => {
          if ( t.receivedAmount != null ||
               t.receivedAmount != "") {
            return Number(t.receivedAmount);
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
          if (t.receivedAmount != null ||
              t.receivedAmount != "") {
            return Number(t.receivedAmount);
          }
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }
  /**
   *➡ボタンを押下して、 発注金額を設定する
   * @param $event
   * @param dataDetail
   */
  getDisplayData($event, data: ODIS0020OrderShiwake) {
    if (data.orderPlanAmount == '' ||
        data.orderPlanAmount == null ||
        data.orderPlanAmount == undefined
    ){
      return;
    }
    if(data.orderSplitAmount != ''){
      return;
    }
    data.orderSplitAmount = data.orderPlanAmount;

    let i = this.orderData.indexOf(data);

    let skBody = this.viewRef.element.nativeElement.querySelector('tbody');
    let tr = skBody.rows[i];
    //合計金額と発注予定金額を比較する
    if(tr.cells[5].style.color == 'red'){
      //発注予定金額の色を変える。
      tr.cells[5].style.color = 'black';
    }

  }
  /**
   * 分割明細画面に移動する
   * @param $event
   * @param data
   */
  moveToSliptDetailInput($event, selectedItem: ODIS0020OrderShiwake) {
    var shiwakeDt: ODIS0060OrderShiwake[] = [];
    var splitDt: ODIS0060OrderDetailBunkatsu[] = [];
    for (const odrDt of this.orderData) {
      if (odrDt.id === selectedItem.id) {
        let tmp = new ODIS0060OrderShiwake();

        tmp.tabIndex          = odrDt.tabIndex;
        tmp.id                = odrDt.id;
        tmp.journalCode       = odrDt.journalCode;
        tmp.accountCode       = odrDt.accountCode;
        tmp.journalName       = odrDt.journalName;
        tmp.orderSupplierCode = odrDt.orderSupplierCode;
        tmp.orderSupplierName = odrDt.orderSupplierName;
        tmp.orderPlanAmount   = odrDt.orderPlanAmount;

        shiwakeDt.push(tmp);

        break;
      }
    }

    this.orderData.forEach(dt => {
      if (dt.id === selectedItem.id) {
        let newSplit = new ODIS0060OrderDetailBunkatsu();
        newSplit.orderSplitAmount     = dt.orderSplitAmount;
        newSplit.comment              = dt.comment;
        newSplit.requestDate          = dt.requestDate;
        newSplit.requester            = dt.requester;
        newSplit.approvalDate_lv1     = dt.approvalDate_lv1;
        newSplit.approvalPerson_lv1   = dt.approvalPerson_lv1;
        newSplit.approvalDate_lv2     = dt.approvalDate_lv2;
        newSplit.approvalPerson_lv2   = dt.approvalPerson_lv2;
        newSplit.orderDate            = dt.orderDate;
        newSplit.orderAmount          = dt.orderAmount;
        newSplit.receivedDate         = dt.receivedDate;
        newSplit.receivedAmount       = dt.receivedAmount;
        newSplit.paymentDate          = dt.paymentDate;
        newSplit.paymentAmount        = dt.paymentAmount;

        splitDt.push(newSplit);

      }
    });

    this.odis0060Service.setSplitTable(shiwakeDt);
    this.odis0060Service.setDetailTable(splitDt);

    //　エミッターを送る。
    this.dataEmitter.action = Const.Action.A0007;
    this.sendOrderData.emit(this.dataEmitter);

  }

  /**
   * 選択された行の背景色を変える。
   * @param $event
   */
  onSelectHighLight($event, value: ODIS0020OrderShiwake) {
    this.comCompnt.CommonOnSelHight($event);

    //テーブルに選択されたデータをまとめる
    let filter = this.orderData.filter(element =>{
      if(element.id == value.id){
        return element;
      }
    });
    
    let irai = filter.filter(dt =>{
      if(dt.requester != ''){
        return dt;
      }
    });

    let shounin = filter.filter(dt => {
      if(dt.approvalPerson_lv1 !=''){
        return dt;
      }
    });

    let iraiSumi = irai.length == filter.length;
    let shouninSumi = shounin.length == filter.length;
    let shouninChuu = shounin.length > 0;

    //先頭データのインデックスを取得する
    let keyIndex = this.orderData.indexOf(filter[0]);
    // 選択されたデータのインデックス
    let rIndex: number = this.orderData.indexOf(value);
    //明細件数を取得
    let totalLength: number = filter.length;
    //総明細に対して、選択された明細のインデックスを取得する。
    let current: number = filter.indexOf(value) + 1;

    //渡すデータを設定する。
    this.dataEmitter.action = Const.Action.A0004;
    this.dataEmitter.setEmitterData(filter[0], filter);
    this.dataEmitter.setRowStatus(keyIndex,rIndex,totalLength,current,iraiSumi,shouninSumi,shouninChuu);

    //　親コンポーネントにデータを送る。
    this.sendOrderData.emit(this.dataEmitter);
  }


  /**
   * 依頼ボタンを実行する
   * @param event
   * @param dt 
   */
  setRequest(event: any, dt: ODIS0020OrderShiwake) {

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
    btnShounin[0].style.display = 'inherit';
    btnShounin[0].removeAttribute('disabled');

    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    btn.setAttribute('disabled','disabled');
    btn.style.display = 'none';


  }

  /**
   * 承認１を実行する
   * @param event 
   * @param dt 
   */
  setApprovalFirstLevel(event: any, dt: ODIS0020OrderShiwake) {

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
    btnShounin[0].style.display = 'inherit';
    btnShounin[0].removeAttribute('disabled');

    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    btn.setAttribute('disabled','disabled');
    btn.style.display = 'none';

  }

  /**
 * 承認２を実行する
 * @param event 
 * @param dt 
 */
  setApprovalNextLevel(event: any, dt: ODIS0020OrderShiwake) {

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


    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    btn.setAttribute('disabled','disabled');
    btn.style.display = 'none';
  }

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
    this.setTableButtonDisplay(this.orderData);
    this.setTextColorWhenAmountIsDifference(this.orderData);

  }
  /**
   * 明細テーブルに初期表の時、ボタン活動性を設定する。
   *↓↓↓　ボタン名　↓↓↓
   * 「依頼」「承認」「承認」
   * 
   * @param dt 
   * 
   */
  setTableButtonDisplay(dt: ODIS0020OrderShiwake[]) {
    let skBody = this.viewRef.element.nativeElement.querySelector('tbody');
    let tr: HTMLTableRowElement;
    let btn: any;
    dt.forEach(element => {
      let ind = dt.indexOf(element);
      // 固定行にボンタンを表示させない。
      if (element.journalName.match('ハウス材') ||
        element.journalName.match('運賃・荷造・保管料') ||
        element.journalName.match('労災')) {
          tr = skBody.rows[ind];
          
          //➡　ボタンを非表示させる
          btn = tr.cells[6].getElementsByTagName('button');
          btn[0].setAttribute('disabled',true);
          
          //分　ボタンを非表示させる
          btn = tr.cells[7].getElementsByTagName('button');
          btn[0].setAttribute('disabled',true);
          
          //依頼　ボタンを非表示させる
          btn = tr.cells[11].getElementsByTagName('button');
          btn[0].style.display = 'none';

          //承認ボタンは既に非表示されているため、再非表示する必要なし。
      }
    });

  }

  /**
   * レンダー後、差額がある場合、テキスト色を変える。
   * @param dt 
   */
  setTextColorWhenAmountIsDifference(dt: ODIS0020OrderShiwake[]){

    for (let i = 0; i < dt.length; i++) {
      //先頭データのIDを取得する。
      let currID = dt[i].id;
      //IDに当てはまるデータを絞り込む
      var filter = dt.filter(data =>{
        if(data.id == currID){
          return data;
        }
      });
      //絞り込んだデータを分割の合計発注金額を取得する。
      let totalAmount: number = filter.map(data => {
        //重複明細を数える。
        if (Number(data.orderSplitAmount) > 0) {
          return Number(data.orderSplitAmount);
        }
        else {
          return 0;
        }
      }).reduce((acc, value) => acc + value);

      let skBody = this.viewRef.element.nativeElement.querySelector('tbody');
      let tr = skBody.rows[i];
      //合計金額と発注予定金額を比較する
      if(totalAmount != Number(dt[i].orderPlanAmount)){
        //発注予定金額の色を変える。
        tr.cells[5].style.color = 'red';
      }
      else{
        tr.cells[5].style.color = 'black';
      }
      
      //処理後、カーソルの位置が後尾に変換する。
      i += filter.length - 1;

    }

  }

}
