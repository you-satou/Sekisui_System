import { Component, OnInit, OnDestroy } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderDetailAddInputService } from './order-detail-add-input.service';
import { OrderDetailAddInputType } from './orderDetailAddInputType'


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
  
  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private modalService: OrderDetailAddInputService
  ) { }

  ngOnInit() {
  }

  public onClick($event) {
    this.notifyCloseModal();
  }
  
  private notifyCloseModal() {
    this.modalService.requestCloseModal(this.resVal);
  }

}