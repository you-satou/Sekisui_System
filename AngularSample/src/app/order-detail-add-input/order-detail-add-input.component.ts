import { Component, OnInit, OnDestroy } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderDetailAddInputService } from './order-detail-add-input.service';
import { OrderDetailAddInputType } from './orderDetailAddInputType'
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService } from '../order-journal-select/order-journal-select.service';
import { Subscription } from 'rxjs';

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

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private modalService: OrderDetailAddInputService,
    private modalService2: OrderJournalSelectService
  ) { }

  ngOnInit() {
    this.subscription = this.modalService.closeEventObservable$.subscribe(
      () => {
        // プロパティ modal に null をセットすることでコンポーネントを破棄する
        // このタイミングで ModalComponent では ngOnDestroy が走る
        
        this.modal = null;
      }
    );
  }

  public onClick($event) {
    this.notifyCloseModal();
  }
  
  private notifyCloseModal() {
    this.modalService.requestCloseModal(this.resVal);
  }

  public onDialog($event){
    this.modal = OrderJournalSelectComponent;

  }

}