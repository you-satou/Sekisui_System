import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderSupplierSelectService } from '../services/order-supplier-select.service';
import { OrderSupplierSelectType } from '../entities/odis0040.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { Odis0020Service } from '../../ODIS0020/services/odis0020-service';
import { Const } from '../../common/const';

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

  //エラーメッセージ
  errormsg:string ="";

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
    private Odis0020Service: Odis0020Service,
  ) {}
  
  /**
   * 初期処理
   */
  ngOnInit() {

    this.getOrderInputData();
    console.log(this.Odis0020Service.getVal());

  }

  /**
   * 終了時
  */
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

  /**
   * 閉じるボタン
   */
  public onCloseClick() {
    this.modalService.requestCloseModal();
  }

  /**
  * 選択ボタン
  */
  public onChooseClick($event) {
    
    if(this.resVal == undefined ||this.resVal == null){
        this.errormsg = Const.ErrorMsg.E0008;
        $event.stopPropagation();
    }
    else{
      this.modalService.requestChooseVal(this.resVal);
    }
  }

  /**
  * JSONファイルをdatasに格納
  */
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