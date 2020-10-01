import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
import { CommonComponent } from 'app/common/common.component';
import { OrderSplitApprovalMasterTable, DropDownList } from '../entities/odis0070.entity';
import { OrderSplitApprovalMasterService } from '../services/order-split-approval-master-service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { ODIS0070Form } from '../entities/odis0070-Form.entity';
import { UserInfo} from '../entities/odis0070-UserInfo.entitiy'

// 承認 ドロップダウン 設定内容
const APPROVAL_TYPE: DropDownList[] =[
  {
    id:'0',
    text:''
  },
  {
    id:'1',
    text:'可'
  }
];

// 承認 ドロップダウン 設定内容
const DEL_TYPE: DropDownList[] =[
  {
    id:'0',
    text:''
  },
  {
    id:'1',
    text:'削'
  }
];

@Component({
  selector: 'app-order-split-approval-master',
  templateUrl: './order-split-approval-master.component.html',
  styleUrls: ['./order-split-approval-master.component.css']
})
export class OrderSplitApprovalMasterComponent implements OnInit {

  // 承認 ドロップダウン 設定
  appTypes = APPROVAL_TYPE;

  // 削除 ドロップダウン 設定
  delTypes = DEL_TYPE;
  
  //選択行 インデックス
  index: number;

  //ボタンの初期表示
  btnTsuika: boolean;
  btnHenkou: boolean;
  btnChuushi: boolean;
  btnSakujo: boolean;
  
  // パラメータ
  input = new ODIS0070Form();

  // 個人情報 パラメータ
  paramUserInfo = new ODIS0070Form();
  // 個人情報 レスポンス
  resUserInfo: UserInfo;

  //発注承認者マスタのインターフェース
  orderApprovalData: OrderSplitApprovalMasterTable[];

  //発注承認者マスタテーブルのカラム
  orderApprovalColumns: string[] = [
    'personalID',
    'employeeCode',
    'employeeName',
    'approval1',
    'approval2',
    'deleteFlag'
  ];

  dataSource: any;

  // mocking data url
  _urlOrderSplit: string = "assets/data/dataSplitApproval.json";

  /**
   * コンストラクタ
   *
   * @param {service} service
   * @memberof OrderSplitApprovalMasterService
   */
  constructor(
    private view: ViewContainerRef,
    private appComponent: AppComponent,
    private commonComponent: CommonComponent,
    private _location: Location,
    private service: CommonService,
    private router: Router,
    private CommonService: CommonService,  
  ) { }

  /**
   * ページがロードする時、テーブルデータを取得する
   */
  ngOnInit() {
    this.appComponent.setHeader(Const.ScreenName.S0007, Const.LinKSetting.L0000);
    this.getOrderSplitApproval();
    //this.getOrderInputData();

    // ボタン制御
    this.setPageButtonDisplay(false, true, false, true);
  }

  /**
   * データを取得
   */
  getOrderInputData() {
    this.service.getSingleData(this._urlOrderSplit)
      .subscribe(
        data => this.orderApprovalData = data       
      );
  }

