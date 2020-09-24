import { ODIS0020Session } from './../entities/odis0020-Form.entity';
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
import { DataEmitter, TableStatus } from '../entities/odis0020-DataEmitter.entity';

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
  selectedTab: string = "設計";

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

  // レスポンスから取得する
  pageTotalInfo = new ODIS0020OrderDetailTotalInfo();

  // 発注データ
  orderInformation: ODIS0020OrderDetailInputInformation[];
  tblMainOrder: ODIS0020MainOrderEdaBan[];
  tblInsertedOrder: ODIS0020InsertedOrderEdaBan[];

  // 明細テーブルにデータを渡す引数
  tblSekkei : ODIS0020OrderShiwake[] = [];
  tblHontai: ODIS0020OrderShiwake[] = [];
  tblTsuika: ODIS0020OrderShiwake[] = [];

  // mocking data url
  _urlOrderInput2: string = "assets/data/odis0020-OrderInputSplit.json";

  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;

  // 明細追加専用クラス
  addInput = new ODIS0020AddOrderDetail();
  rowStatus = new TableStatus();

  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private SupplierPatternService: SupplierPatternService,
    private OrderJournalSelectService: OrderJournalSelectService,
    private OrderSupplierSelectService: OrderSupplierSelectService,
    private ODIS0020Service: ODIS0020Service,
    private router: Router,

  ) { }

  ngOnInit() {
    // 各モダール 
    this.getDataFromModals();
    this.appComponent.setHeader(Const.ScreenName.S0002, Const.LinKSetting.L0000);

    if(sessionStorage.getItem(Const.ScreenName.S0002EN)){
      
      this.resetOrderInputData();
    }
    else{
      this.getOrderInputData();
    }
    
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
          temp.tabIndex = this.selectedTab;
          temp.id = element.journalCode;
          temp.journalCode = element.journalCode;
          temp.accountCode = element.accountingCategory;
          temp.journalName = element.journalName;
          temp.orderSupplierCode = element.supplierCode;
          temp.orderSupplierName = element.supplierName;
          temp.orderPlanAmount = '';
          temp.comment = '';
          temp.orderSplitAmount = '';
          temp.requestDate = '';
          temp.requester = '';
          temp.approvalDate_lv1 = '';
          temp.approvalPerson_lv1 = '';
          temp.approvalDate_lv2 = '';
          temp.approvalPerson_lv2 = '';
          temp.orderDate = '';
          temp.orderAmount = '';
          temp.receivedDate = '';
          temp.receivedAmount = '';
          temp.paymentDate = '';
          temp.paymentAmount = '';

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

            // セックションに保持する
            let saveDt = new ODIS0020Session();
            saveDt.ContractInfo = this.orderInformation;
            saveDt.MainOrderInfo = this.tblMainOrder;
            saveDt.InsertedOrderInfo = this.tblInsertedOrder;
            saveDt.SekkeiData = this.tblSekkei;
            saveDt.HontaiData = this.tblHontai;
            saveDt.TsuikaData = this.tblTsuika;

            sessionStorage.setItem(Const.ScreenName.S0002EN,JSON.stringify(saveDt));
          }
        }
        
      );
  }

  /**
   * セックションからデータを取得
   * @param dt 
   * @param tabName 
   */
  resetOrderInputData(){

    let savedData = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0002EN));
    this.orderInformation = savedData.ContractInfo;
    this.tblMainOrder = savedData.MainOrderInfo;
    this.tblInsertedOrder = savedData.InsertedOrderInfo;
    
    let returnDt = this.ODIS0020Service.returnedSplitData;
    if(returnDt.length <= 0){
      this.tblSekkei = savedData.SekkeiData;
      this.tblHontai = savedData.HontaiData;
      this.tblTsuika = savedData.TsuikaData;
    }
    else{
      this.selectedTab = returnDt[0].tabIndex;
      switch (returnDt[0].tabIndex) {
        case this.tabNo1:
  
          this.tblSekkei = this.mergeData(savedData.SekkeiData, returnDt);
          this.tblHontai = savedData.HontaiData;
          this.tblTsuika = savedData.TsuikaData;
          break;
  
        case this.tabNo2:
          this.tblSekkei = savedData.SekkeiData;
          this.tblHontai = this.mergeData(savedData.HontaiData, returnDt);
          this.tblTsuika = savedData.TsuikaData;
          break;
  
        case this.tabNo3:
          this.tblSekkei = savedData.SekkeiData;
          this.tblHontai = savedData.HontaiData;
          this.tblTsuika = this.mergeData(savedData.TsuikaData, returnDt);
          break;
      }
    }


    // セックションに保持する
    let saveDt = new ODIS0020Session();
    saveDt.ContractInfo = this.orderInformation;
    saveDt.MainOrderInfo = this.tblMainOrder;
    saveDt.InsertedOrderInfo = this.tblInsertedOrder;
    saveDt.SekkeiData = this.tblSekkei;
    saveDt.HontaiData = this.tblHontai;
    saveDt.TsuikaData = this.tblTsuika;

    sessionStorage.setItem(Const.ScreenName.S0002EN, JSON.stringify(saveDt));
  }

  mergeData(savedDt: ODIS0020OrderShiwake[], returnDt: ODIS0020OrderShiwake[]): ODIS0020OrderShiwake[]{
    var returnId = returnDt[0].id;
    var filterDt = savedDt.filter(value =>{
      return value.id == returnId;
    })
    let indx = savedDt.indexOf(filterDt[0]);
    switch(true){
      case filterDt.length == returnDt.length:
        for (let i = 0 ; i < returnDt.length; i++)  {
          savedDt[i+indx].id = this.setValue(returnDt[i].id);
          savedDt[i+indx].tabIndex = this.setValue(returnDt[i].tabIndex);
          savedDt[i+indx].journalCode = this.setValue(returnDt[i].journalCode);
          savedDt[i+indx].journalName = this.setValue(returnDt[i].journalName);
          savedDt[i+indx].orderPlanAmount = this.setValue(returnDt[i].orderPlanAmount);
          savedDt[i+indx].orderSupplierCode = this.setValue(returnDt[i].orderSupplierCode);
          savedDt[i+indx].orderSupplierName = this.setValue(returnDt[i].orderSupplierName);
          savedDt[i+indx].comment = this.setValue(returnDt[i].comment);
          savedDt[i+indx].orderSplitAmount =  this.setValue(returnDt[i].orderSplitAmount);
          savedDt[i+indx].requestDate =  this.setValue(returnDt[i].requestDate);
          savedDt[i+indx].requester =  this.setValue(returnDt[i].requester);
          savedDt[i+indx].approvalDate_lv1 =  this.setValue(returnDt[i].approvalDate_lv1);
          savedDt[i+indx].approvalPerson_lv1 =  this.setValue(returnDt[i].approvalPerson_lv1);
          savedDt[i+indx].approvalDate_lv2 =  this.setValue(returnDt[i].approvalDate_lv2);
          savedDt[i+indx].approvalPerson_lv2 =  this.setValue(returnDt[i].approvalPerson_lv2);
          savedDt[i+indx].orderDate =  this.setValue(returnDt[i].orderDate);
          savedDt[i+indx].orderAmount =  this.setValue(returnDt[i].orderAmount);
          savedDt[i+indx].receivedDate =  this.setValue(returnDt[i].receivedDate);
          savedDt[i+indx].receivedAmount =  this.setValue(returnDt[i].receivedAmount);
          savedDt[i+indx].paymentDate =  this.setValue(returnDt[i].paymentDate);
          savedDt[i+indx].paymentAmount =  this.setValue(returnDt[i].paymentAmount);
        };
        return savedDt;

      //分割明細画面で明細を削除した場合：
      case filterDt.length > returnDt.length:
        for (let i = 0 ; i < filterDt.length; i++)  {
          if(i < returnDt.length){
            savedDt[i+indx].id = this.setValue(returnDt[i].id);
            savedDt[i+indx].tabIndex = this.setValue(returnDt[i].tabIndex);
            savedDt[i+indx].journalCode = this.setValue(returnDt[i].journalCode);
            savedDt[i+indx].journalName = this.setValue(returnDt[i].journalName);
            savedDt[i+indx].orderPlanAmount = this.setValue(returnDt[i].orderPlanAmount);
            savedDt[i+indx].orderSupplierCode = this.setValue(returnDt[i].orderSupplierCode);
            savedDt[i+indx].orderSupplierName = this.setValue(returnDt[i].orderSupplierName);
            savedDt[i+indx].comment = this.setValue(returnDt[i].comment);
            savedDt[i+indx].orderSplitAmount =  this.setValue(returnDt[i].orderSplitAmount);
            savedDt[i+indx].requestDate =  this.setValue(returnDt[i].requestDate);
            savedDt[i+indx].requester =  this.setValue(returnDt[i].requester);
            savedDt[i+indx].approvalDate_lv1 =  this.setValue(returnDt[i].approvalDate_lv1);
            savedDt[i+indx].approvalPerson_lv1 =  this.setValue(returnDt[i].approvalPerson_lv1);
            savedDt[i+indx].approvalDate_lv2 =  this.setValue(returnDt[i].approvalDate_lv2);
            savedDt[i+indx].approvalPerson_lv2 =  this.setValue(returnDt[i].approvalPerson_lv2);
            savedDt[i+indx].orderDate =  this.setValue(returnDt[i].orderDate);
            savedDt[i+indx].orderAmount =  this.setValue(returnDt[i].orderAmount);
            savedDt[i+indx].receivedDate =  this.setValue(returnDt[i].receivedDate);
            savedDt[i+indx].receivedAmount =  this.setValue(returnDt[i].receivedAmount);
            savedDt[i+indx].paymentDate =  this.setValue(returnDt[i].paymentDate);
            savedDt[i+indx].paymentAmount =  this.setValue(returnDt[i].paymentAmount);

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
            savedDt[i+indx].id = this.setValue(returnDt[i].id);
            savedDt[i+indx].tabIndex = this.setValue(returnDt[i].tabIndex);
            savedDt[i+indx].journalCode = this.setValue(returnDt[i].journalCode);
            savedDt[i+indx].journalName = this.setValue(returnDt[i].journalName);
            savedDt[i+indx].orderPlanAmount = this.setValue(returnDt[i].orderPlanAmount);
            savedDt[i+indx].orderSupplierCode = this.setValue(returnDt[i].orderSupplierCode);
            savedDt[i+indx].orderSupplierName = this.setValue(returnDt[i].orderSupplierName);
            savedDt[i+indx].comment = this.setValue(returnDt[i].comment);
            savedDt[i+indx].orderSplitAmount =  this.setValue(returnDt[i].orderSplitAmount);
            savedDt[i+indx].requestDate =  this.setValue(returnDt[i].requestDate);
            savedDt[i+indx].requester =  this.setValue(returnDt[i].requester);
            savedDt[i+indx].approvalDate_lv1 =  this.setValue(returnDt[i].approvalDate_lv1);
            savedDt[i+indx].approvalPerson_lv1 =  this.setValue(returnDt[i].approvalPerson_lv1);
            savedDt[i+indx].approvalDate_lv2 =  this.setValue(returnDt[i].approvalDate_lv2);
            savedDt[i+indx].approvalPerson_lv2 =  this.setValue(returnDt[i].approvalPerson_lv2);
            savedDt[i+indx].orderDate =  this.setValue(returnDt[i].orderDate);
            savedDt[i+indx].orderAmount =  this.setValue(returnDt[i].orderAmount);
            savedDt[i+indx].receivedDate =  this.setValue(returnDt[i].receivedDate);
            savedDt[i+indx].receivedAmount =  this.setValue(returnDt[i].receivedAmount);
            savedDt[i+indx].paymentDate =  this.setValue(returnDt[i].paymentDate);
            savedDt[i+indx].paymentAmount =  this.setValue(returnDt[i].paymentAmount);

          }
          else{
            let ins = new ODIS0020OrderShiwake();
            ins.id = this.setValue(returnDt[i].id);
            ins.tabIndex =  this.setValue(returnDt[i].tabIndex);
            ins.journalCode = '';
            ins.accountCode = '';
            ins.journalName = '';
            ins.orderSupplierCode = '';
            ins.orderSupplierName = '';
            ins.orderPlanAmount = '';
            ins.comment = this.setValue(returnDt[i].comment);
            ins.orderSplitAmount = this.setValue(returnDt[i].orderSplitAmount);
            ins.requestDate = this.setValue(returnDt[i].requestDate);
            ins.requester = this.setValue(returnDt[i].requester);
            ins.approvalDate_lv1 = this.setValue(returnDt[i].approvalDate_lv1);
            ins.approvalPerson_lv1 = this.setValue(returnDt[i].approvalPerson_lv1);
            ins.approvalDate_lv2 = this.setValue(returnDt[i].approvalDate_lv2);
            ins.approvalPerson_lv2 = this.setValue(returnDt[i].approvalPerson_lv2);
            ins.orderDate = this.setValue(returnDt[i].orderDate);
            ins.orderAmount = this.setValue(returnDt[i].orderAmount);
            ins.receivedDate = this.setValue(returnDt[i].receivedDate);
            ins.receivedAmount = this.setValue(returnDt[i].receivedAmount);
            ins.paymentDate = this.setValue(returnDt[i].paymentDate);
            ins.paymentAmount = this.setValue(returnDt[i].paymentAmount);

            savedDt.splice(i+indx,0,ins);
          }
        };
        return savedDt;
    }
    
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
          if (i === 0) {
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
        let dividedDt = this.setData('NoSplitData', tabName, element, null);
        data.push(dividedDt);
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
        newDt.tabIndex = tabName;
        newDt.id = this.setValue(orderDt.journalCode);
        newDt.journalCode = this.setValue(orderDt.journalCode);
        newDt.accountCode = this.setValue(orderDt.accountCode);
        newDt.journalName = this.setValue(orderDt.journalName);
        newDt.orderSupplierCode = this.setValue(orderDt.orderSupplierCode);
        newDt.orderSupplierName = this.setValue(orderDt.orderSupplierName);
        newDt.orderPlanAmount = this.setValue(orderDt.orderPlanAmount);
        newDt.comment = '';
        newDt.orderSplitAmount = '';
        newDt.requestDate = '';
        newDt.requester = '';
        newDt.approvalDate_lv1 = '';
        newDt.approvalPerson_lv1 = '';
        newDt.approvalDate_lv2 = '';
        newDt.approvalPerson_lv2 = '';
        newDt.orderDate = '';
        newDt.orderAmount = '';
        newDt.receivedDate = '';
        newDt.receivedAmount = '';
        newDt.paymentDate = '';
        newDt.paymentAmount = '';

        break;

      case 'SetFirstSplitData':
        newDt.tabIndex = tabName;
        newDt.id = this.setValue(orderDt.journalCode);
        newDt.journalCode = this.setValue(orderDt.journalCode);
        newDt.accountCode = this.setValue(orderDt.accountCode);
        newDt.journalName = this.setValue(orderDt.journalName);
        newDt.orderSupplierCode = this.setValue(orderDt.orderSupplierCode);
        newDt.orderSupplierName = this.setValue(orderDt.orderSupplierName);
        newDt.orderPlanAmount = this.setValue(orderDt.orderPlanAmount);
        newDt.comment = this.setValue(splitDt.comment);
        newDt.orderSplitAmount = this.setValue(splitDt.orderSplitAmount);
        newDt.requestDate = this.setValue(splitDt.requestDate);
        newDt.requester = this.setValue(splitDt.requester);
        newDt.approvalDate_lv1 = this.setValue(splitDt.approvalDate_lv1);
        newDt.approvalPerson_lv1 = this.setValue(splitDt.approvalPerson_lv1);
        newDt.approvalDate_lv2 = this.setValue(splitDt.approvalDate_lv2);
        newDt.approvalPerson_lv2 = this.setValue(splitDt.approvalPerson_lv2);
        newDt.orderDate = this.setValue(splitDt.orderDate);
        newDt.orderAmount = this.setValue(splitDt.orderAmount);
        newDt.receivedDate = this.setValue(splitDt.receivedDate);
        newDt.receivedAmount = this.setValue(splitDt.receivedAmount);
        newDt.paymentDate = this.setValue(splitDt.paymentDate);
        newDt.paymentAmount = this.setValue(splitDt.paymentAmount);
        break;

      case 'SetNextSplitData':
        newDt.tabIndex = tabName;
        newDt.id = this.setValue(orderDt.journalCode);
        newDt.journalCode = '';
        newDt.accountCode = '';
        newDt.journalName = '';
        newDt.orderSupplierCode = '';
        newDt.orderSupplierName = '';
        newDt.orderPlanAmount = '';
        newDt.comment = this.setValue(splitDt.comment);
        newDt.orderSplitAmount = this.setValue(splitDt.orderSplitAmount);
        newDt.requestDate = this.setValue(splitDt.requestDate);
        newDt.requester = this.setValue(splitDt.requester);
        newDt.approvalDate_lv1 = this.setValue(splitDt.approvalDate_lv1);
        newDt.approvalPerson_lv1 = this.setValue(splitDt.approvalPerson_lv1);
        newDt.approvalDate_lv2 = this.setValue(splitDt.approvalDate_lv2);
        newDt.approvalPerson_lv2 = this.setValue(splitDt.approvalPerson_lv2);
        newDt.orderDate = this.setValue(splitDt.orderDate);
        newDt.orderAmount = this.setValue(splitDt.orderAmount);
        newDt.receivedDate = this.setValue(splitDt.receivedDate);
        newDt.receivedAmount = this.setValue(splitDt.receivedAmount);
        newDt.paymentDate = this.setValue(splitDt.paymentDate);
        newDt.paymentAmount = this.setValue(splitDt.paymentAmount);

        break;
    }
    return newDt;

  }

  /**
   * データがNULL時、
   * 空白で返す
   * @param dt 
   */
  setValue(dt: any){

    if(dt != undefined || dt != null){
      return dt;
    }
    return '';
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
      return;
    }
    let temp: ODIS0020OrderShiwake = {
      tabIndex: this.selectedTab,
      id: this.addInput.journalCode,
      journalCode: this.addInput.journalCode,
      accountCode: this.addInput.accountCode,
      journalName: this.addInput.journalName,
      orderSupplierCode: this.addInput.orderSupplierCode,
      orderSupplierName: this.addInput.orderSupplierName,
      orderPlanAmount: this.addInput.orderPlanAmount,
      comment: '',
      orderSplitAmount: '',
      requestDate: '',
      requester: '',
      approvalDate_lv1: '',
      approvalPerson_lv1: '',
      approvalDate_lv2: '',
      approvalPerson_lv2: '',
      orderDate: '',
      orderAmount: '',
      receivedDate: '',
      receivedAmount: '',
      paymentDate: '',
      paymentAmount: '',
    }

    this.insertToDataTable(temp);

  }

  /** テーブルに明細を追加る */
  insertToDataTable(insertDt: ODIS0020OrderShiwake) {
    var insertIndex: number = 0;
    var cnt: number;

    switch (this.selectedTab) {
      case this.tabNo1:

        insertIndex = this.countDefaultData(this.childSekkei.orderData);
        this.childSekkei.orderData.splice(insertIndex, 0, insertDt);
        this.childSekkei.tableShiwake.renderRows();
        let skBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        this.setNewRowHighLight(Const.Action.A0001, skBody, insertIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;

      case this.tabNo2:

        insertIndex = this.countDefaultData(this.childHontai.orderData);
        this.childHontai.orderData.splice(insertIndex, 0, insertDt);
        this.childHontai.tableShiwake.renderRows();
        let hntBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        this.setNewRowHighLight(Const.Action.A0001, hntBody, insertIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;

      case this.tabNo3:

        insertIndex = this.countDefaultData(this.childTsuika.orderData);
        this.childTsuika.orderData.splice(insertIndex, 0, insertDt);
        this.childTsuika.tableShiwake.renderRows();
        let tsuikaBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody');
        this.setNewRowHighLight(Const.Action.A0001, tsuikaBody, insertIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;
    }
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

  insertDataFromSupplier(insertBucket:ODIS0020OrderShiwake[]){
    switch (this.selectedTab) {
      case this.tabNo1:
        let dataSekkei = this.childSekkei.orderData;

        this.insertProcess(insertBucket,dataSekkei);

        this.childSekkei.tableShiwake.renderRows();
        let skBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabNo2:
        let dataHontai = this.childHontai.orderData;

        this.insertProcess(insertBucket,dataHontai);

        this.childHontai.tableShiwake.renderRows();
        let hntBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody');
        break;

      case this.tabNo3:
        let dataTsuika = this.childTsuika.orderData;

        this.insertProcess(insertBucket,dataTsuika);

        this.childTsuika.tableShiwake.renderRows();
        break;
    }

  }

  insertProcess(insertBucket:ODIS0020OrderShiwake[], dataTable: ODIS0020OrderShiwake[]){

    let temp : ODIS0020OrderShiwake[] = [];
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

    if (!this.rowStatus.isSelected ||
      this.addInput.isBlank) {
      return;
    }

    var i = this.rowStatus.rowIndex;
    switch (this.selectedTab) {
      case this.tabNo1:
        this.childSekkei.orderData[i].journalCode = this.addInput.journalCode;
        this.childSekkei.orderData[i].accountCode = this.addInput.accountCode;
        this.childSekkei.orderData[i].journalName = this.addInput.journalName;
        this.childSekkei.orderData[i].orderSupplierCode = this.addInput.orderSupplierCode;
        this.childSekkei.orderData[i].orderSupplierName = this.addInput.orderSupplierName;
        this.childSekkei.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        let sekkeiBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, sekkeiBody, i);

        this.childSekkei.tableShiwake.renderRows();
        this.addInput.Clear();
        break;
      case this.tabNo2:
        this.childHontai.orderData[i].journalCode = this.addInput.journalCode;
        this.childHontai.orderData[i].accountCode = this.addInput.accountCode;
        this.childHontai.orderData[i].journalName = this.addInput.journalName;
        this.childHontai.orderData[i].orderSupplierCode = this.addInput.orderSupplierCode;
        this.childHontai.orderData[i].orderSupplierName = this.addInput.orderSupplierName;
        this.childHontai.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        let hontaiBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, hontaiBody, i);

        this.childHontai.tableShiwake.renderRows();
        this.addInput.Clear();
        break;
      case this.tabNo3:
        this.childTsuika.orderData[i].journalCode = this.addInput.journalCode;
        this.childTsuika.orderData[i].accountCode = this.addInput.accountCode;
        this.childTsuika.orderData[i].journalName = this.addInput.journalName;
        this.childTsuika.orderData[i].orderSupplierCode = this.addInput.orderSupplierCode;
        this.childTsuika.orderData[i].orderSupplierName = this.addInput.orderSupplierName;
        this.childTsuika.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        let tsuikaBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, tsuikaBody, i);

        this.childTsuika.tableShiwake.renderRows();
        this.addInput.Clear();
        break;
    }

  }

  /**
   * 変更処理を中止する
   */
  clearOrderDetail() {
    switch (this.selectedTab) {
      case this.tabNo1:
        let skIndex = this.rowStatus.rowIndex;
        let skBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.T0003, skBody, skIndex);
        this.addInput.Clear();
        this.rowStatus.Reset();
        break;

      case this.tabNo2:
        let hntIndex = this.rowStatus.rowIndex;
        let hntBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.T0003, hntBody, hntIndex);
        this.addInput.Clear();
        this.rowStatus.Reset();
        break;

      case this.tabNo3:
        let tskIndex = this.rowStatus.rowIndex;
        let tsuikaBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.T0003, tsuikaBody, tskIndex);
        this.addInput.Clear();
        this.rowStatus.Reset();
        break;
    }
  }

  /**
   * 明細テーブルにて、選択された明細を削除する
   */
  deleteOrderDetail() {

    if (!this.rowStatus.isSelected) {
      return;
    }
    // Display confirm box
    var request = window.confirm('選択している明細を削除してよろしいでしょうか？');
    if (request) {
      let i = this.rowStatus.rowIndex;
      switch (this.selectedTab) {
        case this.tabNo1:
          this.childSekkei.orderData.splice(i, 1);
          this.childSekkei.tableShiwake.renderRows();
          break;
        case this.tabNo2:
          this.childHontai.orderData.splice(i, 1);
          this.childHontai.tableShiwake.renderRows();
          break;
        case this.tabNo3:
          this.childTsuika.orderData.splice(i, 1);
          this.childTsuika.tableShiwake.renderRows();
          break;
      }
      this.rowStatus.Reset()
    }

  }

  /**
 * 行の背景色 変更する
 * @param body 
 * @param newIndex 
 */
  setNewRowHighLight(action: string, body: any, newIndex: number) {

    if (!action.match(Const.Action.T0003)) {
      for (var rIndex = 0; rIndex < body.rows.length; rIndex++) {
        if (rIndex == newIndex) {
          var tr = body.rows[rIndex];
          for (var cIndex = 0; cIndex < tr.cells.length; cIndex++) {
            var td = tr.cells[cIndex];
            td.style.color = this.getColor(action);
          }
        }
      }
    }
    else {
      for (var rIndex = 0; rIndex < body.rows.length; rIndex++) {
        if (rIndex == newIndex) {
          var tr = body.rows[rIndex];
          for (var cIndex = 0; cIndex < tr.cells.length; cIndex++) {
            var td = tr.cells[cIndex];
            td.style.backgroundColor = this.getColor(action);
          }
        }
      }
    }
    this.rowStatus.Reset();
  }

  getColor(action: string): string {

    switch (action) {
      case Const.Action.A0001:
        return Const.HighLightColour.Inserted;
      case Const.Action.A0002:
        return Const.HighLightColour.Modified;
      case Const.Action.T0003:
        return Const.HighLightColour.None;
    }

  }
  /**
   * タブを変わった時、デフォルト値を変える。
   * @param event 
   */
  setSelectTabChanged(event: any) {
    this.selectedTab = event.tab.textLabel;
    this.addInput.Clear();
  }

  /**
   * 子供コンポーネントから渡されたデータを取得する
   * @param emitterData 
   */
  getEmitter(emitterData: DataEmitter) {

    // if (!emitterData.action.match(Const.Action.T0001)) {
    //   this.rowStatus.Reset();
    //   return;
    // }

    switch(emitterData.action){

      case Const.Action.T0001:
        // 値設定
        this.rowStatus.rowIndex = emitterData.id;
        this.rowStatus.isSelected = emitterData.selected;
        this.addInput.accountCode = emitterData.data.accountCode;
        this.addInput.journalCode = emitterData.data.journalCode;
        this.addInput.journalName = emitterData.data.journalName;
        this.addInput.orderSupplierCode = emitterData.data.orderSupplierCode;
        this.addInput.orderSupplierName = emitterData.data.orderSupplierName;
        this.addInput.orderPlanAmount = emitterData.data.orderPlanAmount;
        break;

      case Const.Action.P001:
        this.rowStatus.Reset();

        let pageData = new ODIS0020Session();
     
        pageData.ContractInfo = this.orderInformation;
        pageData.MainOrderInfo = this.tblMainOrder;
        pageData.InsertedOrderInfo = this.tblInsertedOrder;
        pageData.SekkeiData = this.childSekkei.orderData;
        pageData.HontaiData = this.childHontai.orderData;
        pageData.TsuikaData = this.childTsuika.orderData;

        if(sessionStorage.getItem(Const.ScreenName.S0002EN) != null){
          sessionStorage.removeItem(Const.ScreenName.S0002EN);
        }
        sessionStorage.setItem(Const.ScreenName.S0002EN, JSON.stringify(pageData));

        this.router.navigate([Const.UrlSetting.U0006]);
        
        break;
    }

  }

  /**
   * 追加した明細に自動スクロールする
   */
  setAutoScroll() {

    return true;
  }

}
