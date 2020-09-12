import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderSupplierSelectService } from '../services/order-supplier-select.service';
import { OrderSupplierSelectType } from '../entities/odis0040.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';

@Component({
    selector: 'order-Supplier-select',
    templateUrl: './order-Supplier-select.component.html',
    styleUrls: ['../../common/common.component.css',
                './order-supplier-select.component.css']
})

/**
 * 発注先マスタ選択コンポーネント
 */
export class OrderSupplierSelectComponent implements OnInit, OnDestroy  {

  //タイトル
  title = '発注先マスタ選択';

  //画面表示データ
  datas: OrderSupplierSelectType[];
  //戻り値
  resVal:OrderSupplierSelectType;

  // JSONファイル
  _suppierSelect: string = "assets/data/odis0040-SupplierSelect.json";

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private modalService: OrderSupplierSelectService,
    private commonComponent: CommonComponent,
    private orderService: CommonService,
  ) {}
  
  //初期処理
  ngOnInit() {

    this.getOrderInputData();

  }
  
  ngOnDestroy() {}

   /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem){
  
    this.resVal = selectedItem;

    this.commonComponent.CommonOnSelHight($event);

  }

  //閉じるボタン
  public onClick($event) {
    this.notifyCloseModal();

  }

  private notifyCloseModal() {
    this.modalService.requestCloseModal(this.resVal);
  }

  //JSONファイルをdatasに格納
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