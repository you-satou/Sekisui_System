import { Component, OnInit } from '@angular/core';
import { OrderJournalSelectService } from '../services/order-journal-select.service';
import { OrderJournalSelectType } from '../entities/odis0030.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';

@Component({
    selector: 'order-journal-select',
    templateUrl: './order-journal-select.component.html',
    styleUrls: ['../../common/common.component.css',
                './order-journal-select.component.css']
})

/**
 * 発注仕訳マスタ選択コンポーネント
 */
export class OrderJournalSelectComponent implements OnInit {

  //タイトル
  title = '発注仕訳マスタ選択';

  //画面表示データ
  datas: OrderJournalSelectType[];
  //戻り値
  resVal:OrderJournalSelectType;

   // JSONファイル
   _journalSelect: string = "assets/data/odis0030-JournalSelect.json";

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private commonComponent: CommonComponent,
    private modalService: OrderJournalSelectService,
    private orderService: CommonService,
  ) {}
  
  //初期処理
  ngOnInit() {

    this.getOrderInputData();
    
  }

  //モーダルを閉じた時
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

    this.orderService.getSingleData(this._journalSelect)
    .subscribe(
      data => {
        if (data !== undefined) {
          this.datas = data;
      }
    });
  }
}

