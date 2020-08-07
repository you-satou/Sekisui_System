import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderJournalSelectService } from './order-journal-select.service';


@Component({
    selector: 'order-journal-select',
    templateUrl: './order-journal-select.component.html',
    styleUrls: ['../common/common.component.css',
                './order-journal-select.component.css']
  })

  export class OrderJournalSelectComponent implements OnInit, OnDestroy  {
    
  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private modalService: OrderJournalSelectService,
    private wkAllItemTypesService: WkAllItemTypesService,
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef,
    private router: Router
  ) {}

    ngOnInit() {}

    ngOnDestroy() {
      // モーダルダイアログが閉じたタイミングで出力される
      console.log('destroyed');
    }

    public onClick($event) {
      this.notifyCloseModal();
    }

    private notifyCloseModal() {
      this.modalService.requestCloseModal();
    }

  }