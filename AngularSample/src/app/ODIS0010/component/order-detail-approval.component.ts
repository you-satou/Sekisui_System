import { Component, HostListener, OnInit, ViewEncapsulation,ViewChild,QueryList,ViewContainerRef } from "@angular/core";
import { ODIS0010Form } from "../entities/odis0010-Form.entity";
import { ODIS0010OrderDetail } from "../entities/odis0010.entity";
import { OrderDetailApprovalTable } from 'app/ODIS0010/component/data-table/oder-detail-approval-table';
import { CommonService } from "app/common/common.service";
import { CommonComponent } from "app/common/common.component";
import { AppComponent } from "../../app.component";
import { Const } from "../../common/const";
import { Router } from '@angular/router';

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

  // // Mocking data用、削除予定
  // _url: string = "assets/data/dataApproval.json";
  
  @ViewChild(OrderDetailApprovalTable,{static:true}) private orderDetailApprovalTable: OrderDetailApprovalTable;
  
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
    
    // Search ボタンの位置を設定する
    this.screenSize = window.innerWidth;
    this.pixel = this.screenSize  - 408;

    this.orderDetailApprovalTable.sort.disabled = true;

  }

  onCloseClick(){
    this.router.navigate(['']);
  }

  //ページ広さを調整する時にボタンの位置も調整する
  @HostListener('window:resize', ['$event'])
  onResize(event) {
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
    this.inputment.contractNumTo = '';
    this.inputment.propertyName = '';
    this.inputment._checked = true;
    this.inputment.detailCreated = false;
    this.inputment.detailNone = false;
    this.inputment.approval_1 = false;
    this.inputment.approval_2 = false;
  }

  /** 
   * 検索処理
   */
  getSearchRequest() {

    if (this.checkInput(this.inputment)) {

    // Todo　システムログイン情報から取得すること！
    // 事業区分コード設定
    this.inputment.officeCode = '701000';

    // 物件名 設定
    this.inputment.searchByName = this.getPropertyKubun();
    
    // 発注明細入力_承認処理取得
    this.orderService.getSearchRequest(Const.UrlLinkName.S0001_Search,this.inputment)
      .then(
        (response) => {

          if(response.result === "OK"){
            this.orderDetailData = response.applicationData;
          }else{
            alert(response.message);
          }
        }
      );
    }

    this.orderDetailApprovalTable.sort.disabled = false;
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

      var NumFrom = Number(input.contractNumFrom);
      var NumTo = Number(input.contractNumTo);
  
        if(NumFrom >= NumTo){
          alert(Const.ErrorMsg.E0001);
          return false;
        }
    }
    return true;
  }

  /** 
   * パージネタを解除する 
   */
  setPaginator(){
    let pageInput = document.getElementById("pageIndex");
    pageInput.setAttribute("value", "1");
    pageInput.removeAttribute("disabled");
  }

  /** 
   * 契約番号From　入力値チェック 
   */
  onKeyUpNumFrom(value: string){

    this.inputment.contractNumFrom = this.CommonComponent.onlyHanNumber(value);

  }

  /** 
   * 契約番号To　入力値チェック 
   */
  onKeyUpNumTo(value:string){

    this.inputment.contractNumTo = this.CommonComponent.onlyHanNumber(value);

  }

  /** 
   * 物件名　ロストフォーカスで半角⇒全角
   */
  toZenkaku(value:string){

    this.inputment.propertyName = this.CommonComponent.onChangeZenkaku(value);

  }

}
