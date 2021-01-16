import { Component, OnInit, AfterViewInit, QueryList, ViewContainerRef, ViewChildren} from '@angular/core';
import { OrderJournalSelectService } from '../services/order-journal-select.service';
import { OrderJournalSelectType } from '../entities/odis0030.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { ODIS0020Service } from '../../ODIS0020/services/odis0020-service';
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
export class OrderJournalSelectComponent implements OnInit, AfterViewInit{

  //タイトル
  title = '発注仕訳マスタ選択';

  //画面表示データ
  datas: OrderJournalSelectType[];

  //戻り値
  resVal: OrderJournalSelectType;

  //エラーメッセージ
  errorMsg: string ="";

  //入力された値
  selectVal: string;

  //フォーカス対象列
  selectRow: number;

  // ローディング 判定
  isLoading: boolean = true;

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private view: ViewContainerRef,
    private commonComponent: CommonComponent,
    private modalService: OrderJournalSelectService,
    private orderService: CommonService,
    private ODIS0020Service: ODIS0020Service,
  ) {}
  
 /**
  * 初期処理
  */
  ngOnInit() {

    this.getOrderInputData();
  }

 /**
  * レンダリング後（自動スクロール）
  */
 @ViewChildren('initScroll')
 initScroll: QueryList<any>;
 ngAfterViewInit(){
   this.initScroll.changes.subscribe(t => {
     var wTbody = this.view.element.nativeElement.querySelector('.table > tbody');

     if(this.selectVal !== ''){
     wTbody.rows[this.selectRow].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
     
     var wTr = wTbody.rows[this.selectRow];
     wTr.style.backgroundColor = Const.HighLightColour.Selected;
    }

  });
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
        this.errorMsg = Const.ErrorMsg.E0008;
        $event.stopPropagation();
    }
    else{
      this.modalService.requestChooseVal(this.resVal);
    }
  }

  /**
  * JSONファイルをdatasに格納
  */
  private getOrderInputData() {

    //入力された値
    this.selectVal = this.ODIS0020Service.getVal();

    // 発注仕訳マスタ取得
    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0003_Init)
      .then(
        (response) => {
          if (response.result === Const.ConnectResult.R0001) {
            this.datas = response.applicationData;
            if (!(this.selectVal == undefined || this.selectVal == null)) {
              this.onScroll(this.datas, this.selectVal);
            }
          }
          //ロード画面を解除する。
          this.isLoading = false;
        }
      );
  }

  private onScroll(datas:OrderJournalSelectType[], selectVal:any){

    //行数取得
    var row = 0;
    for(let data of datas){
      if(data.journalCode == selectVal){
        this.selectRow = row;
        // 値 設定
        this.resVal = data;
      }
      row += 1;
    }
  }
}
