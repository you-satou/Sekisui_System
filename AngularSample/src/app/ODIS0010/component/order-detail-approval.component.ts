import { Component, HostListener, OnInit, ViewEncapsulation } from "@angular/core";
import { ODIS0010Form,ODIS0010OrderDetail } from "../entities/odis0010-Form.entity";
import { ODIS0010OrderSearchInputment } from "../entities/odis0010-SearchForm.entity";
import { CommonService } from "app/common/common.service";
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
  inputment= new ODIS0010OrderSearchInputment();

  pixel: number;

  screenSize: any;

  // パラメータ
  param = new ODIS0010Form();

  // // Mocking data用、削除予定
  // _url: string = "assets/data/dataApproval.json";
  
  
  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private router: Router,
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

  /** ページ初期化 */
  setStartPage() {
    this.inputment.Clear();

  }

  getSearchRequest() {
    if (this.checkInput(this.inputment)) {

      //// Get data from server
      // setTimeout(()=> {
      //   this.orderService.getSearchRequest(Const.UrlLinkName.S0001_Search,this.inputment)
      //   .then(
      //     (response) => {
      //       this.orderDetailData = response;
      //       if(this.orderDetailData != null){
      //           this.setPaginator();
      //       }
      //     }
      //   );
      // });

      // // Mocking data from JSON file
      // this.orderService.getMultipileData(this._url).subscribe((data) => {
      //   this.orderDetailData = data;
      //   if (this.orderDetailData != null) {
      //     this.setPaginator();
      //   }
      // });

    // Todo　システムログイン情報から取得すること！
    // 事業区分コード設定
    this.param.officeCode = '701000';

    // 事業区分コード設定
    if(!(this.inputment.contractNumFrom == null)){
      this.param.contractNumFrom = this.inputment.contractNumFrom;
    }

    if(!(this.inputment.contractNumTo == null)){
      this.param.contractNumTo = this.inputment.contractNumTo;
    }

    if(!(this.inputment.propertyName == null)){
      this.param.propertyName = this.inputment.propertyName;
    }

    if(this.inputment._checked == true){
      this.param.searchByName = '1';
    }
    else{
      this.param.searchByName = '2';
    }
    
    if(this.inputment.detailNone == true ){
      this.param.detailCreated = true;
    }
    else{
      this.param.detailCreated = false;
    }

    if(this.inputment.detailCreated == true ){
      this.param.detailNone = true;
    }
    else{
      this.param.detailNone = false;
    }

    if(this.inputment.approval_1 == true ){
      this.param.approval_1 = true;
    }
    else{
      this.param.approval_1 = false;
    }

    if(this.inputment.approval_2 == true ){
      this.param.approval_2 = true;
    }
    else{
      this.param.approval_2 = false; 
    }

    // 発注明細入力_承認処理取得
    this.orderService.getSearchRequest(Const.UrlLinkName.S0001_Search,this.param)
      .then(
        (response) => {
          this.orderDetailData = response;
        }
      );
    }
  }

  /**  入力検証 */
  checkInput(input: ODIS0010OrderSearchInputment): boolean {
    return true;
  }

  /** パージネタを解除する */
  setPaginator(){
    let pageInput = document.getElementById("pageIndex");
    pageInput.setAttribute("value", "1");
    pageInput.removeAttribute("disabled");
  }

}
