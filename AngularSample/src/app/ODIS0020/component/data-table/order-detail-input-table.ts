import { DatePipe } from '@angular/common';
import { DataEmitter } from "../../services/odis0020-DataEmitter.service";
import { Component, ViewChild, Input, ViewEncapsulation, Output, EventEmitter, OnInit,　AfterViewInit, ViewContainerRef } from "@angular/core";
import { MatTable } from "@angular/material";
import { CommonComponent } from "app/common/common.component";
import { Const } from "app/common/const";
import { ODIS0060SplitDetailService } from 'app/ODIS0060/services/split-detail-input-service';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake } from 'app/ODIS0060/entities/odis0060-SplitDetail.entity';
import { ODIS0020OrderDetaiSplitBean } from '../../entities/odis0020-OrderDetailSplit.entity'
import { element } from 'protractor';

@Component({
  selector: "shiwake-table",
  styleUrls: ["order-detail-input-table.css"],
  templateUrl: "./order-detail-input-table.html",
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailShiwakeTable implements OnInit, 　AfterViewInit {
  @Input() orderData: ODIS0020OrderDetaiSplitBean[];
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
   * ヘッダーサブの定義
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
    public comCompnt: CommonComponent,
    private viewRef: ViewContainerRef,
    private odis0060Service: ODIS0060SplitDetailService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() { }

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
    this.setTableButtonDisplay(this.orderData);
    this.setFontWhite(this.orderData);

  }

  /**
   * 発注予定金額の合計
   */
  getTotalPlanAmount() {
    if (this.orderData.length != 0) {
      return this.orderData
        .map((t) => {
          if (this.comCompnt.setValue(t.orderPlanAmount) != '' && this.comCompnt.setValue(t.splitNo == '1')) {
            return Number(t.orderPlanAmount);
          }else{ return 0}
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   * 発注分割金額の合計
   */
  getOrderSplitAmount() {
    if (this.orderData.length != 0) {
      return this.orderData
        .map((t) => {
          if (this.comCompnt.setValue(t.orderSplitAmount) != '') {
            return Number(t.orderSplitAmount);
          }else{ return 0}
        })
        .reduce((acc, value) => acc + value);
    }
  }

  /**
   *  発注金額の合計
   */
  getOrderAmount() {
    if (this.orderData.length != 0) {
      return this.orderData
        .map((t) => {
          if (this.comCompnt.setValue(t.orderAmount) != '') {
            return Number(t.orderAmount);
          }else{ return 0}
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   *  受入金額の合計
   */
  getReceivedAmount() {
    if (this.orderData.length != 0) {
      return this.orderData
        .map((t) => {
          if ( this.comCompnt.setValue(t.receivedAmount) != '') {
            return Number(t.receivedAmount);
          }else{ return 0}
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   *  支払金額の合計
   */
  getPaymentAmount() {
    if (this.orderData.length != 0) {
      return this.orderData
        .map((t) => {
          if (this.comCompnt.setValue(t.receivedAmount) != '') {
            return Number(t.receivedAmount);
          }else{ return 0}
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   * ボタン活性フラグ(分割リンクボタン)
   * @param element 
   */
  isReflectFlg(element:ODIS0020OrderDetaiSplitBean){
    // 発注予定金額画空白の場合、非活性にする。
    if(this.comCompnt.setValue(element.orderPlanAmount) === ''){
      // 非活性
      return true;
    }

    // 分割連番 1以外の場合は非活性
    if(this.comCompnt.setValue(element.splitNo) !== '1'){
      return true;
    }

    // 発注金額にデータが入っている場合、非活性
    if(this.comCompnt.setValue(element.orderSplitAmount) !== ''){
      return true;
    }

    // ハウス材、運賃・荷造・保管料、労災の場合は非活性
    if(element.journalName == 'ハウス材' ||
       element.journalName == '運賃・荷造・保管料' ||
       element.journalName == '労災'){
         return true;
     }

    // 活性
    return false;
  }

  /**
   * ボタン活性フラグ(分割リンクボタン)
   * @param element 
   */
  isSplitFlg(element:ODIS0020OrderDetaiSplitBean){
    
    // 発注予定金額画空白の場合、非活性にする。
    if(this.comCompnt.setValue(element.orderPlanAmount) === ''){
      // 非活性
      return true;
    }

    // ハウス材、運賃・荷造・保管料、労災の場合は非活性
    if(element.journalName == 'ハウス材' ||
       element.journalName == '運賃・荷造・保管料' ||
       element.journalName == '労災'){
         return true;
     }

    // 活性
    return false;
  }

  /**
   *➡ボタンを押下して、 発注金額を設定する
   * @param $event
   * @param dataDetail
   */
  getDisplayData($event, data: ODIS0020OrderDetaiSplitBean) {
    // 発注予定金額を発注金額に設定
    data.orderSplitAmount = this.comCompnt.removeCommas(data.orderPlanAmount);

    let i = this.orderData.indexOf(data);

    let skBody = this.viewRef.element.nativeElement.querySelector('tbody');
    let tr = skBody.rows[i];
    // 通常データの場合は更新データに変更する
    if(data.insKubun == Const.InsKubun.Normal){
      // 登録区分：更新に設定
      data.insKubun = Const.InsKubun.Upd;
      // 行　更新色に変更
      this.comCompnt.setRowColor(Const.Action.A0002,skBody,i);
    }
  }

  /**
   * 分割明細画面に移動する
   * @param $event
   * @param data
   */
  moveToSliptDetailInput($event, data: ODIS0020OrderDetaiSplitBean) {

    // 初期化
    var shiwakeDt: ODIS0060OrderShiwake[] = [new ODIS0060OrderShiwake()];
    var splitDt: ODIS0060OrderDetailBunkatsu[] = [];
    shiwakeDt[0].insKubun          = data.insKubun;
    shiwakeDt[0].propertyNo        = data.propertyNo;
    shiwakeDt[0].detailKind        = data.detailKind;
    shiwakeDt[0].detailNo          = data.detailNo;
    shiwakeDt[0].journalCode       = data.journalCode;
    shiwakeDt[0].accountCode       = data.accountCode;
    shiwakeDt[0].journalName       = data.journalName;
    shiwakeDt[0].orderSupplierCode = data.orderSupplierCode;
    shiwakeDt[0].orderSupplierName = data.orderSupplierName;
    shiwakeDt[0].orderPlanAmount   = data.orderPlanAmount;
    
    this.orderData.forEach(dt => {
      if (dt.detailNo === data.detailNo) {
        let newSplit = new ODIS0060OrderDetailBunkatsu();
        newSplit.splitNo              = this.comCompnt.setValue(dt.detailNo);
        newSplit.orderSplitAmount     = this.comCompnt.setValue(dt.orderSplitAmount);
        newSplit.comment              = this.comCompnt.setValue(dt.comment);
        newSplit.requestDate          = this.comCompnt.setValue(dt.requestDate);
        newSplit.requester            = this.comCompnt.setValue(dt.requester);
        newSplit.approvalDate_lv1     = this.comCompnt.setValue(dt.approvalDate_lv1);
        newSplit.approvalPerson_lv1   = this.comCompnt.setValue(dt.approvalPerson_lv1);
        newSplit.approvalDate_lv2     = this.comCompnt.setValue(dt.approvalDate_lv2);
        newSplit.approvalPerson_lv2   = this.comCompnt.setValue(dt.approvalPerson_lv2);
        newSplit.orderDate            = this.comCompnt.setValue(dt.orderDate);
        newSplit.orderAmount          = this.comCompnt.setValue(dt.orderAmount);
        newSplit.receivedDate         = this.comCompnt.setValue(dt.receivedDate);
        newSplit.receivedAmount       = this.comCompnt.setValue(dt.receivedAmount);
        newSplit.paymentDate          = this.comCompnt.setValue(dt.paymentDate);
        newSplit.paymentAmount        = this.comCompnt.setValue(dt.paymentAmount);
        
        splitDt.push(newSplit);
      }
    });

    //　テーブル一覧：左側 仕訳コード
    this.odis0060Service.setSplitTable(shiwakeDt);
    //　テーブル一覧：右側 分割データ
    this.odis0060Service.setDetailTable(splitDt);

    //　エミッターを送る。
    this.dataEmitter.action = Const.Action.A0007;
    this.sendOrderData.emit(this.dataEmitter);

  }

  /**
   * 選択された行の背景色を変える。
   * @param $event
   */
  onSelectHighLight($event, value: ODIS0020OrderDetaiSplitBean) {
    
    this.comCompnt.CommonOnSelHight($event);

    // 明細連番 対象データ抽出
    let filter = this.orderData.filter(element =>{
      if(element.detailNo == value.detailNo){
        return element;
      }
    });

    //先頭データのインデックスを取得する
    let keyIndex = this.orderData.indexOf(filter[0]);
    // 選択されたデータのインデックス
    let rowIndex: number = this.orderData.indexOf(value);
    //明細件数を取得
    let totalLength: number = filter.length;

    let isCanNotUpd: boolean = false;
    let isCanNotDel: boolean = false;

    // 承認1 済 抽出
    let approval1List = filter.filter(element =>{
      if(this.comCompnt.setValue(element.approvalPerson_lv1) !== ''){
        return element;
      }
    });
    // 抽出データ == 済データが一致した場合は、更新ボタン 非活性
    if(approval1List.length === filter.length){
      isCanNotUpd = true;
    }

    // 済みのデータが1件以上の場合、削除ボタン 非活性
    if(approval1List.length >= 1){
      isCanNotDel = true;
    }

    // ハウス材、運賃・荷造・保管料、労災の場合は削除不可
    if(value.journalName == 'ハウス材' ||
       value.journalName == '運賃・荷造・保管料' ||
       value.journalName == '労災'){
        isCanNotDel = true;
     }

    //渡すデータを設定する。
    this.dataEmitter.action = Const.Action.A0004;   //行を選択

    //依頼・承認ボタンを押下した場合、設定する
    var nodeName = $event.target.nodeName;
    if(nodeName === 'SPAN' || nodeName === 'BUTTON'){
      this.dataEmitter.action = Const.Action.A0008; 
    }
    this.dataEmitter.setEmitterData(filter[0]);     //明細のデータ
    this.dataEmitter.setRowStatus(keyIndex,rowIndex,totalLength,isCanNotUpd,isCanNotDel,value); //明細ステータス

    this.sendOrderData.emit(this.dataEmitter);
  }


  /**
   * 依頼ボタンを実行する
   * @param event
   * @param dt 
   */
  setRequest(event: any, dt: ODIS0020OrderDetaiSplitBean) {

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
  }

  /**
   * 承認１を実行する
   * @param event 
   * @param dt 
   */
  setApprovalFirstLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

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
  }

  /**
 * 承認２を実行する
 * @param event 
 * @param dt 
 */
  setApprovalNextLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

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
   * 明細テーブルに初期表の時、ボタン活動性を設定する。
   *↓↓↓　ボタン名　↓↓↓
   * 「依頼」「承認」「承認」
   * 
   * @param dt 
   * 
   */
  setTableButtonDisplay(dt: ODIS0020OrderDetaiSplitBean[]) {
    let skBody = this.viewRef.element.nativeElement.querySelector('tbody');
    let tr: HTMLTableRowElement;
    let btn: any;
    dt.forEach(element => {
      let ind = dt.indexOf(element);
      // 固定行にボンタンを表示させない。
      if (element.journalName == 'ハウス材' ||
          element.journalName == '運賃・荷造・保管料' ||
          element.journalName == '労災') {
          
            tr = skBody.rows[ind];
          
            //➡　ボタンを非表示させる
            btn = tr.cells[6].getElementsByTagName('button');
            btn[0].setAttribute('disabled',true);
            
            //分　ボタンを非表示させる
            btn = tr.cells[7].getElementsByTagName('button');
            btn[0].setAttribute('disabled',true);
            
            //依頼　ボタンを非表示させる
            btn = tr.cells[11].getElementsByTagName('button');
            // ボタンが存在すれば以下の処理を実施
            if(btn[0] !== undefined){
              btn[0].style.display = 'none';
            }

            //承認ボタンは既に非表示されているため、再非表示する必要なし。
      }
    });

  }

  /**
   * 差額がある場合、テキスト色を変える。
   * @param dt 
   */
  getFontColor(element: ODIS0020OrderDetaiSplitBean){

    // フォント色
    if(element.splitNo == '1'){
      // 初期化
      var isFont = 'black';

      // 色 設定
      switch(element.insKubun){
        case Const.InsKubun.Normal: 
          isFont = 'black';
          break;
        case Const.InsKubun.Ins:
          isFont = Const.HighLightColour.Inserted;
          break;
        case Const.InsKubun.Upd:
          isFont = Const.HighLightColour.Modified;
          break;
      }

      if(this.comCompnt.setValue(element.orderSplitAmount) === ''){
        return isFont;
      }

      // IDに当てはまるデータを絞り込む
      var filter = this.orderData.filter(data =>{
        if(data.detailNo == element.detailNo){
          return data;
        }
      });

      // 絞り込んだデータを分割の合計発注金額を取得する。
      let totalAmount: number = filter.map(data => {
        // 重複明細を数える。
        if (this.comCompnt.setValue(data.orderSplitAmount) !== '') {
          return Number(data.orderSplitAmount);
        }
        else {
          return 0;
        }
      }).reduce((acc, value) => acc + value);

      // 差額がある場合はフォントを赤字にする。
      if(totalAmount != Number(element.orderPlanAmount)){
        isFont = 'red';
      }
      return isFont;
    }
  }

  /**
   * テーブル一覧 左側 親データ以外は文字白
   * @param dt 
   */
  private setFontWhite(dt: ODIS0020OrderDetaiSplitBean[]){
    let skBody = this.viewRef.element.nativeElement.querySelector('tbody');

    for (let i = 0; i < dt.length; i++) {
      if(dt[i].splitNo !== '1'){
        let tr = skBody.rows[i];
        tr.cells[0].style.color = 'transparent';
        tr.cells[1].style.color = 'transparent';
        tr.cells[2].style.color = 'transparent';
        tr.cells[3].style.color = 'transparent';
        tr.cells[4].style.color = 'transparent';
        tr.cells[5].style.color = 'transparent';
      }
    }
  }
}
