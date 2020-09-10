import { OrderDetailInputGeneral,OrderDetailInput, OrderInfo, OrderDetailShiwake, OrderDetailSplit } from '../entities/odis0020.entity';
import { Component, OnInit,OnDestroy, ViewEncapsulation, Input, OnChanges, HostListener,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { Subscription } from 'rxjs';
import { SupplierPatternService } from '../../ODIS0050/services/supplier-pattern.service';
import { SupplierPatternComponent } from '../../ODIS0050/component/supplier-pattern.component';
import { OrderJournalSelectService } from '../../ODIS0030/services/order-journal-select.service';
import { OrderJournalSelectComponent } from '../../ODIS0030/component/order-journal-select.component';
import { OrderSupplierSelectService } from '../../ODIS0040/services/order-supplier-select.service';
import { OrderSupplierSelectComponent } from '../../ODIS0040/component/order-supplier-select.component';
import { Const } from '../../common/const'
import { AppComponent } from '../../app.component'

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class OrderDetailInputComponent implements OnInit,OnDestroy {

    @Input() contracNum: string;
    
    title = '発注明細入力＿詳細入力';

    _element: HTMLElement;

    orderGeneral: OrderDetailInputGeneral;

    sekkeiData: OrderDetailShiwake[];
    hontaiData: OrderDetailShiwake[];
    tsuikaData: OrderDetailShiwake[];

    bunkatsuData: OrderDetailSplit[];

    orderInputDatas : OrderDetailInput[];

    datas: any[];

    TBL1: OrderInfo[];
    TBL2: OrderInfo[];

    // url
    _urlShiwake: string = "assets/data/dataShiwake.json";
    _urlSplit: string = "assets/data/dataSplit.json";
    _urlOrderInput: string = "assets/data/dataOrderInput.json";
    _urlOrderTBL1: string = "assets/data/dataInputTBL1.json";
    _urlOrderTBL2: string = "assets/data/dataInputTBL2.json";

      // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
    private subscription: Subscription;
  　// ngComponentOutlet にセットするためのプロパティ
    public modal: any = null;

    ngOnInit() {

      this.getOrderInputData();

      this.appComponent.setHeader(Const.ScreenName.S0002,Const.LinKSetting.L0000);

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

    ){ }
    
    getOrderInputData(){

      this.orderService.getSingleData(this._urlOrderInput)
      .subscribe(
        data => {if(data !== undefined){
          this.orderGeneral = data;
          this.orderInputDatas = this.orderGeneral.orderDetail;
          this.TBL1 = this.orderGeneral.orderInfoTable_1;
          this.TBL2 = this.orderGeneral.orderInfoTable_2;
          this.sekkeiData = this.orderGeneral.orderShiwakeTable;
          this.hontaiData = OrderDetailShiwake[0];
          this.tsuikaData = OrderDetailShiwake[0];
          this.bunkatsuData = this.orderGeneral.orderSliptTable;

        }});
    }

    swichPage(order: string){

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

    orderJournalSelect($event){
      this.modal = OrderJournalSelectComponent;
    }

      /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */

    orderSupplierSelect($event){
      this.modal = OrderSupplierSelectComponent;
    }


  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
    supplierPattern($event){
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