  /**
   * 初期表示 データ取得
   *
   * @param $event イベント
   */
  getOrderSplitApproval() {
    // TODO
    this.input.officeCode = '204006';

    // 発注承認者マスタ 取得
    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Init,this.input)
      .then(
        (response) => {

          if(response.result === Const.ConnectResult.R0001){
            this.orderApprovalData = response.applicationData;
          }else{
            alert(response.message);
          }
        }
      );
  }

  /**
   * 「戻る」ボタンの押下
   *
   * @param $event イベント
   */
  public onBackClick($event) {
    this.router.navigate([Const.UrlSetting.U0000]);
  }

  /**
   * 個人認証ＩＤ ロストフォーカス
   *
   * @param $event イベント
   */
  getEmployeeInfo($event){
    // 空白以外の場合に処理を実行
    if($event.target.value.trim().length >= 1){
      // 前回の個人認証ＩＤと異なる場合に以降の処理を実施
      if(this.paramUserInfo.personalID !== $event.target.value.trim()){
        // 初期化
        this.paramUserInfo = new ODIS0070Form();
        // TODO
        this.input.officeCode = '204006';
        // 個人認証ＩＤ
        this.paramUserInfo.personalID = $event.target.value.trim();

        this.CommonService.getSearchRequest('ODIS0070/getUser',this.paramUserInfo)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){
              this.resUserInfo = response.applicationData;
              this.input.personalID = $event.target.value.trim();
              this.input.employeeCode = this.resUserInfo.employeeCode;
              this.input.employeeName = this.resUserInfo.employeeName;
            }else{
              alert(response.message);
            }
          }
        );

      }


    }
  }

  /**
   * 行を選択する処理
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem) {
    // 背景色 設定
    this.commonComponent.CommonOnSelHight($event);
  
    // 格項目設定
    this.input.personalID = selectedItem.personalID;
    this.input.employeeCode = selectedItem.employeeCode;
    this.input.employeeName = selectedItem.employeeName;
    // 承認１ ドロップダウン 設定
    for(var data of APPROVAL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.approval1)){
        this.view.element.nativeElement.querySelector('#selApp1').selectedIndex = data.id;
      }
    }

    // 承認２ ドロップダウン 設定
    for(var data of APPROVAL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.approval2)){
        this.view.element.nativeElement.querySelector('#selApp2').selectedIndex = data.id;
      }
    }

    // 削除 ドロップダウン 設定
    for(var data of DEL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.deleteFlag)){
        this.view.element.nativeElement.querySelector('#selDel').selectedIndex = data.id;
      }
    }

    this.input.approval1 = selectedItem.approval1;
    this.input.approval2 = selectedItem.approval2;
    this.input.deleteFlag = selectedItem.deleteFlag;
    // 選択行 設定
    this.index = this.orderApprovalData.indexOf(selectedItem);

    // ボタン制御
    this.setPageButtonDisplay(true, false, false, false);
  }

  /**
   * 分割明細ページの各ボタンの活用性を設定する。　
   * ボタンの初期表、「disabled」属性を「False」する
   * @param tsuika 追加ボタンの設定
   * @param henkou 変更ボタンの設定
   * @param chuushi 中止ボタンの設定
   * @param sakujo 削除ボタンの設定
   */
  private setPageButtonDisplay(tsuika: boolean,henkou: boolean,chuushi: boolean,sakujo: boolean) {
    this.btnTsuika = tsuika;
    this.btnHenkou = henkou;
    this.btnChuushi = chuushi;
    this.btnSakujo = sakujo;
  }

  /**
   * 明細追加ボタン
   */
  onInsClick(){
    // TODO
    this.input.officeCode = '204006';
    this.input.approval1 = this.view.element.nativeElement.querySelector('#selApp1').selectedIndex;
    this.input.approval2 = this.view.element.nativeElement.querySelector('#selApp2').selectedIndex;
    this.input.deleteFlag = this.view.element.nativeElement.querySelector('#selDel').selectedIndex;
    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Insert,this.input)
    .then(
      (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.orderApprovalData = response.applicationData;
           // 初期化
           this.clearItem();
         }else{
           alert(response.message);
         }
       }
     );
  }

  /**
   * 明細更新ボタン
   */
  onUpdClick(){
    // TODO
    this.input.officeCode = '204006';
    this.input.approval1 = this.view.element.nativeElement.querySelector('#selApp1').selectedIndex;
    this.input.approval2 = this.view.element.nativeElement.querySelector('#selApp2').selectedIndex;
    this.input.deleteFlag = this.view.element.nativeElement.querySelector('#selDel').selectedIndex;
    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Update,this.input)
    .then(
      (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.orderApprovalData = response.applicationData;
           // 初期化
           this.clearItem();
         }else{
           alert(response.message);
         }
       }
     );
  }

  /**
   * 中止ボタン 
   */
  onStopClick($event){
    let tbody = this.view.element.nativeElement.querySelector('tbody');
    //選択解除
    this.commonComponent.setRowColor(Const.Action.A0006, tbody, this.index);
    // 項目初期化
    this.clearItem();
    // ボタン制御
    this.setPageButtonDisplay(false, true, false, true);
  }

  /**
   * 削除ボタン
   */
  onDelClick(){
    // TODO
    this.input.officeCode = '204006';
    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Delete,this.input)
    .then(
      (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.orderApprovalData = response.applicationData;
           // 初期化
           this.clearItem();
         }else{
           alert(response.message);
         }
       }
     );
  }

  /**
   * 項目クリア
   */
  clearItem(){
    // 格項目 初期化
    this.input.personalID = ''
    this.input.employeeCode = ''
    this.input.employeeName = ''
    this.input.approval1 = ''
    this.input.approval2 = ''
    this.input.deleteFlag = ''
    // ドロップダウン初期化
    this.view.element.nativeElement.querySelector('#selApp1').selectedIndex = 0;
    this.view.element.nativeElement.querySelector('#selApp2').selectedIndex = 0;
    this.view.element.nativeElement.querySelector('#selDel').selectedIndex = 0;
  }
}
