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

  private selectedApp1 = new DropDownList(); // 承認１
  private selectedApp2 = []; // 承認２
  private selectedDel = [];  // 削除

  approvalId: string = "0";

  //編集テーブルの値
  // personalID: string = "";
  // employeeCode: string = "";
  // employeeName: string = "";
  // approval1: string = "";
  // approval2: string = "";
  // deleteFlag: string = "";

  //行が選択されているかどうか
  selected: boolean;
  
  //選択された行のインデックス
  index: number;

  //ボタンの初期表示
  btnTsuika: boolean;
  btnHenkou: boolean;
  btnChuushi: boolean;
  btnSakujo: boolean;
  
  // パラメータ
  input = new ODIS0070Form();

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

    this.setPageButtonDisplay(false,false, false,false);
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
   * テーブルデータの取得
   *
   * @param $event イベント
   */
  getOrderSplitApproval() {

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
   * 行を選択する処理
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem) {
    // 背景色 設定
    this.commonComponent.CommonOnSelHight($event);
    
    this.selected = true
    this.input.personalID = selectedItem.personalID;
    this.input.employeeCode = selectedItem.employeeCode;
    this.input.employeeName = selectedItem.employeeName;
    if(selectedItem.approval1 == "可") {
      this.approvalId = "1";
    }
    this.input.approval1 = selectedItem.approval1;
    this.input.approval2 = selectedItem.approval2;
    this.input.delFlag = selectedItem.deleteFlag;
    this.index = this.orderApprovalData.indexOf(selectedItem);
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
    this.input.delFlag = this.view.element.nativeElement.querySelector('#selDel').selectedIndex;
    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Insert,this.input)
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
   * 明細更新ボタン
   */
  onUpdClick(){
    // TODO
    this.input.officeCode = '204006';
    this.input.approval1 = this.view.element.nativeElement.querySelector('#selApp1').selectedIndex;
    this.input.approval2 = this.view.element.nativeElement.querySelector('#selApp2').selectedIndex;
    this.input.delFlag = this.view.element.nativeElement.querySelector('#selDel').selectedIndex;
    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Update,this.input)
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
   * 中止ボタン 
   */
  onStopClick($event){
    let tbody = this.view.element.nativeElement.querySelector('tbody');
    //選択解除
    // this.commonComponent.setRowColor(Const.Action.A0006, tbody, this.rowStatus.rowIndex);
    // 項目初期化
    this.clearItem();

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
    this.input.delFlag = ''
    // ドロップダウン初期化
    this.view.element.nativeElement.querySelector('#selApp1').selectedIndex = 0;
    this.view.element.nativeElement.querySelector('#selApp2').selectedIndex = 0;
    this.view.element.nativeElement.querySelector('#selDel').selectedIndex = 0;
  }
}
