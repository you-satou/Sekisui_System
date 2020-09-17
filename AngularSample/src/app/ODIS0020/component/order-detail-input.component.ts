import { ODIS0020OrderSplitSub } from './../entities/odis0020-OrderDetailList.entity';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
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
import { ODIS0020OrderDetailList, ODIS0020OrderShiwake } from '../entities/odis0020-OrderDetailList.entity'
import { ODIS0020InsertedOrderEdaBan } from '../entities/odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from '../entities/odis0020-MainOrderEdaBan.entity'
import { ODIS0020OrderDetailInputInformation } from '../entities/odis0020-OrderInfomation.entity'
import { ODIS0020OrderDetailTotalInfo } from '../entities/odis0020-Form.entity';
import { ODIS0020AddOrderDetail } from '../entities/odis0020-AddDetailForm.entity';
import { Odis0020Service } from '../services/odis0020-service';

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

  //  タッブの名
  tab1: string = '設計';
  tab2: string = '本体';
  tab3: string = '追加';

  // レスポンスから取得する
  pageTotalInfo: ODIS0020OrderDetailTotalInfo;

  // 発注データ
  orderInformation: ODIS0020OrderDetailInputInformation[];
  tblMainOrder: ODIS0020MainOrderEdaBan[];
  tblInsertedOrder: ODIS0020InsertedOrderEdaBan[];

  // 明細テーブルにデータを渡す引数
  tblSekki: ODIS0020OrderShiwake[] = [];
  tblHontai: ODIS0020OrderShiwake[] = [];
  tblTsuika: ODIS0020OrderShiwake[] = [];

  // mocking data url
  // _urlOrderInput: string = "assets/data/odis0020-OrderInputTest.json";
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
    private ODIS0020Service: Odis0020Service,

  ) { }

  ngOnInit() {

    // Mocking data
    this.getOrderInputData();

    this.appComponent.setHeader(Const.ScreenName.S0002, Const.LinKSetting.L0000);

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
          this.addInput.orderSuplierCode = this.OrderSupplierSelectService.getVal().supplierCode;
          this.addInput.orderSuplierName = this.OrderSupplierSelectService.getVal().supplierJournalName;
        }

        this.modal = null;
      }
    );
    //ODIS0050発注明細入力_発注先パターン選択
    this.subscription = this.SupplierPatternService.closeEventObservable$.subscribe(
      () => {

        if (!(this.SupplierPatternService.getVal() == undefined)) {

          let returnValues = this.SupplierPatternService.getVal();
          returnValues.forEach(element => {

            let temp: ODIS0020OrderShiwake = {
              tabIndex: this.selectedTab,
              id: element.journalCode,
              journalCode: element.journalCode,
              accountCode: element.accountingCategory,
              journalName: element.journalName,
              orderSuplierCode: element.supplierCode,
              orderSuplierName: element.supplierName,
              orderPlanAmount: '',
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
              recievedDate: '',
              recievedAmount: '',
              paymentDate: '',
              paymentAmount: '',

            }
            this.insertToDataTable(temp);
          });
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

            this.tblSekki = this.divideData(this.pageTotalInfo.SekkeiData, this.tab1);
            this.tblHontai = this.divideData(this.pageTotalInfo.HontaiData, this.tab2);
            this.tblTsuika = this.divideData(this.pageTotalInfo.TsuikaData, this.tab3);

          }
        }
      );
  }

  /**
   * 重複しているデータを余白にさせる。
   * @param dt 
   */
  divideData(dt: ODIS0020OrderDetailList[], tabName: string): ODIS0020OrderShiwake[] {
    let data: ODIS0020OrderShiwake[] = [];

    dt.forEach(element => {
      // 分割データを取得
      let splitdt: ODIS0020OrderSplitSub[] = element.splitData;

      if (splitdt.length > 0) {

        for (let i = 0; i < splitdt.length; i++) {
          let tmp = new ODIS0020OrderShiwake();
          const sdt = splitdt[i];
          //データをある場合、設定する
          if (i === 0) {
            tmp.tabIndex = tabName;
            tmp.id = element.journalCode;
            tmp.journalCode = element.journalCode;
            tmp.accountCode = element.accountCode;
            tmp.journalName = element.journalName;
            tmp.orderSuplierCode = element.orderSuplierCode;
            tmp.orderSuplierName = element.orderSuplierName;
            tmp.orderPlanAmount = element.orderPlanAmount;
            tmp.comment = sdt.comment;
            tmp.orderSplitAmount = sdt.orderSplitAmount;
            tmp.requestDate = sdt.requestDate;
            tmp.requester = sdt.requester;
            tmp.approvalDate_lv1 = sdt.approvalDate_lv1;
            tmp.approvalPerson_lv1 = sdt.approvalPerson_lv1;
            tmp.approvalDate_lv2 = sdt.approvalDate_lv2;
            tmp.approvalPerson_lv2 = sdt.approvalPerson_lv2;
            tmp.orderDate = sdt.orderDate;
            tmp.orderAmount = sdt.orderAmount;
            tmp.recievedDate = sdt.recievedDate;
            tmp.recievedAmount = sdt.recievedAmount;
            tmp.paymentDate = sdt.paymentDate;
            tmp.paymentAmount = sdt.paymentAmount;

          }
          else {
            //　一番以降仕訳データを余白にする
            tmp.tabIndex = tabName;
            tmp.id = element.journalCode;
            tmp.journalCode = '';
            tmp.accountCode = '';
            tmp.journalName = '';
            tmp.orderSuplierCode = '';
            tmp.orderSuplierName = '';
            tmp.orderPlanAmount = '';
            tmp.comment = sdt.comment;
            tmp.orderSplitAmount = sdt.orderSplitAmount;
            tmp.requestDate = sdt.requestDate;
            tmp.requester = sdt.requester;
            tmp.approvalDate_lv1 = sdt.approvalDate_lv1;
            tmp.approvalPerson_lv1 = sdt.approvalPerson_lv1;
            tmp.approvalDate_lv2 = sdt.approvalDate_lv2;
            tmp.approvalPerson_lv2 = sdt.approvalPerson_lv2;
            tmp.orderDate = sdt.orderDate;
            tmp.orderAmount = sdt.orderAmount;
            tmp.recievedDate = sdt.recievedDate;
            tmp.recievedAmount = sdt.recievedAmount;
            tmp.paymentDate = sdt.paymentDate;
            tmp.paymentAmount = sdt.paymentAmount;

          }

          data.push(tmp);
        }
      }
      else {

        let tmp = new ODIS0020OrderShiwake();
        tmp.tabIndex = tabName;
        tmp.id = element.journalCode;
        tmp.journalCode = element.journalCode;
        tmp.accountCode = element.accountCode;
        tmp.journalName = element.journalName;
        tmp.orderSuplierCode = element.orderSuplierCode;
        tmp.orderSuplierName = element.orderSuplierName;
        tmp.orderPlanAmount = element.orderPlanAmount;
        tmp.comment = '';
        tmp.orderSplitAmount = '';
        tmp.requestDate = '';
        tmp.requester = '';
        tmp.approvalDate_lv1 = '';
        tmp.approvalPerson_lv1 = '';
        tmp.approvalDate_lv2 = '';
        tmp.approvalPerson_lv2 = '';
        tmp.orderDate = '';
        tmp.orderAmount = '';
        tmp.recievedDate = '';
        tmp.recievedAmount = '';
        tmp.paymentDate = '';
        tmp.paymentAmount = '';

        data.push(tmp);
      }

    });

    return data;

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
      orderSuplierCode: this.addInput.orderSuplierCode,
      orderSuplierName: this.addInput.orderSuplierName,
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
      recievedDate: '',
      recievedAmount: '',
      paymentDate: '',
      paymentAmount: '',
    }

    this.insertToDataTable(temp);

  }

  /** テーブルに明細を追加る */
  insertToDataTable(temp: ODIS0020OrderShiwake) {
    var insertIndex: number = 0;

    switch (this.selectedTab) {
      case this.tab1:
        insertIndex = this.childSekkei.orderData.length -3; // 一番下に肯定している３行を除く

        this.childSekkei.orderData.splice(insertIndex,0,temp);
        this.childSekkei.tableShiwake.renderRows();

        let skBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0001, skBody, insertIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;

      case this.tab2:
        insertIndex = this.childHontai.orderData.length -3; // 一番下に肯定している３行を除く

        this.childHontai.orderData.splice(insertIndex,0,temp);
        this.childHontai.tableShiwake.renderRows();

        let hntBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0001, hntBody, insertIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;

      case this.tab3:
        insertIndex = this.childTsuika.orderData.length -3; // 一番下に肯定している３行を除く
        this.childTsuika.orderData.splice(insertIndex,0,temp);
        this.childTsuika.tableShiwake.renderRows();

        let tsuikaBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0001, tsuikaBody, insertIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;
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
      case this.tab1:
        this.childSekkei.orderData[i].journalCode = this.addInput.journalCode;
        this.childSekkei.orderData[i].accountCode = this.addInput.accountCode;
        this.childSekkei.orderData[i].journalName = this.addInput.journalName;
        this.childSekkei.orderData[i].orderSuplierCode = this.addInput.orderSuplierCode;
        this.childSekkei.orderData[i].orderSuplierName = this.addInput.orderSuplierName;
        this.childSekkei.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        let sekkeiBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, sekkeiBody, i);

        this.childSekkei.tableShiwake.renderRows();
        this.addInput.Clear();
        break;
      case this.tab2:
        this.childHontai.orderData[i].journalCode = this.addInput.journalCode;
        this.childHontai.orderData[i].accountCode = this.addInput.accountCode;
        this.childHontai.orderData[i].journalName = this.addInput.journalName;
        this.childHontai.orderData[i].orderSuplierCode = this.addInput.orderSuplierCode;
        this.childHontai.orderData[i].orderSuplierName = this.addInput.orderSuplierName;
        this.childHontai.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        let hontaiBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, hontaiBody, i);

        this.childHontai.tableShiwake.renderRows();
        this.addInput.Clear();
        break;
      case this.tab3:
        this.childTsuika.orderData[i].journalCode = this.addInput.journalCode;
        this.childTsuika.orderData[i].accountCode = this.addInput.accountCode;
        this.childTsuika.orderData[i].journalName = this.addInput.journalName;
        this.childTsuika.orderData[i].orderSuplierCode = this.addInput.orderSuplierCode;
        this.childTsuika.orderData[i].orderSuplierName = this.addInput.orderSuplierName;
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
      case this.tab1:
        let skIndex = this.rowStatus.rowIndex;
        let skBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.T0003, skBody, skIndex);
        this.addInput.Clear();
        this.rowStatus.Reset();
        break;

      case this.tab2:
        let hntIndex = this.rowStatus.rowIndex;
        let hntBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.T0003, hntBody, hntIndex);
        this.addInput.Clear();
        this.rowStatus.Reset();
        break;

      case this.tab3:
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
    // Display request box
    var request = window.confirm('選択している明細を削除してよろしいでしょうか？');
    if (request) {
      let i = this.rowStatus.rowIndex;
      switch (this.selectedTab) {
        case this.tab1:
          this.childSekkei.orderData.splice(i, 1);
          this.childSekkei.tableShiwake.renderRows();
          break;
        case this.tab2:
          this.childHontai.orderData.splice(i, 1);
          this.childHontai.tableShiwake.renderRows();
          break;
        case this.tab3:
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

    if (!emitterData.action.match(Const.Action.T0001)) {
      this.rowStatus.Reset();
      return;
    }

    // 値設定
    this.rowStatus.rowIndex = emitterData.id;
    this.rowStatus.isSelected = emitterData.selected;
    this.addInput.accountCode = emitterData.data.accountCode;
    this.addInput.journalCode = emitterData.data.journalCode;
    this.addInput.journalName = emitterData.data.journalName;
    this.addInput.orderSuplierCode = emitterData.data.orderSuplierCode;
    this.addInput.orderSuplierName = emitterData.data.orderSuplierName;
    this.addInput.orderPlanAmount = emitterData.data.orderPlanAmount;

  }

  /**
   * 追加した明細に自動スクロールする
   */
  setAutoScroll() {

    return true;
  }
}

/**
 * 親に渡すデータの定義
 */
export class DataEmitter {

  id: number;
  action: string;
  selected: boolean;
  // data: ODIS0020OrderDetailList;

  data: ODIS0020OrderShiwake;

  constructor() { }
}

/**
 * 
 */
export class TableStatus {
  rowIndex: number;
  isSelected: boolean = false;

  constructor() {
    this.Reset();
  }

  Reset() {
    this.rowIndex = null;
    this.isSelected = false;
  }
}