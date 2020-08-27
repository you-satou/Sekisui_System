import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderJournalSelectService } from './order-journal-select.service';
import { OrderJournalSelectType } from './orderJournalSelectType'
import { testData } from './test-data'
import { CommonComponent } from '../common/common.component'
import { AppModule } from '../app.module'

@Component({
    selector: 'order-journal-select',
    templateUrl: './order-journal-select.component.html',
    styleUrls: ['../common/common.component.css',
                './order-journal-select.component.css']
})

export class OrderJournalSelectComponent implements OnInit {

  title = '発注仕訳マスタ選択';
  // TODO
  datas: OrderJournalSelectType[] = testData;
  resVal:OrderJournalSelectType;

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
    private router: Router,
    private commonComponent: CommonComponent,
  ) {}
  
  ngOnInit() {}

  
  public onClick($event) {
    this.notifyClosePage();
  }
  
  private notifyClosePage() {
    this.modalService.setVal(this.resVal);
    
  }

   /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem){
    // TODO
    this.resVal = selectedItem;

    this.commonComponent.CommonOnSelHight($event);
  }

}