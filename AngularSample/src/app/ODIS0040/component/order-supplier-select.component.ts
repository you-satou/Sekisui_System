import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../../wk-all-item-types.service';
import { WkAllItemType } from '../../WkAllItemType';
import { Router } from '@angular/router';
import { OrderSupplierSelectService } from '../services/order-supplier-select.service';
import { OrderSupplierSelectType } from '../entities/odis0040.entity'
import { testData } from '../test_deta'
import { CommonComponent } from '../../common/common.component'
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
import { Location } from '@angular/common';

@Component({
    selector: 'order-Supplier-select',
    templateUrl: './order-Supplier-select.component.html',
    styleUrls: ['../../common/common.component.css',
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
    private appComponent: AppComponent,
    private modalService: OrderSupplierSelectService,
    private wkAllItemTypesService: WkAllItemTypesService,
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef,
    private router: Router,
    private commonComponent: CommonComponent,
    private _location: Location
  ) {}
  
  ngOnInit() {

    this.appComponent.setHeader(Const.ScreenName.S0005,Const.LinKSetting.L0005);

  }
  
  ngOnDestroy() {
    // モーダルダイアログが閉じたタイミングで出力される
    
  }
   /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   */
  public onBackClick($event) {
    
    this._location.back();

  }
  
  public onClick($event) {
    
    this.modalService.setVal(this.resVal);
    this._location.back();

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