import { Component, OnInit} from '@angular/core';
import { OrderJournalSelectService } from '../services/order-journal-select.service';
import { OrderJournalSelectType } from '../entities/odis0030.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { Odis0020Service } from '../../ODIS0020/services/odis0020-service';
import { Const } from '../../common/const';

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

  //エラーメッセージ
  errormsg:string ="";

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

    this.orderService.getSingleData(this._journalSelect)
    .subscribe(
      data => {
        if (data !== undefined) {
          this.datas = data;
      }
    });
  }
}

