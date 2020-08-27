import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderSupplierSelectService } from './order-supplier-select.service';
import { OrderSupplierSelectType } from './orderSupplierSelectType'
import { testData } from './test_deta'
import { CommonComponent } from '../common/common.component'

@Component({
    selector: 'order-Supplier-select',
    templateUrl: './order-Supplier-select.component.html',
    styleUrls: ['../common/common.component.css',
                './order-supplier-select.component.css']
})

export class OrderSupplierSelectComponent implements OnInit, OnDestroy  {

  title = '発注先マスタ選択';

  // TODO
  datas: OrderSupplierSelectType[] = testData;
  resVal:OrderSupplierSelectType;

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private modalService: OrderSupplierSelectService,
    private wkAllItemTypesService: WkAllItemTypesService,
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef,
    private router: Router,
    private commonComponent: CommonComponent,
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

    this.commonComponent.CommonOnSelHight($event);

  }

}