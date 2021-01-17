import { LoginUserEntity } from './../../ODIS0000/entities/odis0000-loginInfo.entity';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ViewContainerRef} from '@angular/core';
import { MatTable } from '@angular/material';
import { AppComponent } from '../../app.component';
import { Const } from '../../common/const';
import { CommonComponent } from 'app/common/common.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake, ODIS0060Session } from '../entities/odis0060-SplitDetail.entity';
import { ODIS0020Service } from './../../ODIS0020/services/odis0020-service';
import { ODIS0020OrderDetaiSplitBean } from './../../ODIS0020/entities/odis0020-OrderDetailSplit.entity';
import { ODIS0060SplitDetailService } from '../services/split-detail-input-service';
import { ODIS0020BunkatsuInsertService, ODIS0060RowStatus } from '../services/odis0060-AddBunkatsuDetail.service';
import { Subscription } from 'rxjs';
import { OrderSupplierSelectService } from '../../ODIS0040/services/order-supplier-select.service';
import { OrderSupplierSelectComponent } from 'app/ODIS0040/component/order-supplier-select.component';
import { ODIS0060Form} from '../entities/odis0060-Form.entity';
import { ODIS0060OrderCode} from '../entities/odis0060-OrderCode.entitiy';
import { ODIS0060SuchOAP} from '../entities/odis0060-SuchOAP.entity';
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'split-detail-input',
  templateUrl: './split-detail-input.component.html',
  styleUrls: ['./split-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SplitOrderDetailComponent implements OnInit, OnDestroy {

  /** 仕訳テーブルのヘッダーの1行目のカラム */
  mainHeaderCols: string[] = [
    'no',
    'orderPlanAmount',
    'bunkatsuHachuuSaki',
    "bunkatsuChumon",
    'comment',
    'irai',
    'saishuu_shounin',
    'order',
    'received',
    'payment',
  ]

  /** 仕訳テーブルのヘッダーの2行目のカラム */
  subHeaderCols: string[] = [
    'requestDate',
    'approvalDate_final',
  ];

  /** テーブルの全カラム */
  totalColumns: string[] = [
    'index',
    'orderPlanAmount1',
    'splitSupplierCode',
    'splitSupplierName',
    "splitOrderReceipt",
    'comment1',
    'requestDate',
    'approvalDate_final',
    'orderDate',
    'orderAmount',
    'receivedDate',
    'receivedAmount',
    'paymentDate',
    'paymentAmount',
  ];
  
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild('ShiwakeData', { static: true }) childShiwake: any;
  @ViewChild('BunkatsuData', { static: true }) childBunkatsu: any;


  //仕訳テーブルのデータ
  shiwakeData: ODIS0060OrderShiwake[] = [];
  //分割テーブルのデータ
  bunkatsuData: ODIS0060OrderDetailBunkatsu[] = [];
  //分割明細追加サービス
  input = new ODIS0020BunkatsuInsertService();

  amountDeference: number = 0;

  rowStatus = new ODIS0060RowStatus();

  //タブネーム
  tabName: string = '';
  //ボタンの初期表示
  btnTsuika: boolean;
  btnHenkou: boolean;
  btnChuushi: boolean;
  btnSakujo: boolean;

  //初期画面のレンダー
  isInitFlg: boolean = false;
  //ビジーカーソル
  isLoading: boolean = false;

  // 編集フラグ
  isEditFlg = false;

  // 発注先コード パラメータ
  paramOrderCode = new ODIS0060Form();
  // 発注先コード レスポンス
  resOrderCode = new ODIS0060OrderCode();

  // 発注、受入、仕入 パラメータ
  paramSuchOAP = new ODIS0060Form();
  // 発注、受入、仕入 レスポンス
  resSuchOAP : ODIS0060SuchOAP;

  private subscription: Subscription;
  public modal: any = null;

  loginInfo: LoginUserEntity;
  //承認人数
  approvalUnit: number;

  //仕訳テーブルのチェックボックス
  orderReceiptCheckStt: string = Const.OrderReceiptCheckType.UnCheck;

  constructor(
    private appComponent: AppComponent,
    private baseCompnt: CommonComponent,
    private commonService: CommonService,
    private router: Router,
    private datePipe: DatePipe,
    private splitService: ODIS0060SplitDetailService,
    private odis0020Service: ODIS0020Service,
    private viewRef: ViewContainerRef,
    private OrderSupplierSelectService: OrderSupplierSelectService,
  ) {  }

  // --------------------------------------- ▼▼ 初期表示処理 ▼▼ ---------------------------------------
  /**
   * 初期表示
   * 説明：ページがロードする時、テーブルデータを取得する
   */
  ngOnInit() {

    this.approvalUnit = this.appComponent.approvalLevels;
    this.loginInfo = this.appComponent.loginInfo;

    this.appComponent.setHeader(Const.ScreenName.S0006, Const.LinKSetting.L0000 + Const.LinKSetting.L0002);
    this.setApprovalLevelColumns(this.approvalUnit);
    this.setModal();
    //セッションにデータがあるかどうか
    if(sessionStorage.getItem(Const.ScreenName.S0006EN) != null){

      let savedDt = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0006EN));
      this.shiwakeData = savedDt.shiwakeData;
      this.tabName = this.getTabName(this.shiwakeData[0].detailKind);
      this.bunkatsuData = savedDt.bunkatsuData;
      
      // 画面をレンダーする
      this.isInitFlg = true;
      
    }
    else{ 
      //初期表示
      this.setDisplayData();
  　 }


    //ページボタンの初期化
    this.setPageButtonDisplay(false,true,false,true);
  }

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
    this.setTableBunkatsuButtonDisplay(this.bunkatsuData);
    let firstIndex = document.getElementsByClassName('mat-tab-label-active');
    firstIndex[0].setAttribute('tabindex','-1');
    let autoFocus = document.getElementById('txtSplitAmount');
    autoFocus.focus();
    
  }

  private setApprovalLevelColumns(unit: number){
    switch(unit){
      //承認人数が1人で設定する
      case Const.ApprovalLevel.OneLevel:
        break;

      //承認人数が2人で設定する
      case Const.ApprovalLevel.TwoLevels:
        this.mainHeaderCols.splice(this.mainHeaderCols.indexOf('irai') + 1, 0, 'shounin_1');
        this.subHeaderCols.splice((this.subHeaderCols.indexOf('requestDate') + 1), 0, 'approvalDate_lv1');
        this.totalColumns.splice((this.totalColumns.indexOf('requestDate') + 1), 0, 'approvalDate_lv1');
        break;

      //承認人数が3人で設定する
      case Const.ApprovalLevel.ThreeLevels:
        this.mainHeaderCols.splice(this.mainHeaderCols.indexOf('irai') + 1, 0, 'shounin_1', 'shounin_2');
        this.subHeaderCols.splice((this.subHeaderCols.indexOf('requestDate') + 1), 0, 'approvalDate_lv1', 'approvalDate_lv2');
        this.totalColumns.splice((this.totalColumns.indexOf('requestDate') + 1), 0, 'approvalDate_lv1', 'approvalDate_lv2');
        break;

      //承認人数が4人で設定する
      case Const.ApprovalLevel.FourLevels:
      default:
        this.mainHeaderCols.splice((this.mainHeaderCols.indexOf('irai') + 1), 0, 'shounin_1', 'shounin_2', 'shounin_3');
        this.subHeaderCols.splice((this.subHeaderCols.indexOf('requestDate') + 1), 0, 'approvalDate_lv1', 'approvalDate_lv2', 'approvalDate_lv3',);
        this.totalColumns.splice((this.totalColumns.indexOf('requestDate') + 1), 0, 'approvalDate_lv1', 'approvalDate_lv2', 'approvalDate_lv3',);
        break;
    }
  }

  /**
   * 明細テーブルに初期表の時、ボタン活動性を設定する。
   *↓↓↓　ボタン名　↓↓↓
   * 「依頼」「承認」「承認」
   * 
   * @param dt 
   * 
   */
  private setTableBunkatsuButtonDisplay(dt: ODIS0060OrderDetailBunkatsu[]) {

    //分割データがない場合、余白行を削除する
    if (this.baseCompnt.setValue(dt[0].orderSplitAmount) == '') {
      // 分割明細テーブルのBodyを取得する
      let skBody:any = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
      skBody.rows[0].remove();
      return;
    }
  }

  public setModal() {
    //ODIS0040発注先マスタ選択
    this.subscription = this.OrderSupplierSelectService.closeEventObservable$.subscribe(
      () => {
        if (!this.baseCompnt.isEmpty(this.OrderSupplierSelectService.getVal())) {
          this.input.splitSupplierCode = this.OrderSupplierSelectService.getVal().supplierCode;
          this.input.splitSupplierName = this.OrderSupplierSelectService.getVal().supplierJournalName;
        }
        this.modal = null;
      }
    );
  }

  public splitSupplierSelect($event, selectVal) {
    this.odis0020Service.setVal(this.baseCompnt.setValue(selectVal));
    this.modal = OrderSupplierSelectComponent;
  }

  /**
   * 仕訳テーブルのデータの取得のメソッド
   */
  private setDisplayData() {
    this.shiwakeData = this.splitService.getSplitTableData();
    this.tabName = this.getTabName(this.shiwakeData[0].detailKind);
    this.bunkatsuData = this.splitService.getDetailTableData();

    //詳細のチェックボックスの値を変数に入れる
    this.orderReceiptCheckStt = this.shiwakeData[0].orderReceipt;

    //分割のチェックボックスの値が０かつ８でないばあい、０にする
    for(let i = 0; i < this.bunkatsuData.length; i++){
      if(this.baseCompnt.setValue(this.bunkatsuData[i].splitOrderReceipt) == ''){
        this.bunkatsuData[i].splitOrderReceipt = Const.OrderReceiptCheckType.UnCheck;
      }
    }

    this.saveDataToSession();

    // 初期画面をレンダーする
    this.isInitFlg = true;
  }

 /**
   * タブ名 取得
   */
  private getTabName(val: string){
    var resVal: string = '';
    switch(val){
      case Const.JuuChuuEdaban.Sekkei:
        resVal = Const.TabName.TabName_Sekkei;
        break;
      case Const.JuuChuuEdaban.Hontai:
        resVal = Const.TabName.TabName_Hontai;
        break;
      case Const.JuuChuuEdaban.Kaitai:
        resVal = Const.TabName.TabName_Kaitai;
        break;
      case Const.JuuChuuEdaban.Zouen1:
        resVal = Const.TabName.TabName_Zouen1;
        break;
      case Const.JuuChuuEdaban.Zouen2:
        resVal = Const.TabName.TabName_Zouen2;
        break;
      case Const.JuuChuuEdaban.Tsuika:
        resVal = Const.TabName.TabName_Tsuika;
        break;
    }
    return resVal;
  }

  /**
   * 終了処理
   *
   * @memberof AppComponent
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  // --------------------------------------- ▲▲ 初期表示処理 ▲▲ ---------------------------------------

  // --------------------------------------- ▼▼ 各ボタン 処理 ▼▼ ---------------------------------------
  /**
   * 分割明細ページの各ボタンの活用性を設定する。　
   * ボタンの初期表、「disabled」属性を「False」する
   * @param tsuika 追加ボタンの設定
   * @param henkou 変更ボタンの設定
   * @param chuushi 中止ボタンの設定
   * @param sakujo 削除ボタンの設定
   */
  private setPageButtonDisplay(tsuika: boolean,henkou: boolean,chuushi: boolean,sakujo: boolean) {
    this.btnTsuika = tsuika;
    this.btnHenkou = henkou;
    this.btnChuushi = chuushi;
    this.btnSakujo = sakujo;
  }

  /**
   * 分割テーブルの合計金額の再計算
   */
  public totalAmount() {
      return this.bunkatsuData.map(data => Number(data.orderSplitAmount)).reduce((acc, value) => (acc + value));
  }
  /**
   * 金額差
   */
  public getAmountDeference(){
    return Number(this.shiwakeData[0].orderPlanAmount) - Number(this.totalAmount());
  }

  /**
   * 仕訳テーブルの行を選択する場合
   *
   * @param $event イベント
   * @param rowDt 選択さらた行の値
   */
  public selectRow($event, rowDt: ODIS0060OrderDetailBunkatsu) {

    //選択された行に背景色を変える
    this.baseCompnt.CommonOnSelHight($event);

    var nodeName = $event.target.nodeName;
    if(nodeName != 'SPAN' && nodeName != 'BUTTON' && nodeName != 'INPUT')
    {
      let index = this.bunkatsuData.indexOf(rowDt);
      this.rowStatus.setRowStatus(true, index);
      
      //編集テーブルの各セルに選択された行の値を挿入
      this.input.setInput(rowDt);
 
    }

    //分割明細のボタンの活用性を設定する
    this.journalDataApprovalChecker(rowDt, nodeName);
  }

  /**
   * 分割明細 制限チェック
   * @param rowData 
   */
  private journalDataApprovalChecker(rowData: ODIS0060OrderDetailBunkatsu, nodeName: any){
    
    switch(true){
      case (nodeName == 'SPAN' || nodeName == 'BUTTON' || nodeName == 'INPUT'):
        this.setPageButtonDisplay(false, true, false, true);
        break;
      //依頼未・承認未
      case (rowData.requester == '' && rowData.approvalPerson_lv1 == ''):
        this.setPageButtonDisplay(true, false, false, false);
        break;
      //依頼済・承認未
      case (rowData.requester != '' && rowData.approvalPerson_lv1 == ''):
        this.setPageButtonDisplay(true, false, false, false);
        break;
      //依頼済・承認済
      case (rowData.requester != '' && rowData.approvalPerson_lv1 != ''):
        this.setPageButtonDisplay(true, true, false, true);
        break;
      // 最終承認済
      case (rowData.approvalPerson_final != ''):
        this.setPageButtonDisplay(true, true, false, true);
        break;
    };
  }

  /**
   * 「明細追加」ボタンの押下
   * @param $event イベント
   */
  public insertBunkatsuOrderDetail($event) {
    // 入力検証
    if(!this.inputCheck('0')){
      return;
    }
    this.isLoading = true;
    // 発注、受入、支払データ取得
    this.paramSuchOAP.propertyNo = this.shiwakeData[0].propertyNo;      // 物件管理ＮＯ
    this.paramSuchOAP.accountCode = this.shiwakeData[0].accountCode;    // 経理分類コード
    this.paramSuchOAP.orderSupplierCode = this.input.splitSupplierCode; // 発注先コード
    
    // 発注、受入、支払 データ取得
    this.commonService.getAuthorizationSearch(Const.UrlLinkName.S0006_GetSuchOAP,this.paramSuchOAP)
    .then(
      (response) => {
        if(response.result === Const.ConnectResult.R0001){
          // データ取得
          this.resSuchOAP = response.applicationData;

          //入力情報 値 保存
          let insertDt = new ODIS0060OrderDetailBunkatsu();
          
          //　明細に追加する位置
          let rowIndex: number = this.bunkatsuData.length;

          // データ追加　設定
          insertDt = this.input.getInput(insertDt, Const.Action.A0001, this.resSuchOAP);

          //分割明細は１件もない場合
          if(rowIndex === 1 && this.baseCompnt.setValue(this.bunkatsuData[0].orderSplitAmount) === ''){
            this.bunkatsuData.splice(0, 1, insertDt);
            rowIndex = 0;
          }
          else{
            //明細に追加する位置を取得
            this.bunkatsuData.splice(rowIndex, 0, insertDt);
          }

          this.table.renderRows();

          let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
          //明細の背景色を変える
          this.baseCompnt.setRowColor(Const.Action.A0001, tbody, rowIndex);
          this.setAutoScroll(tbody,rowIndex);

          //修正完了フラグ ON
          this.isEditFlg = true;

          //仕訳テーブルのチェックボックスを変える
          this.setSplitCheckBox();

          // ボタン制御
          this.setPageButtonDisplay(false, true, false, true);
          this.resetAddTable();
          this.saveDataToSession();

          this.isLoading =false;
        }
      }
    )  
    
  }

  /**
   * 「明細更新」ボタンの押下
   *
   * @param $event イベント
   */
  public updateBunkatsuOrderDetail($event) {

    // 入力検証
    if(!this.inputCheck('1')){
      return;
    }
    this.isLoading = true;
    

    // 発注、受入、支払データ取得
    this.paramSuchOAP.propertyNo = this.shiwakeData[0].propertyNo;      // 物件管理ＮＯ
    this.paramSuchOAP.accountCode = this.shiwakeData[0].accountCode;    // 経理分類コード
    this.paramSuchOAP.orderSupplierCode = this.input.splitSupplierCode; // 発注先コード

    // 発注、受入、支払 データ取得
    this.commonService.getAuthorizationSearch(Const.UrlLinkName.S0006_GetSuchOAP,this.paramSuchOAP)
    .then(
      (response) => {
        if(response.result === Const.ConnectResult.R0001){
          // データ取得
          this.resSuchOAP = response.applicationData;

          let i: number = this.rowStatus.rowIndex;

          this.bunkatsuData[i] = this.input.getInput(this.bunkatsuData[i], Const.Action.A0002, this.resSuchOAP);

          this.table.renderRows();

          let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
          this.baseCompnt.setRowColor(Const.Action.A0002, tbody, i);

          //仕訳テーブルのチェックボックスを変える
          this.setSplitCheckBox();
          
          //最後にページ初期化する
          this.resetAddTable();
          this.setPageButtonDisplay(false, true, false, true);

          //修正完了フラグ ON
          this.isEditFlg = true;
          this.saveDataToSession();
          this.isLoading = false;
        }
      }
    );
  }

  /**
   * 「明細削除」ボタンの押下
   *
   * @param $event イベント
   */
  public deleteOrderDetail($event) {

    //行が選択された場合
    if (!this.rowStatus.isSelected) {
      alert(Const.ErrorMsg.E0008);
      return;

    }
    // 削除する前に一回確認する
    var confirm = window.confirm(Const.WarningMsg.W0001);
    if(!confirm){
      return;
    }
    //分割明細が一つだけの場合、中身を空白する
    if(this.bunkatsuData.length == 1){
      // 初期化
      this.bunkatsuData[0] = new ODIS0060OrderDetailBunkatsu;
    }
    else{
      //選択された行のデータを削除
      this.bunkatsuData.splice(this.rowStatus.rowIndex, 1);

      // 分割連番 再度 採番
      for(let cnt = 0; cnt < this.bunkatsuData.length; cnt++){
        this.bunkatsuData[cnt].splitNo = (cnt + 1).toString();
      }
    }

    //テーブルの再レンダー
    this.table.renderRows();
    this.setTableBunkatsuButtonDisplay(this.bunkatsuData);

    //修正完了フラグ ON
    this.isEditFlg = true;

    //仕訳テーブルのチェックボックスを変える
    this.setSplitCheckBox();

    // ボタン制御
    this.setPageButtonDisplay(false, true, false, true);
    this.resetAddTable();
    this.saveDataToSession();
  }

  /**
   *  「中止」ボタンの押下
   * @param $event イベント
   */
  public stopModifyDetail($event) {

    let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    //選択状態を抜ける
    this.baseCompnt.setRowColor(Const.Action.A0006, tbody, this.rowStatus.rowIndex);
    this.resetAddTable();
    this.setPageButtonDisplay(false, true, false, true);
  }

  /**
   * 分割明細テーブルに「依頼」ボタンを押下する時
   * @param event 
   * @param dt 
   */
  public mainTableRequest(event: any, dt: ODIS0060OrderDetailBunkatsu,) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.requestDate = requestTime;
    //TODO: ログイン情報を取得
    dt.requester = this.loginInfo.empNmKnj;

    this.resetAddTable();
  }

  /**
   * 分割明細テーブルにチェックボックスを押下する時
   * @param event 
   * @param dt 
   */
  public mainTableCheckBoxChange(event: any, dt: ODIS0060OrderDetailBunkatsu) {
    let isChecked = event.currentTarget.checked;
    switch(isChecked){
      case false:
        dt.splitOrderReceipt = Const.OrderReceiptCheckType.UnCheck;
        break;
      case true:
        dt.splitOrderReceipt = Const.OrderReceiptCheckType.Checked;
        break;
    }

    //仕訳テーブルのチェックボックスを変える
    this.setSplitCheckBox();
    this.resetAddTable();
  }

  /**
   * 仕訳テーブルのチェックボックスを変える
   */
  private setSplitCheckBox(){
    for(let i = 0; i < this.bunkatsuData.length; i++){
      if(this.bunkatsuData[i].splitOrderReceipt == Const.OrderReceiptCheckType.Checked){
        this.orderReceiptCheckStt = Const.OrderReceiptCheckType.Checked;
        return;
      } else {
        this.orderReceiptCheckStt = Const.OrderReceiptCheckType.UnCheck;
      }
    }
  }

  /**
   * 入力テーブルに「依頼」ボタンを押下する時。
   * @param event 
   */
  public subTableRequest(event: any) {
    if(this.input.orderSplitAmount == ''){
      this.baseCompnt.setFocus('txtSplitAmount');
      alert(Const.ErrorMsg.E0012);
      return;
    }
    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

    //TODO: ログイン情報を取得 
    this.input.requestDate = requestTime;
    this.input.requester = this.loginInfo.empNmKnj;

  }

  /**
   * 入力テーブルにチェックボックスを押下する時。
   * @param event 
   */
  public subTableCheckBoxChange(event: any) {
    let isChecked = event.currentTarget.checked;
    switch(isChecked){
      case false:
        this.input.splitOrderReceipt = Const.OrderReceiptCheckType.UnCheck;
        break;
      case true:
        this.input.splitOrderReceipt = Const.OrderReceiptCheckType.Checked;
        break;
    }
  }
  
  /**
   * 分割明細追加テーブルを初期化する
   */
  private resetAddTable() {
    this.input.Clear();
    this.rowStatus.Reset();
    this.paramOrderCode = new ODIS0060Form();
  }

  /**
   * 入力チェック
   * @param val 0:明細追加, 1:明細更新
   */
  private inputCheck(val: string): boolean {
    
    //発注予定金額が未入力かどうか
    if (this.input.amountIsBlank) {
      this.baseCompnt.setFocus('txtSplitAmount');
      alert(Const.ErrorMsg.E0006);
      return false;
    }

    //発注先コードが未入力かどうか
    if (this.input.supplierCodeIsBlank) {
      this.baseCompnt.setFocus('txtSupplierCode');
      alert(Const.ErrorMsg.E0005);
      return false;
    }

    // 「明細更新」ボタン処理の場合
    if(val === '1'){
      // 値が変更されていない場合
      if(!this.input.isChanged){
        alert(Const.ErrorMsg.E0015);
        return;
      }
    }
    return true;
  }

  /**
   * 「閉じる」ボタンの押下
   */
  public backToOrderDetailInput() {

    this.toSaveShiwakeData();
    this.router.navigate([Const.UrlSetting.U0002]);
    
  }

  /**
   * 一時的なデータをセッションに保持する
   */
  private saveDataToSession(){

    let saveDt = new ODIS0060Session();
    saveDt.bunkatsuData = this.bunkatsuData;
    saveDt.shiwakeData = this.shiwakeData;

    sessionStorage.setItem(Const.ScreenName.S0006EN, JSON.stringify(saveDt));
  }

  /**
   * 遷移元に値を受け渡す
   * @param body 
   * @param row
   */
  private toSaveShiwakeData(){
    let senderDt: ODIS0020OrderDetaiSplitBean[] = [];

    //分割明細毎発注仕訳データを作成する
    for(var i=0; i < this.bunkatsuData.length; i++){
      let dt = new ODIS0020OrderDetaiSplitBean();
      // 通常データ　かつ　修正完了している場合、詳細入力の対象データをオレンジにする
      if(this.shiwakeData[0].insKubun === Const.InsKubun.Normal && this.isEditFlg){
        dt.insKubun         = Const.InsKubun.Upd;
      }else{
        dt.insKubun         = this.shiwakeData[0].insKubun;
      }
      dt.propertyNo           = this.shiwakeData[0].propertyNo;
      dt.detailKind           = this.shiwakeData[0].detailKind;
      dt.detailNo             = this.shiwakeData[0].detailNo;
      dt.orderBranchNo        = this.shiwakeData[0].orderBranchNo;
      dt.journalCode          = this.shiwakeData[0].journalCode;
      dt.accountCode          = this.shiwakeData[0].accountCode;
      dt.journalName          = this.shiwakeData[0].journalName;
      dt.orderSupplierCode    = this.shiwakeData[0].orderSupplierCode;
      dt.orderSupplierName    = this.shiwakeData[0].orderSupplierName;
      dt.orderReceipt         = this.orderReceiptCheckStt;
      dt.orderPlanAmount      = this.shiwakeData[0].orderPlanAmount;
      dt.bulkRequestDate      = this.shiwakeData[0].bulkRequestDate;
      dt.bulkRequester        = this.shiwakeData[0].bulkRequester;
      dt.bulkApprovalDate_lv1     = this.shiwakeData[0].bulkApprovalDate_lv1;
      dt.bulkApprovalPerson_lv1   = this.shiwakeData[0].bulkApprovalPerson_lv1;
      dt.bulkApprovalDate_lv2     = this.shiwakeData[0].bulkApprovalDate_lv2;
      dt.bulkApprovalPerson_lv2   = this.shiwakeData[0].bulkApprovalPerson_lv2;
      dt.bulkApprovalDate_lv3     = this.shiwakeData[0].bulkApprovalDate_lv3;
      dt.bulkApprovalPerson_lv3   = this.shiwakeData[0].bulkApprovalPerson_lv3;
      dt.bulkApprovalDate_final   = this.shiwakeData[0].bulkApprovalDate_final;
      dt.bulkApprovalPerson_final = this.shiwakeData[0].bulkApprovalPerson_final;
      dt.splitNo              = (i + 1).toString();
      dt.orderSplitAmount     = this.bunkatsuData[i].orderSplitAmount;
      dt.splitSupplierCode    = this.bunkatsuData[i].splitSupplierCode;
      dt.splitSupplierName    = this.bunkatsuData[i].splitSupplierName;
      dt.splitOrderReceipt    = this.bunkatsuData[i].splitOrderReceipt;
      dt.comment              = this.bunkatsuData[i].comment;
      dt.requestDate          = this.bunkatsuData[i].requestDate;
      dt.requester            = this.bunkatsuData[i].requester;
      dt.approvalDate_lv1     = this.bunkatsuData[i].approvalDate_lv1;
      dt.approvalPerson_lv1   = this.bunkatsuData[i].approvalPerson_lv1;
      dt.approvalDate_lv2     = this.bunkatsuData[i].approvalDate_lv2;
      dt.approvalPerson_lv2   = this.bunkatsuData[i].approvalPerson_lv2;
      dt.approvalDate_lv3     = this.bunkatsuData[i].approvalDate_lv3;
      dt.approvalPerson_lv3   = this.bunkatsuData[i].approvalPerson_lv3;
      dt.approvalDate_final   = this.bunkatsuData[i].approvalDate_final;
      dt.approvalPerson_final = this.bunkatsuData[i].approvalPerson_final;
      dt.orderDate            = this.bunkatsuData[i].orderDate;
      dt.orderAmount          = this.bunkatsuData[i].orderAmount;
      dt.receivedDate         = this.bunkatsuData[i].receivedDate;
      dt.receivedAmount       = this.bunkatsuData[i].receivedAmount;
      dt.paymentDate          = this.bunkatsuData[i].paymentDate;
      dt.paymentAmount        = this.bunkatsuData[i].paymentAmount;


      senderDt.push(dt);
    }

    if(this.getAmountDeference() != 0){
      this.odis0020Service.isDeferenceAmount = true;
    }

    //発注明細入力画面に返却するデータを設定する。
    this.odis0020Service.setReturnSplitData(senderDt);

    //発注詳細入力画面に戻る前に、セッションを削除する
    sessionStorage.removeItem(Const.ScreenName.S0006EN);

  }
  // --------------------------------------- ▲▲ 各ボタン 処理 ▲▲ ----------------------------------------
  
  // --------------------------------------- ▼▼ フォーカス系 処理 ▼▼ -------------------------------------
  /**
   * focus処理
   *
   * @param $event イベント
   */
  public commonFocus($event){
    this.input.orderSplitAmount = this.baseCompnt.removeCommas($event.target.value);
  }

  /**
   * blur処理（カンマ）
   *
   * @param $event イベント
   */
  public commonBlur($event){
    if(!($event.target.value == "")){

      var maxLen:number = $event.target.maxLength;
      var val = $event.target.value;
      if(val.length > maxLen){
        val = val.substr(0,maxLen);
      }

      this.input.orderSplitAmount = this.baseCompnt.addCommas(val);
    }
  }

  /**
   * blur処理（全角変換）
   *
   * @param $event イベント
   */
  public onChangeZenkaku($event){

    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }

    this.input.comment = this.baseCompnt.onChangeZenkaku(val);
  }

  /**
   * keyUp処理(半角数字のみ)
   *
   * @param $event イベント
   */
  public onlyHanPrice($event){

    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    
    this.input.orderSplitAmount = this.baseCompnt.onlyHanPrice(val);
  }

  /**
    * keyUp処理 半角数字のみ(発注先コード)
    *
    * @param $event イベント
    */
  public toHanNumSC($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    this.input.splitSupplierCode = this.baseCompnt.onlyHanNumber(val);
  }

  /**
   * 追加した明細に自動スクロールする
   * @param body 
   * @param row
   */
  private setAutoScroll(body: any, row: number) {
    body.rows[row].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
  }

  /**
   * 発注先コード ロストフォーカス
   * @param event 
   */
  public getOrderCode($event){
    
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }

    // 空白以外の場合に処理を実行
    if(val.trim().length >= 1){
      // 0パディング 設定
      var strOrderCode = this.baseCompnt.getZeroPadding(val.trim(), 3);
      // 前回の仕訳コードと異なる場合に以降の処理を実施
      if(this.paramOrderCode.orderSupplierCode !== strOrderCode){
        // 初期化
        this.paramOrderCode = new ODIS0060Form();
        // TODO:　システムログイン情報から取得すること！
        // 事業区分コード設定
        // this.paramOrderCode.officeCode = '701000';

        this.paramOrderCode.officeCode = this.loginInfo.jgyshCd;
        // 仕訳コード 設定
        this.paramOrderCode.orderSupplierCode = strOrderCode;

        // 仕訳コード取得
        this.commonService.getAuthorizationSearch(Const.UrlLinkName.S0006_GetOrderCode, this.paramOrderCode)
        .then(
          (response) => {

            if(response.result === Const.ConnectResult.R0001){
              this.resOrderCode = response.applicationData;
              this.input.splitSupplierCode = strOrderCode;   // 発注先コード
              this.input.splitSupplierName = this.resOrderCode.orderSupplierName;   // 発注先名称
            }
          }
        );
      }
    }
  }
  
  // --------------------------------------- ▲▲ フォーカス系 処理 ▲▲ ---------------------------------------
}