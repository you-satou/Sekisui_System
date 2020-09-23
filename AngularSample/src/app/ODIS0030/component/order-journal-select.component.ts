import { Component, OnInit} from '@angular/core';
import { OrderJournalSelectService } from '../services/order-journal-select.service';
import { OrderJournalSelectType } from '../entities/odis0030.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { Odis0020Service } from '../../ODIS0020/services/odis0020-service';
import { Const } from '../../common/const';
import { ODIS0030Form } from '../entities/odis0030-Form.entity'

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

  //デフォルトデータ
  dDatas: OrderJournalSelectType[];

  //戻り値
  resVal:OrderJournalSelectType;

  // パラメータ
  param = new ODIS0030Form();

  //エラーメッセージ
  errormsg: string ="";

  //入力された値
  selectVal: string;

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
    // 背景色 設定
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
    
    // Todo　システムログイン情報から取得すること！
    // 事業区分コード設定
    this.param.officeCode = '701000';

    //入力された値
    this.selectVal = this.Odis0020Service.getVal();

    // 発注仕訳マスタ取得
    this.orderService.getSearchRequest(Const.UrlLinkName.S0003_Init,this.param)
      .then(
        (response) => {
         this.datas = response;
         if(!(this.selectVal == undefined || this.selectVal == null)){
          this.onScroll(this.datas,this.selectVal);
         }
        }
     );
  }

  onScroll(datas:OrderJournalSelectType[],selectVal:any){

    var i = 0;

    for(let data of datas){

      var idCode = data.journalCode;
      var tmp = document.getElementsByClassName("tableBody");

      tmp[i].setAttribute("tableBody",idCode);

      i = i +1;
      console.log(idCode);

      if(idCode == selectVal){
        var element = document.getElementById("tableBody");

        element.scrollIntoView();

      }
    }

  }
}
