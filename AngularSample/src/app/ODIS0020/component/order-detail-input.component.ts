import { DatePipe } from '@angular/common';
import { ODIS0020Session, ODIS0020Form } from './../entities/odis0020-Form.entity';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Const } from '../../common/const'
import { AppComponent } from '../../app.component'
import { Subscription } from 'rxjs';
import { CommonService } from '../../common/common.service';
import { SupplierPatternService } from '../../ODIS0050/services/supplier-pattern.service';
import { SupplierPatternComponent } from '../../ODIS0050/component/supplier-pattern.component';
import { OrderJournalSelectService } from '../../ODIS0030/services/order-journal-select.service';
import { OrderJournalSelectComponent } from '../../ODIS0030/component/order-journal-select.component';
import { OrderSupplierSelectComponent } from '../../ODIS0040/component/order-supplier-select.component';
import { OrderSupplierSelectService } from '../../ODIS0040/services/order-supplier-select.service';
import { ODIS0020InsertedOrderEdaBan } from '../entities/odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from '../entities/odis0020-MainOrderEdaBan.entity'
import { ODIS0020CustomerInfoBean, ODIS0020DateInfoBean } from '../entities/odis0020-OrderInformation.entity'
import { ODIS0020OrderDetailTotalInfo } from '../entities/odis0020.entity';
import { ODIS0020AddOrderDetail } from '../entities/odis0020-AddDetailForm.entity';
import { ODIS0020Service } from '../services/odis0020-service';
import { DataEmitter, RowStatus } from '../services/odis0020-DataEmitter.service';
import { CommonComponent } from 'app/common/common.component';
import { ODIS0020JournalCode } from '../entities/odis0020-JournalCode.entity';
import { ODIS0020OrderCode } from '../entities/odis0020-OrderCode.entitiy';
import { ODIS0020OrderDetaiSplitBean } from '../entities/odis0020-OrderDetailSplit.entity';
import { ODIS0020UpdForm } from '../entities/odis0020-UpdForm.entity';

