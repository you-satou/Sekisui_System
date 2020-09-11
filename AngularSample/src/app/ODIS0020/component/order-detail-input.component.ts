import { style } from '@angular/animations';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Const } from '../../common/const'
import { AppComponent } from '../../app.component'
import { Subscription } from 'rxjs';

//サービスの追加
import { CommonService } from '../../common/common.service';
import { SupplierPatternService } from '../../ODIS0050/services/supplier-pattern.service';
import { SupplierPatternComponent } from '../../ODIS0050/component/supplier-pattern.component';
import { OrderJournalSelectService } from '../../ODIS0030/services/order-journal-select.service';
import { OrderJournalSelectComponent } from '../../ODIS0030/component/order-journal-select.component';
import { OrderSupplierSelectComponent } from '../../ODIS0040/component/order-supplier-select.component';
import { OrderSupplierSelectService } from '../../ODIS0040/services/order-supplier-select.service';

// テーブルの定義
import { ODIS0020OrderDetailList } from '../entities/odis0020-OrderDetailList.entity'
import { ODIS0020InsertedOrderEdaBan } from '../entities/odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from '../entities/odis0020-MainOrderEdaBan.entity'
import { ODIS0020OrderDetailInputInformation } from '../entities/odis0020-OrderInfomation.entity'
import { ODIS0020OrderDetailTotalInfo } from '../entities/odis0020-Form.entity';
import { ODIS0020AddOrderDetail } from '../entities/odis0020-AddDetailForm.entity';

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


  selectedTab: string = "設計";

  _element: HTMLElement;

  // レスポンスから取得する
  pageTotalInfo: ODIS0020OrderDetailTotalInfo;

  // 発注データ
  orderInformation: ODIS0020OrderDetailInputInformation[];
  tblMainOrder: ODIS0020MainOrderEdaBan[];
  tblInsertedOrder: ODIS0020InsertedOrderEdaBan[];

  // 明細テーブルにデータを渡す引数
  tblSekki: ODIS0020OrderDetailList[];
  tblHontai: ODIS0020OrderDetailList[];
  tblTsuika: ODIS0020OrderDetailList[];

  // url
  _urlOrderInput: string = "assets/data/odis0020-OrderInputTest.json";

  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;

  // 明細追加専用クラス
  addInput = new ODIS0020AddOrderDetail();
  rowStatus = new TableStatus();

  ngOnInit() {

    this.getOrderInputData();

    this.appComponent.setHeader(Const.ScreenName.S0002, Const.LinKSetting.L0000);

    //ODIS0030発注仕訳マスタ選択
    this.subscription = this.OrderJournalSelectService.closeEventObservable$.subscribe(
      () => {

        this.addInput.journalCode = this.OrderJournalSelectService.getVal().journalCode;
        this.addInput.accountCode = this.OrderJournalSelectService.getVal().accountingCategory;
        this.addInput.journalName = this.OrderJournalSelectService.getVal().orderJournalName;

        this.modal = null;

      }
    );
    //ODIS0040発注先マスタ選択
    this.subscription = this.OrderSupplierSelectService.closeEventObservable$.subscribe(
      () => {

        this.addInput.orderSuplierCode = this.OrderSupplierSelectService.getVal().supplierCode;
        this.addInput.orderSuplierName = this.OrderSupplierSelectService.getVal().supplierJournalName;

        this.modal = null;
      }
    );
    //ODIS0050発注明細入力_発注先パターン選択
    this.subscription = this.SupplierPatternService.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る

        this.modal = null;
      }
    );


  }

  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private router: Router,
    private SupplierPatternService: SupplierPatternService,
    private OrderJournalSelectService: OrderJournalSelectService,
    private OrderSupplierSelectService: OrderSupplierSelectService,

  ) { }

  getOrderInputData() {

    this.orderService.getSingleData(this._urlOrderInput)
      .subscribe(
        data => {
          if (data !== undefined) {
            this.pageTotalInfo = data;
            this.orderInformation = this.pageTotalInfo.ContractInfo;
            this.tblMainOrder = this.pageTotalInfo.MainOrderInfo;
            this.tblInsertedOrder = this.pageTotalInfo.InsertedOrderInfo;
            this.tblSekki = this.pageTotalInfo.SekkeiData;
            this.tblHontai = this.pageTotalInfo.HontaiData;
            this.tblTsuika = this.pageTotalInfo.TsuikaData;

          }
        }
      );
  }

  swichPage(order: string) {

    switch (order) {
      case 'meisai':
        this.router.navigate(['/OrderDetailAddInput']);
        break;

      case 'supplier':
        this.router.navigate(['/SupplierPattern']);
        break;
    }

  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */

  orderJournalSelect($event) {
    this.modal = OrderJournalSelectComponent;
  }

  /**
* クリックイベント
*
* @param {*} $event イベント情報
* @memberof AppComponent
*/

  orderSupplierSelect($event) {
    this.modal = OrderSupplierSelectComponent;
  }


  /**
   * クリックイベント
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
   * 
   */
  setOrderDetail() {
    if(this.addInput.isBlank){
      return;
    }
    let temp: ODIS0020OrderDetailList = {
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

    switch (this.selectedTab) {
      case '設計':
        this.childSekkei.orderData.push(temp);
        this.childSekkei.tableShiwake.renderRows();

        let skIndex = this.childSekkei.orderData.length - 1;
        let skBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0001, skBody, skIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;

      case '本体':
        this.childHontai.orderData.push(temp);
        this.childHontai.tableShiwake.renderRows();

        let hntIndex = this.childHontai.orderData.length - 1;
        let hntBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0001, hntBody, hntIndex);
        this.setAutoScroll();
        this.addInput.Clear();
        break;

      case '追加':
        this.childTsuika.orderData.push(temp);
        this.childTsuika.tableShiwake.renderRows();

        let tskIndex = this.childTsuika.orderData.length - 1;
        let tsuikaBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0001, tsuikaBody, tskIndex);
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
      case '設計':
        this.childSekkei.orderData[i].journalCode = this.addInput.journalCode;
        this.childSekkei.orderData[i].accountCode = this.addInput.accountCode;
        this.childSekkei.orderData[i].journalName = this.addInput.journalName;
        this.childSekkei.orderData[i].orderSuplierCode = this.addInput.orderSuplierCode;
        this.childSekkei.orderData[i].orderSuplierName = this.addInput.orderSuplierName;
        this.childSekkei.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        // this.childSekkei.tableShiwake.renderRows();
        let sekkeiBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, sekkeiBody, i);
        this.addInput.Clear();
        break;
      case '本体':
        this.childHontai.orderData[i].journalCode = this.addInput.journalCode;
        this.childHontai.orderData[i].accountCode = this.addInput.accountCode;
        this.childHontai.orderData[i].journalName = this.addInput.journalName;
        this.childHontai.orderData[i].orderSuplierCode = this.addInput.orderSuplierCode;
        this.childHontai.orderData[i].orderSuplierName = this.addInput.orderSuplierName;
        this.childHontai.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        // this.childHontai.tableShiwake.renderRows();

        let hontaiBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, hontaiBody, i);
        this.addInput.Clear();
        break;
      case '追加':
        this.childTsuika.orderData[i].journalCode = this.addInput.journalCode;
        this.childTsuika.orderData[i].accountCode = this.addInput.accountCode;
        this.childTsuika.orderData[i].journalName = this.addInput.journalName;
        this.childTsuika.orderData[i].orderSuplierCode = this.addInput.orderSuplierCode;
        this.childTsuika.orderData[i].orderSuplierName = this.addInput.orderSuplierName;
        this.childTsuika.orderData[i].orderPlanAmount = this.addInput.orderPlanAmount;

        // this.childTsuika.tableShiwake.renderRows();

        let tsuikaBody = this.childTsuika.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.A0002, tsuikaBody, i);
        this.addInput.Clear();
        break;
    }

  }

  /**
   * 明細追加をクリアする
   */
  clearOrderDetail() {
    switch (this.selectedTab) {
      case '設計':
        let skIndex = this.rowStatus.rowIndex;
        let skBody = this.childSekkei.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.T0003, skBody, skIndex);
        this.addInput.Clear();
        this.rowStatus.Reset();
        break;

      case '本体':
        let hntIndex = this.rowStatus.rowIndex;
        let hntBody = this.childHontai.viewRef.element.nativeElement.querySelector('tbody')
        this.setNewRowHighLight(Const.Action.T0003, hntBody, hntIndex);
        this.addInput.Clear();
        this.rowStatus.Reset();
        break;

      case '追加':
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
        case '設計':
          this.childSekkei.orderData.splice(i, 1);
          this.childSekkei.tableShiwake.renderRows();
          break;
        case '本体':
          this.childHontai.orderData.splice(i, 1);
          this.childHontai.tableShiwake.renderRows();
          break;
        case '追加':
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

    if(!action.match(Const.Action.T0003)){
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
    else{
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


  getColor(action: string): string{

    switch (action) {
      case Const.Action.A0001:
        return Const.HighLightColour.Inserted;
      case Const.Action.A0002:
        return Const.HighLightColour.Modified;
      case Const.Action.T0003:
        return Const.HighLightColour.None;
    }
    
  }

  updateColor(body: any){

  }
  /**
   * タブを変わった時、デフォルト値を変える。
   * @param event 
   */
  setSelectTabChanged(event: any) {
    this.selectedTab = event.tab.textLabel;
    this.addInput.Clear();
  }

  getEmitter(emitterData: DataEmitter) {

    if (!emitterData.action.match(Const.Action.T0001)) {
      this.rowStatus.Reset();
      return;
    }

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


  }

  /**
   * 追加されたや更新した行はフォント色を変える 
   */
  setRowsTextsColor(action: string, body: any) {

    switch (action) {
      case '':

        break;
    }
  }
}

/**
 * 親に渡すデータの定義
 */
export class DataEmitter {

  id: number;
  action: string;
  selected: boolean;
  data: ODIS0020OrderDetailList;

  constructor() { }
}

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