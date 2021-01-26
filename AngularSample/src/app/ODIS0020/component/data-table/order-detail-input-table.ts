import { ODIS0020UserApprovalPermission } from './../../entities/odis0020-ApprovalPermission.entity';
import { LoginUserEntity } from './../../../ODIS0000/entities/odis0000-loginInfo.entity';
import { ODIS0020RowStatus } from './../../../ODIS0020/services/odis0020-DataEmitter.service';
import { DatePipe } from '@angular/common';
import { DataEmitter } from "../../services/odis0020-DataEmitter.service";
import { Component, Input, ViewEncapsulation, Output, EventEmitter, OnInit,　AfterViewInit, ViewContainerRef, ViewChild} from "@angular/core";
import { CommonComponent } from "app/common/common.component";
import { Const } from "app/common/const";
import { ODIS0060SplitDetailService } from 'app/ODIS0060/services/split-detail-input-service';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake } from 'app/ODIS0060/entities/odis0060-SplitDetail.entity';
import { ODIS0020OrderDetaiSplitBean } from '../../entities/odis0020-OrderDetailSplit.entity'
import { AppComponent} from 'app/app.component';
import { MatTable } from '@angular/material';
import { ODIS0020Service } from 'app/ODIS0020/services/odis0020-service';

@Component({
  selector: "shiwake-table",
  styleUrls: ["order-detail-input-table.css"],
  templateUrl: "./order-detail-input-table.html",
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailShiwakeTable implements OnInit, AfterViewInit {
  @Input() orderData: ODIS0020OrderDetaiSplitBean[] = [];
  @Input() tabName:string;
  @Output() sendOrderData = new EventEmitter<DataEmitter>();
  @Input() permission: ODIS0020UserApprovalPermission = new ODIS0020UserApprovalPermission();
  
  //親から観察されている
  @ViewChild(MatTable, { static: false }) tableShiwake: MatTable<any>;

  //承認人数
  approvalUnit: number;
  systemDate: Date = new Date();
  dataEmitter = new DataEmitter();
 
  grayOut = Const.HighLightColour.GrayOut;
  transparent = Const.HighLightColour.Transparent;
  black = Const.HighLightColour.Black;
  readonly readonlyTab = Const.TabName.TabName_Tsuika;
  
  /** 明細に固定さている明細名称 */
  private readonly FIXED_ROW = ['0100','9100','9200','9300'];

  /** 明細にクリックされた位置 */
  private clickedPosition: number = -1;

  //ユーザの承認権限
  loginInfo: LoginUserEntity;

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
    private odis0020Service: ODIS0020Service,
  ) {  }

  ngOnInit(): void {
    
    this.TabChangeSubscriber();

    this.approvalUnit = this.appComponent.approvalLevels;
    this.loginInfo = this.appComponent.loginInfo;

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
  }

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
  
    //データがない場合、テーブルの背景色が変更しない。
    if(this.orderData.length > 0){
      this.setFontWhite(this.orderData);
    }
  }

  //　詳細入力画面でタブ切り替える場合、テーブルの背景色を初期化させる
  private TabChangeSubscriber(){
    this.odis0020Service.tabChange$.subscribe(
      (tabName)=>{
        //データがない場合、テーブルの背景色が変更しない。
        if(this.orderData.length > 0){
          const wTbody = this.viewRef.element.nativeElement.querySelector('tbody');
          this.resetTableBackGroundColor(wTbody, tabName);
        }
      }
    )
  }

  private resetTableBackGroundColor(wTbody: any, tabName: string){

    const row = wTbody.rows[0];
    if(row == undefined || row == null ){
      return;
    }

    var bulkApprovalCell = 0;
    //一括最終承認のセールまで数える
    for(var i = 0; i < row.cells.length; i++){
      if(row.children[i].id == 'bulkApprovalFinal'){
        bulkApprovalCell = i;
        break;
      }
    }
    var approvalCell = 0;
    //一括最終承認のセールまで数える
    for(var i = 0; i < row.cells.length; i++){
      if(row.children[i].id == 'approvalFinal'){
        approvalCell = i;
        break;
      }
    }

    for (var i = 0; i < this.orderData.length; i++) {
      //「追加」タブを選択される場合
      if (tabName == this.readonlyTab) {            
        var tr = wTbody.rows[i];
        for (var j = 0; j < tr.cells.length; j++) {
          var td = tr.cells[j];
          if ((j > bulkApprovalCell) && (j <= approvalCell)) {
            td.style.backgroundColor = this.grayOut;
          }
          else {
            td.style.backgroundColor = Const.HighLightColour.None;
          }
        }
      }
      //「追加」タブ　以外　を選択される場合
      else {
        //一括承認データが入っている行はグレーアウトする。
        if (this.comCompnt.setValue(this.orderData[i].bulkApprovalDate_final) != '') {
          var tr = wTbody.rows[i];
          for (var j = 0; j < tr.cells.length; j++) {
            var td = tr.cells[j];
            //一括最終承認のセールまでグレイアウトする
            if (j <= bulkApprovalCell) {
              td.style.backgroundColor = this.grayOut;
            }
            else {
              td.style.backgroundColor = Const.HighLightColour.None;
            }
          }
        }
        //一括承認データが入らない行は白色をする。
        else {
          var tr = wTbody.rows[i];
          for (var j = 0; j < tr.cells.length; j++) {
            var td = tr.cells[j];
            td.style.backgroundColor = Const.HighLightColour.None;
          }
        }
      }
    } 
  }

  /**
   * 発注予定金額の合計
   */
  public getTotalPlanAmount() {
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
  public getOrderSplitAmount() {
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
  public getOrderAmount() {
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
  public getReceivedAmount() {
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
  public getPaymentAmount() {
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
   * 「反映」ボタン活性フラグ
   * @param element 
   */
  public isReflectFlg(element:ODIS0020OrderDetaiSplitBean) {

    if(this.tabName === this.readonlyTab){
      return true;
    }

    //一括承認データが入らない場合、非活性する。
    if(this.comCompnt.setValue(element.bulkApprovalDate_final) === ''){
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

    // ハウス材、運賃、荷造・保管料、労災の場合は非活性
    if (this.FIXED_ROW.includes(element.journalCode)) {
      return true;
    }

    // 活性
    return false;
  }

  /**
   * 「却下」ボタンの活性か設定
   * @param element 
   * @param type 
   */
  public isRejectFlg(element:ODIS0020OrderDetaiSplitBean, type?:string) {
    //「追加」タブを選択される場合、非活性する
    if(this.tabName === this.readonlyTab){
      return true;
    }
    // 左側の却下ボタンには、一括最終承認が入る場合、非活性する
    if(type == 'order'){
      // if(this.comCompnt.setValue(element.bulkApprovalDate_final) != ''){
      //   return true;
      // }
      if (this.comCompnt.setValue(element.orderSplitAmount) != '') {
        return true;
      }
    }
    // 右側の却下ボタンには、最終承認が入る場合、非活性する
    if(type == 'split'){
      if(this.comCompnt.setValue(element.approvalDate_final) != ''){
        return true;
      }
    }
    return false;
  }

  /**
   * チェックボックスの活性か設定
   * @param element 
   * @param type 
   */
  public isCheckBoxFlg(element:ODIS0020OrderDetaiSplitBean, type:string) {
    //「追加」タブを選択される場合、非活性する
    if(this.tabName === this.readonlyTab){
      return true;
    }
    // 左側の却下ボタンには、一括最終承認が入る場合、非活性する
    if(type == 'order'){
      if(this.comCompnt.setValue(element.bulkApprovalDate_final) != ''){
        return true;
      }
    }
    // 右側の却下ボタンには、最終承認が入る場合、非活性する
    if(type == 'split'){
      if(this.comCompnt.setValue(element.approvalDate_final) != ''){
        return true;
      }
    }
    return false;
  }

  /**
   * 「分割」ボタン活性フラグ
   * @param element 
   */
  public isSplitFlg(element:ODIS0020OrderDetaiSplitBean) {
    if(this.tabName === this.readonlyTab){
      return true;
    }

    //一括承認データが入らない場合、非活性する。
    if (this.comCompnt.setValue(element.bulkApprovalDate_final) === '') {
      return true;
    }
    
    // 発注予定金額画空白の場合、非活性にする。
    if(this.comCompnt.setValue(element.orderPlanAmount) === ''){
      // 非活性
      return true;
    }

    // ハウス材、運賃、荷造・保管料、労災の場合は非活性
    if (this.FIXED_ROW.includes(element.journalCode)) {
      return true;
    }
    // 活性
    return false;
  }

  /**
   *「反映」ボタンを押下して、 発注金額を設定する
   * @param $event
   * @param dataDetail
   */
  public getDisplayData($event, data: ODIS0020OrderDetaiSplitBean) {
    // 発注予定金額を発注金額に設定
    data.orderSplitAmount = this.comCompnt.removeCommas(data.orderPlanAmount);
    //左も注文書発行区分がチェックされたら、分割の注文書発行区分もチェックする
    if(data.orderReceipt == Const.OrderReceiptCheckType.Checked){
      data.splitOrderReceipt = Const.OrderReceiptCheckType.Checked;
    }

    let i = this.orderData.indexOf(data);
    let skBody = this.viewRef.element.nativeElement.querySelector('tbody');
    
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
  public moveToSliptDetailInput($event, data: ODIS0020OrderDetaiSplitBean) {

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
    shiwakeDt[0].bulkRequesterID      = this.comCompnt.setValue(data.bulkRequesterID);
    shiwakeDt[0].bulkApprovalDate_lv1     = this.comCompnt.setValue(data.bulkApprovalDate_lv1);
    shiwakeDt[0].bulkApprovalPerson_lv1   = this.comCompnt.setValue(data.bulkApprovalPerson_lv1);
    shiwakeDt[0].bulkApprovalPersonID_lv1 = this.comCompnt.setValue(data.bulkApprovalPersonID_lv1);
    shiwakeDt[0].bulkApprovalDate_lv2     = this.comCompnt.setValue(data.bulkApprovalDate_lv2);
    shiwakeDt[0].bulkApprovalPerson_lv2   = this.comCompnt.setValue(data.bulkApprovalPerson_lv2);
    shiwakeDt[0].bulkApprovalPersonID_lv2 = this.comCompnt.setValue(data.bulkApprovalPersonID_lv2);
    shiwakeDt[0].bulkApprovalDate_lv3     = this.comCompnt.setValue(data.bulkApprovalDate_lv3);
    shiwakeDt[0].bulkApprovalPerson_lv3   = this.comCompnt.setValue(data.bulkApprovalPerson_lv3);
    shiwakeDt[0].bulkApprovalPersonID_lv3 = this.comCompnt.setValue(data.bulkApprovalPersonID_lv3);
    shiwakeDt[0].bulkApprovalDate_final   = this.comCompnt.setValue(data.bulkApprovalDate_final);
    shiwakeDt[0].bulkApprovalPerson_final = this.comCompnt.setValue(data.bulkApprovalPerson_final);
    shiwakeDt[0].bulkApprovalPersonID_final = this.comCompnt.setValue(data.bulkApprovalPersonID_final);
    
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
        newSplit.requesterID          = this.comCompnt.setValue(dt.requesterID);
        newSplit.approvalDate_lv1     = this.comCompnt.setValue(dt.approvalDate_lv1);
        newSplit.approvalPerson_lv1   = this.comCompnt.setValue(dt.approvalPerson_lv1);
        newSplit.approvalPersonID_lv1 = this.comCompnt.setValue(dt.approvalPersonID_lv1);
        newSplit.approvalDate_lv2     = this.comCompnt.setValue(dt.approvalDate_lv2);
        newSplit.approvalPerson_lv2   = this.comCompnt.setValue(dt.approvalPerson_lv2);
        newSplit.approvalPersonID_lv2 = this.comCompnt.setValue(dt.approvalPersonID_lv2);
        newSplit.approvalDate_lv3     = this.comCompnt.setValue(dt.approvalDate_lv3);
        newSplit.approvalPerson_lv3   = this.comCompnt.setValue(dt.approvalPerson_lv3);
        newSplit.approvalPersonID_lv3 = this.comCompnt.setValue(dt.approvalPersonID_lv3);
        newSplit.approvalDate_final   = this.comCompnt.setValue(dt.approvalDate_final);
        newSplit.approvalPerson_final = this.comCompnt.setValue(dt.approvalPerson_final);
        newSplit.approvalPersonID_final = this.comCompnt.setValue(dt.approvalPersonID_final);
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
   * @param event
   */
  public onSelectHighLight(event: any, value: ODIS0020OrderDetaiSplitBean) {

    this.setSelect(event);
    
    const nodeName = event.target.nodeName;
    // チェックボックス・ボタンを押下する時、エミッタ―データを送らない。
    if (nodeName == 'INPUT' || nodeName == 'MAT-ICON') { return; }
  
    this.sendEmitter(value, nodeName);
  }

  /**
   * 親元にデータを送る。
   * @param value 
   * @param nodeName 
   */
  private sendEmitter(value: ODIS0020OrderDetaiSplitBean, nodeName: string = null) {
    // 明細連番 対象データ抽出
    let dtList = this.orderData.filter(element => {
      if (element.detailNo == value.detailNo) {
        return element;
      }
    });

    let rowStt = new ODIS0020RowStatus();
    rowStt.rowBegin = this.orderData.indexOf(dtList[0]);
    rowStt.detailNo = value.detailNo;
    rowStt.splitNo = value.splitNo;
    rowStt.dataLength = dtList.length;

    this.dataEmitter.action = Const.Action.A0004;

    // 依頼・承認ボタンを押下した場合、
    if (nodeName === 'SPAN' || nodeName === 'BUTTON') {
      if (this.clickedPosition >= 11) {
        this.dataEmitter.action = Const.Action.A0008;
      }
    }

    this.dataEmitter.setRowStatus(rowStt);
    this.dataEmitter.setEmitterData(value);
    this.sendOrderData.emit(this.dataEmitter);
  }

  /**
   * 一覧にて、明細を選択する時、発生する
   * @param event 
   */
  private setSelect(event: any){

    //クリックされたエレメント名を取得する
    const nodeName = event.target.nodeName;
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
        this.clickedPosition = event.path[3].cellIndex;
        break;

      case 'LABEL':
        wTr = event.path[2];
        wTbody = event.path[3];
        this.clickedPosition = event.path[1].cellIndex;
        break;

      //依頼・承認ボタンを押下した後、明細変更テーブルにデータを表示しない。
      case 'SPAN':
        wTr = event.path[3];
        wTbody = event.path[4];
        this.clickedPosition = event.path[2].cellIndex;
        break;

      case 'BUTTON':
        wTr = event.path[2];
        wTbody = event.path[3];
        this.clickedPosition = event.path[1].cellIndex;
        break;

      //チェックボックス
      case 'INPUT':
        wTr = event.path[2];
        wTbody = event.path[3];
        this.clickedPosition = event.path[1].cellIndex;
        break;
    }
  
    this.resetTableBackGroundColor(wTbody, this.tabName);

    //選択されている行の背景色を変える
    for (var i = 0; i < wTr.cells.length; i++) {
      var cell = wTr.cells[i];
      cell.style.backgroundColor = Const.HighLightColour.Selected;
    }

  }


  /**
   * 依頼ボタンを実行する
   * @param event
   * @param dt 
   */
  public setRequest(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.requestDate = requestTime;
    dt.requester = this.loginInfo.empNmKnj;
    dt.requesterID = this.loginInfo.personAuthID;
  }

  /**
   * 承認１を実行する
   * @param event 
   * @param dt 
   */
  public setApprovalFirstLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_lv1 = requestTime;
    dt.approvalPerson_lv1 = this.loginInfo.empNmKnj;
    dt.approvalPersonID_lv1 = this.loginInfo.personAuthID;
  }

  /**
  * 承認２を実行する
  * @param event
  * @param dt
  */
  public setApprovalNextLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_lv2 = requestTime;
    dt.approvalPerson_lv2 = this.loginInfo.empNmKnj;
    dt.approvalPersonID_lv2 = this.loginInfo.personAuthID;

  }

  /**
  * 承認３を実行する
  * @param event 
  * @param dt 
  */
  public setApprovalThirdLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_lv3 = requestTime;
    dt.approvalPerson_lv3 = this.loginInfo.empNmKnj;
    dt.approvalPersonID_lv3 = this.loginInfo.personAuthID;

  }

  /**
 * 最終承認を実行する
 * @param event 
 * @param dt 
 */
  public setApprovalFinalLevel(event: any, dt: ODIS0020OrderDetaiSplitBean) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.approvalDate_final = requestTime;
    dt.approvalPerson_final = this.loginInfo.empNmKnj;
    dt.approvalPersonID_final = this.loginInfo.personAuthID;
  }

  /**
   * 差額がある場合、テキスト色を変える。
   * @param dt 
   */
  public getFontColor(element: ODIS0020OrderDetaiSplitBean){
    // フォント色
    if(element.splitNo == '1'){
      // 初期化
      var isFont = Const.HighLightColour.Black;
      // 追加タブを選択される場合、フォント色を変えない。
      if(this.tabName == this.readonlyTab){
        return isFont;
      }

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
    const tr = skBody.rows[0];
    if(tr == undefined || tr == null){
      return;
    }

    var bulkApprovalCell = 0;
    for(var i = 0; i < tr.cells.length; i++){
      //最終承認セールまで数える
      if(tr.childNodes[i].id == "bulkApprovalFinal"){
        bulkApprovalCell = i;
        break;
      }
    }
    for (let i = 0; i < dt.length; i++) {
      if(dt[i].splitNo !== '1'){
        var row = skBody.rows[i];
        for(var j = 0; j <= bulkApprovalCell; j++){
          row.cells[j].style.color = Const.HighLightColour.Transparent;
        }
      }
    }
  }

  /**
   * 一括依頼ボタンの制御
   */
  public bulkRequestInfo(){

    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括依頼処理を行わない
    if (this.dataEmitter.getRowStatus().isSelected) {
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

  /**
   * 一括承認１ボタンの制御
   */
  public bulkApprovalLv1Info(){
    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().isSelected) {
      return true;
    }

    //一括依頼データを抽出
    var requestInfo = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkRequestDate) != '' &&
          this.comCompnt.setValue(value.bulkApprovalPerson_final) == '') {
        return value;
      }
    })
    //一括承認データを抽出
    var approvalLv1 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv1) != '' &&
          this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalFinal = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    //一括依頼済の時、かつ承認１未済の場合、ボタン活性する。
    if (requestInfo.length == approvalFinal.length &&
        approvalLv1.length != approvalFinal.length &&
        //承認者の数が２以上の場合
        this.approvalUnit >= Const.ApprovalLevel.TwoLevels &&
        //ユーザーが承認１の権限を持つ場合、ボタンを活性にする
        this.comCompnt.setValue(this.permission.approvalLv1) == Const.ApprovalValue.Allow &&
        this.comCompnt.setValue(this.permission.deleteFlag) != '1') {
      return false;
    }

    
    return true;

  }

  /**
   * 一括承認２ボタンの制御
   */
  public bulkApprovalLv2Info(){
 
    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().isSelected) {
      return true;
    }

    //一括承認データを抽出
    var approvalLv1 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv1) != '' &&
          this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalLv2 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv2) != '' &&
          this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    var approvalFinal = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    //一括承認１済の時、かつ承認２未済の場合、ボタン非活性する。
      if (approvalLv1.length == approvalFinal.length &&
          approvalLv2.length != approvalFinal.length &&
          //承認者の数が３以上の場合
          this.approvalUnit >= Const.ApprovalLevel.ThreeLevels &&
          //ユーザーが承認２の権限を持つ場合、ボタンを活性にする
          this.comCompnt.setValue(this.permission.approvalLv2) == Const.ApprovalValue.Allow &&
          this.comCompnt.setValue(this.permission.deleteFlag) != '1') {
      return false;
    }
    return true;
  }

  /**
   * 一括承認３ボタンの制御
   */
  public bulkApprovalLv3Info(){
 
    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().isSelected) {
      return true;
    }

    //一括承認データを抽出
    var approvalLv2 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv2) != '' &&
          this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalLv3 = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_lv3) != '' &&
          this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    var approvalFinal = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    //一括承認２済の時、かつ承認３未済の場合、ボタン非活性する。
    if (approvalLv2.length == approvalFinal.length &&
        approvalLv3.length != approvalFinal.length &&
        this.approvalUnit >= Const.ApprovalLevel.FourLevels &&
        //ユーザーが承認３の権限を持つ場合、ボタンを活性にする
        this.comCompnt.setValue(this.permission.approvalLv3) == Const.ApprovalValue.Allow && 
        this.comCompnt.setValue(this.permission.deleteFlag) != '1') {
      return false;
    }
    return true;

  }

  /**
   * 一括最終承認ボタンの制御
   */
  public bulkApprovalFinalInfo(){

    if(this.tabName === this.readonlyTab){
      return true;
    }

    //明細が選択されている時、一括承認処理を行わない
    if (this.dataEmitter.getRowStatus().isSelected) {
      return true;
    }

    //一括承認データを抽出
    var requestInfo = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkRequestDate) != '' &&
          this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })

    //一括承認データを抽出
    var approvalFinal = this.orderData.filter(value => {
      if (this.comCompnt.setValue(value.bulkApprovalDate_final) == '') {
        return value;
      }
    })
    
    //一括依頼済の時、かつ最終承認未済の場合、ボタン活性する。
    if(requestInfo.length == approvalFinal.length &&
       approvalFinal.length > 0 &&
       //ユーザーが最終承認の権限を持つ場合、ボタンを活性にする
       this.comCompnt.setValue(this.permission.approvalFinal) == Const.ApprovalValue.Allow &&
       this.comCompnt.setValue(this.permission.deleteFlag) != '1'){
      return false;
    }

    return true;

  }

  /**
   * 一括最依頼
   * @param $event 
   */
  public oneClickRequest($event){

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

    this.orderData.forEach(element=>{
      if(this.comCompnt.setValue(element.bulkRequestDate) ==''){
        element.bulkRequestDate = requestTime;
        element.bulkRequester   = this.loginInfo.empNmKnj;
        element.bulkRequesterID = this.loginInfo.personAuthID;
      }
    })
  }

  /**
   * 一括最承認１
   * @param $event 
   */
  public oneClickApprovalLv1($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkRequestDate) != '' && 
           this.comCompnt.setValue(element.bulkApprovalDate_lv1) == '' && 
           this.comCompnt.setValue(element.bulkApprovalDate_final) == ''){
          element.bulkApprovalDate_lv1     = approvalTime;
          element.bulkApprovalPerson_lv1   = this.loginInfo.empNmKnj;
          element.bulkApprovalPersonID_lv1 = this.loginInfo.personAuthID;
        }
      })
  }
  /**
   * 一括最承認２
   * @param $event 
   */
  public oneClickApprovalLv2($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkApprovalDate_lv1) != '' &&
           this.comCompnt.setValue(element.bulkApprovalDate_lv2) == '' &&
           this.comCompnt.setValue(element.bulkApprovalDate_final) == ''){
          element.bulkApprovalDate_lv2   = approvalTime;
          element.bulkApprovalPerson_lv2 = this.loginInfo.empNmKnj;
          element.bulkApprovalPersonID_lv2 = this.loginInfo.personAuthID;
        }
      })
  }

  /**
   * 一括最承認３
   * @param $event 
   */
  public oneClickApprovalLv3($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkApprovalDate_lv2) !=''&&
           this.comCompnt.setValue(element.bulkApprovalDate_lv3) ==''&&
           this.comCompnt.setValue(element.bulkApprovalDate_final) ==''){
          element.bulkApprovalDate_lv3   = approvalTime;
          element.bulkApprovalPerson_lv3 = this.loginInfo.empNmKnj;
          element.bulkApprovalPersonID_lv3 = this.loginInfo.personAuthID;
        }
      })
  }

  /**
   * 一括最終承認
   * @param $event 
   */
  public oneClickApprovalFinal($event) {

      let currTime = Date.now();
      let approvalTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

      this.orderData.forEach(element=>{
        if(this.comCompnt.setValue(element.bulkApprovalDate_final) ==''){
          element.bulkApprovalDate_final   = approvalTime;
          element.bulkApprovalPerson_final = this.loginInfo.empNmKnj;
          element.bulkApprovalPersonID_final = this.loginInfo.personAuthID;
        }
      })
  }
  
  /**
   * 却下ボタンを押下する時
   * @param event 
   * @param dt 
   * @param type 
   */
  public approvalReject(event: any, dt: ODIS0020OrderDetaiSplitBean, type: string){

    var confirm = window.confirm(Const.WarningMsg.W0006);
    if(!confirm){
      return false;
    }

    switch(type){
      //左側の却下
      case 'order':
        this.orderData.forEach(element => {
          if(element.detailNo == dt.detailNo){
            element.bulkRequestDate          = '';
            element.bulkRequester            = '';
            element.bulkRequesterID          = '';
            element.bulkApprovalDate_lv1     = '';
            element.bulkApprovalPerson_lv1   = '';
            element.bulkApprovalPersonID_lv1 = '';
            element.bulkApprovalDate_lv2     = '';
            element.bulkApprovalPerson_lv2   = '';
            element.bulkApprovalPersonID_lv2 = '';
            element.bulkApprovalDate_lv3     = '';
            element.bulkApprovalPerson_lv3   = '';
            element.bulkApprovalPersonID_lv3 = '';
            element.bulkApprovalDate_final   = '';
            element.bulkApprovalPerson_final = '';
            element.bulkApprovalPersonID_final = '';
          }          
        });

        break;
      
      //右側の却下
      case 'split':
        dt.requestDate          = '';
        dt.requester            = '';
        dt.requesterID          = '';
        dt.approvalDate_lv1     = '';
        dt.approvalPerson_lv1   = '';
        dt.approvalPersonID_lv1 = '';
        dt.approvalDate_lv2     = '';
        dt.approvalPerson_lv2   = '';
        dt.approvalPersonID_lv2 = '';
        dt.approvalDate_lv3     = '';
        dt.approvalPerson_lv3   = '';
        dt.approvalPersonID_lv3 = '';
        dt.approvalDate_final   = '';
        dt.approvalPerson_final = '';
        dt.approvalPersonID_final = '';

        break;
    }

  }

  /**
   * 注文区分をチェックする
   * @param event 
   * @param dt 
   * @param type 
   */
  public setOrderReceiptStt(event: any, dt: ODIS0020OrderDetaiSplitBean, type: string): Promise<any>{
    const checkValue = event.currentTarget.checked;
    var value: string = '0';
    if(checkValue){
      value = Const.OrderReceiptCheckType.Checked;
    }
    else{
      value = Const.OrderReceiptCheckType.UnCheck;
    }
    //発注注文書区分
    if(type =='order'){
      this.orderData.forEach(element => {
        if(element.detailNo == dt.detailNo){
          element.orderReceipt = value;
          element.splitOrderReceipt = value; 
        }
      });
    }
    //分割注文書区分
    if(type =='split'){
      //分割明細金額がない場合、チェックしないようにする
      if(this.comCompnt.setValue(dt.orderSplitAmount) == ''){
        event.currentTarget.checked = false;
        return;
      }
      var cnt: number = 0;
      var unCheck: number = 0; 
      this.orderData.forEach(element => {
        if(element.detailNo == dt.detailNo){
          //同じ明細連番のデータを数える。
          cnt++;
          if(element.splitNo == dt.splitNo){
            //チェックされた明細の注文区分を変える
            element.splitOrderReceipt = value;
          }
          //チェックしない明細連番を数える
          if(element.splitOrderReceipt == Const.OrderReceiptCheckType.UnCheck){
            unCheck ++;
          }
        }
      })
      //分割データは全体が未チェック場合、発注注文発行区分が未チェックする
      this.orderData.forEach(element => {
        if(element.detailNo == dt.detailNo){
          if(cnt == unCheck){
            element.orderReceipt = Const.OrderReceiptCheckType.UnCheck;
          }
          else{
            element.orderReceipt = Const.OrderReceiptCheckType.Checked;
          }
       }
      })

    }
    // 最後にエミッタ―データを送る。
    this.sendEmitter(dt);

  }
}
