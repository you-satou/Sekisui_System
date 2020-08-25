import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
// import { IndexItemType } from '../IndexItemType';
import { Router } from '@angular/router';
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService } from '../order-journal-select/order-journal-select.service';
import { SupplierPatternComponent } from '../supplier-pattern/supplier-pattern.component';
import { SupplierPatternService } from '../supplier-pattern/supplier-pattern.service';
import { OrderSupplierSelectComponent } from '../order-supplier-select/order-supplier-select.component';
import { OrderSupplierSelectService } from '../order-supplier-select/order-supplier-select.service';
import { OrderDetailAddInputComponent } from '../order-detail-add-input/order-detail-add-input.component';
import { OrderDetailAddInputService } from '../order-detail-add-input/order-detail-add-input.service';
import { AddOrderDetailComponent } from 'app/add-order-detail/add-order-detail.component';
import { AddSupplierPatternService } from 'app/add-order-detail/add-supplier-pattern.service';

import { Subscription } from 'rxjs';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../common/common.component.css',
              './index.component.css']
})

export class IndexComponent implements OnInit, OnDestroy   {
    
  _element: HTMLElement;
  
  // indexDataList: IndexItemType[]

  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
　// ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;

  pageIndex: number = 0;
  recordMax: number = 0;
  pageMax: number = 0;
  pageSize: number = 50;

  str:String="";
  journalCode:String="";
  accountingCategory:String="";
  journalName:String="";
  supplierName:String="";

  constructor(
      private wkAllItemTypesService: WkAllItemTypesService,
      private changeDetectorRef: ChangeDetectorRef,
      private modalService: OrderJournalSelectService,
      private modalService2: SupplierPatternService,
      private modalService3: OrderSupplierSelectService,
      private modalService4: OrderDetailAddInputService,
      private modalService5: AddSupplierPatternService,
      private element: ElementRef,
      private router: Router
  ) { this._element = this.element.nativeElement }

  ngOnInit() {
      // // データ取得
      // this.wkAllItemTypesService.indexJson()
      // .subscribe(response => {
      //   let datas: IndexItemType[] = response;
      //   this.recordMax = datas.length;
      //   this.pageMax = Math.floor(this.recordMax / this.pageSize);
      //   this.indexDataList = response;
      // });
      this.subscription = this.modalService.closeEventObservable$.subscribe(
        () => {
          // プロパティ modal に null をセットすることでコンポーネントを破棄する
          // このタイミングで ModalComponent では ngOnDestroy が走る
          
          this.modal = null;
          // データ設定
          this.str = this.modalService.getVal().journalName
        }
      );
      this.subscription = this.modalService2.closeEventObservable$.subscribe(
        () => {
          // プロパティ modal に null をセットすることでコンポーネントを破棄する
          // このタイミングで ModalComponent では ngOnDestroy が走る
          this.modal = null;
        }
      );

      this.subscription = this.modalService3.closeEventObservable$.subscribe(
        () => {
          // プロパティ modal に null をセットすることでコンポーネントを破棄する
          // このタイミングで ModalComponent では ngOnDestroy が走る
          this.modal = null;
        }
      );

      this.subscription = this.modalService4.closeEventObservable$.subscribe(
        () => {
          // プロパティ modal に null をセットすることでコンポーネントを破棄する
          // このタイミングで ModalComponent では ngOnDestroy が走る
          this.modal = null;
          this.journalCode = this.modalService.getVal().journalCode
          this.accountingCategory = this.modalService.getVal().accountingCategory
        }
      );

      this.subscription = this.modalService5.closeEventObservable$.subscribe(
        () => {
          // プロパティ modal に null をセットすることでコンポーネントを破棄する
          // このタイミングで ModalComponent では ngOnDestroy が走る
          this.modal = null;
        }
      );
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
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick($event) {
    this.modal = OrderJournalSelectComponent;
  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick2($event) {
    this.modal = SupplierPatternComponent;
  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick3($event) {
    this.modal = OrderSupplierSelectComponent;
  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick4($event) {
    this.modal = OrderDetailAddInputComponent;
  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick5($event) {
    this.modal = AddOrderDetailComponent;
  }
}
