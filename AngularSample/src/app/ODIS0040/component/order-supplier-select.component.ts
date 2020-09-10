import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../../wk-all-item-types.service';
import { WkAllItemType } from '../../WkAllItemType';
import { Router } from '@angular/router';
import { OrderSupplierSelectService } from '../services/order-supplier-select.service';
import { OrderSupplierSelectType } from '../entities/odis0040.entity'
import { CommonComponent } from '../../common/common.component'
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
import { Location } from '@angular/common';
import { CommonService } from '../../common/common.service';

@Component({
    selector: 'order-Supplier-select',
    templateUrl: './order-Supplier-select.component.html',
    styleUrls: ['../../common/common.component.css',
                './order-supplier-select.component.css']
})

export class OrderSupplierSelectComponent implements OnInit, OnDestroy  {

  title = '発注先マスタ選択';

  // TODO
  datas: OrderSupplierSelectType[];
  resVal:OrderSupplierSelectType;

  // url
  _suppierSelect: string = "assets/data/odis0040-SupplierSelect.json";

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private appComponent: AppComponent,
    private modalService: OrderSupplierSelectService,
    private wkAllItemTypesService: WkAllItemTypesService,
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef,
    private router: Router,
    private commonComponent: CommonComponent,
    private _location: Location,
    private orderService: CommonService,
  ) {}
  
  ngOnInit() {
    this.getOrderInputData();
  }
  
  ngOnDestroy() {
    // モーダルダイアログが閉じたタイミングで出力される
    
  }
   /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   */
  
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

  getOrderInputData(){

    this.orderService.getSingleData(this._suppierSelect)
    .subscribe(
      data => {
        if (data !== undefined) {
          this.datas = data;

      }
    });
  }

}