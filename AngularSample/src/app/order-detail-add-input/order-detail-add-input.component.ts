import { Component, OnInit, OnDestroy, EventEmitter, Input, Output,ElementRef  } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderDetailAddInputService } from './order-detail-add-input.service';
import { OrderDetailAddInputType } from './orderDetailAddInputType'
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService } from '../order-journal-select/order-journal-select.service';
import { OrderJournalSelectType } from '../order-journal-select/orderJournalSelectType';
import { Subscription } from 'rxjs';
import { OrderSupplierSelectComponent } from '../order-supplier-select/order-supplier-select.component';
import { OrderSupplierSelectService } from '../order-supplier-select/order-supplier-select.service';
import { OrderSupplierSelectType } from '../order-supplier-select/orderSupplierSelectType';
import { runInThisContext } from 'vm';
import { testData2, testData3 } from './test-data';
import { CommonComponent } from '../common/common.component';

@Component({
    selector: 'order-detail-add-input',
    templateUrl: './order-detail-add-input.component.html',
    styleUrls: ['../common/common.component.css',
                './order-detail-add-input.component.css']
})

export class OrderDetailAddInputComponent implements OnInit,OnDestroy{

  _element: HTMLElement;

  journalCode:String="";
  accountingCategory:String="";
  journalName:String="";
  supplierName:String="";
  //TODO
  datas: OrderDetailAddInputType[];
  resVal:OrderDetailAddInputType;
  datas2: OrderJournalSelectType[] = testData2; 
  resVal2:OrderJournalSelectType;
  datas3: OrderSupplierSelectType[] = testData3;
  resVal3:OrderSupplierSelectType;
  
  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;
  public modal2: any = null;
  public modal3: any = null;

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   * 
   */

  constructor(
    private modalService: OrderDetailAddInputService,
    private modalService2: OrderJournalSelectService,
    private modalService3: OrderSupplierSelectService,
    private element: ElementRef,
    private router: Router,
    private commonComponent: CommonComponent,
  ) { this._element = this.element.nativeElement }

  ngOnInit() {
    this.subscription = this.modalService.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る
        
        this.modal = null;
        // データ設定
        this.journalCode = this.modalService.getVal().journalCode
      }
    );
    this.subscription = this.modalService2.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る
        this.modal2 = null;
      }
    );

    this.subscription = this.modalService3.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る
        this.modal3 = null;
      }
    );


  }
  
  ngOnDestroy() {
    // モーダルダイアログが閉じたタイミングで出力される
    
  }

  public onClick($event) {
    this.notifyCloseModal();
  }
  
  private notifyCloseModal() {
    this.modalService.requestCloseModal(this.resVal);
  }
   /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick1($event){

    this.modal2 = OrderJournalSelectService;

  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick2($event) {
    this.modal3 = OrderSupplierSelectComponent;
  }

     /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem){
    // TODO
    this.resVal2 = selectedItem;

    this.commonComponent.CommonOnSelHight($event);

  }

  public onSubClick ($event){

    this.notifyCloseModal2();

  }

  private notifyCloseModal2() {
    this.modalService.requestCloseModal2(this.resVal2);
  }

       /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight2($event, selectedItem){
    // TODO
    this.resVal3 = selectedItem;

    this.commonComponent.CommonOnSelHight($event);

  }

  
  public onSubClick2 ($event){

    this.notifyCloseModal3();

  }

  private notifyCloseModal3() {
    this.modalService.requestCloseModal3(this.resVal3);
  }

}

