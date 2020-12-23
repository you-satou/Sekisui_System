import { Component, OnInit, AfterViewInit, QueryList, ViewContainerRef, ViewChildren } from '@angular/core';
import { OrderSupplierSelectService } from '../services/order-supplier-select.service';
import { OrderSupplierSelectType } from '../entities/odis0040.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { ODIS0020Service } from '../../ODIS0020/services/odis0020-service';
import { Const } from '../../common/const';
import { ODIS0040Form } from '../entities/odis0040-Form.entity'

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
  resVal:OrderSupplierSelectType;

  // パラメータ
  param = new ODIS0040Form();

  // エラーメッセージ
  errormsg:string ="";

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
     var wTbody = this.view.element.nativeElement.querySelector('.table > tbody');

     if(this.selectVal !== ''){
    //  wTbody.rows[this.selectRow].scrollIntoView(true);
     wTbody.rows[this.selectRow].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
     var wTr = wTbody.rows[this.selectRow];
     wTr.style.backgroundColor = Const.HighLightColour.Selected;

    }
    // else{
    //   wTbody.rows[this.selectRow].scrollIntoView(false);
    // }
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
    //  this.param.officeCode = '827007';

     //入力された値
     this.selectVal = this.ODIS0020Service.getVal();

     // 発注仕訳マスタ取得
     this.orderService.getSearchRequest(Const.UrlLinkName.S0004_Init,this.param)
       .then(
         (response) => {

            if(response.result === Const.ConnectResult.R0001){
              this.datas = response.applicationData;
                if(!(this.selectVal == undefined || this.selectVal == null)){
                  this.onScroll(this.datas,this.selectVal);
                }
            }else{
              alert(response.message);
            }
            //ロード画面を解除する。
            this.isLoading = false;
          }
        );
  }
  onScroll(datas:OrderSupplierSelectType[],selectVal:any){

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

}