import { ODIS0020UserApprovalPermission } from './../entities/odis0020-ApprovalPermission.entity';
import { ODIS0020Session, ODIS0020Form} from './../entities/odis0020-Form.entity';
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
import { ODIS0020AddOrderDetailService } from '../services/odis0020-AddOrderDetail.service';
import { ODIS0020Service } from '../services/odis0020-service';
import { DataEmitter, ODIS0020RowStatus } from '../services/odis0020-DataEmitter.service';
import { CommonComponent } from 'app/common/common.component';
import { ODIS0020JournalCode } from '../entities/odis0020-JournalCode.entity';
import { ODIS0020OrderDetaiSplitBean } from '../entities/odis0020-OrderDetailSplit.entity';
import { ODIS0020UpdForm } from '../entities/odis0020-UpdForm.entity';
import { ODIS0020OrderCode } from '../entities/odis0020-OrderCode.entity';
import { HttpResponse } from '@angular/common/http';

declare var require: any;
const FileSaver = require('file-saver');

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
  @ViewChild('tabZouen1', { static: false }) childZouEn1: any
  @ViewChild('tabZouen2', { static: false }) childZouEn2: any

  // タッブの初期値
  protected selectedTab: string = Const.TabName.TabName_Sekkei;

  //  タッブの名前
  tabName1: string = Const.TabName.TabName_Sekkei;   //設計
  tabName2: string = Const.TabName.TabName_Hontai;   //ハウス
  tabName3: string = Const.TabName.TabName_Kaitai;   //解体
  tabName4: string = Const.TabName.TabName_Zouen1;   //造園①
  tabName5: string = Const.TabName.TabName_Zouen2;   //造園②
  tabName6: string = Const.TabName.TabName_Tsuika;   //追加工事

  //　選択されたタブのIndexを取得
  get tabIndexValue(){
    switch(this.selectedTab){
      case this.tabName1:
        return 0;
      case this.tabName2:
        return 1;
      case this.tabName3:
        return 2;
      case this.tabName4:
        return 3;
      case this.tabName5:
        return 4;
      case this.tabName6:
        return 5;
    }
  }

  get tabOrderKind(){
    switch(this.selectedTab){
      case this.tabName1:
        return Const.JuuChuuEdaban.Sekkei;
      case this.tabName2:
        return Const.JuuChuuEdaban.Hontai;
      case this.tabName3:
        return Const.JuuChuuEdaban.Kaitai;
      case this.tabName4:
        return Const.JuuChuuEdaban.Zouen1;
      case this.tabName5:
        return Const.JuuChuuEdaban.Zouen2;
      case this.tabName6:
        return Const.JuuChuuEdaban.Tsuika;
    }
  }

  get currentBranchNo(){
    switch(this.selectedTab){
      case this.tabName1:
        return Const.BranchValue.Sekkei;
      case this.tabName2:
        return Const.BranchValue.Hontai;
      case this.tabName3:
        return Const.BranchValue.Kaitai;
      case this.tabName6:
        return Const.BranchValue.Tsuika;
      case this.tabName4:
        return Const.BranchValue.Zouen1;
      case this.tabName5:
        return Const.BranchValue.Zouen2;
    }
  }

  isLoading: boolean = true;

  // レスポンスから取得する
  private pageTotalInfo = new ODIS0020OrderDetailTotalInfo();

  // 発注データ
  orderCustomerInfo = new ODIS0020CustomerInfoBean();
  order0DateInfo = new ODIS0020DateInfoBean;
  tblMainOrder: ODIS0020MainOrderEdaBan[];
  tblInsertedOrder: ODIS0020InsertedOrderEdaBan[];
  orderDetaiSplitlList: ODIS0020OrderDetaiSplitBean[];
  approvalPermission = new ODIS0020UserApprovalPermission();

  // 明細テーブルにデータを渡す引数 (連動タブを使ったら削除予定)
  tblSekkei : ODIS0020OrderDetaiSplitBean[] = [];
  tblHouse : ODIS0020OrderDetaiSplitBean[] = [];
  tblKaitai : ODIS0020OrderDetaiSplitBean[] = [];
  tblTsuika : ODIS0020OrderDetaiSplitBean[] = [];
  tblZouen1 : ODIS0020OrderDetaiSplitBean[] = [];
  tblZouen2 : ODIS0020OrderDetaiSplitBean[] = [];

  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;

  // 明細追加専用クラス
  addInput = new ODIS0020AddOrderDetailService();
  rowStatus = new ODIS0020RowStatus();

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

  // 発注、受入、仕入 パラメータ
  paramSuchOAP = new ODIS0020Form();
  // 発注、受入、仕入 レスポンス
  resSuchOAP : ODIS0020OrderDetaiSplitBean;

  // 更新情報 パラメータ
  paramUpd = new ODIS0020UpdForm();

  //初期画面のレンダー
  isInitFlg: boolean = false;
  approvalUnit: number;

  /** 明細に固定さている明細名称 */
  private readonly FIXED_ROW = ['0100','9100','9200','9300'];

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
  ) {  }

  //#region  --------------- ▼▼ 初期表示処理 ▼▼ -----------------------------------
  /**
   * 初期表示
   */
  ngOnInit() {

    //URLのパラメーターを消す
    history.replaceState({}, '', '#' + Const.UrlSetting.U0002);
    // 各モダール 
    this.getDataFromModals();
    this.appComponent.setHeader(Const.ScreenName.S0002, Const.LinKSetting.L0000);
    this.approvalUnit = this.appComponent.approvalLevels;
    // セッション情報が存在する場合
    if(sessionStorage.getItem(Const.ScreenName.S0002EN)){
      // セッション情報 設定
      this.getOrderInputDataFromSession();

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

          temp.insKubun                 = Const.InsKubun.Ins;         
          temp.propertyNo               = this.paramInit.propertyNo;
          temp.detailKind               = this.tabOrderKind;
          temp.orderBranchNo            = this.getOrderBranchValue(this.tabOrderKind);
          temp.splitNo                  = '1';
          temp.journalCode              = element.journalCode;
          temp.accountCode              = element.accountingCategory;
          temp.journalName              = element.journalName;
          temp.orderReceipt             = '0';
          temp.orderSupplierCode        = element.supplierCode;
          temp.orderSupplierName        = element.supplierName;
          temp.orderDate                = element.orderDate;
          temp.orderAmount              = element.orderAmount;
          temp.receivedDate             = element.receivedDate;
          temp.receivedAmount           = element.receivedAmount;
          temp.paymentDate              = element.paymentDate;
          temp.paymentAmount            = element.paymentAmount;
          temp.bulkRequestDate          = '';
          temp.bulkRequester            = '';
          temp.bulkApprovalDate_lv1     = '';
          temp.bulkApprovalPerson_lv1   = '';
          temp.bulkApprovalDate_lv2     = '';
          temp.bulkApprovalPerson_lv2   = '';
          temp.bulkApprovalDate_lv3     = '';
          temp.bulkApprovalPerson_lv3   = '';
          temp.bulkApprovalDate_final   = '';
          temp.bulkApprovalPerson_final = '';

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
  private getOrderInputData() {

    //承認処理画面から遷移された時のパラメータを取得する
    this.actvRoute.queryParams.subscribe(params =>{
    
      this.paramInit.propertyNo = params.prop;    //物件管理番号
      this.paramInit.contractNum = params.cntrt;  //契約番号      
    });

    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0002_Init, this.paramInit)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){
              this.pageTotalInfo = response.applicationData;
              this.orderCustomerInfo = this.pageTotalInfo.custmerInfo;              // 契約情報
              this.order0DateInfo = this.pageTotalInfo.dateInfo;                    // 契約日付
              this.tblMainOrder = this.pageTotalInfo.mainOrderInfo;                 // 本体受注枝番
              this.tblInsertedOrder = this.pageTotalInfo.insertedOrderInfo;         // 追加工事
              this.orderDetaiSplitlList = this.pageTotalInfo.orderDetailList;       // 発注明細分割
              this.approvalPermission = this.pageTotalInfo.approvalPermission;

              // 「設計」タブ
              this.tblSekkei = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JuuChuuEdaban.Sekkei);
              
              // 「ハウス」タブ
              this.tblHouse = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JuuChuuEdaban.Hontai);
              
              // 「解体」タブ
              this.tblKaitai = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JuuChuuEdaban.Kaitai);

              // 「追加」タブ
              this.tblTsuika = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JuuChuuEdaban.Tsuika);
              
              // 「造園①」タブ
              this.tblZouen1 = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JuuChuuEdaban.Zouen1);
              
              // 「造園②」タブ
              this.tblZouen2 = this.splitOrderDetail(this.orderDetaiSplitlList, Const.JuuChuuEdaban.Zouen2);

              // 画面をレンダーする
              this.isInitFlg = true;

              // 再描画
              this.changeDetectorRef.detectChanges();
              
              // セッション保存
              this.saveTemporaryData();
            }
            else {

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
   * @param edaBan
   */
  private splitOrderDetail(listOrderDetail: ODIS0020OrderDetaiSplitBean[], edaBan: string){
    // データ フィルタ
    var dt = listOrderDetail.filter(val =>{
      if(this.baseCompnt.setValue(val.detailKind) == edaBan){
        return val;
      }
    });

    // 取得件数が0件の場合に、初期設定を行う
    if(dt.length === 0 && edaBan != Const.JuuChuuEdaban.Tsuika){
      dt = this.getInitData(edaBan);
    }else{
      // ハウス材等を一番下に加工
      var temp1 = dt.filter(dt => {
        if (!this.FIXED_ROW.includes(dt.journalCode)){
          return dt;
        }
      })

      var temp2 = dt.filter(dt => {
        if (this.FIXED_ROW.includes(dt.journalCode)) {
          return dt;
        }
      })
      
      // マージ（データ並び順を設定）
      dt = temp1.concat(temp2);
    }

    return dt;
  }

  /**
   * 初期データ 設定
   */
  private getInitData(edaBan: string): ODIS0020OrderDetaiSplitBean[]{
    var initData: ODIS0020OrderDetaiSplitBean[] = [];
    var dt: ODIS0020OrderDetaiSplitBean;

    // ハウス材
    dt = new ODIS0020OrderDetaiSplitBean();
    dt.insKubun           = Const.InsKubun.Normal;
    dt.propertyNo         = this.paramInit.propertyNo;
    dt.detailKind         = edaBan;
    dt.detailNo           = '1';
    dt.splitNo            = '1';
    dt.orderBranchNo      = this.getOrderBranchValue(edaBan);
    dt.journalCode        = '0100';
    dt.accountCode        = '010';
    dt.journalName        = 'ハウス材';
    dt.orderSupplierCode  = '';
    dt.orderSupplierName  = '';
    dt.bulkRequestDate    = '';
    dt.bulkRequester      = '';
    dt.bulkApprovalDate_lv1     = '';
    dt.bulkApprovalPerson_lv1   = '';
    dt.bulkApprovalDate_lv2     = '';
    dt.bulkApprovalPerson_lv2   = '';
    dt.bulkApprovalDate_lv3     = '';
    dt.bulkApprovalPerson_lv3   = '';
    dt.bulkApprovalDate_final   = '';
    dt.bulkApprovalPerson_final = '';
    initData.push(dt);

    // 荷造・保管料
    dt = new ODIS0020OrderDetaiSplitBean();
    dt.insKubun           = Const.InsKubun.Normal;
    dt.propertyNo         = this.paramInit.propertyNo;
    dt.detailKind         = edaBan;
    dt.detailNo           = '2';
    dt.splitNo            = '1';
    dt.orderBranchNo      = this.getOrderBranchValue(edaBan);
    dt.journalCode        = '9100';
    dt.accountCode        = '910';
    dt.journalName        = '荷造・保管料';
    dt.orderSupplierCode  = '';
    dt.orderSupplierName  = '';
    dt.bulkRequestDate    = '';
    dt.bulkRequester      = '';
    dt.bulkApprovalDate_lv1     = '';
    dt.bulkApprovalPerson_lv1   = '';
    dt.bulkApprovalDate_lv2     = '';
    dt.bulkApprovalPerson_lv2   = '';
    dt.bulkApprovalDate_lv3     = '';
    dt.bulkApprovalPerson_lv3   = '';
    dt.bulkApprovalDate_final   = '';
    dt.bulkApprovalPerson_final = '';
    initData.push(dt);

    // 運賃
    dt = new ODIS0020OrderDetaiSplitBean();
    dt.insKubun           = Const.InsKubun.Normal;
    dt.propertyNo         = this.paramInit.propertyNo;
    dt.detailKind         = edaBan;
    dt.detailNo           = '3';
    dt.splitNo            = '1';
    dt.orderBranchNo      = this.getOrderBranchValue(edaBan);
    dt.journalCode        = '9200';
    dt.accountCode        = '920';
    dt.journalName        = '運賃';
    dt.orderSupplierCode  = '';
    dt.orderSupplierName  = '';
    dt.bulkRequestDate    = '';
    dt.bulkRequester      = '';
    dt.bulkApprovalDate_lv1     = '';
    dt.bulkApprovalPerson_lv1   = '';
    dt.bulkApprovalDate_lv2     = '';
    dt.bulkApprovalPerson_lv2   = '';
    dt.bulkApprovalDate_lv3     = '';
    dt.bulkApprovalPerson_lv3   = '';
    dt.bulkApprovalDate_final   = '';
    dt.bulkApprovalPerson_final = '';
    initData.push(dt);

    // 労災
    dt = new ODIS0020OrderDetaiSplitBean();
    dt.insKubun           = Const.InsKubun.Normal;
    dt.propertyNo         = this.paramInit.propertyNo;
    dt.detailKind         = edaBan;
    dt.detailNo           = '4';
    dt.splitNo            = '1';
    dt.orderBranchNo      = this.getOrderBranchValue(edaBan);
    dt.journalCode        = '9300';
    dt.accountCode        = '930';
    dt.journalName        = '労災';
    dt.orderSupplierCode  = '';
    dt.orderSupplierName  = '';
    dt.bulkRequestDate    = '';
    dt.bulkRequester      = '';
    dt.bulkApprovalDate_lv1     = '';
    dt.bulkApprovalPerson_lv1   = '';
    dt.bulkApprovalDate_lv2     = '';
    dt.bulkApprovalPerson_lv2   = '';
    dt.bulkApprovalDate_lv3     = '';
    dt.bulkApprovalPerson_lv3   = '';
    dt.bulkApprovalDate_final   = '';
    dt.bulkApprovalPerson_final = '';
    initData.push(dt);

    return initData;
  }

  /**
   * 明細種類により受注枝番の設定値を返却する
   * @param detailKind 
   */
  private getOrderBranchValue(detailKind: string){
    switch(detailKind){
      case Const.JuuChuuEdaban.Hontai:
        return Const.BranchValue.Hontai;

      case Const.JuuChuuEdaban.Sekkei:
        return Const.BranchValue.Sekkei;

      case Const.JuuChuuEdaban.Kaitai:
        return Const.BranchValue.Kaitai;

      case Const.JuuChuuEdaban.Zouen1:
        return Const.BranchValue.Zouen1;

      case Const.JuuChuuEdaban.Zouen2:
        return Const.BranchValue.Zouen2;
      
    }
  }

  /**
   * 初期表示時 セッションデータ 取得
   * @param dt
   * @param tabName 
   */
  private async getOrderInputDataFromSession(){

    // ロード画面を解除する。
    this.isInitFlg = false;
    this.isLoading = true;

    // セッションからデータを取得する。 
    const savedData: ODIS0020Session = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0002EN));
    this.orderCustomerInfo = savedData.customerInfo;
    this.order0DateInfo    = savedData.dateInfo;
    this.tblMainOrder      = savedData.mainOrderInfo;
    this.tblInsertedOrder  = savedData.insertedOrderInfo;
    this.tblSekkei = savedData.sekkeiData;
    this.tblHouse  = savedData.hontaiData;
    this.tblKaitai = savedData.kaitaiData;
    this.tblTsuika = savedData.tsuikaData;
    this.tblZouen1 = savedData.zouEn1Data;
    this.tblZouen2 = savedData.zouEn2Data;

    this.paramInit = savedData.paramInit;
    this.approvalPermission = savedData.approvalPermission;
    
    // 分割明細画面から渡されたパラメータを取得する
    let returnDt = this.ODIS0020Service.ReturnedSplitData;
    // 分割データ 1件以上の場合、以降の処理を実施
    if (returnDt.length >= 1) {
      //返却されたデータが分割データが全件削除された場合、「発注」「受入」「支払」を再取得する。
      if (returnDt.length == 1 && this.baseCompnt.setValue(returnDt[0].orderSplitAmount) == '') {
        
        const fetchDt = await this.fetchData(returnDt[0]);
        
        if (fetchDt.result === Const.ConnectResult.R0001) {
          const resSuchOAP = fetchDt.applicationData;
          returnDt[0].orderDate      = this.baseCompnt.setValue(resSuchOAP.orderDate);
          returnDt[0].orderAmount    = this.baseCompnt.setValue(resSuchOAP.orderAmount);
          returnDt[0].receivedDate   = this.baseCompnt.setValue(resSuchOAP.receivedDate);
          returnDt[0].receivedAmount = this.baseCompnt.setValue(resSuchOAP.receivedAmount);
          returnDt[0].paymentDate    = this.baseCompnt.setValue(resSuchOAP.paymentDate);
          returnDt[0].paymentAmount  = this.baseCompnt.setValue(resSuchOAP.paymentAmount);
        }
      }

      // タブ設定
      this.selectedTab = this.getTabName(returnDt[0].detailKind);
      switch (returnDt[0].detailKind) {
        case Const.JuuChuuEdaban.Sekkei:
          this.tblSekkei = this.mergeData(savedData.sekkeiData, returnDt);
          break;

        case Const.JuuChuuEdaban.Hontai:
          this.tblHouse = this.mergeData(savedData.hontaiData, returnDt);
          break;

        case Const.JuuChuuEdaban.Kaitai:
          this.tblKaitai = this.mergeData(savedData.kaitaiData, returnDt);
          break;

        case Const.JuuChuuEdaban.Zouen1:
          this.tblZouen1 = this.mergeData(savedData.zouEn1Data, returnDt);
          break;

        case Const.JuuChuuEdaban.Zouen2:
          this.tblZouen2 = this.mergeData(savedData.zouEn2Data, returnDt);
          break;

      }
    }
      //データを保持する
      this.saveTemporaryData();
      //画面ロッカーを解除
      this.isLoading = false;
      this.isInitFlg = true;
      //テーブル再レンダリングさせる。
      this.changeDetectorRef.detectChanges();
      // レンダリングの後、タブ毎の色・背景色を設定する
      this.setFontColorAfterRender();

  }
  /**
   * 発注・受入・支払デーだを取得する
   * @param returnDt 
   */
  private async fetchData(returnDt: ODIS0020OrderDetaiSplitBean): Promise<any>{

    this.paramSuchOAP.propertyNo = this.paramInit.propertyNo;          // 物件管理ＮＯ
    this.paramSuchOAP.accountCode = returnDt.accountCode;              // 経理分類
    this.paramSuchOAP.orderSupplierCode = returnDt.orderSupplierCode;  // 発注先コード

    const response = await this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0002_GetSuchOAP, this.paramSuchOAP)
      .then(
        (response) => {
          return response;
        }
    )
    return response;
  }

  /**
   * タブ名 取得
   */
  private getTabName(detailKind: string): string {
    switch(detailKind){
      case Const.JuuChuuEdaban.Sekkei:
        return Const.TabName.TabName_Sekkei;
      case Const.JuuChuuEdaban.Hontai:
        return Const.TabName.TabName_Hontai;
      case Const.JuuChuuEdaban.Kaitai:
        return Const.TabName.TabName_Kaitai;
      case Const.JuuChuuEdaban.Zouen1:
        return Const.TabName.TabName_Zouen1;
      case Const.JuuChuuEdaban.Zouen2:
        return Const.TabName.TabName_Zouen2;
      case Const.JuuChuuEdaban.Tsuika:
        return Const.TabName.TabName_Tsuika;
    }
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
    this.rowStatus.rowBegin = indx;
    this.rowStatus.dataLength = returnDt.length;

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
    temp.orderBranchNo         = this.baseCompnt.setValue(data.orderBranchNo);    //受注枝番
    temp.journalCode           = this.baseCompnt.setValue(data.journalCode);
    temp.accountCode           = this.baseCompnt.setValue(data.accountCode)
    temp.journalName           = this.baseCompnt.setValue(data.journalName);
    temp.orderSupplierCode     = this.baseCompnt.setValue(data.orderSupplierCode);
    temp.orderSupplierName     = this.baseCompnt.setValue(data.orderSupplierName);
    //発注注文書発行区分が空白場合'0'を設定する
    temp.orderReceipt          = this.baseCompnt.setValue(data.orderReceipt)!=''?this.baseCompnt.setValue(data.orderReceipt):'0';
    temp.bulkRequestDate       = this.baseCompnt.setValue(data.bulkRequestDate);
    temp.bulkRequester         = this.baseCompnt.setValue(data.bulkRequester);
    temp.bulkApprovalDate_lv1     = this.baseCompnt.setValue(data.bulkApprovalDate_lv1);
    temp.bulkApprovalPerson_lv1   = this.baseCompnt.setValue(data.bulkApprovalPerson_lv1);
    temp.bulkApprovalDate_lv2     = this.baseCompnt.setValue(data.bulkApprovalDate_lv2);
    temp.bulkApprovalPerson_lv2   = this.baseCompnt.setValue(data.bulkApprovalPerson_lv2);
    temp.bulkApprovalDate_lv3     = this.baseCompnt.setValue(data.bulkApprovalDate_lv3);
    temp.bulkApprovalPerson_lv3   = this.baseCompnt.setValue(data.bulkApprovalPerson_lv3);
    temp.bulkApprovalDate_final   = this.baseCompnt.setValue(data.bulkApprovalDate_final);
    temp.bulkApprovalPerson_final = this.baseCompnt.setValue(data.bulkApprovalPerson_final);
    temp.orderPlanAmount       = this.baseCompnt.setValue(data.orderPlanAmount);
    temp.orderSplitAmount      = this.baseCompnt.setValue(data.orderSplitAmount);
    temp.splitSupplierCode     = this.baseCompnt.setValue(data.splitSupplierCode);
    temp.splitSupplierName     = this.baseCompnt.setValue(data.splitSupplierName);
    //分割注文書発行区分が空白場合'0'を設定する
    temp.splitOrderReceipt     = this.baseCompnt.setValue(data.splitOrderReceipt)!=''?this.baseCompnt.setValue(data.splitOrderReceipt):'0';
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

    return temp;
  }

  /**
   * レンダリングの後、タブ毎の色・背景色を設定する
   */
  private setFontColorAfterRender(){
    if(this.ODIS0020Service.ReturnedSplitData.length >0 ){
      var body: any
      switch (this.ODIS0020Service.ReturnedSplitData[0].detailKind) {
        case Const.JuuChuuEdaban.Sekkei:
          body = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
          break;

        case Const.JuuChuuEdaban.Hontai:
          body = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
          break;

        case Const.JuuChuuEdaban.Kaitai:
          body = this.childKaitai.viewRef.element.nativeElement.querySelector('tbody');
          break;
  
        case Const.JuuChuuEdaban.Zouen1:
          body = this.childZouEn1.viewRef.element.nativeElement.querySelector('tbody');
          break;

        case Const.JuuChuuEdaban.Zouen2:
          body = this.childZouEn2.viewRef.element.nativeElement.querySelector('tbody');
          break;
      }

      // 文字色設定
      this.setAfterViewFont();
      var i = this.rowStatus.dataLength + this.rowStatus.rowBegin -1;
    
      this.setAutoScroll(body, i);
      this.baseCompnt.setRowColor(Const.Action.A0004,body,i);
    }
  }
   
  //#endregion

  //#region ---------------- ▼▼ 各画面設定 ▼▼ --------------------------------------
  /**
   * 画面初期表示
   */
  private setDefaultDisplay(): void {
    // 初期化
    this.Clear();
    // ボタン制御
    // 「追加工事」タブを選択される場合、追加・変更・削除が不可
    if(this.selectedTab === Const.TabName.TabName_Tsuika){
      this.setPageButtonDisplay(true, true, false, true);
    }
    else{
      this.setPageButtonDisplay(false, true, false, true);
    }
    
  }

  /**
   * 仕訳コードリンクボタンを押下する時、モダールを設定する
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */

  public orderJournalSelect($event, selectVal: any) {
    this.ODIS0020Service.setVal(selectVal);
    this.modal = OrderJournalSelectComponent;
  }

  /**
  * 発注先リンクボタンを押下する時、モダールを設定する
  *
  * @param {*} $event イベント情報
  * @memberof AppComponent
  */

  public orderSupplierSelect($event, selectVal: any) {
    this.ODIS0020Service.setVal(selectVal);
    this.modal = OrderSupplierSelectComponent;
  }

  /**
   * 発注先パターン選択ボタンを押下する時、モダールを設定する
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public supplierPattern($event) {
    this.SupplierPatternService.setPropertyNo(this.paramInit.propertyNo);
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
  //#endregion

  //#region ---------------- ▼▼ 各ボタン 処理 ▼▼ ------------------------------------
  /**
   * 明細追加ボタン
   */
  public insertOrderDetail() {
    // 入力チェック
    if(!this.inputCheck('0')){
      return;
    };
    this.isLoading = true;
    this.paramSuchOAP.propertyNo = this.paramInit.propertyNo;               // 物件管理ＮＯ
    this.paramSuchOAP.accountCode = this.addInput.accountCode;              // 経理分類
    this.paramSuchOAP.orderSupplierCode = this.addInput.orderSupplierCode;  // 発注先コード

    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0002_GetSuchOAP, this.paramSuchOAP)
      .then(
        (response) => {
          if(response.result === Const.ConnectResult.R0001){
            // 結果取得
            this.resSuchOAP = response.applicationData;

            // 追加データ 設定
            let temp = new ODIS0020OrderDetaiSplitBean();
            temp.insKubun           = Const.InsKubun.Ins;
            temp.propertyNo         = this.paramInit.propertyNo;
            temp.detailKind         = this.tabOrderKind;
            temp.splitNo            = '1';
            temp.journalCode        = this.addInput.journalCode;
            temp.accountCode        = this.addInput.accountCode;
            temp.journalName        = this.addInput.journalName;
            temp.orderSupplierCode  = this.addInput.orderSupplierCode;
            temp.orderSupplierName  = this.addInput.orderSupplierName;
            temp.orderPlanAmount    = this.addInput.orderPlanAmount;
            temp.orderBranchNo      = this.currentBranchNo;
            temp.orderReceipt       = this.addInput.orderReceipt;
            temp.bulkRequestDate    = '';
            temp.bulkRequester      = '';
            temp.bulkApprovalDate_lv1     = '';
            temp.bulkApprovalPerson_lv1   = '';
            temp.bulkApprovalDate_lv2     = '';
            temp.bulkApprovalPerson_lv2   = '';
            temp.bulkApprovalDate_lv3     = '';
            temp.bulkApprovalPerson_lv3   = '';
            temp.bulkApprovalDate_final   = '';
            temp.bulkApprovalPerson_final = '';
            temp.orderDate          = this.baseCompnt.setValue(this.resSuchOAP.orderDate);
            temp.orderAmount        = this.baseCompnt.setValue(this.resSuchOAP.orderAmount);
            temp.receivedDate       = this.baseCompnt.setValue(this.resSuchOAP.receivedDate);
            temp.receivedAmount     = this.baseCompnt.setValue(this.resSuchOAP.receivedAmount);
            temp.paymentDate        = this.baseCompnt.setValue(this.resSuchOAP.paymentDate);
            temp.paymentAmount      = this.baseCompnt.setValue(this.resSuchOAP.paymentAmount);

            this.insertToDataTable(temp);

            // 初期化
            this.setDefaultDisplay();
          }
          // ローディング解除
          this.isLoading = false;
        }
      )
  }

  /** テーブルに明細を追加 */
  private insertToDataTable(insertDt: ODIS0020OrderDetaiSplitBean) {
    var insertIndex: number = 0;
    var tblBody: any;
    switch (this.selectedTab) {
      case this.tabName1:
        insertIndex = this.countDefaultData(this.childSekkei.orderData);
        this.childSekkei.orderData.splice(insertIndex, 0, insertDt);
        this.reCountDetailNo(this.childSekkei.orderData);
        tblBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabName2:
        insertIndex = this.countDefaultData(this.childHontai.orderData);
        this.childHontai.orderData.splice(insertIndex, 0, insertDt);
        this.reCountDetailNo(this.childHontai.orderData);
        tblBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabName3:
        insertIndex = this.countDefaultData(this.childKaitai.orderData);
        this.childKaitai.orderData.splice(insertIndex, 0, insertDt);
        this.reCountDetailNo(this.childKaitai.orderData);
        tblBody = this.childKaitai.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabName4:
        insertIndex = this.countDefaultData(this.childZouEn1.orderData);
        this.childZouEn1.orderData.splice(insertIndex, 0, insertDt);
        this.reCountDetailNo(this.childZouEn1.orderData);
        tblBody = this.childZouEn1.viewRef.element.nativeElement.querySelector('tbody');
        break;
      case this.tabName5:
        insertIndex = this.countDefaultData(this.childZouEn2.orderData);
        this.childZouEn2.orderData.splice(insertIndex, 0, insertDt);
        this.reCountDetailNo(this.childZouEn2.orderData);
        tblBody = this.childZouEn2.viewRef.element.nativeElement.querySelector('tbody');
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
      if (this.FIXED_ROW.includes(dt.journalCode)) {
        return dt;
      }
    })
    return data.length - flt.length;
  }

  /**
   * 明細連番 再連番 設定
   * @param data 
   */
  private reCountDetailNo(datas: ODIS0020OrderDetaiSplitBean[]){
    // 初期化
    var cnt: number = 0;
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
      case this.tabName1:
        let dataSekkei = this.childSekkei.orderData;
        this.insertProcess(insertBucket,dataSekkei);
        this.childSekkei.tableShiwake.renderRows();
        break;

      case this.tabName2:
        let dataHontai = this.childHontai.orderData;
        this.insertProcess(insertBucket,dataHontai);
        this.childHontai.tableShiwake.renderRows();
        break;

      case this.tabName3:
        let dataKaitai = this.childKaitai.orderData;
        this.insertProcess(insertBucket,dataKaitai);
        this.childKaitai.tableShiwake.renderRows();
        break;

      case this.tabName4:
        let dataZouen1 = this.childZouEn1.orderData;
        this.insertProcess(insertBucket,dataZouen1);
        this.childZouEn1.tableShiwake.renderRows();
        break;

      case this.tabName5:
        let dataZouen2 = this.childZouEn2.orderData;
        this.insertProcess(insertBucket,dataZouen2);
        this.childZouEn2.tableShiwake.renderRows();
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
          // 一括承認日が空白の場合
          if (this.baseCompnt.setValue(data.bulkApprovalDate_final) === '') {
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
    this.reCountDetailNo(dataTable);
  }

  /**
   * 明細更新ボタン
   */
  public updateOrderDetail() {
    // 入力チェック
    if(!this.inputCheck('1')){
      return;
    };
    this.isLoading = true;
    this.paramSuchOAP.propertyNo = this.paramInit.propertyNo;               // 物件管理ＮＯ
    this.paramSuchOAP.accountCode = this.addInput.accountCode;              // 経理分類
    this.paramSuchOAP.orderSupplierCode = this.addInput.orderSupplierCode;  // 発注先コード

    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0002_GetSuchOAP, this.paramSuchOAP)
      .then(
        (response) => {
          if(response.result === Const.ConnectResult.R0001){
            // 結果取得
            this.resSuchOAP = response.applicationData;

            var detailNo = this.rowStatus.detailNo;

            switch (this.selectedTab) {
              //設計
              case this.tabName1:
                this.childSekkei.orderData = this.setUpdateData(this.childSekkei.orderData, detailNo, this.resSuchOAP);
                break;
              //ハウス
              case this.tabName2:
                this.childHontai.orderData = this.setUpdateData(this.childHontai.orderData, detailNo, this.resSuchOAP);
                break;
              //解体
              case this.tabName3:
                this.childKaitai.orderData = this.setUpdateData(this.childKaitai.orderData, detailNo, this.resSuchOAP);
                break;
              //造園１
              case this.tabName4:
                this.childZouEn1.orderData = this.setUpdateData(this.childZouEn1.orderData, detailNo, this.resSuchOAP);
                break;
              //造園２
              case this.tabName5:
                this.childZouEn2.orderData = this.setUpdateData(this.childZouEn2.orderData, detailNo, this.resSuchOAP);
                break;
            }

            // 文字色設定
            this.setAfterViewFont();

            // 初期化
            this.setDefaultDisplay();
            this.rowStatus.Clear();
          }
          // ローディング解除
          this.isLoading = false;
        }
      )
  }

  private setUpdateData(dt: ODIS0020OrderDetaiSplitBean[], detailNo: String, res: ODIS0020OrderDetaiSplitBean): ODIS0020OrderDetaiSplitBean[]{
    
    // 発注連番に紐づくデータをすべて更新
    for (var i = 0; i < dt.length; i++) {
      if (dt[i].detailNo === detailNo) {

        // 登録区分 通常の場合に更新に変更する。
        if (dt[i].insKubun === Const.InsKubun.Normal) {
          dt[i].insKubun = Const.InsKubun.Upd;
        }
        dt[i].orderBranchNo            = this.addInput.orderBranchNo;
        dt[i].journalCode              = this.addInput.journalCode;
        dt[i].journalName              = this.addInput.journalName;
        dt[i].accountCode              = this.addInput.accountCode;
        dt[i].orderSupplierCode        = this.addInput.orderSupplierCode;
        dt[i].orderSupplierName        = this.addInput.orderSupplierName;
        dt[i].orderReceipt             = this.addInput.orderReceipt;
        dt[i].orderPlanAmount          = this.baseCompnt.removeCommas(this.addInput.orderPlanAmount);
        dt[i].bulkRequestDate          = this.addInput.bulkRequestDate;
        dt[i].bulkRequester            = this.addInput.bulkRequester;
        dt[i].bulkApprovalDate_lv1     = this.addInput.bulkApprovalDate_lv1;
        dt[i].bulkApprovalPerson_lv1   = this.addInput.bulkApprovalPerson_lv1;
        dt[i].bulkApprovalDate_lv2     = this.addInput.bulkApprovalDate_lv2;
        dt[i].bulkApprovalPerson_lv2   = this.addInput.bulkApprovalPerson_lv2;
        dt[i].bulkApprovalDate_lv3     = this.addInput.bulkApprovalDate_lv3;
        dt[i].bulkApprovalPerson_lv3   = this.addInput.bulkApprovalPerson_lv3;
        dt[i].bulkApprovalDate_final   = this.addInput.bulkApprovalDate_final;
        dt[i].bulkApprovalPerson_final = this.addInput.bulkApprovalPerson_final;
        dt[i].orderDate                = res.orderDate;
        dt[i].orderAmount              = res.orderAmount;
        dt[i].receivedDate             = res.receivedDate;
        dt[i].receivedAmount           = res.receivedAmount;
        dt[i].paymentDate              = res.paymentDate;
        dt[i].paymentAmount            = res.paymentAmount;
      }
    }

    return dt;
  }
  
  /**
   * 入力チェック
   * @param val 0:明細追加, 1:明細更新
   */
  private inputCheck(val: string){

    let rowData = this.addInput.tmpDt;
    // 明細更新ボタン押下された場合は以下処理を実施
    if(val === '1'){
     
      //選択された明細は「ハウス材」「運賃」「荷造・保管料」「労災」かどうかをチェックする
      if (this.FIXED_ROW.includes(rowData.journalCode)) {
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
  public stopUpdateOrderDetail() {
    // 初期化
    var tblBody: any;
    var tblData: ODIS0020OrderDetaiSplitBean[] = [new ODIS0020OrderDetaiSplitBean()];
    switch (this.selectedTab) {
      case this.tabName1:
        tblBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        tblData = this.childSekkei.orderData;
        break;
      case this.tabName2:
        tblBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        tblData = this.childHontai.orderData;
        break;
      case this.tabName3:
        tblBody = this.childKaitai.viewRef.element.nativeElement.querySelector('tbody');
        tblData = this.childKaitai.orderData;
        break;
      case this.tabName4:
        tblBody = this.childZouEn1.viewRef.element.nativeElement.querySelector('tbody');
        tblData = this.childZouEn1.orderData;
        break;
      case this.tabName5:
        tblBody = this.childZouEn2.viewRef.element.nativeElement.querySelector('tbody');
        tblData = this.childZouEn2.orderData;
        break;
      case this.tabName6:
        tblBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
        tblData = this.childTsuika.orderData;
        break;
    }

    // 行背景 解除
    this.setRowUnselected(tblBody, tblData);

    // 初期化
    this.rowStatus.Clear();
    this.setDefaultDisplay();
  }

  /**
   * 選択されている明細を解除する 
   * @param body 
   * @param dt 
   */
  private setRowUnselected(body:any, dt: ODIS0020OrderDetaiSplitBean[]){

    var bulkApprovalCell = 0;

    const row = body.rows[0];
    for(var i = 0; i < row.cells.length; i++){
      //最終承認セールまで数える
      
      if(row.childNodes[i].id == "bulkApprovalFinal"){
        bulkApprovalCell = i;
        break;
      }
    }
    //テーブルの背景色を設定する。
    for(var i = 0; i < dt.length; i++){
      //一括承認データが入っている行はグレーアウトする。
      if(this.baseCompnt.setValue(dt[i].bulkApprovalPerson_final) != ''){
        var tr = body.rows[i];
        for (var j = 0; j < tr.cells.length; j++) {
          var td = tr.cells[j];
          // if (j <= this.cellNumber) {
          if (j <= bulkApprovalCell) {
            td.style.backgroundColor = Const.HighLightColour.GrayOut;
          }
          else {
            td.style.backgroundColor = Const.HighLightColour.None;
          }
        }
      }
      //一括承認データが入らない行は白色をする。
      else{
        var tr = body.rows[i];
        for (var j = 0; j < tr.cells.length; j++) {
          var td = tr.cells[j];  
          td.style.backgroundColor = Const.HighLightColour.None;
        }
      }
    }
  }

  /**
   * 明細削除ボタン
   */
  public deleteOrderDetail() {
    // 警告メッセージ
    const confirm = window.confirm(Const.WarningMsg.W0001);
    if (!confirm) { return; };

    const key = this.rowStatus.rowBegin;
    const len = this.rowStatus.dataLength;

    // 明細削除
    switch (this.selectedTab) {
      case this.tabName1:
        this.childSekkei.orderData.splice(key, len);
        this.childSekkei.tableShiwake.renderRows();
        this.reCountDetailNo(this.childSekkei.orderData);
        break;
      case this.tabName2:
        this.childHontai.orderData.splice(key, len);
        this.childHontai.tableShiwake.renderRows();
        this.reCountDetailNo(this.childHontai.orderData);
        break;
      case this.tabName3:
        this.childKaitai.orderData.splice(key, len);
        this.childKaitai.tableShiwake.renderRows();
        this.reCountDetailNo(this.childKaitai.orderData);
        break;
      case this.tabName4:
        this.childZouEn1.orderData.splice(key, len);
        this.childZouEn1.tableShiwake.renderRows();
        this.reCountDetailNo(this.childZouEn1.orderData);
        break;
      case this.tabName5:
        this.childZouEn2.orderData.splice(key, len);
        this.childZouEn2.tableShiwake.renderRows();
        this.reCountDetailNo(this.childZouEn2.orderData);
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
  public setSelectTabChanged(event: any) {

    // タブIndex とタブ value が合わないため、タブ名称を取得
    this.selectedTab = event.tab.textLabel;
    // 初期化
    this.setDefaultDisplay();
    this.rowStatus.Clear();
    this.ODIS0020Service.tabChange.next(this.selectedTab);
  }

  /**
   * 初期化
   */
  private Clear(){

    // 入力パラメータを初期化
    this.addInput.Clear();
    this.paramJournalCode  = new ODIS0020Form();
    this.paramOrderCode    = new ODIS0020Form();
  } 

  /**
   * 子供コンポーネントから渡されたデータを取得する
   * @param dt 
   */
  public getEmitter(dt: DataEmitter) {
    switch(dt.action){
      //明細を選択する
      case Const.Action.A0004:
        // 値設定
        this.rowStatus = dt.getRowStatus();
        this.addInput.setInput(dt.getEmitterData());
        this.setButtonEnabledBySelectedData(dt.getEmitterData());
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
        this.setButtonEnabledBySelectedData();
        break;
    }
  }

  private setButtonEnabledBySelectedData(dt: ODIS0020OrderDetaiSplitBean = null){

    this.setPageButtonDisplay(true, true, false, true);

    if (dt != null) {
      if (this.FIXED_ROW.includes(dt.journalCode)) {
        this.setPageButtonDisplay(true, false, false, true);
      }
      if (this.baseCompnt.setValue(dt.bulkApprovalPerson_final) != ''){
        this.setPageButtonDisplay(true, true, false, true);
      }
      else {
        this.setPageButtonDisplay(true, false, false, false);
      }
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
    this.childZouEn1.tableShiwake.renderRows();   // 造園①
    this.childZouEn2.tableShiwake.renderRows();   // 造園②

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
    // 「造園①」タブ
    this.setColor(this.childZouEn1.orderData,
                  this.childZouEn1.viewRef.element.nativeElement.querySelector('tbody'));
    // 「造園②」タブ
    this.setColor(this.childZouEn2.orderData,
                  this.childZouEn2.viewRef.element.nativeElement.querySelector('tbody'));

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
          this.baseCompnt.setRowColor(Const.Action.A0001,body,i,tmpTbl[i].bulkApprovalPerson_final);
          break;
        case Const.InsKubun.Upd:
          // 更新
          this.baseCompnt.setRowColor(Const.Action.A0002,body,i,tmpTbl[i].bulkApprovalPerson_final);
          break;
      }
    }
  }

  /**
   * 更新終了ボタン
   */
  public finalUpdateProgress(){

    this.isLoading = true;
    //明細追加テーブルにて、入力途中項目があるかどうかを検証する。
    if(!this.addInput.isBlank){
        const confirm = window.confirm(Const.WarningMsg.W0004);
        if(!confirm){
          this.isLoading = false;    
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
    // 入力チェック(「造園①」タブ)
    if(this.updCheck(this.childZouEn1.orderData)){
      this.isLoading = false;
      return 
    }

    // 入力チェック(「造園②」タブ)
    if(this.updCheck(this.childZouEn2.orderData)){
      this.isLoading = false;
      return 
    }

    //サーバに更新データを送る。
    var tmp: ODIS0020OrderDetaiSplitBean[] = [];
    // 受注枝番 マージ
    this.createOrderData(tmp, this.childSekkei.orderData);    // 設計
    this.createOrderData(tmp, this.childHontai.orderData);    // 本体
    this.createOrderData(tmp, this.childKaitai.orderData);    // 解体
    this.createOrderData(tmp, this.childZouEn1.orderData);    // 追加
    this.createOrderData(tmp, this.childZouEn2.orderData);    // 造園１

    // データ更新
    this.paramUpd.propertyNo = this.paramInit.propertyNo;
    this.paramUpd.orderDetailList = tmp;

    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0002_UPDATE, this.paramUpd)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){  
              //セッションを削除する
              sessionStorage.removeItem(Const.ScreenName.S0002EN);

              // 承認処理画面に戻る
              this.router.navigate([Const.UrlSetting.U0001]);
            }
          }
        )
        .finally(
          ()=>{
            //ロード画面を解除する。
            this.isLoading = false;
          }
        )
  }

  /**
   * 更新終了 入力チェック
   * @param val 
   */
  private updCheck(datas: ODIS0020OrderDetaiSplitBean[]):boolean{
    var tmp = datas.filter(dt => {
        if (!this.FIXED_ROW.includes(dt.journalCode)) {
          return dt;
        }
      }
    )
    
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
  private saveTemporaryData(){

    // セッションに保持する
    let saveDt = new ODIS0020Session();
    saveDt.customerInfo      = this.orderCustomerInfo;
    saveDt.dateInfo          = this.order0DateInfo;
    saveDt.mainOrderInfo     = this.tblMainOrder;
    saveDt.insertedOrderInfo = this.tblInsertedOrder;
    saveDt.orderDetailList   = this.orderDetaiSplitlList;
    saveDt.sekkeiData        = this.tblSekkei;
    saveDt.hontaiData        = this.tblHouse;
    saveDt.kaitaiData        = this.tblKaitai;
    saveDt.tsuikaData        = this.tblTsuika;
    saveDt.zouEn1Data        = this.tblZouen1;
    saveDt.zouEn2Data        = this.tblZouen2;
    saveDt.paramInit         = this.paramInit;
    saveDt.approvalPermission = this.approvalPermission;

    // 既にセッションが格納されている場合は除去する
    if (sessionStorage.getItem(Const.ScreenName.S0002EN) != null) {
      sessionStorage.removeItem(Const.ScreenName.S0002EN);
    }
    sessionStorage.setItem(Const.ScreenName.S0002EN, JSON.stringify(saveDt));
  }

  public backToApprovalPage($event){
    
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

  /**
   * ダウンロードする前に、一回登録してから帳票を出力する
   * @param $event 
   */
  public updateDownloadOrderDetailExportFile($event){	  
  
    //登録警告を表示する。
    const confirm = window.confirm(Const.WarningMsg.W0005);
    if(!confirm){
      return;    
    }
    
    // 入力チェック(「設計」タブ)
    if(this.updCheck(this.childSekkei.orderData)){
      return;
    }
    // 入力チェック(「本体」タブ)
    if(this.updCheck(this.childHontai.orderData)){
      return;
    }
    // 入力チェック(「解体」タブ)
    if(this.updCheck(this.childKaitai.orderData)){
      return;
    }
    // 入力チェック(「造園①」タブ)
    if(this.updCheck(this.childZouEn1.orderData)){
      return;
    }
    // 入力チェック(「造園②」タブ)
    if(this.updCheck(this.childZouEn2.orderData)){
      return;
    }

    // ローディング開始
    this.isLoading = true;
    //サーバに更新データを送る。
    var tmp: ODIS0020OrderDetaiSplitBean[] = [];
    // 受注枝番 マージ
    this.createOrderData(tmp, this.childSekkei.orderData);    // 設計
    this.createOrderData(tmp, this.childHontai.orderData);    // 本体
    this.createOrderData(tmp, this.childKaitai.orderData);    // 解体
    this.createOrderData(tmp, this.childZouEn1.orderData);    // 造園１
    this.createOrderData(tmp, this.childZouEn2.orderData);    // 造園２

    this.paramUpd.propertyNo = this.paramInit.propertyNo;     // 物件管理Ｎｏ
    this.paramUpd.contractNum = this.paramInit.contractNum;   // 契約書番号
    this.paramUpd.orderDetailList = tmp;                      // 一覧データ

    this.paramUpd.token = sessionStorage.getItem(Const.General.AccessToken);

    this.orderService.getDownLoad(Const.UrlLinkName.S0002_UpdateAndDownload, this.paramUpd)
    .subscribe((response:HttpResponse<any>) => {
          try{
            //ファイル名を取得する。
            let fileName = response.headers.get('Content-Disposition').replace('attachment; filename=','');
            //デイコード 
            fileName = decodeURI(fileName);            
            //ダウンロードデータを取得する。
            let dataStream: Blob = new Blob([response.body], {type: response.headers.get('Content-Type')});
            //保存する。
            FileSaver.saveAs(dataStream, fileName);
          }
          catch(error){
            //エラーが発生した場合、エラーメッセージを表示する。
            alert(Const.ErrorMsg.E0020);
          }
          finally{
            this.isLoading = false;
          }
     })    

  }
  //#endregion

  //#region  --------------- ▼▼ フォーカス系 処理 ▼▼ --------------------------------
  /**
  * keyUp処理 半角数字のみ(仕訳コード)
  *
  * @param $event イベント
  */
  public toHanNumJC($event){
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
  public toHanNumAC($event){
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
  public toHanNumSC($event){
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
  public toHanPricePA($event){
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
  public commonBlurPA($event){
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
  public commonFocusPA($event){
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
  public toZenkakuJN($event){
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
  public getJournalCode($event){

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

        // 仕訳コード 設定
        this.paramJournalCode.journalCode = strJournalCode;

        // 仕訳コード取得
        this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0002_GetJournalCode,this.paramJournalCode)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){
              this.resJournalCode = response.applicationData;
              this.addInput.journalCode = strJournalCode;   // 仕訳コード
              this.addInput.accountCode = this.resJournalCode.accountCode;   // 経理分類
              this.addInput.journalName = this.resJournalCode.journalName;   // 仕訳名称
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
  public blurAccountCode($event){
    if (!($event.target.value == '')){ 
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
  public getOrderCode($event){
    
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if (val.length > maxLen){
      val = val.substr(0,maxLen);
    }

    // 空白以外の場合に処理を実行
    if (val.trim().length >= 1){
      // 0パディング 設定
      const strOrderCode = this.baseCompnt.getZeroPadding(val.trim(), 3);
      // 前回の仕訳コードと異なる場合に以降の処理を実施
      if(this.paramOrderCode.orderSupplierCode !== strOrderCode){
        // 初期化
        this.paramOrderCode = new ODIS0020Form();
        
        // 仕訳コード 設定
        this.paramOrderCode.orderSupplierCode = strOrderCode;

        // 仕訳コード取得
        this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0002_GetOrderCode, this.paramOrderCode)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){
              this.resOrderCode = response.applicationData;
              this.addInput.orderSupplierCode = strOrderCode;   // 発注先コード
              this.addInput.orderSupplierName = this.resOrderCode.orderSupplierName;   // 発注先名称
            }})
      }
    }
  }

  /**
   * 粗利率画面に遷移します
   * @param $event 
   */
  public moveToOrderGrossProfitPage($event){

    //一時データを保持する
    this.saveTemporaryData();

    var param = { prop: this.paramInit.propertyNo,  // 物件管理Ｎｏ
                  cntr: this.paramInit.contractNum} // 契約番号
    //画面遷移
    this.router.navigate([Const.UrlSetting.U0008],{ queryParams: param,skipLocationChange: false, replaceUrl: false});
  }

  public changeOrderReceiptStt($event){
    var isChecked = $event.currentTarget.checked;

    if(isChecked){
      this.addInput.orderReceipt = Const.OrderReceiptCheckType.Checked;
    }
    else{
      this.addInput.orderReceipt = Const.OrderReceiptCheckType.UnCheck;
    }

  }

  //#endregion
}

