import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, OnChanges, HostListener, ViewChild } from '@angular/core';
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
import { OrderSupplierSelectService } from '../../ODIS0040/services/order-supplier-select.service';
import { OrderSupplierSelectComponent } from '../../ODIS0040/component/order-supplier-select.component';

// テーブルの定義
import { ODIS0020OrderDetailList } from '../entities/odis0020-OrderDetailList.entity'
import { ODIS0020InsertedOrderEdaBan } from '../entities/odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from '../entities/odis0020-MainOrderEdaBan.entity'
import { ODIS0020OrderDetailInputInformation } from '../entities/odis0020-OrderInfomation.entity'
import { ODIS0020OrderDetailTotalInfo } from '../entities/odis0020-Form.entity';


@Component({
  selector: 'order-detail-input',
  templateUrl: './order-detail-input.component.html',
  styleUrls: ['./order-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OrderDetailInputComponent implements OnInit, OnDestroy {
  @Input() contracNum: string;

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

  journalCode: String = "";
  accountingCategory: String = "";
  orderJournalName: String = "";
  supplierCode: String = "";
  supplierJournalName: String = "";

  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;

  ngOnInit() {

    this.getOrderInputData();

    this.appComponent.setHeader(Const.ScreenName.S0002, Const.LinKSetting.L0000);

    this.subscription = this.SupplierPatternService.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る

        this.modal = null;
      }
    );
    this.subscription = this.SupplierPatternService.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る

        this.modal = null;
      }
    )

  }

  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    public router: Router,
    private SupplierPatternService: SupplierPatternService,
    private OrderJournalSelectService: OrderSupplierSelectService,
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
        });
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
}
