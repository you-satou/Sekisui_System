import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderJournalSelectService } from './order-journal-select.service';
import { OrderJournalSelectType } from './orderJournalSelectType'
import { testData } from './test-data'

@Component({
    selector: 'order-journal-select',
    templateUrl: './order-journal-select.component.html',
    styleUrls: ['../common/common.component.css',
                './order-journal-select.component.css']
})

export class OrderJournalSelectComponent implements OnInit, OnDestroy  {

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
    private router: Router
  ) {}
  
  ngOnInit() {}
  
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
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem){
    // TODO
    this.resVal = selectedItem;

    // テーブル 背景色 クリア
    var wTbody = $event.target.parentElement.parentElement;
    for(var i=0; i<wTbody.rows.length; i++){
      // 行 取得
      var wTr = wTbody.rows[i];
      for(var j=0; j<wTr.cells.length; j++){
        // セル クリア
        var wTd = wTr.cells[j];
        wTd.style.backgroundColor = '';
      }
    }

    // 要素取得
    var wTr = $event.target.parentElement;

    // 背景色 変更
    for(var i=0; i<wTr.cells.length; i++){
      var wTd = wTr.cells[i];
      wTd.style.backgroundColor = '#CCFFFF';
    }
  }

}