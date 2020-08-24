import { Component, OnInit, OnDestroy } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderDetailAddInputService } from './order-detail-add-input.service';
import { OrderDetailAddInputType } from './orderDetailAddInputType'
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService } from '../order-journal-select/order-journal-select.service';
import { Subscription } from 'rxjs';
import { OrderSupplierSelectComponent } from '../order-supplier-select/order-supplier-select.component';
import { OrderSupplierSelectService } from '../order-supplier-select/order-supplier-select.service';

@Component({
    selector: 'order-detail-add-input',
    templateUrl: './order-detail-add-input.component.html',
    styleUrls: ['../common/common.component.css',
                './order-detail-add-input.component.css']
})

export class OrderDetailAddInputComponent implements OnInit {

  //TODO
  datas: OrderDetailAddInputType[];
  resVal:OrderDetailAddInputType;
  
  // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
  private subscription: Subscription;
  // ngComponentOutlet にセットするためのプロパティ
  public modal: any = null;
  public modal2: any = null;

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private modalService: OrderDetailAddInputService,
    private modalService2: OrderJournalSelectService,
    private modalService3: OrderSupplierSelectService
  ) { }

  ngOnInit() {
    this.subscription = this.modalService.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る
        
        this.modal = null;
        this.modal2 = null;
      }
    );
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
    changeModal('modal','modal2')

    function changeModal(beforeModal, afterModal) {
      /**#('#'+beforeModal).modal( 'hide' );
      #('#'+afterModal).modal('show');
      */
  }

  }
  public onClick2($event) {
    this.modal2 = OrderSupplierSelectComponent;
  }

}