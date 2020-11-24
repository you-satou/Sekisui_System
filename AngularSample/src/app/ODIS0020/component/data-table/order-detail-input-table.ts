import { DatePipe } from '@angular/common';
import { DataEmitter } from "../../services/odis0020-DataEmitter.service";
import { Component, ViewChild, Input, ViewEncapsulation, Output, EventEmitter, OnInit,　AfterViewInit, ViewContainerRef } from "@angular/core";
import { MatTable } from "@angular/material";
import { CommonComponent } from "app/common/common.component";
import { Const } from "app/common/const";
import { ODIS0060SplitDetailService } from 'app/ODIS0060/services/split-detail-input-service';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake } from 'app/ODIS0060/entities/odis0060-SplitDetail.entity';
import { ODIS0020OrderDetaiSplitBean } from '../../entities/odis0020-OrderDetailSplit.entity'
import { AppComponent } from 'app/app.component';

@Component({
  selector: "shiwake-table",
  styleUrls: ["order-detail-input-table.css"],
  templateUrl: "./order-detail-input-table.html",
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailShiwakeTable implements OnInit, AfterViewInit {
  @Input() orderData: ODIS0020OrderDetaiSplitBean[];
  @Output() sendOrderData = new EventEmitter<DataEmitter>();
  @ViewChild(MatTable, { static: false }) tableShiwake: MatTable<any>;
  //承認人数
  approvalUnit: number;

  systemDate: Date = new Date();
  dataEmitter = new DataEmitter();
  
  grayOut = Const.HighLightColour.GrayOut;

  /**
   * テーブルヘッダーのカラムを定義する。
   */
  mainHeaderColumns: string[] = [
    "shiwakeCode",
    "keiriCode",
    "shiwakeName",
    "hacchuSaki",
    "bulkIraiBi",
    "bulkShouninBi",
    "hacchuKingaku",
    "hanei",
    "bunkatsu",
    "yoteiKigaku",
    "bunkatsuHacchusaki",
    "comment1",
    "irai",
    "shounin_saishuu",
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
    "approvalDate_final",
    "approvalPerson_final",
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
    "bulkRequestDate",
    "bulkApprovalDate",
    "orderPlanAmount",
    "display",
    "split",
    "orderSplitAmount",
    "splitSupplierCode",
    "splitSupplierName",
    "comment",
    "requestDate",
    "requester",
    "approvalDate_final",
    "approvalPerson_final",
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
    private appComponent: AppComponent,
  ) {  }

  ngOnInit(): void {
    //2020/11/09 11月中の要望対応　Add Start
    this.approvalUnit = this.appComponent.approvalLevels;
    switch(this.approvalUnit){
 
      //承認人数が1人で設定する
      case Const.ApprovalLevel.OneLevel:
        break;

      //承認人数が2人で設定する
      case Const.ApprovalLevel.TwoLevels:
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('irai') + 1), 0, "shounin_lv1");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('requester') + 1), 0, "approvalDate_lv1", "approvalPerson_lv1");
        this.bodyColumns.splice((this.bodyColumns.indexOf('requester') + 1), 0, "approvalDate_lv1", "approvalPerson_lv1");
        break;

      //承認人数が3人で設定する
      case Const.ApprovalLevel.ThreeLevels:
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('irai') + 1), 0, "shounin_lv1", "shounin_lv2");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('requester') + 1), 0, "approvalDate_lv1", "approvalPerson_lv1", "approvalDate_lv2", "approvalPerson_lv2");
        this.bodyColumns.splice((this.bodyColumns.indexOf('requester') + 1), 0, "approvalDate_lv1", "approvalPerson_lv1", "approvalDate_lv2", "approvalPerson_lv2");
        break;

      //承認人数が4人で設定する
      case Const.ApprovalLevel.FourLevels:
      //承認者数枠が4人のため、デフォルトが承認者数が4人を設定する。
      default:
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('irai') + 1), 0, "shounin_lv1", "shounin_lv2", "shounin_lv3");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('requester') + 1), 0, "approvalDate_lv1", "approvalPerson_lv1", "approvalDate_lv2", "approvalPerson_lv2", "approvalDate_lv3", "approvalPerson_lv3");
        this.bodyColumns.splice((this.bodyColumns.indexOf('requester') + 1), 0, "approvalDate_lv1", "approvalPerson_lv1", "approvalDate_lv2", "approvalPerson_lv2", "approvalDate_lv3", "approvalPerson_lv3");
        break;

    }
    //2020/11/09 11月中の要望対応 Add End
  }

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

    //一括承認データが入らない場合、非活性する。
    if(this.comCompnt.setValue(element.bulkApprovalPerson) === ''){
      return true;
    }

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

    //一括承認データが入らない場合、非活性する。
    if (this.comCompnt.setValue(element.bulkApprovalPerson) === '') {
      return true;
    }
    
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
  getDisplayData($event,data: ODIS0020OrderDetaiSplitBean) {
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
    shiwakeDt[0].bulkRequestDate      = this.comCompnt.setValue(data.bulkRequestDate);
    shiwakeDt[0].bulkRequester        = this.comCompnt.setValue(data.bulkRequester);
    shiwakeDt[0].bulkApprovalDate     = this.comCompnt.setValue(data.bulkApprovalDate);
    shiwakeDt[0].bulkApprovalPerson   = this.comCompnt.setValue(data.bulkApprovalPerson);
    
    this.orderData.forEach(dt => {
      if (dt.detailNo === data.detailNo) {
        let newSplit = new ODIS0060OrderDetailBunkatsu();
        newSplit.splitNo              = this.comCompnt.setValue(dt.detailNo);
        newSplit.orderSplitAmount     = this.comCompnt.setValue(dt.orderSplitAmount);
        newSplit.splitSupplierCode    = this.comCompnt.setValue(dt.splitSupplierCode);
        newSplit.splitSupplierName    = this.comCompnt.setValue(dt.splitSupplierName);
        newSplit.comment              = this.comCompnt.setValue(dt.comment);
        newSplit.requestDate          = this.comCompnt.setValue(dt.requestDate);
        newSplit.requester            = this.comCompnt.setValue(dt.requester);
        newSplit.approvalDate_lv1     = this.comCompnt.setValue(dt.approvalDate_lv1);
        newSplit.approvalPerson_lv1   = this.comCompnt.setValue(dt.approvalPerson_lv1);
        newSplit.approvalDate_lv2     = this.comCompnt.setValue(dt.approvalDate_lv2);
        newSplit.approvalPerson_lv2   = this.comCompnt.setValue(dt.approvalPerson_lv2);
        newSplit.approvalDate_lv3     = this.comCompnt.setValue(dt.approvalDate_lv3);
        newSplit.approvalPerson_lv3   = this.comCompnt.setValue(dt.approvalPerson_lv3);
        newSplit.approvalDate_final   = this.comCompnt.setValue(dt.approvalDate_final);
        newSplit.approvalPerson_final = this.comCompnt.setValue(dt.approvalPerson_final);
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
    
    this.setSelect($event, value);

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

    //一括承認データがある場合、更新・削除ができない
    if(this.comCompnt.setValue(value.bulkApprovalPerson) != ''){
      isCanNotUpd = true;
      isCanNotDel = true;
    }

    // ハウス材、運賃・荷造・保管料、労災の場合は削除不可
    if (value.journalName == 'ハウス材' ||
      value.journalName == '運賃・荷造・保管料' ||
      value.journalName == '労災') {
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

  setSelect(event: any, value: ODIS0020OrderDetaiSplitBean){

    //クリックされたエレメント名を取得する
    var nodeName = event.target.nodeName;
    //テーブルのBody
    var wTbody: HTMLTableElement;
    //クリックされた行
    var wTr: any;

    switch (nodeName) {
      case 'TR':
        wTr = event.path[0];
        wTbody = event.path[1];
        break;
      case 'TD':
        wTr = event.path[1];
        wTbody = event.path[2];
        break;
      case 'MAT-ICON':
        wTr = event.path[4];
        wTbody = event.path[5];
        break;
      case 'LABEL':
        wTr = event.path[2];
        wTbody = event.path[3];
        break;

      //依頼・承認ボタンを押下した後、明細変更テーブルにデータを表示しない。
      case 'SPAN':
        wTr = event.path[3];
        wTbody = event.path[4];
        break;
      case 'BUTTON':
        wTr = event.path[2];
        wTbody = event.path[3];
        break;
    }

    for(var i = 0; i < this.orderData.length; i++){
      //一括承認データが入っている行はグレーアウトする。
      if(this.comCompnt.setValue(this.orderData[i].bulkApprovalPerson) != ''){
        var tr = wTbody.rows[i];
        for (var j = 0; j < tr.cells.length; j++) {
          var td = tr.cells[j];
          if (j <= 7) {
            td.style.backgroundColor = this.grayOut;
          }
          else {
            td.style.backgroundColor = Const.HighLightColour.None;
          }
        }
      }
      //一括承認データが入らない行は白色をする。
      else{
        var tr = wTbody.rows[i];
        for (var j = 0; j < tr.cells.length; j++) {
          var td = tr.cells[j];  
          td.style.backgroundColor = Const.HighLightColour.None;
        }
      }
    }
    //選択されている行の背景色を変える
    for (var j = 0; j < wTr.cells.length; j++) {
      var cell = wTr.cells[j];
      cell.style.backgroundColor = Const.HighLightColour.Selected;
    }
  }


  /**
   * 依頼ボタンを実行する
   * @param event
   * @param dt 
   */
  setRequest(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.requestDate = requestTime;

    //TODO: ログイン情報を取得
    dt.requester = this.appComponent.loginUser;
  }

  /**
   * 承認１を実行する
   * @param event 
   * @param dt 
   */
  setApprovalFirstLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_lv1 = requestTime;

    //TODO: ログイン情報を取得
    dt.approvalPerson_lv1 = this.appComponent.loginUser;
  }

  /**
 * 承認２を実行する
 * @param event 
 * @param dt 
 */
  setApprovalNextLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_lv2 = requestTime;
    dt.approvalPerson_lv2 = this.appComponent.loginUser;

  }

    /**
 * 承認３を実行する
 * @param event 
 * @param dt 
 */
setApprovalThirdLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {
  
  let currTime = Date.now();
  let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
  dt.approvalDate_lv3 = requestTime;
  dt.approvalPerson_lv3 = this.appComponent.loginUser;

}

  /**
 * 最終承認を実行する
 * @param event 
 * @param dt 
 */
setApprovalFinalLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {
  
  let currTime = Date.now();
  let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
  dt.approvalDate_final = requestTime;
  dt.approvalPerson_final = this.appComponent.loginUser;
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
        btn = tr.cells[8].getElementsByTagName('button');
        btn[0].setAttribute('disabled', true);

        //分　ボタンを非表示させる
        btn = tr.cells[9].getElementsByTagName('button');
        btn[0].setAttribute('disabled', true);

        //依頼　ボタンを非表示させる
        btn = tr.cells[13].getElementsByTagName('button');
        // ボタンが存在すれば以下の処理を実施
        if (btn[0] !== undefined) {
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
      var isFont = Const.HighLightColour.Black;

      // 色 設定
      switch(element.insKubun){
        case Const.InsKubun.Normal: 
          isFont = Const.HighLightColour.Black;
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
        isFont = Const.HighLightColour.Red;
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
        tr.cells[6].style.color = 'transparent';
        tr.cells[7].style.color = 'transparent';
      }
    }
  }

  bulkRequestInfo(){

    //明細が選択されている時、一括依頼処理を行わない
    if (this.dataEmitter.getRowStatus().rowIndex != null) {
      return true;
    }

    //一括依頼データを抽出
    var requestInfo = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkRequestDate) != '') {
        return value;
      }
    })
    //一括依頼が済の場合、一括依頼ボタンを非活性する。
    if (requestInfo.length == this.orderData.length) {
      return true;
    }
    return false;
  }

  bulkApprovalInfo(){

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().rowIndex != null) {
      return true;
    }

    //一括承認データを抽出
    var requestInfo = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkRequestDate) != '') {
        return value;
      }
    })
    //一括承認データを抽出
    var approvalInfo = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate) != '') {
        return value;
      }
    })
    //一括依頼済の時、一括承認ボタンを活性する。
    if (requestInfo.length == this.orderData.length && approvalInfo.length != this.orderData.length) {
      return false;
    }
    return true;

  }

  oneClickRequest($event){

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

    //TODO: ログイン情報
    this.orderData.forEach(element=>{
      if(this.comCompnt.setValue(element.bulkRequestDate) ==''){
        element.bulkRequestDate = requestTime;
        element.bulkRequester   = this.appComponent.loginUser;
      }
    })
  }

  oneClickApproval($event){

    let currTime = Date.now();
    let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

    //TODO: ログイン情報
    this.orderData.forEach(element=>{
      if(this.comCompnt.setValue(element.bulkApprovalDate) ==''){
        element.bulkApprovalDate   = approvalTime;
        element.bulkApprovalPerson = this.appComponent.loginUser;
      }
    })
  }
}
