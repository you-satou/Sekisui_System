import { ODIS0020Session, ODIS0020Form } from './../entities/odis0020-Form.entity';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { ODIS0020OrderDetailList, ODIS0020OrderShiwake, ODIS0020OrderBunkatsuSub } from '../entities/odis0020-OrderDetailList.entity'
import { ODIS0020InsertedOrderEdaBan } from '../entities/odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from '../entities/odis0020-MainOrderEdaBan.entity'
import { ODIS0020OrderDetailInputInformation } from '../entities/odis0020-OrderInformation.entity'
import { ODIS0020OrderDetailTotalInfo } from '../entities/odis0020-Form.entity';
import { ODIS0020AddOrderDetail } from '../entities/odis0020-AddDetailForm.entity';
import { ODIS0020Service } from '../services/odis0020-service';
import { DataEmitter, RowStatus } from '../services/odis0020-DataEmitter.service';
import { CommonComponent } from 'app/common/common.component';
import { ODIS0020JournalCode } from '../entities/odis0020-JournalCode.entity'
import { ODIS0020OrderCode } from '../entities/odis0020-OrderCode.entitiy'

@Component({
  selector: 'order-detail-input',
  templateUrl: './order-detail-input.component.html',
  styleUrls: ['./order-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OrderDetailInputComponent implements OnInit, OnDestroy {

  @ViewChild('tabSekkei', { static: false }) childSekkei: any
  @ViewChild('tabHontai', { static: false }) childHontai: any
  @ViewChild('tabTsuika', { static: false }) childTsuika: any

  // タッブの初期値
  protected selectedTab: string = "設計";

  //  タッブの名前
  private tabNo1: string = '設計';
  private tabNo2: string = '本体';
  private tabNo3: string = '追加';

  get tabValue(){
    switch(this.selectedTab){
      case this.tabNo1:
        return 0;
      case this.tabNo2:
        return 1;
      case this.tabNo3:
        return 2;
    }

  }
  
  loaderText: string = Const.WarningMsg.W0002;
  isLoading: boolean = true;

  // レスポンスから取得する
  private pageTotalInfo = new ODIS0020OrderDetailTotalInfo();

  // 発注データ
  orderInformation: ODIS0020OrderDetailInputInformation[];
  tblMainOrder: ODIS0020MainOrderEdaBan[];
  tblInsertedOrder: ODIS0020InsertedOrderEdaBan[];

  // 明細テーブルにデータを渡す引数 (連動タブを使ったら削除予定)
  tblSekkei : ODIS0020OrderShiwake[] = [];
  tblHontai: ODIS0020OrderShiwake[] = [];
  tblTsuika: ODIS0020OrderShiwake[] = [];

  // mocking data url
  readonly _urlOrderInput2: string = "assets/data/odis0020-OrderInputSplit.json";

  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;

  // 明細追加専用クラス
  addInput = new ODIS0020AddOrderDetail();
  rowStatus = new RowStatus();

  btnInsert: boolean;
  btnUpdate: boolean;
  btnStop: boolean;
  btnDelete: boolean;

  // 仕訳コード パラメータ
  paramJournalCode = new ODIS0020Form();
  // 仕訳コード レスポンス
  resJournalCode: ODIS0020JournalCode;

  // 発注先コード パラメータ
  paramOrderCode = new ODIS0020Form();
  // 発注先コード レスポンス
  resOrderCode : ODIS0020OrderCode;

  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private SupplierPatternService: SupplierPatternService,
    private OrderJournalSelectService: OrderJournalSelectService,
    private OrderSupplierSelectService: OrderSupplierSelectService,
    private ODIS0020Service: ODIS0020Service,
    private router: Router,
    private baseCompnt: CommonComponent,

  ) { }

  ngOnInit() {
    // 各モダール 
    this.getDataFromModals();
    this.appComponent.setHeader(Const.ScreenName.S0002, Const.LinKSetting.L0000);

    if(sessionStorage.getItem(Const.ScreenName.S0002EN)){
      
      this.getOrderInputDataFromSession();
    }
    else{
      this.getOrderInputData();
    }

    this.setDefaultDisplay();
  }
  /**
   * 各モダールの設定
   */
  getDataFromModals(){

    //ODIS0030発注仕訳マスタ選択
    this.subscription = this.OrderJournalSelectService.closeEventObservable$.subscribe(
      () => {

        if (!(this.OrderJournalSelectService.getVal() == undefined)) {
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

        if (!(this.OrderSupplierSelectService.getVal() == undefined)) {
          this.addInput.orderSupplierCode = this.OrderSupplierSelectService.getVal().supplierCode;
          this.addInput.orderSupplierName = this.OrderSupplierSelectService.getVal().supplierJournalName;
        }

        this.modal = null;
      }
    );
    //ODIS0050発注明細入力_発注先パターン選択
    this.subscription = this.SupplierPatternService.closeEventObservable$.subscribe(() => {
      if (!(this.SupplierPatternService.getVal() == undefined)) {
        let returnValues = this.SupplierPatternService.getVal();
        let bucketDt: ODIS0020OrderShiwake[] = [];
        returnValues.forEach(element => {
          let temp = new ODIS0020OrderShiwake();
          temp.tabIndex           = this.selectedTab;
          temp.id                 = element.journalCode;
          temp.journalCode        = element.journalCode;
          temp.accountCode        = element.accountingCategory;
          temp.journalName        = element.journalName;
          temp.orderSupplierCode  = element.supplierCode;
          temp.orderSupplierName  = element.supplierName;
          temp.orderPlanAmount    = '';
          temp.comment            = '';
          temp.orderSplitAmount   = '';
          temp.requestDate        = '';
          temp.requester          = '';
          temp.approvalDate_lv1   = '';
          temp.approvalPerson_lv1 = '';
          temp.approvalDate_lv2   = '';
          temp.approvalPerson_lv2 = '';
          temp.orderDate          = '';
          temp.orderAmount        = '';
          temp.receivedDate       = '';
          temp.receivedAmount     = '';
          temp.paymentDate        = '';
          temp.paymentAmount      = '';

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
    this.orderService.getSingleData(this._urlOrderInput2)
      .subscribe(
        data => {
          if (data !== undefined) {
            this.pageTotalInfo = data;
            this.orderInformation = this.pageTotalInfo.ContractInfo;
            this.tblMainOrder = this.pageTotalInfo.MainOrderInfo;
            this.tblInsertedOrder = this.pageTotalInfo.InsertedOrderInfo;

            this.tblSekkei = this.divideData(this.pageTotalInfo.SekkeiData, this.tabNo1);
            this.tblHontai = this.divideData(this.pageTotalInfo.HontaiData, this.tabNo2);
            this.tblTsuika = this.divideData(this.pageTotalInfo.TsuikaData, this.tabNo3);

            this.saveTemporaryData();
            //ロード画面を解除する。
            this.isLoading = false;
          }
        }
        
      );
  }

  /**
   * セックションからデータを取得
   * @param dt 
   * @param tabName 
   */
  getOrderInputDataFromSession(){

    // セックションからデータを取得する。 
    let savedData = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0002EN));
    this.orderInformation = savedData.ContractInfo;
    this.tblMainOrder = savedData.MainOrderInfo;
    this.tblInsertedOrder = savedData.InsertedOrderInfo;
    
    //分割明細画面から渡されたパラメータを取得する
    let returnDt = this.ODIS0020Service.ReturnedSplitData;
    var body: any;
    var index: number;

    if(returnDt.length <= 0){
      this.tblSekkei = savedData.SekkeiData;
      this.tblHontai = savedData.HontaiData;
      this.tblTsuika = savedData.TsuikaData;
    }
    else{
      this.selectedTab = returnDt[0].tabIndex;
      switch (returnDt[0].tabIndex) {
        case this.tabNo1:
          this.tblSekkei = this.mergeData(savedData.SekkeiData, returnDt, index);
          this.tblHontai = savedData.HontaiData;
          this.tblTsuika = savedData.TsuikaData;
          break;
  
        case this.tabNo2:
          this.tblSekkei = savedData.SekkeiData;
          this.tblHontai = this.mergeData(savedData.HontaiData, returnDt, index);
          this.tblTsuika = savedData.TsuikaData;
          break;
  
        case this.tabNo3:
          this.tblSekkei = savedData.SekkeiData;
          this.tblHontai = savedData.HontaiData;
          this.tblTsuika = this.mergeData(savedData.TsuikaData, returnDt, index);
          break;
      }
    }
   
    this.saveTemporaryData();
    //ロード画面を解除する。
    this.isLoading = false;
  }

  mergeData(savedDt: ODIS0020OrderShiwake[], returnDt: ODIS0020OrderShiwake[], r:number): ODIS0020OrderShiwake[]{
    var returnId = returnDt[0].id;
    var filterDt = savedDt.filter(value =>{
      if(value.id == returnId){
        return value;
      }
    })
    //先頭位置を取得
    let indx = savedDt.indexOf(filterDt[0]);
    this.rowStatus.keyIndex = indx;
    this.rowStatus.detailLength = returnDt.length;
    switch(true){
      case filterDt.length == returnDt.length:
        for (let i = 0 ; i < returnDt.length; i++)  {
          savedDt[i+indx] = this.setDataShiwake(savedDt[i+indx],returnDt[i]);
        };
        return savedDt;

      //分割明細画面で明細を削除した場合：
      case filterDt.length > returnDt.length:
        if(returnDt.length == 1 && returnDt[0].isBlankDetail){
          savedDt.splice(indx,filterDt.length);
        }
        for (let i = 0 ; i < filterDt.length; i++)  {
          if(i < returnDt.length){
            savedDt[i+indx] = this.setDataShiwake(savedDt[i+indx],returnDt[i]);
          }
          else{
            savedDt.splice(i+indx,1);
          }
        };
        return savedDt;

      //分割明細画面で明細を追加した場合：
      case filterDt.length < returnDt.length:
        for (let i = 0 ; i < returnDt.length; i++)  {
          if(i < filterDt.length){
            savedDt[i+indx] = this.setDataShiwake(savedDt[i+indx],returnDt[i]);
          }
          else{
            let ins = new ODIS0020OrderShiwake();
            ins.id                 = this.baseCompnt.setValue(returnDt[i].id);
            ins.tabIndex           = this.baseCompnt.setValue(returnDt[i].tabIndex);
            ins.journalCode        = '';
            ins.accountCode        = '';
            ins.journalName        = '';
            ins.orderSupplierCode  = '';
            ins.orderSupplierName  = '';
            ins.orderPlanAmount    = '';
            ins.comment            = this.baseCompnt.setValue(returnDt[i].comment);
            ins.orderSplitAmount   = this.baseCompnt.setValue(returnDt[i].orderSplitAmount);
            ins.requestDate        = this.baseCompnt.setValue(returnDt[i].requestDate);
            ins.requester          = this.baseCompnt.setValue(returnDt[i].requester);
            ins.approvalDate_lv1   = this.baseCompnt.setValue(returnDt[i].approvalDate_lv1);
            ins.approvalPerson_lv1 = this.baseCompnt.setValue(returnDt[i].approvalPerson_lv1);
            ins.approvalDate_lv2   = this.baseCompnt.setValue(returnDt[i].approvalDate_lv2);
            ins.approvalPerson_lv2 = this.baseCompnt.setValue(returnDt[i].approvalPerson_lv2);
            ins.orderDate          = this.baseCompnt.setValue(returnDt[i].orderDate);
            ins.orderAmount        = this.baseCompnt.setValue(returnDt[i].orderAmount);
            ins.receivedDate       = this.baseCompnt.setValue(returnDt[i].receivedDate);
            ins.receivedAmount     = this.baseCompnt.setValue(returnDt[i].receivedAmount);
            ins.paymentDate        = this.baseCompnt.setValue(returnDt[i].paymentDate);
            ins.paymentAmount      = this.baseCompnt.setValue(returnDt[i].paymentAmount);

            savedDt.splice(i+indx,0,ins);
          }
        };
        return savedDt;
    }
    
  }

  setDataShiwake(savedDt: ODIS0020OrderShiwake, returnDt: ODIS0020OrderShiwake): ODIS0020OrderShiwake{

    savedDt.id                  = this.baseCompnt.setValue(returnDt.id);
    savedDt.tabIndex            = this.baseCompnt.setValue(returnDt.tabIndex);
    savedDt.journalCode         = this.baseCompnt.setValue(returnDt.journalCode);
    savedDt.journalName         = this.baseCompnt.setValue(returnDt.journalName);
    savedDt.orderPlanAmount     = this.baseCompnt.setValue(returnDt.orderPlanAmount);
    savedDt.orderSupplierCode   = this.baseCompnt.setValue(returnDt.orderSupplierCode);
    savedDt.orderSupplierName   = this.baseCompnt.setValue(returnDt.orderSupplierName);
    savedDt.comment             = this.baseCompnt.setValue(returnDt.comment);
    savedDt.orderSplitAmount    = this.baseCompnt.setValue(returnDt.orderSplitAmount);
    savedDt.requestDate         = this.baseCompnt.setValue(returnDt.requestDate);
    savedDt.requester           = this.baseCompnt.setValue(returnDt.requester);
    savedDt.approvalDate_lv1    = this.baseCompnt.setValue(returnDt.approvalDate_lv1);
    savedDt.approvalPerson_lv1  = this.baseCompnt.setValue(returnDt.approvalPerson_lv1);
    savedDt.approvalDate_lv2    = this.baseCompnt.setValue(returnDt.approvalDate_lv2);
    savedDt.approvalPerson_lv2  = this.baseCompnt.setValue(returnDt.approvalPerson_lv2);
    savedDt.orderDate           = this.baseCompnt.setValue(returnDt.orderDate);
    savedDt.orderAmount         = this.baseCompnt.setValue(returnDt.orderAmount);
    savedDt.receivedDate        = this.baseCompnt.setValue(returnDt.receivedDate);
    savedDt.receivedAmount      = this.baseCompnt.setValue(returnDt.receivedAmount);
    savedDt.paymentDate         = this.baseCompnt.setValue(returnDt.paymentDate);
    savedDt.paymentAmount       = this.baseCompnt.setValue(returnDt.paymentAmount);

    return savedDt;
  }

  /**
   * 重複しているデータを余白にさせる。
   * @param dt 
   */
  divideData(dt: ODIS0020OrderDetailList[], tabName: string): ODIS0020OrderShiwake[] {
    let data: ODIS0020OrderShiwake[] = [];
    dt.forEach(element => {
      // 分割データを取得
      let bunkatsuData: ODIS0020OrderBunkatsuSub[] = element.bunkatsuData;
      if (bunkatsuData.length > 0) {
        for (let i = 0; i < bunkatsuData.length; i++) {
          let newDt= new ODIS0020OrderShiwake();
          const splitDt = bunkatsuData[i];
          //データをある場合、設定する
          if (i == 0) {
            newDt = this.setData('SetFirstSplitData', tabName, element, splitDt);
          }
          else{
          //　一番以降仕訳データを余白にする
            newDt = this.setData('SetNextSplitData', tabName, element, splitDt);
          }
          data.push(newDt);
        }
      }
      else {
        let noSplitDt = this.setData('NoSplitData', tabName, element, null);
        data.push(noSplitDt);
        
      }
    });

    return data;
  }

  /**
   * データを分けて、発注明細のデータを返す。
   * @param action 
   * @param tabName タブ名
   * @param orderDt 明細データ
   * @param splitDt 分割データ
   */
  setData(action: string, tabName: string ,orderDt: ODIS0020OrderDetailList, splitDt: ODIS0020OrderBunkatsuSub): ODIS0020OrderShiwake{

    let newDt = new ODIS0020OrderShiwake();

    switch (action) {
      case 'NoSplitData':
        newDt.tabIndex            = tabName;
        newDt.id                  = `${this.baseCompnt.setValue(orderDt.journalCode)}_${this.baseCompnt.setValue(orderDt.accountCode)}_${this.baseCompnt.setValue(orderDt.journalName)}`;
        newDt.journalCode         = this.baseCompnt.setValue(orderDt.journalCode);
        newDt.accountCode         = this.baseCompnt.setValue(orderDt.accountCode);
        newDt.journalName         = this.baseCompnt.setValue(orderDt.journalName);
        newDt.orderSupplierCode   = this.baseCompnt.setValue(orderDt.orderSupplierCode);
        newDt.orderSupplierName   = this.baseCompnt.setValue(orderDt.orderSupplierName);
        newDt.orderPlanAmount     = this.baseCompnt.setValue(orderDt.orderPlanAmount);
        newDt.comment             = '';
        newDt.orderSplitAmount    = '';
        newDt.requestDate         = '';
        newDt.requester           = '';
        newDt.approvalDate_lv1    = '';
        newDt.approvalPerson_lv1  = '';
        newDt.approvalDate_lv2    = '';
        newDt.approvalPerson_lv2  = '';
        newDt.orderDate           = '';
        newDt.orderAmount         = '';
        newDt.receivedDate        = '';
        newDt.receivedAmount      = '';
        newDt.paymentDate         = '';
        newDt.paymentAmount       = '';

        break;

      case 'SetFirstSplitData':
        newDt.tabIndex            = tabName;
        newDt.id                  = `${this.baseCompnt.setValue(orderDt.journalCode)}_${this.baseCompnt.setValue(orderDt.accountCode)}_${this.baseCompnt.setValue(orderDt.journalName)}`;
        newDt.journalCode         = this.baseCompnt.setValue(orderDt.journalCode);
        newDt.accountCode         = this.baseCompnt.setValue(orderDt.accountCode);
        newDt.journalName         = this.baseCompnt.setValue(orderDt.journalName);
        newDt.orderSupplierCode   = this.baseCompnt.setValue(orderDt.orderSupplierCode);
        newDt.orderSupplierName   = this.baseCompnt.setValue(orderDt.orderSupplierName);
        newDt.orderPlanAmount     = this.baseCompnt.setValue(orderDt.orderPlanAmount);
        newDt.comment             = this.baseCompnt.setValue(splitDt.comment);
        newDt.orderSplitAmount    = this.baseCompnt.setValue(splitDt.orderSplitAmount);
        newDt.requestDate         = this.baseCompnt.setValue(splitDt.requestDate);
        newDt.requester           = this.baseCompnt.setValue(splitDt.requester);
        newDt.approvalDate_lv1    = this.baseCompnt.setValue(splitDt.approvalDate_lv1);
        newDt.approvalPerson_lv1  = this.baseCompnt.setValue(splitDt.approvalPerson_lv1);
        newDt.approvalDate_lv2    = this.baseCompnt.setValue(splitDt.approvalDate_lv2);
        newDt.approvalPerson_lv2  = this.baseCompnt.setValue(splitDt.approvalPerson_lv2);
        newDt.orderDate           = this.baseCompnt.setValue(splitDt.orderDate);
        newDt.orderAmount         = this.baseCompnt.setValue(splitDt.orderAmount);
        newDt.receivedDate        = this.baseCompnt.setValue(splitDt.receivedDate);
        newDt.receivedAmount      = this.baseCompnt.setValue(splitDt.receivedAmount);
        newDt.paymentDate         = this.baseCompnt.setValue(splitDt.paymentDate);
        newDt.paymentAmount       = this.baseCompnt.setValue(splitDt.paymentAmount);
        break;

      case 'SetNextSplitData':
        newDt.tabIndex            = tabName;
        newDt.id                  = `${this.baseCompnt.setValue(orderDt.journalCode)}_${this.baseCompnt.setValue(orderDt.accountCode)}_${this.baseCompnt.setValue(orderDt.journalName)}`;
        newDt.journalCode         = '';
        newDt.accountCode         = '';
        newDt.journalName         = '';
        newDt.orderSupplierCode   = '';
        newDt.orderSupplierName   = '';
        newDt.orderPlanAmount     = '';
        newDt.comment             = this.baseCompnt.setValue(splitDt.comment);
        newDt.orderSplitAmount    = this.baseCompnt.setValue(splitDt.orderSplitAmount);
        newDt.requestDate         = this.baseCompnt.setValue(splitDt.requestDate);
        newDt.requester           = this.baseCompnt.setValue(splitDt.requester);
        newDt.approvalDate_lv1    = this.baseCompnt.setValue(splitDt.approvalDate_lv1);
        newDt.approvalPerson_lv1  = this.baseCompnt.setValue(splitDt.approvalPerson_lv1);
        newDt.approvalDate_lv2    = this.baseCompnt.setValue(splitDt.approvalDate_lv2);
        newDt.approvalPerson_lv2  = this.baseCompnt.setValue(splitDt.approvalPerson_lv2);
        newDt.orderDate           = this.baseCompnt.setValue(splitDt.orderDate);
        newDt.orderAmount         = this.baseCompnt.setValue(splitDt.orderAmount);
        newDt.receivedDate        = this.baseCompnt.setValue(splitDt.receivedDate);
        newDt.receivedAmount      = this.baseCompnt.setValue(splitDt.receivedAmount);
        newDt.paymentDate         = this.baseCompnt.setValue(splitDt.paymentDate);
        newDt.paymentAmount       = this.baseCompnt.setValue(splitDt.paymentAmount);

        break;
    }
    return newDt;
  }

  /**
   * 画面初期表示
   */
  setDefaultDisplay(){
    // 初期化
    this.Clear();
    // ボタン制御
    this.setPageButtonDisplay(false, true, false, true);
  }

  ngAfterViewInit(): void {

    if(this.ODIS0020Service.ReturnedSplitData.length >0 ){
      var body: any
      switch (this.ODIS0020Service.ReturnedSplitData[0].tabIndex) {
        case this.tabNo1:
          body = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
          break;
  
        case this.tabNo2:
          body = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
          break;
  
        case this.tabNo3:
          body = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
          break;
      }
      var t = this.rowStatus.detailLength + this.rowStatus.keyIndex -1;
    
      this.setAutoScroll(body, t);
      this.baseCompnt.setRowColor(Const.Action.A0004,body,t);
    }
    
  }

  /**
   * 仕訳コードリンクボタンを押下する時、モダールを設定する
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */

  orderJournalSelect($event, selectVal) {
    this.ODIS0020Service.setVal(selectVal);
    this.modal = OrderJournalSelectComponent;
  }

  /**
  * 発注先リンクボタンを押下する時、モダールを設定する
  *
  * @param {*} $event イベント情報
  * @memberof AppComponent
  */

  orderSupplierSelect($event, selectVal) {
    this.ODIS0020Service.setVal(selectVal);
    this.modal = OrderSupplierSelectComponent;
  }


  /**
   * 発注先パターン選択ボタンを押下する時、モダールを設定する
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  supplierPattern($event) {
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

  /**
   * 明細を追加する。
   */
  insertOrderDetail() {
    if (this.addInput.isBlank) {
      alert(Const.ErrorMsg.E0010);
      this.baseCompnt.setFocus('txtAddJCode');
      return;
    }
    if(this.addInput.journalCode == ''){
      alert(Const.ErrorMsg.E0003);
      this.baseCompnt.setFocus('txtAddJCode');
      return;
    }
    if(this.addInput.accountCode == ''){
      alert(Const.ErrorMsg.E0004);
      this.baseCompnt.setFocus('txtAddAccCode');
      return;
    }
    let temp = new ODIS0020OrderShiwake ()
    temp.tabIndex           = this.selectedTab ;
    temp.id                 = `${this.baseCompnt.setValue(this.addInput.journalCode)}_${this.baseCompnt.setValue(this.addInput.accountCode)}_${this.baseCompnt.setValue(this.addInput.journalName)}`;
    temp.journalCode        = this.addInput.journalCode ;
    temp.accountCode        = this.addInput.accountCode ;
    temp.journalName        = this.addInput.journalName ;
    temp.orderSupplierCode  = this.addInput.orderSupplierCode ;
    temp.orderSupplierName  = this.addInput.orderSupplierName ;
    temp.orderPlanAmount    = this.addInput.orderPlanAmount ;
    temp.comment            = '' ;
    temp.orderSplitAmount   = '' ;
    temp.requestDate        = '' ;
    temp.requester          = '' ;
    temp.approvalDate_lv1   = '' ;
    temp.approvalPerson_lv1 = '' ;
    temp.approvalDate_lv2   = '' ;
    temp.approvalPerson_lv2 = '' ;
    temp.orderDate          = '' ;
    temp.orderAmount        = '' ;
    temp.receivedDate       = '' ;
    temp.receivedAmount     = '' ;
    temp.paymentDate        = '' ;
    temp.paymentAmount      = '' ;

    this.insertToDataTable(temp);

    //初期化
    this.setDefaultDisplay();

  }

  /** テーブルに明細を追加 */
  insertToDataTable(insertDt: ODIS0020OrderShiwake) {
    var insertIndex: number = 0;
    var tblBody;
    switch (this.selectedTab) {
      case this.tabNo1:

        insertIndex = this.countDefaultData(this.childSekkei.orderData);
        this.childSekkei.orderData.splice(insertIndex, 0, insertDt);
        this.childSekkei.tableShiwake.renderRows();
        tblBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabNo2:

        insertIndex = this.countDefaultData(this.childHontai.orderData);
        this.childHontai.orderData.splice(insertIndex, 0, insertDt);
        this.childHontai.tableShiwake.renderRows();
        tblBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabNo3:

        insertIndex = this.countDefaultData(this.childTsuika.orderData);
        this.childTsuika.orderData.splice(insertIndex, 0, insertDt);
        this.childTsuika.tableShiwake.renderRows();
        tblBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
        break;
    }

    this.baseCompnt.setRowColor(Const.Action.A0001, tblBody, insertIndex);
    this.setAutoScroll(tblBody, insertIndex);

    this.setDefaultDisplay();
  }

  /**
   * 一番下に肯定されているデータを除く
   * @param data 
   */
  countDefaultData(data: ODIS0020OrderShiwake[]):number{

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
   * 発注先パータンから返却データを一覧に追加する
   * @param insertBucket 
   */
  insertDataFromSupplier(insertBucket:ODIS0020OrderShiwake[]){
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
        let dataTsuika = this.childTsuika.orderData;
        this.insertProcess(insertBucket,dataTsuika);
        this.childTsuika.tableShiwake.renderRows();
        break;
    }

  }

  /**
   * 発注先パターン 追加/上書き
   */
  insertProcess(insertBucket:ODIS0020OrderShiwake[], dataTable: ODIS0020OrderShiwake[]){
    let insFlg: boolean = false;
    // 発注先パターン
    for (var insBk of insertBucket) {
      insFlg = true;
      // テーブルデータ
      for (var data of dataTable) {
        // 同一仕訳コードが存在する場合
        if (insBk.id === data.id) {
          // 依頼日が空白の場合
          if (data.requestDate.trim() === '') {
            data.orderSupplierCode = insBk.orderSupplierCode    // 発注先コード
            data.orderSupplierName = insBk.orderSupplierName    // 発注先名称
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
  }

  /**
   * 明細テーブルにて、選択された明細を更新する
   */
  updateOrderDetail() {

    if(!this.inputCheck()){
      return;
    };
    var key = this.rowStatus.keyIndex;
    var value = this.rowStatus.rowIndex;
    var body: any;
    switch (this.selectedTab) {
      case this.tabNo1:

        this.childSekkei.orderData = this.addInput.getInput(this.childSekkei.orderData,key,value, Const.Action.A0002);
        body = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        this.baseCompnt.setRowColor(Const.Action.A0006,body,value);
        this.baseCompnt.setUpdateColor(Const.Action.A0002, body, key);
        this.childSekkei.tableShiwake.renderRows();
        break;

      case this.tabNo2:
        this.childHontai.orderData = this.addInput.getInput(this.childHontai.orderData,key,value, Const.Action.A0002);
        body = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        this.baseCompnt.setRowColor(Const.Action.A0006,body,value);
        this.baseCompnt.setUpdateColor(Const.Action.A0002, body,key);
        this.childHontai.tableShiwake.renderRows();
        break;

      case this.tabNo3:
        this.childTsuika.orderData = this.addInput.getInput(this.childTsuika.orderData,key,value, Const.Action.A0002);
        body = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
        this.baseCompnt.setRowColor(Const.Action.A0006,body,value);
        this.baseCompnt.setUpdateColor(Const.Action.A0002, body, key);
        this.childTsuika.tableShiwake.renderRows();
        break;
    }
    this.setDefaultDisplay();
  }

  inputCheck(){
    if (!this.rowStatus.isSelected) {
      alert(Const.ErrorMsg.E0013);
      return false;
    };

    if(this.addInput.isUnchanged){
      alert(Const.ErrorMsg.E0015);
      return false;
    };
    if (this.addInput.isBlank) {
      alert(Const.ErrorMsg.E0010);
      this.baseCompnt.setFocus('txtAddJCode');
      return false;
    }
    if(this.addInput.journalCode == ''){
      alert(Const.ErrorMsg.E0003);
      this.baseCompnt.setFocus('txtAddJCode');
      return false;
    }
    if(this.addInput.accountCode == ''){
      alert(Const.ErrorMsg.E0004);
      this.baseCompnt.setFocus('txtAddAccCode');
      return false;
    }

    return true;
  }

  /**
   * 変更処理を中止する
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
        tblBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
        break;
    }

    // 行　背景 背低
    this.baseCompnt.setRowColor(Const.Action.A0006, tblBody, index);
    // 初期化
    this.rowStatus.Reset();
    this.setDefaultDisplay();
  }

  /**
   * 明細テーブルにて、選択された明細を削除する
   */
  deleteOrderDetail() {
    if (!this.rowStatus.isSelected) {
      alert(Const.ErrorMsg.E0008);
      return;
    };
    var confirm = window.confirm(Const.WarningMsg.W0001);

    if (!confirm) { return; };

    let key = this.rowStatus.keyIndex;
    let len = this.rowStatus.detailLength;

    switch (this.selectedTab) {
      case this.tabNo1:
        this.childSekkei.orderData.splice(key, len);
        this.childSekkei.tableShiwake.renderRows();
        break;
      case this.tabNo2:
        this.childHontai.orderData.splice(key, len);
        this.childHontai.tableShiwake.renderRows();
        break;
      case this.tabNo3:
        this.childTsuika.orderData.splice(key, len);
        this.childTsuika.tableShiwake.renderRows();
        break;
    }

    this.saveTemporaryData();
    // 初期化する
    this.setDefaultDisplay();
    this.rowStatus.Reset();
  }

  //検討中！！！！
  // deleteProcess(dt: ODIS0020OrderShiwake[]){

  //   let rIndex =  this.rowStatus.rowIndex;

  //   // 次の行のデータを設定する。
  //   dt[rIndex + 1].journalCode        = dt[rIndex].journalCode;
  //   dt[rIndex + 1].accountCode        = dt[rIndex].accountCode;
  //   dt[rIndex + 1].journalName        = dt[rIndex].journalName;
  //   dt[rIndex + 1].orderSupplierCode  = dt[rIndex].orderSupplierCode;
  //   dt[rIndex + 1].orderSupplierName  = dt[rIndex].orderSupplierName;
  //   dt[rIndex + 1].orderPlanAmount    = dt[rIndex].orderPlanAmount;

  //   //先頭のデータを削除する。
  //   dt.splice(rIndex, 1);
  // }

  /**
   * タブを変わった時、デフォルト値を変える。
   * @param event 
   */
  setSelectTabChanged(event: any) {
    this.selectedTab = event.tab.textLabel;
    this.setDefaultDisplay();
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
    // this.addInput.shiwakeData       = new ODIS0020OrderShiwake();
    this.paramJournalCode           = new ODIS0020Form();
    this.paramOrderCode             = new ODIS0020Form();
  } 

  /**
   * 子供コンポーネントから渡されたデータを取得する
   * @param emitterData 
   */
  getEmitter(emitterData: DataEmitter) {

    switch(emitterData.action){

      case Const.Action.A0004:
        // 値設定
        this.rowStatus = emitterData.getRowStatus();
        this.addInput.setInput(emitterData.getEmitterData());
        this.journalDataApprovalChecker(this.rowStatus);
        break;

      //分割明細画面に遷移する
      case Const.Action.A0007:
        this.rowStatus.Reset();

        //　一時データを保持する。
        this.saveTemporaryData();
        this.router.navigate([Const.UrlSetting.U0006]);
        
        break;
    }

  }

  /**
   * ボタン制御
   */
  journalDataApprovalChecker(rs: RowStatus){
    switch(true){
      //依頼未・承認未
      case (!rs.iraiSumi && !rs.shouninChuu && !rs.shouninSumi):
        this.setPageButtonDisplay(true, false, false, false);
        break;
      //依頼済・承認未
      case (rs.iraiSumi && !rs.shouninChuu && !rs.shouninSumi):
        this.setPageButtonDisplay(true, false, false, false);
        break;
      //依頼済・承認中
      case (rs.iraiSumi && rs.shouninChuu && !rs.shouninSumi):
        this.setPageButtonDisplay(true, false, false, true);
        break;
      //依頼済・承認済
      case (rs.iraiSumi && rs.shouninChuu && rs.shouninSumi):
        this.setPageButtonDisplay(true, true, false, true);
        break;
    };

  }

  /**
   * 明細ボタン制御
   * @param add 明細追加ボタン
   * @param upd 明細更新ボタン
   * @param cancel 中止ボタン
   * @param del 明細削除ボタン
   */
  setPageButtonDisplay(add:boolean, upd:boolean, cancel:boolean, del:boolean){
    this.btnInsert = add;
    this.btnUpdate = upd;
    this.btnStop = cancel;
    this.btnDelete = del;
  }

  /**
   * focus処理
   *
   * @param $event イベント
   */
  commonFocus($event){
    $event.target.value = this.baseCompnt.removeCommas($event.target.value);
  }

  /**
  * keyUp処理 半角数字のみ
  *
  * @param $event イベント
  */
  toHanNum($event){
    $event.target.value = this.baseCompnt.onlyHanNumber($event.target.value);
  }

  /**
   * blur処理 カンマ処理
   *
   * @param $event イベント
   */
  commonBlur($event){
    if(!($event.target.value == "")){
      $event.target.value = this.baseCompnt.addCommas($event.target.value);
    }
  }

  /**
  * blur処理 半角⇒全角
  *
  * @param $event イベント
  */
  toZenkaku($event){
    $event.target.value = this.baseCompnt.onChangeZenkaku($event.target.value);
  }



  /**
   * 追加した明細に自動スクロールする
   * @param body 
   * @param row
   */
  setAutoScroll(body: any, row: number) {
    body.rows[row].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
  }

  finalUpdateProgress(){


    //サーバに更新データを送る。

    console.log(this.childSekkei.orderData);
    console.log(this.childHontai.orderData);
    console.log(this.childTsuika.orderData);

    //セックションを削除する。
    sessionStorage.removeItem(Const.ScreenName.S0002EN);

    this.router.navigate([Const.UrlSetting.U0001]);

  }

  /**
   * 仕訳コード ロストフォーカス
   * @param event 
   */
  getJournalCode($event){

    // 空白以外の場合に処理を実行
    if($event.target.value.trim().length >= 1){
      // 0パディング 設定
      var strJournalCode = this.baseCompnt.getZeroPadding($event.target.value.trim(), 4);
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
        let actionUrl = Const.UrlLinkName.L0002 + Const.Action.SA_GET_JOURNAL_CODE;
        this.orderService.getSearchRequest(actionUrl,this.paramJournalCode)
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
   * 一時データを保持する
   */
  saveTemporaryData(){

    // セックションに保持する
    let saveDt = new ODIS0020Session();
    saveDt.ContractInfo = this.orderInformation;
    saveDt.MainOrderInfo = this.tblMainOrder;
    saveDt.InsertedOrderInfo = this.tblInsertedOrder;
    saveDt.SekkeiData = this.tblSekkei;
    saveDt.HontaiData = this.tblHontai;
    saveDt.TsuikaData = this.tblTsuika;

    if (sessionStorage.getItem(Const.ScreenName.S0002EN) != null) {
      sessionStorage.removeItem(Const.ScreenName.S0002EN);
    }
    sessionStorage.setItem(Const.ScreenName.S0002EN, JSON.stringify(saveDt));

  }
  /**
   * 経理分類 ロストフォーカス
   * @param event 
   */
  blurAccountCode($event){
    if(!($event.target.value == "")){
      this.addInput.accountCode = this.baseCompnt.getZeroPadding($event.target.value.trim(), 3)
    }
  }

  /**
   * 発注先コード ロストフォーカス
   * @param event 
   */
  getOrderCode($event){
    // 空白以外の場合に処理を実行
    if($event.target.value.trim().length >= 1){
      // 0パディング 設定
      var strOrderCode = this.baseCompnt.getZeroPadding($event.target.value.trim(), 3);
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
        let actionUrl = Const.UrlLinkName.L0002 + Const.Action.SA_GET_ORDER_CODE;
        this.orderService.getSearchRequest(actionUrl,this.paramOrderCode)
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
}
