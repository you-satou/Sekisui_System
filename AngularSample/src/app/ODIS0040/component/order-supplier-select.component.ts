import { Component, OnInit, AfterViewInit, QueryList, ViewContainerRef, ViewChildren } from '@angular/core';
import { OrderSupplierSelectService } from '../services/order-supplier-select.service';
import { OrderSupplierSelectType } from '../entities/odis0040.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { ODIS0020Service } from '../../ODIS0020/services/odis0020-service';
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
export class OrderSupplierSelectComponent implements OnInit, AfterViewInit {

  // タイトル
  title = '発注先マスタ選択';

  // 画面表示データ
  datas: OrderSupplierSelectType[];

  // 戻り値
  resVal: OrderSupplierSelectType;

  // エラーメッセージ
  errormsg:string ="";

  //入力された値
  selectVal: string;

  //フォーカス対象列
  selectRow: number;

  // ローディング 判定
  isLoading: boolean = true;

  filterParam = new OrderSupplierSelectType();

  get isFiltering(){
    if(this.filterParam.supplierCode != ''
    || this.filterParam.supplierJournalName != ''
    || this.filterParam.delivery != ''){
      return true;
    }
    return false;
  }

  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private view: ViewContainerRef,
    private modalService: OrderSupplierSelectService,
    private commonComponent: CommonComponent,
    private orderService: CommonService,
    private ODIS0020Service: ODIS0020Service,
  ) {}
  
  /**
   * 初期処理
   */
  ngOnInit() {

    //サーバ接続用
    this.getOrderInputData();

  }

 /**
  * レンダリング後（自動スクロール）
  */
 @ViewChildren('initScroll')
 initScroll: QueryList<any>;
 ngAfterViewInit(){
   this.initScroll.changes.subscribe(t => {
     var wTbody = this.view.element.nativeElement.querySelector('#mainTbl > tbody');

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
  private getOrderInputData(){
    //入力された値
    this.selectVal = this.ODIS0020Service.getVal();

    // 発注仕訳マスタ取得
    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0004_Init)
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

  private onScroll(datas:OrderSupplierSelectType[],selectVal:any){

    //行数取得
    var row = 0;

    for(let data of datas){

      if(data.supplierCode == selectVal){
        this.selectRow = row;
        // 値 設定
        this.resVal = data;
      }
      row += 1;
    }
  }

  private saveDataToSession(){
    if (!sessionStorage.getItem(Const.ScreenName.S0004EN)) {
      sessionStorage.removeItem(Const.ScreenName.S0004EN);
    }

    let saveDt = [new OrderSupplierSelectType()];
    saveDt = this.datas;
    sessionStorage.setItem(Const.ScreenName.S0004EN, JSON.stringify(saveDt));
  }

  private deleteSession(){
    sessionStorage.removeItem(Const.ScreenName.S0004EN);
  }

  //#region  --------------- ▼▼ フォーカス系 処理 ▼▼ --------------------------------
  /**
  * keyUp処理 半角数字のみ(発注先コード)
  *
  * @param $event イベント
  */
 public toHanNumSC($event) {
  var maxLen: number = $event.target.maxLength;
  var val = $event.target.value;
  if (val.length > maxLen) {
    val = val.substr(0, maxLen);
  }
  this.filterParam.supplierCode = this.commonComponent.onlyHanNumber(val);
}


/**
* blur処理 半角⇒全角(名称)
*
* @param $event イベント
*/
public toZenkaku($event, isSupplier: boolean) {
  var maxLen: number = $event.target.maxLength;
  var val = $event.target.value;
  if (val.length > maxLen) {
    val = val.substr(0, maxLen);
  }

  if(isSupplier) {
    this.filterParam.supplierJournalName = this.commonComponent.onChangeZenkaku(val);
  }
  else{
    this.filterParam.delivery = this.commonComponent.onChangeZenkaku(val);
  }
  
}


  /**
 * 発注先名称 ロストフォーカス
 * @param event 
 */
public filterBySupplierName($event) {

  this.filterData();
}

/**
 * 発注先コード ロストフォーカス
 * @param event 
 */
public filterBySupplierCode($event) {

  this.filterData();
}

/**
 * 納品 ロストフォーカス
 * @param event 
 */
public filterByDelivery($event) {
  
  this.filterData();
}

private filterData(){
  const source: OrderSupplierSelectType[] = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0004EN));
  if(this.isFiltering){
      var tempDt = source.filter((dt) => {
        if (this.commonComponent.setValue(dt.supplierCode).includes(this.filterParam.supplierCode) 
        && this.commonComponent.setValue(dt.supplierJournalName).includes(this.filterParam.supplierJournalName)
        && this.commonComponent.setValue(dt.delivery).includes(this.filterParam.delivery)) {
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