import { Component, HostListener, OnInit, ViewEncapsulation } from "@angular/core";
import { ODIS0010Form } from "../entities/odis0010-Form.entity";
import { ODIS0010OrderDetail } from "../entities/odis0010.entity";
import { CommonService } from "app/common/common.service";
import { AppComponent } from "../../app.component";
import { Const } from "../../common/const";
import { Router } from '@angular/router';
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/typings/scroll/scroll-strategy';

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

  /** 
   * ページ初期化
   */
  setStartPage() {
    this.inputment.contractNumFrom = '';
    this.inputment.contractNumTo = '';
    this.inputment.propertyName = '';
    //this.inputment._checked = true;
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

          if(response.length == 1){
            console.log(response.length);
          }
          this.orderDetailData = response;
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
   * 契約番号from半角数字
   */
  toFromHalf(value: string){

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    for (var i=0; i< value.length; i++){

      var c = "";
      c = beforeTextArr[i];

        if(c.match(/[Ａ-Ｚａ-ｚ０-９！-～]/)){

          c = String.fromCharCode(c.charCodeAt(0)-0xFEE0);
        }
        resultValue += c
    }
    this.inputment.contractNumFrom = resultValue;
  }

  /** 
   * 契約番号to半角数字
   */
  toNumToHalf(value: string){
    var resultValue = "";

    var beforeTextArr = String(value).split('');

    for (var i=0; i< value.length; i++){

      var c = "";
      c = beforeTextArr[i];

        if(c.match(/[Ａ-Ｚａ-ｚ０-９！-～]/)){

          c = String.fromCharCode(c.charCodeAt(0)-0xFEE0);
        }
        resultValue += c
    }
    this.inputment.contractNumTo = resultValue;

  } 

  /** 
  * 物件名 全角
  */
  toZenkaku(value: string){

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    var han = new Array('ｱ','ｲ','ｳ','ｴ','ｵ',
    'ｶ','ｷ','ｸ','ｹ','ｺ',
    'ｻ','ｼ','ｽ','ｾ','ｿ',
    'ﾀ','ﾁ','ﾂ','ﾃ','ﾄ',
    'ﾅ','ﾆ','ﾇ','ﾈ','ﾉ'
    ,'ﾊ','ﾋ','ﾌ','ﾍ','ﾎ'
    ,'ﾏ','ﾐ','ﾑ','ﾒ','ﾓ'
    ,'ﾔ','ﾕ','ﾖ'
    ,'ﾗ','ﾘ','ﾙ','ﾚ','ﾛ'
    ,'ﾜ','ｦ','ﾝ'
    ,'ｧ','ｨ','ｩ','ｪ','ｫ'
    ,'ｬ','ｭ','ｮ','ｯ'
    ,'､','｡','ｰ','｢','｣','ﾞ','ﾟ'
    ,'ｳﾞ','ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ'
    ,'ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ'
    ,'ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ'
    ,'ﾊﾞ','ﾋﾞ','ﾌﾞ','ﾍﾞ','ﾎﾞ'
    ,'ﾊﾟ','ﾋﾟ','ﾌﾟ','ﾍﾟ','ﾎﾟ'
    );
    var txt = new Array('ア','イ','ウ','エ','オ'
    ,'カ','キ','ク','ケ','コ'
    ,'サ','シ','ス','セ','ソ'
    ,'タ','チ','ツ','テ','ト'
    ,'ナ','ニ','ヌ','ネ','ノ'
    ,'ハ','ヒ','フ','ヘ','ホ'
    ,'マ','ミ','ム','メ','モ'
    ,'ヤ','ユ','ヨ'
    ,'ラ','リ','ル','レ','ロ'
    ,'ワ','ヲ','ン'
    ,'ァ','ィ','ゥ','ェ','ォ'
    ,'ャ','ュ','ョ','ッ'
    ,'、','。','ー','「','」','”',''
    ,'ヴ','ガ','ギ','グ','ゲ','ゴ'
    ,'ザ','ジ','ズ','ゼ','ゾ'
    ,'ダ','ヂ','ヅ','デ','ド'
    ,'バ','ビ','ブ','ベ','ボ'
    ,'パ','ピ','プ','ペ','ポ'
    );

    for (var i=0; i< value.length; i++){

      var c = "";
      c = beforeTextArr[i];

        if(c.match(/^[ｦ-ﾟ]*$/)){
          for(var j=0; j<han.length; j++){
            if(c == han[j].toString()){
              c = txt[j].toString();
            } 
          }
        }else if(c.match(/[A-Z a-z 0-9 !-~]/)){
          c = String.fromCharCode(c.charCodeAt(0)+0xFEE0);
        }
        else{}
      resultValue += c
    }
    this.inputment.propertyName = resultValue;
  }
  
}
