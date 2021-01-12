import { Component, HostListener, OnInit, ViewEncapsulation,} from "@angular/core";
import { Router } from '@angular/router';
import { AppComponent } from "../../app.component";
import { ODIS0010Form } from "../entities/odis0010-Form.entity";
import { ODIS0010OrderDetail } from "../entities/odis0010.entity";
import { CommonService } from "app/common/common.service";
import { CommonComponent } from "app/common/common.component";
import { Const } from "../../common/const";
import { ODIS0010Session, TableStatus } from './../entities/odis001.session.entity';

@Component({
  selector: "app-order-detail-approval",
  templateUrl: "./order-detail-approval.component.html",
  styleUrls: ["./order-detail-approval.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailApprovalComponent implements OnInit {

  orderDetailData: ODIS0010OrderDetail[] = [];
  // パラメータ
  inputment　= new ODIS0010Form();

  //検索値
  value = '';
  loaderText = Const.WarningMsg.W0002;
  isGetting: boolean = false;
  
  //初期画面のレンダー
  isInitFlg: boolean = false;

  //明細に渡すページナンバー
  currPageIndex: number;
  
  //明細一覧をソート、またはページ切り替えたときにページナンバーを保持するなパラメタ―
  _pgIndex: number = -1;

  //表示する承認の数の設定
  approvalUnit: number;
  
  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private router: Router,
    private CommonComponent: CommonComponent,
  ) {}

  ngOnInit() {
    // ヘッダー 設定
    this.appComponent.setHeader(
      Const.ScreenName.S0001,
      Const.LinKSetting.L0000
    );
    this.setStartPage();
    this.approvalUnit = this.appComponent.approvalLevels;
    
    // 初期画面をレンダーする
    this.isInitFlg = true;

    
    if(sessionStorage.getItem(Const.ScreenName.S0001EN) != null){
      let savedData = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0001EN));

      //ページャネタの初期表示ページ数を設定する
      this.currPageIndex = savedData.currentPage;
      
      //入力したデータを設定する。
      this.inputment = savedData.inputForm;

      //一覧のソート状態
      this.orderDetailData = savedData.resultData;

    }
  }

  /**
   * 閉じるボタンを押下する
   */
  public onCloseClick(){

    // 既にセッションが格納されている場合は除去する
    if (sessionStorage.getItem(Const.ScreenName.S0001EN) != null) {
      sessionStorage.removeItem(Const.ScreenName.S0001EN);
    }
    this.router.navigate(['']);
  }

  /**
   * 発注承認マスタ画面に遷移する
   */
  public toApproveMaster(){

    this.saveTemporaryData();

    this.router.navigate([Const.UrlSetting.U0007]);
  }

  /** 
   * ページ初期化
   */
  private setStartPage() {
    this.inputment.contractNumFrom = '';
    this.inputment.contractNumTo   = '';
    this.inputment.propertyName    = '';
    this.inputment._checked        = true;
    this.inputment.detailCreated   = false;
    this.inputment.detailNone      = false;
    this.inputment.approval_1      = false;
    this.inputment.approval_2      = false;
    this.inputment.approval_3      = false;
    this.inputment.approval_last   = false;
  }

  /** 
   * 検索処理
   */
  public getSearchRequest($event) {

    if (this.checkInput(this.inputment)) {

      this.isGetting = true;

    // Todo　システムログイン情報から取得すること！
    // 事業区分コード設定
    this.inputment.officeCode = '402000';

    // 物件名 設定
    this.inputment.searchByName = this.getPropertyKubun();
    
    // 発注明細入力_承認処理取得
    // this.orderService.getSearchRequest(Const.UrlLinkName.S0001_Search,this.inputment)
    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0001_Search,this.inputment)    
      .then(
        (response) => {
          if(response.result === Const.ConnectResult.R0001){
            this.orderDetailData = response.applicationData;
          }else{
            //返却データがない場合、データテーブルを初期化にする。
            this.orderDetailData = [];

            //メッセージを表示するまで、タイマーを設定する。
            setTimeout(function() {
              alert(response.message);
            },300);
          }
          this.currPageIndex = 0;
          this.saveTemporaryData();
          //ロード中を解除する。
          this.isGetting = false;
        }
      );
    }
  }
  
  /**
   * 物件名ラジオボタン 値取得
   */
  private getPropertyKubun(){
    if(this.inputment._checked){
      return '1' // １： 名称から始まる
    }
    else{
        return '2' //２：名称を含めて検索
    }
  }

  /**  
   * 入力検証
   */
  public checkInput(input: ODIS0010Form): boolean {

    if(!(input.contractNumFrom == "") && !(input.contractNumTo == "")){

      var numFrom = Number(input.contractNumFrom);
      var numTo = Number(input.contractNumTo);
  
        if(numFrom > numTo){
          alert(Const.ErrorMsg.E0001);
          return false;
        }
    }
    return true;
  }

  /** 
   * 契約番号From　入力値チェック 
   */
  public onKeyUpNumFrom($event){

    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }

    this.inputment.contractNumFrom = this.CommonComponent.onlyHanNumber(val);

  }

  /** 
   * 契約番号To　入力値チェック 
   */
  public onKeyUpNumTo($event){

    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }

    this.inputment.contractNumTo = this.CommonComponent.onlyHanNumber(val);

  }

  /** 
   * 物件名　ロストフォーカスで半角⇒全角
   */
  public toZenkakuPropName($event){

    var maxLen:number = $event.target.maxLength;
    var val = $event.target.value;
    if(val.length > maxLen){
      val = val.substr(0,maxLen);
    }

    this.inputment.propertyName= this.CommonComponent.onChangeZenkaku(val);

  }

   /**
   * 一時データを保持する
   */
  public saveTemporaryData(){

    var saveData = new ODIS0010Session();

    saveData.inputForm = this.inputment;
    saveData.resultData = this.orderDetailData;
    saveData.currentPage = this._pgIndex;

    //ページ切り替えエベント発生しない時、「this._pgIndex」の値が　0　になっているため、セッションを保持する時に
    //ぺジャーネタの表示されているページ数をみて、０でない場合は、表示されているページ数を取得する。
    var pgText: any = document.getElementById("pageIndex");
    var pgNo = pgText.value;
    if(this._pgIndex == -1 && Number(pgNo) > 0){
      saveData.currentPage = this.currPageIndex;
    }

    // 既にセッションが格納されている場合は除去する
    if(sessionStorage.getItem(Const.ScreenName.S0001EN) != null){
      sessionStorage.removeItem(Const.ScreenName.S0001EN);
    }
    sessionStorage.setItem(Const.ScreenName.S0001EN,JSON.stringify(saveData));
  }

  /**
   * ソート・ページ切り替え毎、エベントを取得する
   * @param status 現在のソート順とページナンバー
   */
  public getEmitter(status: TableStatus){

   //現在のソート順とページナンバーを保持する。
   this._pgIndex = status.pgIndex;
   this.orderDetailData = status.sortedData;
   
   //ソートとページ切り替えた後、一時データを保持する。
   this.saveTemporaryData();
  }

}
