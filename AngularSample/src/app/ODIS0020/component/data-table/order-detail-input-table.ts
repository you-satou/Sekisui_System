import { DatePipe } from '@angular/common';
import { DataEmitter } from "../../services/odis0020-DataEmitter.service";
import { Component, ViewChild, Input, ViewEncapsulation, Output, EventEmitter, OnInit,　AfterViewInit, ViewContainerRef } from "@angular/core";
import { MatTable } from "@angular/material";
import { CommonComponent } from "app/common/common.component";
import { Const } from "app/common/const";
import { ODIS0060SplitDetailService } from 'app/ODIS0060/services/split-detail-input-service';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake } from 'app/ODIS0060/entities/odis0060-SplitDetail.entity';
import { ODIS0020OrderDetaiSplitBean } from '../../entities/odis0020-OrderDetailSplit.entity'

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
    private comCompnt: CommonComponent,
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
    this.setTextColorWhenAmountIsDifference(this.orderData);
    this.setFonWhite(this.orderData);

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
  moveToSliptDetailInput($event, data: ODIS0020OrderDetaiSplitBean) {

    if(data.orderPlanAmount == '' ||
       data.orderPlanAmount == null ||
       data.orderPlanAmount == undefined){
          return;
    }

    var shiwakeDt: ODIS0060OrderShiwake[] = [new ODIS0060OrderShiwake()];
    var splitDt: ODIS0060OrderDetailBunkatsu[] = [];
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

    for (const data of filter) {
      //抽出したデータに承認かけたデータがあった場合、明細更新と明細削除が不可能
      if(this.comCompnt.setValue(data.approvalPerson_lv1) != ''){
        isCanNotUpd = true;
        isCanNotDel = true;
        break;
      }
    }

    //渡すデータを設定する。
    this.dataEmitter.action = Const.Action.A0004;   //行を選択
    this.dataEmitter.setEmitterData(filter[0]);     //明細のデータ
    this.dataEmitter.setRowStatus(keyIndex,rowIndex,totalLength,isCanNotUpd,isCanNotDel); //明細ステータス

    //　親コンポーネントにデータを送る。
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


    //クアン検証中
    // // 承認一回目のボタンを活動化する.
    // let tr = btn.parentElement.parentElement;

    // //承認１ボタンのインデックスは「13」
    // let btnShounin = tr.children[13].getElementsByTagName('button');
    // btnShounin[0].style.display = 'inherit';
    // btnShounin[0].removeAttribute('disabled');

    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    // btn.setAttribute('disabled','disabled');
    // btn.style.display = 'none';

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


    //クアン検証中
    // // 承認一回目のボタンを活動化する
    // let tr = btn.parentElement.parentElement;
    // //承認１ボタンのインデックスは「15」
    // let btnShounin = tr.children[15].getElementsByTagName('button');
    // btnShounin[0].style.display = 'inherit';
    // btnShounin[0].removeAttribute('disabled');

    // // ↓↓↓↓↓検討中↓↓↓↓↓↓
    // btn.setAttribute('disabled','disabled');
    // btn.style.display = 'none';

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
  private setTextColorWhenAmountIsDifference(dt: ODIS0020OrderDetaiSplitBean[]){

    for (let i = 0; i < dt.length; i++) {

      // IDに当てはまるデータを絞り込む
      var filter = dt.filter(data =>{
        if(data.detailNo == dt[i].detailNo){
          return data;
        }
      });
      // 絞り込んだデータを分割の合計発注金額を取得する。
      let totalAmount: number = filter.map(data => {
        // 重複明細を数える。
        if (Number(data.orderSplitAmount) > 0) {
          return Number(data.orderSplitAmount);
        }
        else {
          return 0;
        }
      }).reduce((acc, value) => acc + value);

      let skBody = this.viewRef.element.nativeElement.querySelector('tbody');
      let tr = skBody.rows[i];
      // 合計金額と発注予定金額を比較する
      if(totalAmount != Number(dt[i].orderPlanAmount)){
        // 発注予定金額の色を変える。
        tr.cells[5].style.color = 'red';
      }
      else{
        tr.cells[5].style.color = 'black';
      }
      
      // 処理後、カーソルの位置が後尾に変換する。
      i += filter.length - 1;

    }
  }

  /**
   * テーブル一覧 左側 親データ以外は文字白
   * @param dt 
   */
  private setFonWhite(dt: ODIS0020OrderDetaiSplitBean[]){
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
