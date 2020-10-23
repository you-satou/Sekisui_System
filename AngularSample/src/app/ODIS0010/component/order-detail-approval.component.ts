import { ChangeDetectorRef, Component, HostListener, OnInit, ViewEncapsulation,} from "@angular/core";
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

  orderDetailData: ODIS0010OrderDetail[];
  // パラメータ
  inputment= new ODIS0010Form();

  pixel: number;

  screenSize: any;

  //検索値
  value = '';
  loaderText = Const.WarningMsg.W0002;
  isGetting: boolean = false;
  
  //初期画面のレンダー
  isInitFlg: boolean = false;

  //明細に渡すページナンバー
  currPageIndex: number;
  
  //明細一覧をソート、またはページ切り替えたときにページナンバーを保持するなパラメタ―
  _pgIndex: number = 0;
  
  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private router: Router,
    private CommonComponent: CommonComponent,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // ヘッダー 設定
    this.appComponent.setHeader(
      Const.ScreenName.S0001,
      Const.LinKSetting.L0000
    );
    this.setStartPage();
    
    // Search ボタンの初期位置を設定する
    this.screenSize = window.innerWidth;
    this.pixel = this.screenSize  - 408;

    // 初期画面をレンダーする
    this.isInitFlg = true;

    
    if(sessionStorage.getItem(Const.ScreenName.S0001EN) != null){
      let savedData = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0001EN));

      //一覧のソート状態
      this.currPageIndex = savedData.currentPage;    
      this.inputment = savedData.inputForm;
      this.orderDetailData = savedData.resultData;

      this.changeDetectorRef.detectChanges();
      if(this.orderDetailData.length > 0){

        //保持されたページＮｏを設定する。
        this.setPaginator('1',`${this.currPageIndex + 1}`);
      }


    }
  }

  onCloseClick(){

    // 既にセッションが格納されている場合は除去する
    if (sessionStorage.getItem(Const.ScreenName.S0001EN) != null) {
      sessionStorage.removeItem(Const.ScreenName.S0001EN);
    }
    this.router.navigate(['']);
  }

  toApproveMaster(){

    this.saveTemporaryData();

    this.router.navigate(['OrderSplitApprovalMaster']);
  }

  //ページ広さを調整する時にボタンの位置も調整する
  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.screenSize = window.innerWidth;
    if(this.screenSize <= 1284){
      return;
    }
    this.pixel = this.screenSize  - 408;
  }

  /** 
   * ページ初期化
   */
  setStartPage() {
    this.inputment.contractNumFrom = '';
    this.inputment.contractNumTo   = '';
    this.inputment.propertyName    = '';
    this.inputment._checked        = true;
    this.inputment.detailCreated   = false;
    this.inputment.detailNone      = false;
    this.inputment.approval_1      = false;
    this.inputment.approval_2      = false;
  }

  /** 
   * 検索処理
   */
  getSearchRequest() {

    if (this.checkInput(this.inputment)) {

      this.isGetting = true;

    // Todo　システムログイン情報から取得すること！
    // 事業区分コード設定
    this.inputment.officeCode = '402000';

    // 物件名 設定
    this.inputment.searchByName = this.getPropertyKubun();
    
    // 発注明細入力_承認処理取得
    this.orderService.getSearchRequest(Const.UrlLinkName.S0001_Search,this.inputment)
      .then(
        (response) => {
          if(response.result === Const.ConnectResult.R0001){
            this.orderDetailData = response.applicationData;
            this.setPaginator('1','1');
          }else{
            //返却データがない場合、データテーブルを初期化にする。
            this.orderDetailData = [];
            this.setPaginator('0','');

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
  checkInput(input: ODIS0010Form): boolean {

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
 * 検索ボタンを押下した時、パジーネタのページインデックスナンバーを設定する
 * @param val １：データがある場合。２：データがない場合
 * @param pageNo ページNoを設定する
 */
  setPaginator(val: string, pageNo: string){
    let pageInput: any = document.getElementById("pageIndex");
    //返却データがある場合、
    if(val == '1'){
      pageInput.value = pageNo;
      pageInput.removeAttribute("disabled");
    }
    else{
      //返却データがない場合
      pageInput.value = pageNo;
      pageInput.setAttribute("disabled","true");
    }
  }

  /** 
   * 契約番号From　入力値チェック 
   */
  onKeyUpNumFrom($event){

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
  onKeyUpNumTo($event){

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
  toZenkakuPropName($event){

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
  saveTemporaryData(){

    var saveData = new ODIS0010Session();
    //
    if(this._pgIndex == 0 && sessionStorage.getItem(Const.ScreenName.S0001EN) != null){
      saveData.currentPage  = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0001EN)).currentPage;
    }
    else{
      saveData.currentPage = this._pgIndex;
    }
    
    saveData.inputForm = this.inputment;
    saveData.resultData = this.orderDetailData;

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
  getEmitter(status: TableStatus){

   //現在のソート順とページナンバーを保持する。
   this._pgIndex = status.pgIndex;
   this.orderDetailData = status.sortedData;
   
   //ソートとページ切り替えた後、一時データを保持する。
   this.saveTemporaryData();
   
  }

}
