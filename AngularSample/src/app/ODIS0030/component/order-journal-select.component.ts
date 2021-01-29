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

  filterParam = new OrderJournalSelectType();

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
  ngAfterViewInit() {
    this.initScroll.changes.subscribe(t => {
      var wTbody = this.view.element.nativeElement.querySelector('#shiwakeTbl > tbody');

      if (this.selectVal !== '') {
        wTbody.rows[this.selectRow].scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });

        var wTr = wTbody.rows[this.selectRow];
        wTr.style.backgroundColor = Const.HighLightColour.Selected;
      }

    });
  }

  /**
  * 終了時
  */
  ngOnDestroy() {
    this.deleteSession();
  }

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
            
            // データを保持する。
            this.saveDataToSession();
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

  private saveDataToSession(){
    if (!sessionStorage.getItem(Const.ScreenName.S0003EN)) {
      sessionStorage.removeItem(Const.ScreenName.S0003EN);
    }

    let saveDt = [new OrderJournalSelectType()];
    saveDt = this.datas;
    sessionStorage.setItem(Const.ScreenName.S0003EN, JSON.stringify(saveDt));
  }

  private deleteSession(){
    sessionStorage.removeItem(Const.ScreenName.S0003EN);
  }

  //#region  --------------- ▼▼ フォーカス系 処理 ▼▼ --------------------------------
  /**
  * keyUp処理 半角数字のみ(仕訳コード)
  *
  * @param $event イベント
  */
  public toHanNumJC($event) {
    var maxLen: number = $event.target.maxLength;
    var val = $event.target.value;
    if (val.length > maxLen) {
      val = val.substr(0, maxLen);
    }
    this.filterParam.journalCode = this.commonComponent.onlyHanNumber(val);
  }

  /**
    * keyUp処理 半角数字のみ(経理分類コード)
    *
    * @param $event イベント
    */
  public toHanNumAC($event) {
    var maxLen: number = $event.target.maxLength;
    var val = $event.target.value;
    if (val.length > maxLen) {
      val = val.substr(0, maxLen);
    }
    this.filterParam.accountingCategory = this.commonComponent.onlyHanNumber(val);
  }


  /**
  * blur処理 半角⇒全角(仕訳名称)
  *
  * @param $event イベント
  */
  public toZenkaku($event, isJournalName: boolean) {
    var maxLen: number = $event.target.maxLength;
    var val = $event.target.value;
    if (val.length > maxLen) {
      val = val.substr(0, maxLen);
    }

    if(isJournalName) {
      this.filterParam.orderJournalName = this.commonComponent.onChangeZenkaku(val);
    }
    else{
      this.filterParam.other = this.commonComponent.onChangeZenkaku(val);
    }
    
  }

  /**
   * 仕訳コード ロストフォーカス
   * @param event 
   */
  public filterByJournalCode($event) {
    
    if (this.filterParam.accountingCategory != '' ||
        this.filterParam.orderJournalName != '' ||
        this.filterParam.other != '' ) {
      return;
    }
    var maxLen: number = $event.target.maxLength;
    var val = $event.target.value;
    if (val.length > maxLen) {
      val = val.substr(0, maxLen);
    }

    const source: OrderJournalSelectType[] = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0003EN));
    if (this.commonComponent.setValue(this.filterParam.journalCode) != '') {
      var tempDt = source.filter((dt)=>{
        if (this.commonComponent.setValue(dt.journalCode) == this.filterParam.journalCode) {
          return dt;
        }
      })
      this.datas = tempDt;
    }
    else{
      this.datas = source; 
    }
    
  }

    /**
   * 仕訳名称 ロストフォーカス
   * @param event 
   */
  public filterByJournalName($event) {

    if (this.filterParam.accountingCategory != '' ||
        this.filterParam.journalCode != '' ||
        this.filterParam.other != '') {
      return;
    }

    const source: OrderJournalSelectType[] = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0003EN));
    if (this.commonComponent.setValue(this.filterParam.orderJournalName) != '') {
      var tempDt = source.filter((dt) => {
        if (this.commonComponent.setValue(dt.orderJournalName).includes(this.filterParam.orderJournalName)) {
          return dt;
        }
      })
      this.datas = tempDt;
    }
    else{
      this.datas = source;
    }
  }

  /**
   * 経理分類 ロストフォーカス
   * @param event 
   */
  public filterByAccountantCode($event) {

    if (this.filterParam.journalCode != '' ||
        this.filterParam.orderJournalName != '' ||
        this.filterParam.other != '') {
      return;
    }

    if (!($event.target.value == '')) {
      var maxLen: number = $event.target.maxLength;
      var val = $event.target.value;
      if (val.length > maxLen) {
        val = val.substr(0, maxLen);
      }
    }

    const source: OrderJournalSelectType[] = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0003EN));
    if (this.commonComponent.setValue(this.filterParam.accountingCategory) != '') {
      var tempDt = source.filter((dt) => {
        if (this.commonComponent.setValue(dt.accountingCategory) == this.filterParam.accountingCategory) {
          return dt;
        }
      })
      this.datas = tempDt;
    }
    else {
      this.datas = source;
    }

  }

  /**
   * 其他 ロストフォーカス
   * @param event 
   */
  public filterByOther($event) {

    if (this.filterParam.journalCode != '' ||
        this.filterParam.orderJournalName != '' ||
        this.filterParam.accountingCategory != '') {
      return;
    }

    var maxLen: number = $event.target.maxLength;
    var val = $event.target.value;
    if (val.length > maxLen) {
      val = val.substr(0, maxLen);
    }
    const source: OrderJournalSelectType[] = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0003EN));
    if (this.commonComponent.setValue(this.filterParam.other) != '') {
      var tempDt = source.filter((dt) => {
        if (this.commonComponent.setValue(dt.other).includes(this.filterParam.other)) {
          return dt;
        }
      })
      this.datas = tempDt;
    }
    else{
      this.datas = source;
    }
  }
  //#endregion

}