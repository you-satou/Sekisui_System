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
  @Input() orderData: ODIS0020OrderDetaiSplitBean[] = [new ODIS0020OrderDetaiSplitBean()];
  @Input() tabName:string;
  @Output() sendOrderData = new EventEmitter<DataEmitter>();
  
  //承認人数
  approvalUnit: number;

  //テーブルGrayOut のセール数が承認者数でを設定する
  get cellNumber(){
    switch(this.approvalUnit){
      case 1:
        return 10;
      case 2:
        return 11;
      case 3:
        return 12;
      case 4:
        return 13;
    }
  }

  get defaultBranchVal(){
    switch(this.tabName){
      case Const.TabName.TabName_Sekkei:
        return Const.BranchValue.Sekkei;

      case Const.TabName.TabName_Hontai:
        return Const.BranchValue.Hontai;

      case Const.TabName.TabName_Kaitai:
        return Const.BranchValue.Kaitai;

      case Const.TabName.TabName_Tsuika:
        return Const.BranchValue.Zouen1;

      case Const.TabName.TabName_Zouen1:
        return Const.BranchValue.Zouen2;

      case Const.TabName.TabName_Zouen2:
        return Const.BranchValue.Tsuika;
    }
  }

  systemDate: Date = new Date();
  dataEmitter = new DataEmitter();
 
  grayOut = Const.HighLightColour.GrayOut;
  transparent = Const.HighLightColour.Transparent;
  black = Const.HighLightColour.Black;

  readonlyTab = Const.TabName.TabName_Tsuika;

  /**
   * テーブルヘッダーのカラムを定義する。
   */
  mainHeaderColumns: string[] = [
    "juchuEdaban",          // 受注枝番
    "shiwakeCode",          // 仕訳コード
    "keiriCode",            // 経理分類
    "shiwakeName",          // 仕訳名称
    "hacchuSaki",           // 発注先
    "chuuMon",              // 注文書発行区分
    "hacchuKingaku",        // 発注予定金額
    "kyakka",               // 却下
    "bulkIraiBi",           // 一括依頼
    "bulkShouninBi_Final",  // 一括最終承認
    "hanei",                // 反映
    "bunkatsu",             // 分割
    "yoteiKigaku",          // 発注金額
    "bunkatsuHacchusaki",   // 分割発注先
    "bunkatsuChumon",       // 注文書発行区分
    "comment1",             // コメント
    "irai",                 // 依頼
    "shounin_saishuu",      // 最終承認
    "bunKyaku",             // 分割却下
    "hacChu",               // 発注
    "ukeIre",               // 受入
    "shiHarai",             // 支払
  ];
  /**
   * ヘッダーサブの定義
   */
  subHeaderColumns: string[] = [
    "bulkRequestDate",        // 一括依頼日
    "bulkApprovalDate_Final", // 一括最終承認日
    "requestDate",            // 依頼日
    "approvalDate_final",     // 最終承認日
  ];
  /**
   * 行のカラムの定義
   */
  bodyColumns: string[] = [
    "orderBranchNo",          // 受注枝番
    "journalCode",            // 仕訳コード
    "accountCode",            // 経理分類
    "journalName",            // 仕訳名称
    "orderSupplierCode",      // 発注先コード
    "orderSupplierName",      // 発注先名称
    "orderReceipt",           // 注文書発行区分
    "orderPlanAmount",        // 発注予定金額
    "reject",                 // 却下
    "bulkRequestDate",        // 一括依頼日
    "bulkApprovalDate_Final", // 一括最終承認日
    "display",                // 反映
    "split",                  // 分割
    "orderSplitAmount",       // 発注金額
    "splitSupplierCode",      // 分割発注先コード
    "splitSupplierName",      // 分割発注先名称
    "splitOrderReceipt",      // 注文書発行区分
    "comment",                // コメント
    "requestDate",            // 依頼日
    "approvalDate_final",     // 最終承認日
    "splitReject",            // 分割却下
    "orderSupplierDate",      // 発注日
    "orderSupplierAmount",    // 発注金額
    "receivedDate",           // 受入日
    "receivedAmount",         // 受入金額
    "paymentDate",            // 支払日
    "paymentAmount",          // 支払金額
  ];

  constructor(
    public comCompnt: CommonComponent,
    private viewRef: ViewContainerRef,
    private odis0060Service: ODIS0060SplitDetailService,
    private datePipe: DatePipe,
    private appComponent: AppComponent,
  ) {  }

  ngOnInit(): void {
    
    this.approvalUnit = this.appComponent.approvalLevels;
    
    switch(this.approvalUnit){
 
      //承認人数が1人で設定する
      case Const.ApprovalLevel.OneLevel:
        break;

      //承認人数が2人で設定する
      case Const.ApprovalLevel.TwoLevels:
        //左側
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('bulkIraiBi') + 1), 0, "bulkShouninBi_1");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('bulkRequestDate') + 1), 0, "bulkApprovalDate_1");
        this.bodyColumns.splice((this.bodyColumns.indexOf('bulkRequestDate') + 1), 0, "bulkApprovalDate_1");

        //右側
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('irai') + 1), 0, "shounin_lv1");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('requestDate') + 1), 0, "approvalDate_lv1");
        this.bodyColumns.splice((this.bodyColumns.indexOf('requestDate') + 1), 0, "approvalDate_lv1");
        break;

      //承認人数が3人で設定する
      case Const.ApprovalLevel.ThreeLevels:
        //左側
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('bulkIraiBi') + 1), 0, "bulkShouninBi_1", "bulkShouninBi_2");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('bulkRequestDate') + 1), 0, "bulkApprovalDate_1","bulkApprovalDate_2");
        this.bodyColumns.splice((this.bodyColumns.indexOf('bulkRequestDate') + 1), 0, "bulkApprovalDate_1","bulkApprovalDate_2");

        //右側
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('irai') + 1), 0, "shounin_lv1", "shounin_lv2");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('requestDate') + 1), 0, "approvalDate_lv1","approvalDate_lv2");
        this.bodyColumns.splice((this.bodyColumns.indexOf('requestDate') + 1), 0, "approvalDate_lv1","approvalDate_lv2");
        break;

      //承認人数が4人で設定する
      case Const.ApprovalLevel.FourLevels:
      //承認者数枠が4人のため、デフォルトが承認者数が4人を設定する。
      default:
        //左側
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('bulkIraiBi') + 1), 0, "bulkShouninBi_1", "bulkShouninBi_2", "bulkShouninBi_3");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('bulkRequestDate') + 1), 0, "bulkApprovalDate_1","bulkApprovalDate_2","bulkApprovalDate_3");
        this.bodyColumns.splice((this.bodyColumns.indexOf('bulkRequestDate') + 1), 0, "bulkApprovalDate_1", "bulkApprovalDate_2", "bulkApprovalDate_3");

        //右側
        this.mainHeaderColumns.splice((this.mainHeaderColumns.indexOf('irai') + 1), 0, "shounin_lv1", "shounin_lv2", "shounin_lv3");
        this.subHeaderColumns.splice((this.subHeaderColumns.indexOf('requestDate') + 1), 0, "approvalDate_lv1","approvalDate_lv2","approvalDate_lv3");
        this.bodyColumns.splice((this.bodyColumns.indexOf('requestDate') + 1), 0, "approvalDate_lv1", "approvalDate_lv2", "approvalDate_lv3");
        break;

    }
    //2020/11/09 11月中の要望対応 Add End
  }

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
    //TODO: Khong dung thi xoa.
    // this.setTableButtonDisplay(this.orderData);
    // this.setFontWhite(this.orderData);
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

    if(this.tabName === this.readonlyTab){
      return true;
    }

    //一括承認データが入らない場合、非活性する。
    if(this.comCompnt.setValue(element.bulkApprovalPerson_final) === ''){
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

  isRejectFlg(element:ODIS0020OrderDetaiSplitBean){
    if(this.tabName === this.readonlyTab){
      return true;
    }
    return false;
  }

  /**
   * ボタン活性フラグ(分割リンクボタン)
   * @param element 
   */
  isSplitFlg(element:ODIS0020OrderDetaiSplitBean){
    if(this.tabName === this.readonlyTab){
      return true;
    }

    //一括承認データが入らない場合、非活性する。
    if (this.comCompnt.setValue(element.bulkApprovalPerson_final) === '') {
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
    shiwakeDt[0].orderBranchNo     = data.orderBranchNo;
    shiwakeDt[0].detailNo          = data.detailNo;
    shiwakeDt[0].journalCode       = data.journalCode;
    shiwakeDt[0].accountCode       = data.accountCode;
    shiwakeDt[0].journalName       = data.journalName;
    shiwakeDt[0].orderSupplierCode = data.orderSupplierCode;
    shiwakeDt[0].orderSupplierName = data.orderSupplierName;
    shiwakeDt[0].orderReceipt      = data.orderReceipt;
    shiwakeDt[0].orderPlanAmount   = data.orderPlanAmount;
    shiwakeDt[0].bulkRequestDate      = this.comCompnt.setValue(data.bulkRequestDate);
    shiwakeDt[0].bulkRequester        = this.comCompnt.setValue(data.bulkRequester);
    shiwakeDt[0].bulkApprovalDate_lv1     = this.comCompnt.setValue(data.bulkApprovalDate_lv1);
    shiwakeDt[0].bulkApprovalPerson_lv1   = this.comCompnt.setValue(data.bulkApprovalPerson_lv1);
    shiwakeDt[0].bulkApprovalDate_lv2     = this.comCompnt.setValue(data.bulkApprovalDate_lv2);
    shiwakeDt[0].bulkApprovalPerson_lv2   = this.comCompnt.setValue(data.bulkApprovalPerson_lv2);
    shiwakeDt[0].bulkApprovalDate_lv3     = this.comCompnt.setValue(data.bulkApprovalDate_lv3);
    shiwakeDt[0].bulkApprovalPerson_lv3   = this.comCompnt.setValue(data.bulkApprovalPerson_lv3);
    shiwakeDt[0].bulkApprovalDate_final   = this.comCompnt.setValue(data.bulkApprovalDate_final);
    shiwakeDt[0].bulkApprovalPerson_final = this.comCompnt.setValue(data.bulkApprovalPerson_final);
    
    this.orderData.forEach(dt => {
      if (dt.detailNo === data.detailNo) {
        let newSplit = new ODIS0060OrderDetailBunkatsu();
        newSplit.splitNo              = this.comCompnt.setValue(dt.detailNo);
        newSplit.orderSplitAmount     = this.comCompnt.setValue(dt.orderSplitAmount);
        newSplit.splitSupplierCode    = this.comCompnt.setValue(dt.splitSupplierCode);
        newSplit.splitSupplierName    = this.comCompnt.setValue(dt.splitSupplierName);
        newSplit.splitOrderReceipt    = this.comCompnt.setValue(dt.splitOrderReceipt);
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
    
    this.setSelect($event);

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
    if(this.comCompnt.setValue(value.bulkApprovalPerson_final) != ''){
      isCanNotUpd = true;
      isCanNotDel = true;
    }

    // ハウス材、運賃・荷造・保管料、労災の場合は削除不可
    if (value.journalName == 'ハウス材' ||
      value.journalName == '運賃・荷造・保管料' ||
      value.journalName == '労災') {
      isCanNotDel = true;
    }

    //追加工事タブを選択されている時、全ボタンを非活性する
    if(this.tabName === this.readonlyTab){
      isCanNotUpd = true;
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

  setSelect(event: any){

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
      if(this.comCompnt.setValue(this.orderData[i].bulkApprovalPerson_final) != ''){
        var tr = wTbody.rows[i];
        for (var j = 0; j < tr.cells.length; j++) {
          var td = tr.cells[j];
          if (j <= this.cellNumber) {
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
    else{
      return this.transparent;
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

    if(this.tabName === this.readonlyTab){
      return true;
    }

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

  bulkApprovalLv1Info(){

    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().rowIndex != null) {
      return true;
    }

    //一括依頼データを抽出
    var requestInfo = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkRequestDate) != '') {
        return value;
      }
    })
    //一括承認データを抽出
    var approvalLv1 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv1) != '') {
        return value;
      }
    })
    //一括承認１済の時、ボタン非活性する。
    if (requestInfo.length == this.orderData.length && approvalLv1.length != this.orderData.length) {
      return false;
    }
    return true;

  }

  bulkApprovalLv2Info(){
 
    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().rowIndex != null) {
      return true;
    }

    //一括承認データを抽出
    var approvalLv1 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv1) != '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalLv2 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv2) != '') {
        return value;
      }
    })
    //一括承認２済の時、ボタン非活性する。
    if (approvalLv1.length == this.orderData.length && approvalLv2.length != this.orderData.length) {
      return false;
    }
    return true;
  }

  bulkApprovalLv3Info(){
 
    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().rowIndex != null) {
      return true;
    }

    //一括承認データを抽出
    var approvalLv2 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv2) != '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalLv3 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv3) != '') {
        return value;
      }
    })
    //一括承認２済の時、ボタン非活性する。
    if (approvalLv2.length == this.orderData.length && approvalLv3.length != this.orderData.length) {
      return false;
    }
    return true;

  }

  bulkApprovalFinalInfo(){

    if(this.tabName === this.readonlyTab){
      return true;
    }

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
    var approvalLv1 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv1) != '') {
        return value;
      }
    })
    //一括承認データを抽出
    var approvalLv2 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv2) != '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalLv3 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv3) != '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalFinal = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_final) != '') {
        return value;
      }
    })

    if(this.approvalUnit == 1 && requestInfo.length == this.orderData.length && approvalFinal.length != this.orderData.length){
      return false;
    }

    if(this.approvalUnit == 2 && approvalLv1.length == this.orderData.length && approvalFinal.length != this.orderData.length){
      return false;
    }

    if(this.approvalUnit == 3 && approvalLv2.length == this.orderData.length && approvalFinal.length != this.orderData.length){
      return false;
    }

    if(this.approvalUnit == 4 && approvalLv3.length == this.orderData.length && approvalFinal.length != this.orderData.length){
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

  oneClickApprovalLv1($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      //TODO: ログイン情報
      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkApprovalDate_lv1) ==''){
          element.bulkApprovalDate_lv1   = approvalTime;
          element.bulkApprovalPerson_lv1 = this.appComponent.loginUser;
        }
      })
  }

  oneClickApprovalLv2($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      //TODO: ログイン情報
      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkApprovalDate_lv2) ==''){
          element.bulkApprovalDate_lv2   = approvalTime;
          element.bulkApprovalPerson_lv2 = this.appComponent.loginUser;
        }
      })
  }
  oneClickApprovalLv3($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      //TODO: ログイン情報
      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkApprovalDate_lv3) ==''){
          element.bulkApprovalDate_lv3   = approvalTime;
          element.bulkApprovalPerson_lv3 = this.appComponent.loginUser;
        }
      })
  }
  oneClickApprovalFinal($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      //TODO: ログイン情報
      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkApprovalDate_final) ==''){
          element.bulkApprovalDate_final   = approvalTime;
          element.bulkApprovalPerson_final = this.appComponent.loginUser;
        }
      })
  }
  approvalReject($event, dt: ODIS0020OrderDetaiSplitBean, type:string){

    var confirm = window.confirm(Const.WarningMsg.W0006);
    if(!confirm){
      return false;
    }

    //TODO:
    switch(type){
      case '0':
        
        break;
      case '1':
        dt.requestDate = '';
        dt.requester   = '';
        dt.approvalDate_lv1 = '';
        dt.requestDate = '';
        dt.approvalDate_lv2 = '';
        dt.requestDate = '';
        dt.approvalDate_lv3 = '';
        dt.requestDate = '';
        dt.approvalDate_final = '';
        break;
    }

  }

  setOrderReceiptStt($event,dt: ODIS0020OrderDetaiSplitBean, type: string){
    var isChecked = $event.currentTarget.checked;
    if(type=='0'){
      this.orderData.forEach(element => {
        if(element.detailNo == dt.detailNo){
          if(isChecked){
            element.orderReceipt == '8';
            element.splitOrderReceipt == '8'
          }
          else{
            element.orderReceipt == '0';
            element.splitOrderReceipt == '0'
          }
          
        }
        
      });
    }
    if(type=='1'){
      if(isChecked){
        dt.splitOrderReceipt = '8';
      }
      else{
        dt.splitOrderReceipt = '0';
      }
    }

  }
}
