import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
import { CommonComponent } from 'app/common/common.component';
import { OrderSplitApprovalMasterTable, DropDownList } from '../entities/odis0070.entity';
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
  isEditFlgPersonal: boolean = false;
  isEditFlgEmployee: boolean = false;
  
  // パラメータ
  input = new ODIS0070Form();

  // 個人情報 パラメータ
  paramUserInfo = new ODIS0070Form();
  // 個人情報 レスポンス
  resUserInfo: UserInfo;

  // ビジーカーソル
  isLoading: boolean = true;

  //発注承認者マスタのインターフェース
  orderApprovalData: OrderSplitApprovalMasterTable[];

  //初期画面のレンダー
  isInitFlg: boolean = false;

  dataSource: any;

  //表示する承認の数の設定
  approvalUnit: number;

  tableWidth: number;

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
    private router: Router,
    private CommonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  /**
   * ページがロードする時、テーブルデータを取得する
   */
  ngOnInit() {
    this.approvalUnit = this.appComponent.approvalLevels;
    //ヘッダー設定
    this.appComponent.setHeader(Const.ScreenName.S0007, Const.LinKSetting.L0000);
    // ボタン制御
    this.setPageButtonDisplay(false, true, false, true);
    //データ取得
    this.getOrderSplitApproval();
    this.onResize('$event');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
    if(window.innerWidth < 840) {
      this.setTableSize(true);
    } else {
      this.setTableSize(false);
    }
  }

  /**
   * 初期表示 データ取得
   *
   * @param $event イベント
   */
  private getOrderSplitApproval() {
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
          // ビジー解除
          this.isLoading = false;
          // 初期画面をレンダーする
          this.isInitFlg = true;
          //再描画
          this.changeDetectorRef.detectChanges();
          var autofocus = document.getElementById('txtPersonalID');
          //個人認証IDにオートフォーカス
          autofocus.focus();
        }
      );
  }

  /**
   * 「戻る」ボタンの押下
   *
   * @param $event イベント
   */
  public onBackClick($event) {
    this.router.navigate([Const.UrlSetting.U0001]);
  }

  /**
   * 入力制限半角英数字のみ(個人認証ＩＤ)
   *
   * @param $event イベント
   */
  public toABCNumPersonal($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    this.input.personalID = this.commonComponent.onlyHanABCNumber(val);
  }

  /**
   * 入力制限半角英数字のみ(従業員コード))
   *
   * @param $event イベント
   */
  public toABCNumEmployee($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    this.input.employeeCode = this.commonComponent.onlyHanABCNumber(val);
  }

  /**
   * 個人認証ＩＤ ロストフォーカス
   *
   * @param $event イベント
   */
  public getEmployeeInfo($event){
    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }
    // 空白以外の場合に処理を実行
    if(val.trim().length >= 1){
      // 前回の個人認証ＩＤと異なる場合に以降の処理を実施
      if(this.paramUserInfo.personalID !== val.trim()){
        // ビジー開始
        this.isLoading = true;

        // 初期化
        this.paramUserInfo = new ODIS0070Form();
        // TODO:
        this.input.officeCode = '204006';
        // 個人認証ＩＤ
        this.paramUserInfo.personalID = val.trim();

        this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_GetUser,this.paramUserInfo)
        .then(
          (response) => {
            if(response.result === Const.ConnectResult.R0001){
              this.resUserInfo = response.applicationData;
              this.input.personalID = val.trim();
              this.input.employeeCode = this.resUserInfo.employeeCode;
              this.input.employeeName = this.resUserInfo.employeeName;
              // ボタン制御
              this.setPageButtonDisplay(false, true, false, true);
            }else{
              alert(response.message);
              // ボタン制御
              this.setPageButtonDisplay(true, true, false, true);
            }
            // ビジー解除
            this.isLoading = false;
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
  public onSelHighLight($event, selectedItem: OrderSplitApprovalMasterTable) {
    // 背景色 設定
    this.commonComponent.CommonOnSelHight($event);
  
    // 格項目設定
    this.input.personalID = selectedItem.personalID;
    this.input.employeeCode = selectedItem.employeeCode;
    this.input.employeeName = selectedItem.employeeName;
    // 承認１ ドロップダウン 設定
    for(var data of APPROVAL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.approval1) &&
      this.appComponent.approvalLevels >= Const.ApprovalLevel.TwoLevels){
        this.view.element.nativeElement.querySelector('#selApp1').selectedIndex = data.id;
        this.input.approval1 = selectedItem.approval1;
      }
    }

    // 承認２ ドロップダウン 設定
    for(var data of APPROVAL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.approval2) &&
      this.appComponent.approvalLevels >= Const.ApprovalLevel.ThreeLevels){
        this.view.element.nativeElement.querySelector('#selApp2').selectedIndex = data.id;
        this.input.approval2 = selectedItem.approval2;
      }
    }

    // 承認３ ドロップダウン 設定
    for(var data of APPROVAL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.approval3) &&
      this.appComponent.approvalLevels >= Const.ApprovalLevel.FourLevels){
        this.view.element.nativeElement.querySelector('#selApp3').selectedIndex = data.id;
        this.input.approval3 = selectedItem.approval3;
      }
    }

    // 最終承認 ドロップダウン 設定
    for(var data of APPROVAL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.approvalLast)){
        this.view.element.nativeElement.querySelector('#selAppLast').selectedIndex = data.id;
        this.input.approvalLast = selectedItem.approvalLast;
      }
    }

    // 削除 ドロップダウン 設定
    for(var data of DEL_TYPE){
      if(data.text === this.commonComponent.setValue(selectedItem.deleteFlag)){
        this.view.element.nativeElement.querySelector('#selDel').selectedIndex = data.id;
        this.input.deleteFlag = selectedItem.deleteFlag;
      }
    }

    // 選択行 設定
    this.index = this.orderApprovalData.indexOf(selectedItem);

    // 個人認証ＩＤ 非活性
    this.isEditFlgPersonal = true;
    // 従業員コード
    this.isEditFlgEmployee = true;

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
  public onInsClick(){
    // 入力チェック 個人認証ＩＤ 必須入力
    var strVal = this.commonComponent.setValue(this.input.personalID);
    if(strVal === ''){
      alert(Const.ErrorMsg.E0016);
      return;
    }

    // ビジー開始
    this.isLoading = true;

    // TODO
    this.input.officeCode = '204006';

    //承認人数が2人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.TwoLevels) {
      this.input.approval1 = this.view.element.nativeElement.querySelector('#selApp1').selectedIndex;
    }
    //承認人数が3人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.ThreeLevels) {
      this.input.approval2 = this.view.element.nativeElement.querySelector('#selApp2').selectedIndex;
    }
    //承認人数が4人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.FourLevels) {
      this.input.approval3 = this.view.element.nativeElement.querySelector('#selApp3').selectedIndex;
    }

    this.input.approvalLast = this.view.element.nativeElement.querySelector('#selAppLast').selectedIndex;
    this.input.deleteFlag = this.view.element.nativeElement.querySelector('#selDel').selectedIndex;
    
    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Insert,this.input)
    .then(
      (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.orderApprovalData = response.applicationData;

           // 再描画
          this.changeDetectorRef.detectChanges();

          // 行 文字色 青 設定
          var tbody = this.view.element.nativeElement.querySelector('tbody');
          // 追加データ抽出
          let filter = this.orderApprovalData.filter(element =>{
            if(element.personalID == this.input.personalID){
              return element;
            }
          });
          // 行番号取得
          let row = this.orderApprovalData.indexOf(filter[0]);
          // 背景色 変更
          this.commonComponent.setRowColor(Const.Action.A0001, tbody, row);
          // 自動スクロール
          tbody.rows[row].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});

           // 初期化
           this.clearItem();
         }else{
           alert(response.message);
         }
         // ビジー解除
         this.isLoading = false;
       }
     );
  }

  /**
   * 明細更新ボタン
   */
  public onUpdClick(){
    // ビジー開始
    this.isLoading = true;

    // TODO:
    this.input.officeCode = '204006';
    this.input.approval1 = Const.ApprovalValue.Deny;
    this.input.approval2 = Const.ApprovalValue.Deny;
    this.input.approval3 = Const.ApprovalValue.Deny;
    //承認人数が2人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.TwoLevels) {
      this.input.approval1 = this.view.element.nativeElement.querySelector('#selApp1').selectedIndex;
    }
    //承認人数が3人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.ThreeLevels) {
      this.input.approval2 = this.view.element.nativeElement.querySelector('#selApp2').selectedIndex;
    }
    //承認人数が4人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.FourLevels) {
      this.input.approval3 = this.view.element.nativeElement.querySelector('#selApp3').selectedIndex;
    }
    
    this.input.approvalLast = this.view.element.nativeElement.querySelector('#selAppLast').selectedIndex;
    this.input.deleteFlag = this.view.element.nativeElement.querySelector('#selDel').selectedIndex;

    this.CommonService.getSearchRequest(Const.UrlLinkName.S0007_Update,this.input)
    .then(
      (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.orderApprovalData = response.applicationData;

          // 再描画
          this.changeDetectorRef.detectChanges();

          // 行 文字色 青 設定
          var tbody = this.view.element.nativeElement.querySelector('tbody');
          // 追加データ抽出
          let filter = this.orderApprovalData.filter(element =>{
            if(element.personalID == this.input.personalID){
              return element;
            }
          });
          // 行番号取得
          let row = this.orderApprovalData.indexOf(filter[0]);
          // 背景色 変更
          this.commonComponent.setRowColor(Const.Action.A0002, tbody, row);
          // 自動スクロール
          tbody.rows[row].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});

           // 初期化
           this.clearItem();

         }else{
           alert(response.message);
         }
         // ビジー解除
         this.isLoading = false;
       }
     );
  }

  /**
   * 中止ボタン 
   */
  public onStopClick($event){
    let tbody = this.view.element.nativeElement.querySelector('tbody');
    //選択解除
    this.commonComponent.setRowColor(Const.Action.A0006, tbody, this.index);
    // 項目初期化
    this.clearItem();
  }

  /**
   * 削除ボタン
   */
  public onDelClick(){
    // ビジー開始
    this.isLoading = true;
    
    // TODO:
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
         // ビジー解除
         this.isLoading = false;
       }
     );
  }

  /**
   * 項目クリア
   */
  private clearItem(){
    // 格項目 初期化
    this.input.personalID = '';
    this.input.employeeCode = '';
    this.input.employeeName = '';
    this.input.deleteFlag = '';
    this.paramUserInfo = new ODIS0070Form();
    // ドロップダウン初期化

    //承認人数が2人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.TwoLevels) {
      this.input.approval1 = '';
      this.view.element.nativeElement.querySelector('#selApp1').selectedIndex = 0;
    }
    //承認人数が3人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.ThreeLevels) {
      this.input.approval2 = '';
      this.view.element.nativeElement.querySelector('#selApp2').selectedIndex = 0;
    }
    //承認人数が4人で設定する
    if(this.appComponent.approvalLevels >= Const.ApprovalLevel.FourLevels) {
      this.input.approval3 = '';
      this.view.element.nativeElement.querySelector('#selApp3').selectedIndex = 0;
    }
    this.input.approvalLast = '';

    this.view.element.nativeElement.querySelector('#selAppLast').selectedIndex = 0;
    this.view.element.nativeElement.querySelector('#selDel').selectedIndex = 0;

    // 個人認証ＩＤ 活性
    this.isEditFlgPersonal = false;
    // 従業員コード 活性
    this.isEditFlgEmployee = false;

    // ボタン制御
    this.setPageButtonDisplay(false, true, false, true);
  }

  private setTableSize(isSmall: boolean) {
    switch(this.appComponent.approvalLevels) {
      //承認人数が4人で設定する
      case Const.ApprovalLevel.FourLevels:
        this.tableWidth = 756;
        break;
      //承認人数が3人で設定する
      case Const.ApprovalLevel.ThreeLevels:
        this.tableWidth = 679;
        break;
      //承認人数が2人で設定する
      case Const.ApprovalLevel.TwoLevels:
        this.tableWidth = 602;
        break;
      case Const.ApprovalLevel.OneLevel:
        this.tableWidth = 525;
        break;
    }

    if(isSmall) {
      switch(this.appComponent.approvalLevels) {
        //承認人数が4人で設定する
        case Const.ApprovalLevel.FourLevels:
          this.tableWidth = 684;
          break;
      }
    }
  }

}