@Component({
  selector: 'order-detail-input',
  templateUrl: './order-detail-input.component.html',
  styleUrls: ['./order-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OrderDetailInputComponent implements OnInit, OnDestroy {

  @ViewChild('tabSekkei', { static: false }) childSekkei: any
  @ViewChild('tabHontai', { static: false }) childHontai: any
  @ViewChild('tabKaitai', { static: false }) childKaitai: any
  @ViewChild('tabTsuika', { static: false }) childTsuika: any

  // タッブの初期値
  protected selectedTab: string = Const.TabName.TabName_0;

  //  タッブの名前
  private tabNo1: string = Const.TabName.TabName_0;
  private tabNo2: string = Const.TabName.TabName_1;
  private tabNo3: string = Const.TabName.TabName_2;
  private tabNo4: string = Const.TabName.TabName_3;

  get tabValue(){
    switch(this.selectedTab){
      case this.tabNo1:
        return Number(Const.JutyuEdaban.TabIndex_0);
      case this.tabNo2:
        return Number(Const.JutyuEdaban.TabIndex_1);
      case this.tabNo3:
        return Number(Const.JutyuEdaban.TabIndex_2);
      case this.tabNo4:
        return Number(Const.JutyuEdaban.TabIndex_3);
    }

  }
  
  loaderText: string = Const.WarningMsg.W0002;
  isLoading: boolean = true;

  // レスポンスから取得する
  private pageTotalInfo = new ODIS0020OrderDetailTotalInfo();

  // 発注データ
  orderCustomerInfo = new ODIS0020CustomerInfoBean();
  order0DateInfo = new ODIS0020DateInfoBean;
  tblMainOrder: ODIS0020MainOrderEdaBan[];
  tblInsertedOrder: ODIS0020InsertedOrderEdaBan[];
  orderDetaiSplitlList: ODIS0020OrderDetaiSplitBean[];

  // 明細テーブルにデータを渡す引数 (連動タブを使ったら削除予定)
  tblSekkei : ODIS0020OrderDetaiSplitBean[] = [];
  tblHontai : ODIS0020OrderDetaiSplitBean[] = [];
  tblKaitai : ODIS0020OrderDetaiSplitBean[] = [];
  tblTsuika : ODIS0020OrderDetaiSplitBean[] = [];

  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;

  // 明細追加専用クラス
  addInput = new ODIS0020AddOrderDetail();
  rowStatus = new RowStatus();

  // ボタン制御
  btnInsert: boolean;
  btnUpdate: boolean;
  btnStop: boolean;
  btnDelete: boolean;

  // 初期表示 パラメータ
  paramInit = new ODIS0020Form();

  // 仕訳コード パラメータ
  paramJournalCode = new ODIS0020Form();
  // 仕訳コード レスポンス
  resJournalCode: ODIS0020JournalCode;

  // 発注先コード パラメータ
  paramOrderCode = new ODIS0020Form();
  // 発注先コード レスポンス
  resOrderCode : ODIS0020OrderCode;

  // 更新情報 パラメータ
  paramUpd = new ODIS0020UpdForm();

  //初期画面のレンダー
  isInitFlg: boolean = false;

  bulkReAppStatus =  new BulkRequestAndApproval();

  approvalUnits:number;

  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private SupplierPatternService: SupplierPatternService,
    private OrderJournalSelectService: OrderJournalSelectService,
    private OrderSupplierSelectService: OrderSupplierSelectService,
    private ODIS0020Service: ODIS0020Service,
    private router: Router,
    private baseCompnt: CommonComponent,
    private changeDetectorRef: ChangeDetectorRef,
    private actvRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  // --------------------------------------- ▼▼ 初期表示処理 ▼▼ ---------------------------------------
  /**
   * 初期表示
   */
  ngOnInit() {

    //URLのパラメーターを消す
    history.replaceState({}, '', Const.UrlSetting.U0002);
    // 各モダール 
    this.getDataFromModals();
    this.appComponent.setHeader(Const.ScreenName.S0002, Const.LinKSetting.L0000);

    // セッション情報が存在する場合
    if(sessionStorage.getItem(Const.ScreenName.S0002EN)){
      // セッション情報 設定
      this.getOrderInputDataFromSession();

      // 画面をレンダーする
      this.isInitFlg = true;
      // 再描画
      this.changeDetectorRef.detectChanges();
    }
    else{
      // 初期設定
      this.getOrderInputData();
    }

    // 初期化
    this.setDefaultDisplay();

  }

  /**
   * 各モダールの設定
   */
  private getDataFromModals(){

    //ODIS0030発注仕訳マスタ選択
    this.subscription = this.OrderJournalSelectService.closeEventObservable$.subscribe(
      () => {

        //モーダルから返却データを取得して、展開する。
        if (!this.baseCompnt.isEmpty(this.OrderJournalSelectService.getVal())) {
        this.addInput.journalCode = this.OrderJournalSelectService.getVal().journalCode;
        this.addInput.accountCode = this.OrderJournalSelectService.getVal().accountingCategory;
        this.addInput.journalName = this.OrderJournalSelectService.getVal().orderJournalName;
        }
        this.modal = null;
      }
    );
    //ODIS0040発注先マスタ選択
    this.subscription = this.OrderSupplierSelectService.closeEventObservable$.subscribe(
      () => {
        if (!this.baseCompnt.isEmpty(this.OrderSupplierSelectService.getVal())) {
          this.addInput.orderSupplierCode = this.OrderSupplierSelectService.getVal().supplierCode;
          this.addInput.orderSupplierName = this.OrderSupplierSelectService.getVal().supplierJournalName;
        }

        this.modal = null;
      }
    );
    //ODIS0050発注明細入力_発注先パターン選択
    this.subscription = this.SupplierPatternService.closeEventObservable$.subscribe(() => {
      if (!this.baseCompnt.isEmpty(this.SupplierPatternService.getVal())) {
        let returnValues = this.SupplierPatternService.getVal();
        let bucketDt: ODIS0020OrderDetaiSplitBean[] = [];
        returnValues.forEach(element => {
          let temp = new ODIS0020OrderDetaiSplitBean();

          temp.insKubun           = Const.InsKubun.Ins;
          temp.propertyNo         = this.paramInit.propertyNo;
          temp.detailKind         = this.tabValue.toString();
          temp.splitNo            = '1';
          temp.journalCode        = element.journalCode;
          temp.accountCode        = element.accountingCategory;
          temp.journalName        = element.journalName;
          temp.orderSupplierCode  = element.supplierCode;
          temp.orderSupplierName  = element.supplierName;

          bucketDt.push(temp);
        });

        this.insertDataFromSupplier(bucketDt);
      }

      this.modal = null;
    }
    );
  }

  /**
   * データを取得
   */
  getOrderInputData() {

    //承認処理画面から遷移された時のパラメータを取得する
    this.actvRoute.queryParams.subscribe(params =>{
    
      this.paramInit.propertyNo = params.prop;    //物件管理番号
      this.paramInit.contractNum = params.cntrt;  //契約番号

      if(this.baseCompnt.setValue(params.appUnit) != ''){
        this.approvalUnits = Number(params.appUnit);
      }
      else{
        this.approvalUnits = Const.ApprovalLevel.FourLevels;
      }
      
      
    });

    // データ取得
    // TODO
    this.paramInit.officeCode = '402000';

    // this.paramInit.propertyNo = '55664';
    // this.paramInit.contractNum = '000000122';

    this.orderService.getSearchRequest(Const.UrlLinkName.S0002_Init,this.paramInit)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){
              this.pageTotalInfo = response.applicationData;
              this.orderCustomerInfo = this.pageTotalInfo.custmerInfo;              // 契約情報
              this.order0DateInfo = this.pageTotalInfo.dateInfo;                    // 契約日付
              this.tblMainOrder = this.pageTotalInfo.mainOrderInfo;                 // 本体受注枝番
              this.tblInsertedOrder = this.pageTotalInfo.insertedOrderInfo;         // 追加工事
              this.orderDetaiSplitlList = this.pageTotalInfo.orderDetailList;       // 発注明細分割
              //TODO: 承認人数を設定する。
              // this.approvalUnits = 3;
              // 「設計」タブ
              this.tblSekkei = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JutyuEdaban.TabIndex_0);
              
              // 「本体」タブ
              this.tblHontai = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JutyuEdaban.TabIndex_1);
              
              // 「解体」タブ
              this.tblKaitai = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JutyuEdaban.TabIndex_2);

              // 「追加」タブ
              this.tblTsuika = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JutyuEdaban.TabIndex_3);
              
              // 画面をレンダーする
              this.isInitFlg = true;

              // 再描画
              this.changeDetectorRef.detectChanges();
              // 
              this.setBulkReqAppData(this.tblSekkei);
              
              
              // セッション保存
              this.saveTemporaryData();
            }else{
              alert(response.message);
              this.router.navigate([Const.UrlSetting.U0001]);
            }
            //ロード画面を解除する。
            this.isLoading = false;          

          }
        );
  }

  /**
   * 受注枝番 データ 仕訳
   * @param listOrderDetail
   * @param tabIndex
   */
  private splitOrderDetail(listOrderDetail: ODIS0020OrderDetaiSplitBean[], tabIndex: string){
    // データ フィルタ
    var dt = listOrderDetail.filter(val =>{
      if(this.baseCompnt.setValue(val.detailKind) == tabIndex){
        return val;
      }
    });

    // 取得件数が0件の場合に、初期設定を行う
    if(dt.length === 0){
      dt = this.getInitData(tabIndex);
    }else{
      // ハウス材等を一番下に加工
      var temp1 = dt.filter(dt => {
        if(dt.journalName != 'ハウス材' &&
          dt.journalName != '運賃・荷造・保管料' &&
          dt.journalName != '労災'){
            return dt;
        }
      });
      var temp2 = dt.filter(dt => {
        if(dt.journalName == 'ハウス材' ||
          dt.journalName == '運賃・荷造・保管料' ||
          dt.journalName == '労災'){
            return dt;
        }
      });
      // マージ（データ並び順を設定）
      dt = temp1.concat(temp2);
    }

    return dt;
  }

  /**
   * 初期データ 設定
   */
  private getInitData(tabIndex: string): ODIS0020OrderDetaiSplitBean[]{
    var initData: ODIS0020OrderDetaiSplitBean[] = [];
    var dt: ODIS0020OrderDetaiSplitBean;

    // ハウス材
    dt = new ODIS0020OrderDetaiSplitBean();
    dt.insKubun          = Const.InsKubun.Normal;
    dt.propertyNo        = this.paramInit.propertyNo;
    dt.detailKind        = tabIndex;
    dt.detailNo          = '1';
    dt.splitNo           = '1';
    dt.journalCode       = '0100';
    dt.accountCode       = '010';
    dt.journalName       = 'ハウス材';
    dt.orderSupplierCode = '';
    dt.orderSupplierName = '';
    initData.push(dt);

    // 運賃・荷造・保管料
    dt = new ODIS0020OrderDetaiSplitBean();
    dt.insKubun          = Const.InsKubun.Normal;
    dt.propertyNo        = this.paramInit.propertyNo;
    dt.detailKind        = tabIndex;
    dt.detailNo          = '2';
    dt.splitNo           = '1';
    dt.journalCode       = '9100';
    dt.accountCode       = '910';
    dt.journalName       = '運賃・荷造・保管料';
    dt.orderSupplierCode = '';
    dt.orderSupplierName = '';
    initData.push(dt);

    // 労災
    dt = new ODIS0020OrderDetaiSplitBean();
    dt.insKubun          = Const.InsKubun.Normal;
    dt.propertyNo        = this.paramInit.propertyNo;
    dt.detailKind        = tabIndex;
    dt.detailNo          = '3';
    dt.splitNo           = '1';
    dt.journalCode       = '9300';
    dt.accountCode       = '930';
    dt.journalName       = '労災';
    dt.orderSupplierCode = '';
    dt.orderSupplierName = '';
    initData.push(dt);

    return initData;
  }

  /**
   * 初期表示時 セッションデータ 取得
   * @param dt
   * @param tabName 
   */
  private getOrderInputDataFromSession(){

    // セッションからデータを取得する。 
    let savedData = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0002EN));
    this.approvalUnits = savedData.approvalLevels;
    this.orderCustomerInfo = savedData.CustomerInfo;
    this.order0DateInfo = savedData.DateInfo;
    this.tblMainOrder = savedData.mainOrderInfo;
    this.tblInsertedOrder = savedData.insertedOrderInfo;
    this.tblSekkei = savedData.SekkeiData;
    this.tblHontai = savedData.HontaiData;
    this.tblKaitai = savedData.KaitaiData;
    this.tblTsuika = savedData.TsuikaData;
    this.paramInit = savedData.paramInit;
    
    // 分割明細画面から渡されたパラメータを取得する
    let returnDt = this.ODIS0020Service.ReturnedSplitData;

    // 分割データ 1件以上の場合、以降の処理を実施
    if(returnDt.length >= 1){
      // タブ設定
      this.selectedTab = this.getTabName(returnDt[0].detailKind);
      switch (returnDt[0].detailKind) {
        case Const.JutyuEdaban.TabIndex_0:
          this.tblSekkei = this.mergeData(savedData.SekkeiData, returnDt);
          break;
  
        case Const.JutyuEdaban.TabIndex_1:
          this.tblHontai = this.mergeData(savedData.HontaiData, returnDt);
          break;

        case Const.JutyuEdaban.TabIndex_2:
          this.tblKaitai = this.mergeData(savedData.KaitaiData, returnDt);
          break;
  
        case Const.JutyuEdaban.TabIndex_3:
          this.tblTsuika = this.mergeData(savedData.TsuikaData, returnDt);
          break;
      }
    }
    // セッション保存
    this.saveTemporaryData();
    // ロード画面を解除する。
    this.isLoading = false;

    
    // TODO: TEST
    var currentTabDt = this.getDataFromCurrentTab();
    this.setBulkReqAppData(currentTabDt);
  }

  /**
   * タブ名 取得
   */
  private getTabName(val: string){
    var resVal: string = '';
    switch(val){
      case Const.JutyuEdaban.TabIndex_0:
        resVal = Const.TabName.TabName_0;
        break;
      case Const.JutyuEdaban.TabIndex_1:
        resVal = Const.TabName.TabName_1;
        break;
      case Const.JutyuEdaban.TabIndex_2:
        resVal = Const.TabName.TabName_2;
        break;
      case Const.JutyuEdaban.TabIndex_3:
        resVal = Const.TabName.TabName_3;
        break;
    }
    return resVal;
  }

    /**
   * 分割データ 返却データ マージ
   * @param savedDt 
   * @param returnDt 
   */
  private mergeData(savedDt: ODIS0020OrderDetaiSplitBean[], returnDt: ODIS0020OrderDetaiSplitBean[]): ODIS0020OrderDetaiSplitBean[]{

    // 先頭位置 取得
    var fDt = savedDt.filter(value =>{
      if(value.detailNo == returnDt[0].detailNo){
        return value;
      }
    })
    // 位置取得
    let indx = savedDt.indexOf(fDt[0]);
    this.rowStatus.keyIndex = indx;
    this.rowStatus.detailLength = returnDt.length;

    // 対象外データ抽出
    var tempDt = savedDt.filter(value =>{
      if(value.detailNo != returnDt[0].detailNo){
        return value;
      }
    })
    
    // データ マージ
    for (let i = 0 ; i < returnDt.length; i++){
      let ins = this.createData(returnDt[i]);
      tempDt.splice(i+indx,0,ins);
    }
    
    return tempDt;
  }

  /** 
   * データ 作成
   * @param data
   */
  private createData(data: ODIS0020OrderDetaiSplitBean): ODIS0020OrderDetaiSplitBean{
    let temp = new ODIS0020OrderDetaiSplitBean();

    temp.insKubun              = this.baseCompnt.setValue(data.insKubun);
    temp.propertyNo            = this.baseCompnt.setValue(data.propertyNo);
    temp.detailKind            = this.baseCompnt.setValue(data.detailKind);
    temp.detailNo              = this.baseCompnt.setValue(data.detailNo);
    temp.splitNo               = this.baseCompnt.setValue(data.splitNo);
    temp.journalCode           = this.baseCompnt.setValue(data.journalCode);
    temp.accountCode           = this.baseCompnt.setValue(data.accountCode)
    temp.journalName           = this.baseCompnt.setValue(data.journalName);
    temp.orderSupplierCode     = this.baseCompnt.setValue(data.orderSupplierCode);
    temp.orderSupplierName     = this.baseCompnt.setValue(data.orderSupplierName);
    temp.orderPlanAmount       = this.baseCompnt.setValue(data.orderPlanAmount);
    temp.orderSplitAmount      = this.baseCompnt.setValue(data.orderSplitAmount);
    temp.splitSupplierCode     = this.baseCompnt.setValue(data.splitSupplierCode);
    temp.splitSupplierName     = this.baseCompnt.setValue(data.splitSupplierName);
    temp.comment               = this.baseCompnt.setValue(data.comment);
    temp.requestDate           = this.baseCompnt.setValue(data.requestDate);
    temp.requester             = this.baseCompnt.setValue(data.requester);
    temp.approvalDate_lv1      = this.baseCompnt.setValue(data.approvalDate_lv1);
    temp.approvalPerson_lv1    = this.baseCompnt.setValue(data.approvalPerson_lv1);
    temp.approvalDate_lv2      = this.baseCompnt.setValue(data.approvalDate_lv2);
    temp.approvalPerson_lv2    = this.baseCompnt.setValue(data.approvalPerson_lv2);
    temp.approvalDate_lv3      = this.baseCompnt.setValue(data.approvalDate_lv3);
    temp.approvalPerson_lv3    = this.baseCompnt.setValue(data.approvalPerson_lv3);
    temp.approvalDate_final    = this.baseCompnt.setValue(data.approvalDate_final);
    temp.approvalPerson_final  = this.baseCompnt.setValue(data.approvalPerson_final);
    temp.orderDate             = this.baseCompnt.setValue(data.orderDate);
    temp.orderAmount           = this.baseCompnt.setValue(data.orderAmount);
    temp.receivedDate          = this.baseCompnt.setValue(data.receivedDate);
    temp.receivedAmount        = this.baseCompnt.setValue(data.receivedAmount);
    temp.paymentDate           = this.baseCompnt.setValue(data.paymentDate);
    temp.paymentAmount         = this.baseCompnt.setValue(data.paymentAmount);
    temp.bulkRequestDate       = this.baseCompnt.setValue(data.bulkRequestDate);
    temp.bulkRequester         = this.baseCompnt.setValue(data.bulkRequester);
    temp.bulkApprovalDate      = this.baseCompnt.setValue(data.bulkApprovalDate);
    temp.bulkApprovalPerson    = this.baseCompnt.setValue(data.bulkApprovalPerson);
    
    return temp;
  }

  /**
   * 初期表示後処理実施
   */
  ngAfterViewInit(): void {

    if(!this.isInitFlg){
      return;
    }

    if(this.ODIS0020Service.ReturnedSplitData.length >0 ){
      var body: any
      switch (this.ODIS0020Service.ReturnedSplitData[0].detailKind) {
        case Const.JutyuEdaban.TabIndex_0:
          body = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
          break;
  
        case Const.JutyuEdaban.TabIndex_1:
          body = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
          break;

        case Const.JutyuEdaban.TabIndex_2:
          body = this.childKaitai.viewRef.element.nativeElement.querySelector('tbody');
          break;
  
        case Const.JutyuEdaban.TabIndex_3:
          body = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
          break;
      }

      // 文字色設定
      this.setAfterViewFont();
      var t = this.rowStatus.detailLength + this.rowStatus.keyIndex -1;
    
      this.setAutoScroll(body, t);
      this.baseCompnt.setRowColor(Const.Action.A0004,body,t);
    }    
  }
  // --------------------------------------- ▲▲ 初期表示処理 ▲▲ -------------------------------------

  // --------------------------------------- ▼▼ 各画面設定 ▼▼ ---------------------------------------
  /**
   * 画面初期表示
   */
  setDefaultDisplay(){
    // 初期化
    this.Clear();
    // ボタン制御
    this.setPageButtonDisplay(false, true, false, true);
  }

  /**
   * 仕訳コードリンクボタンを押下する時、モダールを設定する
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */

  orderJournalSelect(selectVal) {
    this.ODIS0020Service.setVal(selectVal);
    this.modal = OrderJournalSelectComponent;
  }

  /**
  * 発注先リンクボタンを押下する時、モダールを設定する
  *
  * @param {*} $event イベント情報
  * @memberof AppComponent
  */

  orderSupplierSelect(selectVal) {
    this.ODIS0020Service.setVal(selectVal);
    this.modal = OrderSupplierSelectComponent;
  }

  /**
   * 発注先パターン選択ボタンを押下する時、モダールを設定する
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  supplierPattern() {
    this.modal = SupplierPatternComponent;
  }

  /**
   * 終了処理
   *
   * @memberof AppComponent
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  // --------------------------------------- ▲▲ 各画面設定 ▲▲ ---------------------------------------

  // --------------------------------------- ▼▼ 各ボタン 処理 ▼▼ ---------------------------------------
  /**
   * 明細追加ボタン
   */
  insertOrderDetail() {
    // 入力チェック
    if(!this.inputCheck('0')){
      return;
    };

    // 追加データ 設定
    let temp = new ODIS0020OrderDetaiSplitBean();
    temp.insKubun           = Const.InsKubun.Ins;
    temp.propertyNo         = this.paramInit.propertyNo;
    temp.detailKind         = this.tabValue.toString();
    temp.splitNo            = '1';
    temp.journalCode        = this.addInput.journalCode;
    temp.accountCode        = this.addInput.accountCode;
    temp.journalName        = this.addInput.journalName;
    temp.orderSupplierCode  = this.addInput.orderSupplierCode;
    temp.orderSupplierName  = this.addInput.orderSupplierName;
    temp.orderPlanAmount    = this.addInput.orderPlanAmount;

    this.insertToDataTable(temp);

    // 初期化
    this.setDefaultDisplay();

  }
  /** テーブルに明細を追加 */
  private insertToDataTable(insertDt: ODIS0020OrderDetaiSplitBean) {
    var insertIndex: number = 0;
    var tblBody;
    switch (this.selectedTab) {
      case this.tabNo1:
        insertIndex = this.countDefaultData(this.childSekkei.orderData);
        this.childSekkei.orderData.splice(insertIndex, 0, insertDt);
        this.reDetailNo(this.childSekkei.orderData);
        tblBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabNo2:
        insertIndex = this.countDefaultData(this.childHontai.orderData);
        this.childHontai.orderData.splice(insertIndex, 0, insertDt);
        this.reDetailNo(this.childHontai.orderData);
        tblBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabNo3:
        insertIndex = this.countDefaultData(this.childKaitai.orderData);
        this.childKaitai.orderData.splice(insertIndex, 0, insertDt);
        this.reDetailNo(this.childKaitai.orderData);
        tblBody = this.childKaitai.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabNo4:
        insertIndex = this.countDefaultData(this.childTsuika.orderData);
        this.childTsuika.orderData.splice(insertIndex, 0, insertDt);
        this.reDetailNo(this.childTsuika.orderData);
        tblBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
        break;
    }

    // 文字色設定
    this.setAfterViewFont();
    this.setAutoScroll(tblBody, insertIndex);

    // 初期化
    this.setDefaultDisplay();
  }

  /**
   * 一番下に肯定されているデータを除く
   * @param data 
   */
  private countDefaultData(data: ODIS0020OrderDetaiSplitBean[]):number{

    var flt = data.filter(dt =>{
      if(dt.journalName == 'ハウス材' ||
        dt.journalName == '運賃・荷造・保管料' ||
        dt.journalName == '労災'){
          return dt;
      }
    })
    return data.length - flt.length;
  }

  /**
   * 明細連番 再連番 設定
   * @param data 
   */
  private reDetailNo(datas: ODIS0020OrderDetaiSplitBean[]){
    // 初期化
    var cnt: number = 0;

    // 再連番
    for(var i = 0; i < datas.length; i++){
      // 仕訳コードに値が入っている場合、連番をカウントアップ
      if(this.baseCompnt.setValue(datas[i].splitNo) === '1'){
        cnt++;
      }

      datas[i].detailNo = cnt.toString();
    }
  }

  /**
   * 発注先パータンから返却データを一覧に追加する
   * @param insertBucket 
   */
  private insertDataFromSupplier(insertBucket:ODIS0020OrderDetaiSplitBean[]){
    switch (this.selectedTab) {
      case this.tabNo1:
        let dataSekkei = this.childSekkei.orderData;
        this.insertProcess(insertBucket,dataSekkei);
        this.childSekkei.tableShiwake.renderRows();
        break;

      case this.tabNo2:
        let dataHontai = this.childHontai.orderData;
        this.insertProcess(insertBucket,dataHontai);
        this.childHontai.tableShiwake.renderRows();
        break;

      case this.tabNo3:
        let dataKaitai = this.childKaitai.orderData;
        this.insertProcess(insertBucket,dataKaitai);
        this.childTsuika.tableShiwake.renderRows();
        break;

      case this.tabNo4:
        let dataTsuika = this.childTsuika.orderData;
        this.insertProcess(insertBucket,dataTsuika);
        this.childTsuika.tableShiwake.renderRows();
        break;
    }
  }

  /**
   * 発注先パターン 追加/上書き
   */
  private insertProcess(insertBucket:ODIS0020OrderDetaiSplitBean[], dataTable: ODIS0020OrderDetaiSplitBean[]){
    let insFlg: boolean = false;
    // 発注先パターン
    for(var insBk of insertBucket) {
      insFlg = true;
      // テーブルデータ
      for(var data of dataTable) {
        // 同一仕訳コードが存在する場合
        if (insBk.journalCode === data.journalCode) {
          // 承認日１が空白の場合
          if (this.baseCompnt.setValue(data.approvalPerson_lv1) === '') {
            // 対象データ（同一発注連番）を上書きする
            for(var tempDt of dataTable){
              if(data.detailNo === tempDt.detailNo){
                tempDt.orderSupplierCode = this.baseCompnt.setValue(insBk.orderSupplierCode);    // 発注先コード
                tempDt.orderSupplierName = this.baseCompnt.setValue(insBk.orderSupplierName );   // 発注先名称
                tempDt.insKubun = Const.InsKubun.Upd;
              }
            }
            insFlg = false;
            break;
          }
        }
      }
      // データ追加
      if (insFlg) {
        this.insertToDataTable(insBk);
      }
    }
    this.reDetailNo(dataTable);
  }

  /**
   * 明細更新ボタン
   */
  updateOrderDetail() {
    // 入力チェック
    if(!this.inputCheck('1')){
      return;
    };
    var key = this.rowStatus.keyIndex;
    switch (this.selectedTab) {
      case this.tabNo1:
        this.childSekkei.orderData = this.addInput.getInput(this.childSekkei.orderData,key);
        break;

      case this.tabNo2:
        this.childHontai.orderData = this.addInput.getInput(this.childHontai.orderData,key);
        break;

      case this.tabNo3:
        this.childKaitai.orderData = this.addInput.getInput(this.childKaitai.orderData,key);
        break;

      case this.tabNo4:
        this.childTsuika.orderData = this.addInput.getInput(this.childTsuika.orderData,key);
        break;
    }

    // 文字色設定
    this.setAfterViewFont();

    // 初期化
    this.setDefaultDisplay();
  }
  
  /**
   * 入力チェック
   * @param val 0:明細追加, 1:明細更新
   */
  private inputCheck(val: string){

    let rowData = this.rowStatus.rowData;
    // 明細更新ボタン押下された場合は以下処理を実施
    if(val === '1'){
     
      //選択された明細は「ハウス材」「運賃・荷造・保管料」「労災」かどうかをチェックする
      if(rowData.journalName === 'ハウス材' ||
         rowData.journalName === '運賃・荷造・保管料' ||
         rowData.journalName === '労災'){
        //仕訳と発注先が変更されたかどうかをチェックする
        if (rowData.journalCode != this.addInput.journalCode ||
            rowData.accountCode != this.addInput.accountCode ||
            rowData.journalName != this.addInput.journalName ||
            rowData.orderSupplierCode != this.addInput.orderSupplierCode ||
            rowData.orderSupplierName != this.addInput.orderSupplierName) {
            //変更された場合、エラーメッセージを表示する。
            alert(Const.ErrorMsg.E0019);
            return false;
        }
      }

      //明細が変更したかどうかチェックする
      if(this.addInput.isUnchanged){
        alert(Const.ErrorMsg.E0015);
        return false;
      }
    }

    // 仕訳コード 未入力の場合
    if(this.baseCompnt.setValue(this.addInput.journalCode) == ''){
      alert(Const.ErrorMsg.E0003);
      this.baseCompnt.setFocus('txtAddJCode');
      return false;
    }
    if (this.baseCompnt.setValue(this.addInput.accountCode) == '') {
      alert(Const.ErrorMsg.E0004);
      this.baseCompnt.setFocus('txtAddAccCode');
      return false;
    }
    // 発注予定金額が0の場合
    if(Number(this.baseCompnt.setValue(this.addInput.orderPlanAmount)) == 0){
      alert(Const.ErrorMsg.E0006);
      this.baseCompnt.setFocus('txtAddAmount');
      return false;
    }
    return true;
  }

  /**
   * 変更中止ボタン
   */
  stopUpdateOrderDetail() {
    // 初期化
    let index = this.rowStatus.rowIndex;
    var tblBody: any;
    switch (this.selectedTab) {
      case this.tabNo1:
        tblBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        break;
      case this.tabNo2:
        tblBody= this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        break;
      case this.tabNo3:
        tblBody = this.childKaitai.viewRef.element.nativeElement.querySelector('tbody');
        break;
      case this.tabNo4:
        tblBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
        break;
    }

    // 行背景 解除
    this.baseCompnt.setRowColor(Const.Action.A0006, tblBody, index);
    // 初期化
    this.rowStatus.Clear();
    this.setDefaultDisplay();
  }

  /**
   * 明細削除ボタン
   */
  deleteOrderDetail() {
    // 警告メッセージ
    var confirm = window.confirm(Const.WarningMsg.W0001);
    if (!confirm) { return; };

    let key = this.rowStatus.keyIndex;
    let len = this.rowStatus.detailLength;

    // 明細削除
    switch (this.selectedTab) {
      case this.tabNo1:
        this.childSekkei.orderData.splice(key, len);
        this.childSekkei.tableShiwake.renderRows();
        this.reDetailNo(this.childSekkei.orderData);
        break;
      case this.tabNo2:
        this.childHontai.orderData.splice(key, len);
        this.childHontai.tableShiwake.renderRows();
        this.reDetailNo(this.childHontai.orderData);
        break;
      case this.tabNo3:
        this.childKaitai.orderData.splice(key, len);
        this.childKaitai.tableShiwake.renderRows();
        this.reDetailNo(this.childKaitai.orderData);
        break;
      case this.tabNo4:
        this.childTsuika.orderData.splice(key, len);
        this.childTsuika.tableShiwake.renderRows();
        this.reDetailNo(this.childTsuika.orderData);
        break;
    }

    // セッション保存
    this.saveTemporaryData();
    // 初期化する
    this.setDefaultDisplay();
    this.rowStatus.Clear();
  }

  /**
   * タブ切り替え イベント
   * @param event 
   */
  setSelectTabChanged(event: any) {
    // タブ設定
    this.selectedTab = event.tab.textLabel;
    // 初期化
    this.setDefaultDisplay();

    var tabDt = this.getDataFromCurrentTab();

    this.setBulkReqAppData(tabDt);
    
  }

  setBulkReqAppData(tabDt: ODIS0020OrderDetaiSplitBean[]){
    this.bulkReAppStatus = new BulkRequestAndApproval();

    // 承認 済 抽出
    let bulkRequest = tabDt.filter(element => {
      if (this.baseCompnt.setValue(element.bulkRequester) != '') {
        return element;
      }
    });

    // 承認 済 抽出
    let bulkApproval = tabDt.filter(element => {
      if (this.baseCompnt.setValue(element.bulkApprovalPerson) != '') {
        return element;
      }
    });

    if(bulkRequest.length == tabDt.length){
      this.bulkReAppStatus.bulkRequestDate = bulkRequest[0].bulkRequestDate;
      this.bulkReAppStatus.bulkRequester = bulkRequest[0].bulkRequester;
    }
    if(bulkApproval.length == tabDt.length){
      this.bulkReAppStatus.bulkApprovalDate = bulkApproval[0].bulkApprovalDate;
      this.bulkReAppStatus.bulkApprovalPerson = bulkApproval[0].bulkApprovalPerson;
    }
  }

  /**
   * 初期化
   */
  private Clear(){
    this.addInput.journalCode       = '';
    this.addInput.accountCode       = '';
    this.addInput.journalName       = '';
    this.addInput.orderSupplierCode = '';
    this.addInput.orderSupplierName = '';
    this.addInput.orderPlanAmount   = '';
    this.addInput.shiwakeData       = new ODIS0020OrderDetaiSplitBean();
    this.paramJournalCode           = new ODIS0020Form();
    this.paramOrderCode             = new ODIS0020Form();
  } 

  /**
   * 子供コンポーネントから渡されたデータを取得する
   * @param emitterData 
   */
  getEmitter(emitterData: DataEmitter) {
    switch(emitterData.action){
      //明細を選択する
      case Const.Action.A0004:
        // 値設定
        this.rowStatus = emitterData.getRowStatus();
        this.addInput.setInput(emitterData.getEmitterData());
        this.setPageButtonDisplay(true,this.rowStatus.update,false,this.rowStatus.delete);
        break;

      //分割明細画面に遷移する
      case Const.Action.A0007:
        this.rowStatus.Clear();

        // セッション保存
        this.saveTemporaryData();
        this.router.navigate([Const.UrlSetting.U0006]);
        
        break;
      
      //依頼・承認を行う時、各ボタン制御設定する。
      case Const.Action.A0008:
        //入力項目を初期化する。
        this.rowStatus.Clear();
        this.addInput.Clear();
        //各ボタンの制御を設定する。
        this.setPageButtonDisplay(true,this.rowStatus.update,false,this.rowStatus.delete);
        
        break;
    }
  }
 
  /**
   * 明細ボタン制御
   * @param add 明細追加ボタン
   * @param upd 明細更新ボタン
   * @param cancel 中止ボタン
   * @param del 明細削除ボタン
   */
  private setPageButtonDisplay(add:boolean, upd:boolean, cancel:boolean, del:boolean){
    this.btnInsert = add;
    this.btnUpdate = upd;
    this.btnStop = cancel;
    this.btnDelete = del;
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
   * 各タブ 文字色設定
   */
  private setAfterViewFont(){

    // レンダリング
    this.childSekkei.tableShiwake.renderRows();   // 設計
    this.childHontai.tableShiwake.renderRows();   // 本体
    this.childKaitai.tableShiwake.renderRows();   // 解体
    this.childTsuika.tableShiwake.renderRows();   // 追加

    // 文字色 設定
    // 「設計」タブ
    this.setColor(this.childSekkei.orderData,
                  this.childSekkei.viewRef.element.nativeElement.querySelector('tbody'));
                  
    // 「本体」タブ
    this.setColor(this.childHontai.orderData,
                  this.childHontai.viewRef.element.nativeElement.querySelector('tbody'));
    // 「解体」タブ
    this.setColor(this.childKaitai.orderData,
                  this.childKaitai.viewRef.element.nativeElement.querySelector('tbody'));
    // 「追加」タブ
    this.setColor(this.childTsuika.orderData,
                  this.childTsuika.viewRef.element.nativeElement.querySelector('tbody'));

  }

  /** 追加、更新データ フォント色 設定
   * @param tmpTbl
   * @param body
   */
  private setColor(tmpTbl: ODIS0020OrderDetaiSplitBean[], body:any){
    for(var i=0; i<tmpTbl.length; i++){
      switch(tmpTbl[i].insKubun){
        case Const.InsKubun.Normal:
          // 通常
          break;
        case Const.InsKubun.Ins:
          // 登録
          this.baseCompnt.setRowColor(Const.Action.A0001,body,i);
          break;
        case Const.InsKubun.Upd:
          // 更新
          this.baseCompnt.setRowColor(Const.Action.A0002,body,i);
          break;
      }
    }
  }

  /**
   * 更新終了ボタン
   */
  finalUpdateProgress(){

    //明細追加テーブルにて、入力途中項目があるかどうかを検証する。
    if(!this.addInput.isBlank){
        var confirm = window.confirm(Const.WarningMsg.W0004);
        if(!confirm){
          return;
        }
    }

    // 入力チェック(「設計」タブ)
    if(this.updCheck(this.childSekkei.orderData)){
      this.isLoading = false;
      return 
    }
    // 入力チェック(「本体」タブ)
    if(this.updCheck(this.childHontai.orderData)){
      this.isLoading = false;
      return 
    }
    // 入力チェック(「解体」タブ)
    if(this.updCheck(this.childKaitai.orderData)){
      this.isLoading = false;
      return 
    }
    // 入力チェック(「追加」タブ)
    if(this.updCheck(this.childTsuika.orderData)){
      this.isLoading = false;
      return 
    }

    // ローディング開始
    this.isLoading = true;
    //サーバに更新データを送る。
    var tmp: ODIS0020OrderDetaiSplitBean[] = [];
    // 受注枝番 マージ
    this.createOrderData(tmp, this.childSekkei.orderData);    // 設計
    this.createOrderData(tmp, this.childHontai.orderData);    // 本体
    this.createOrderData(tmp, this.childKaitai.orderData);    // 解体
    this.createOrderData(tmp, this.childTsuika.orderData);    // 追加

    // データ更新
    this.paramUpd.propertyNo = this.paramInit.propertyNo;
    this.paramUpd.orderDetailList = tmp;

    this.orderService.getSearchRequest(Const.UrlLinkName.S0002_UPDATE,this.paramUpd)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){  
              //更新が成功した場合、メッセージを表示する
              alert(response.message);
              //セッションを削除する
              sessionStorage.removeItem(Const.ScreenName.S0002EN);

              // 承認処理画面に戻る
              this.router.navigate([Const.UrlSetting.U0001]);
            }else{
              //更新が失敗した場合、エラーメッセージを表示する
              alert(response.message);
            }

            //ロード画面を解除する。
            this.isLoading = false;
          }
        );
  }

  /**
   * 更新終了 入力チェック
   * @param val 
   */
  private updCheck(datas: ODIS0020OrderDetaiSplitBean[]):boolean{
    var tmp = datas.filter(dt => {
      if(dt.journalName !== 'ハウス材' &&
        dt.journalName !== '運賃・荷造・保管料' &&
        dt.journalName !== '労災'){
          return dt;
        }
      });
    
    // 発注先コード、発注予定金額 空白チェック   
    for(var i=0; i<tmp.length; i++){
      // 発注先コード 空白場合
      if(this.baseCompnt.setValue(tmp[i].orderSupplierCode) === ''){
        var tabName = '「' + this.getTabName(tmp[i].detailKind) + '」タブ ';
        alert(tabName + (i+1).toString()+ '行目：' + Const.ErrorMsg.E0017);
        return true;
      }
      // 発注予定金額
      if(this.baseCompnt.setValue(tmp[i].orderPlanAmount) === ''){
        var tabName = '「' + this.getTabName(tmp[i].detailKind) + '」';
        alert(tabName + (i+1).toString()+ '行目：' + Const.ErrorMsg.E0006);
        return true;
      }
    }
    return false;
  }

  /**
   * データ 受注枝番 マージ
   * @param outDatas
   * @param inDatas
   */
  private createOrderData(outDatas: ODIS0020OrderDetaiSplitBean[], inDatas: ODIS0020OrderDetaiSplitBean[]):ODIS0020OrderDetaiSplitBean[]{
    // データ 設定
    for (let i = 0 ; i < inDatas.length; i++){
      outDatas.push(this.createData(inDatas[i]));
    }
    return outDatas;
  }

  /**
   * 一時データを保持する
   */
  saveTemporaryData(){

    // セッションに保持する
    let saveDt = new ODIS0020Session();
    saveDt.approvalLevels = this.approvalUnits;
    saveDt.CustomerInfo = this.orderCustomerInfo;
    saveDt.DateInfo = this.order0DateInfo;
    saveDt.mainOrderInfo = this.tblMainOrder;
    saveDt.insertedOrderInfo = this.tblInsertedOrder;
    saveDt.orderDetailList = this.orderDetaiSplitlList;
    saveDt.SekkeiData = this.tblSekkei;
    saveDt.HontaiData = this.tblHontai;
    saveDt.KaitaiData = this.tblKaitai;
    saveDt.TsuikaData = this.tblTsuika;
    saveDt.paramInit = this.paramInit;

    // 既にセッションが格納されている場合は除去する
    if (sessionStorage.getItem(Const.ScreenName.S0002EN) != null) {
      sessionStorage.removeItem(Const.ScreenName.S0002EN);
    }
    sessionStorage.setItem(Const.ScreenName.S0002EN, JSON.stringify(saveDt));
  }

  backToApprovalPage(){
    
    //警告メッセージを表示する
    let confirm = window.confirm(Const.WarningMsg.W0003);
    if(!confirm){
      return;
    }
    //セッションを削除する
    sessionStorage.removeItem(Const.ScreenName.S0002EN);
    // 承認処理画面に戻る
    this.router.navigate([Const.UrlSetting.U0001]);
  }

  oneClickRequest(){

    var childDt = this.getDataFromCurrentTab();

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

    //TODO: ログイン情報
    this.bulkRequestApproval('irai',childDt, requestTime, '積水　次郎');
    this.setBulkReqAppData(childDt);
  }

  oneClickApproval(){

    var childDt = this.getDataFromCurrentTab();

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    //TODO: ログイン情報
    this.bulkRequestApproval('shounin',childDt, requestTime, '積水　次郎');
    this.setBulkReqAppData(childDt);
  }

  getDataFromCurrentTab(){

    var dt: ODIS0020OrderDetaiSplitBean[] = [];
    switch(this.tabValue){
      case Number(Const.JutyuEdaban.TabIndex_0):
        dt = this.tblSekkei;
        break;
      case Number(Const.JutyuEdaban.TabIndex_1):
        dt = this.tblHontai;
        break;
      case Number(Const.JutyuEdaban.TabIndex_2):
        dt = this.tblKaitai;
        break;
      case Number(Const.JutyuEdaban.TabIndex_3):
        dt = this.tblTsuika;
        break;
    }
    return dt;
  }


  bulkRequestApproval(command: string, dt: ODIS0020OrderDetaiSplitBean[], dateTime: string, name: string){

    dt.forEach(element => {
      if(command == 'irai'){
        element.bulkRequestDate = dateTime;
        element.bulkRequester   = name; 
      }
      if(command == 'shounin'){
        element.bulkApprovalDate     = dateTime;
        element.bulkApprovalPerson   = name; 
      }

    });
  }



  // --------------------------------------- ▲▲ 各ボタン 処理 ▲▲ ---------------------------------------

  // --------------------------------------- ▼▼ フォーカス系 処理 ▼▼ ---------------------------------------
  /**
  * keyUp処理 半角数字のみ(仕訳コード)
  *
  * @param $event イベント
  */
  toHanNumJC($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    this.addInput.journalCode = this.baseCompnt.onlyHanNumber(val);
  }

  /**
    * keyUp処理 半角数字のみ(経理分類コード)
    *
    * @param $event イベント
    */
 toHanNumAC($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
  this.addInput.accountCode = this.baseCompnt.onlyHanNumber(val);
 }

  /**
    * keyUp処理 半角数字のみ(発注先コード)
    *
    * @param $event イベント
    */
 toHanNumSC($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
  this.addInput.orderSupplierCode = this.baseCompnt.onlyHanNumber(val);
 }


  /**
    * keyUp処理 半角数字のみ(発注先予定金額)
    *
    * @param $event イベント
    */
  toHanPricePA($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    this.addInput.orderPlanAmount = this.baseCompnt.onlyHanPrice(val);
  }

  /**
   * blur処理 カンマ処理
   *
   * @param $event イベント
   */
  commonBlurPA($event){
    if(!($event.target.value == "")){
      var maxLen:number = $event.target.maxLength;
      var val = $event.target.value;
      if(val.length > maxLen){
        val = val.substr(0,maxLen);
      }
      // 表示内容
      $event.target.value = this.baseCompnt.addCommas(val);
      // 実際値
      this.addInput.orderPlanAmount = this.baseCompnt.removeCommas(val);
    }
  }

  /**
   * focus処理
   *
   * @param $event イベント
   */
  commonFocusPA($event){
    // 表示内容
    $event.target.value = this.baseCompnt.removeCommas($event.target.value);
    // 実際値
    this.addInput.orderPlanAmount = this.baseCompnt.removeCommas($event.target.value);
  }

 /**
  * blur処理 半角⇒全角(仕訳名称)
  *
  * @param $event イベント
  */
  toZenkakuJN($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    this.addInput.journalName = this.baseCompnt.onChangeZenkaku(val);
  }

  /**
   * 仕訳コード ロストフォーカス
   * @param event 
   */
  getJournalCode($event){

    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }

    // 空白以外の場合に処理を実行
    if(val.trim().length >= 1){
      // 0パディング 設定
      var strJournalCode = this.baseCompnt.getZeroPadding(val.trim(), 4);
      // 前回の仕訳コードと異なる場合に以降の処理を実施
      if(this.paramJournalCode.journalCode !== strJournalCode){
        // 初期化
        this.paramJournalCode = new ODIS0020Form();
        // Todo　システムログイン情報から取得すること！
        // 事業区分コード設定
        this.paramJournalCode.officeCode = '701000';

        // 仕訳コード 設定
        this.paramJournalCode.journalCode = strJournalCode;

        // 仕訳コード取得
        this.orderService.getSearchRequest(Const.UrlLinkName.S0002_GetJournalCode,this.paramJournalCode)
        .then(
          (response) => {

            if(response.result === Const.ConnectResult.R0001){
              this.resJournalCode = response.applicationData;
              this.addInput.journalCode = strJournalCode;   // 仕訳コード
              this.addInput.accountCode = this.resJournalCode.accountCode;   // 経理分類
              this.addInput.journalName = this.resJournalCode.journalName;   // 仕訳名称
            }else{
              alert(response.message);
            }
          }
        );
      }
    }
  }

  /**
   * 経理分類 ロストフォーカス
   * @param event 
   */
  blurAccountCode($event){
    if(!($event.target.value == '')){ 
      var maxLen:number = $event.target.maxLength;
      var val = $event.target.value;
      if(val.length > maxLen){
        val = val.substr(0,maxLen);
      }
      this.addInput.accountCode = this.baseCompnt.getZeroPadding(val.trim(), 3)
    }
  }

  /**
   * 発注先コード ロストフォーカス
   * @param event 
   */
  getOrderCode($event){
    
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
        this.paramOrderCode = new ODIS0020Form();
        // Todo　システムログイン情報から取得すること！
        // 事業区分コード設定
        this.paramOrderCode.officeCode = '701000';

        // 仕訳コード 設定
        this.paramOrderCode.orderSupplierCode = strOrderCode;

        // 仕訳コード取得
        this.orderService.getSearchRequest(Const.UrlLinkName.S0002_GetOrderCode,this.paramOrderCode)
        .then(
          (response) => {

            if(response.result === Const.ConnectResult.R0001){
              this.resOrderCode = response.applicationData;
              this.addInput.orderSupplierCode = strOrderCode;   // 発注先コード
              this.addInput.orderSupplierName = this.resOrderCode.orderSupplierName;   // 発注先名称
            }else{
              alert(response.message);
            }
          }
        );
      }
    }
  }
  // --------------------------------------- ▲▲ フォーカス系 処理 ▲▲ ---------------------------------------
}

export class BulkRequestAndApproval{

  bulkRequestDate : string = '';

  bulkRequester: string = '';

  bulkApprovalDate: string = '';
  
  bulkApprovalPerson: string = '';

}
