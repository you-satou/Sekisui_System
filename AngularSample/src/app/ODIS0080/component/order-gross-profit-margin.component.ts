import { ODIS0080Session } from './../entities/odis0080.session.entity';
import { ODIS0080TotalData } from './../entities/odis0080.entity';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { CommonComponent } from 'app/common/common.component';
import { CommonService } from 'app/common/common.service';
import { Const } from 'app/common/const';
import { ODIS0080InitParam } from '../entities/odis0080.form.entity';
import { ODIS0080GrossProfitBean } from '../entities/odis0080.GrossProfit.entity';
import { ODIS0080OrderInfoBean } from '../entities/odis0080.OrderInfo.entity';

@Component({
  selector: 'gross-profit-margin',
  templateUrl: './order-gross-profit-margin.component.html',
  styleUrls: ['./order-gross-profit-margin.component.css']
})
export class OrderGrossProfitMarginComponent implements OnInit {

  totalData: ODIS0080TotalData;
  grossProfitData: ODIS0080GrossProfitBean[] = [new ODIS0080GrossProfitBean()];
  orderInfo: ODIS0080OrderInfoBean = new ODIS0080OrderInfoBean();
  /** テーブルの全カラム */
  mainColumns:string[] = [
    'keiyakuNo',      // 契約
    'keiyakuKeitai',  // 受注形態
    'edaBan',         // 枝番
    'keiyakuYmd',     // 契約日
    'keiyakuKin',     // 契約金額
    'hachuuKin',      // 発注金額
    'riritsu',        // 粗利率
    'rousaiKin',      // 労災金額
    'koujiHi',        // 工事費
    'houseZai',       // ハウス材
    'unChin',         // 運賃
    'niTsukuri',      // 荷造り
  ];
  /** テーブルの全カラム */
  totalColumns:string[] = [
    'contractNo',
    'contractKind',
    'branch01',
    'branch02',
    'contractDate',
    'contractAmount',
    'orderAmount',  
    'grossProfit',
    'accidentAmount',
    'constructionCost',
    'houseMaterial',
    'transCost',
    'packingAmount'
  ];

  initParam:ODIS0080InitParam = new ODIS0080InitParam();
  isLoading = false;
  isInitFlg = false;

  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private router: Router,
    private baseCompnt: CommonComponent,
    private actvRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    //ヘッダー設定
    this.appComponent.setHeader(Const.ScreenName.S0008, Const.LinKSetting.L0000 + Const.LinKSetting.L0008);
    //URLのパラメーターを消す
    history.replaceState({}, '', '#' + Const.UrlSetting.U0008);

    this.isInitFlg = false;

    //セッションにデータがあるかどうか
    if(sessionStorage.getItem(Const.ScreenName.S0008EN) != null){

      let savedDt = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0008EN));
      this.orderInfo = savedDt.orderInfoData;
      this.grossProfitData = savedDt.grossProfitListData;
      
      // 画面をレンダーする
      this.isInitFlg = true;
      
    }
    else{ 
      //初期表示
      this.setDisplayData();
  　 }
  }  

  /**
   * 粗利率のデータを取得する
   */
  private setDisplayData(){

    //詳細入力画面から遷移された時のパラメータを取得する
    this.actvRoute.queryParams.subscribe(params =>{
    
      this.initParam.propertyNo = params.prop;    // 物件管理番号
      this.initParam.contractNum = params.cntr;   // 契約番号   
      this.initParam.officeCode = params.offCd;   // 事業所コード
    });

    this.isLoading = true;
     
    //サーバーに接続し、データを取得する
    this.orderService.getSearchRequest(Const.UrlLinkName.S0008_Init, this.initParam)    
     .then(
       (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.totalData = response.applicationData;

           this.orderInfo = this.totalData.orderInfoData;
           this.grossProfitData = this.totalData.grossProfitListData;

           this.saveDataToSession();
         }else{
           //返却データがない場合、詳細入力画面に戻る。
           alert(response.message);
           this.router.navigate([Const.UrlSetting.U0002]);
         }
       }
     )
     .finally(
       ()=>{
         //ロード中を解除する。
         this.isLoading = false;
         this.isInitFlg = true;

       }
     )
  }

  /**
   * 一時的なデータをセッションに保持する
   */
  private saveDataToSession(){

    let saveDt = new ODIS0080Session();
    saveDt.orderInfoData = this.orderInfo;
    saveDt.grossProfitListData = this.grossProfitData;

    sessionStorage.setItem(Const.ScreenName.S0008EN, JSON.stringify(saveDt));
  }

  /**
   * 発注明細入力＿詳細入力画面に戻る
   * @param $event 
   */
  public backToPreviousPage($event){

    if (sessionStorage.getItem(Const.ScreenName.S0008EN) != null){
      //発注詳細入力画面に戻る前に、セッションを削除する
      sessionStorage.removeItem(Const.ScreenName.S0008EN);
    }
    //画面遷移
    this.router.navigate([Const.UrlSetting.U0002]);
  }

  /**
   * 各明細の粗利率を計算する
   * @param element 各明細のデータ 
   */
  public getGrossProfit(element: ODIS0080GrossProfitBean) {
    let grossProfit = '0';
    if (this.baseCompnt.setValue(element.grossProfit) != '') {
      grossProfit = (Number(element.grossProfit) / 100).toString();
    }
    return grossProfit;
  }

  /**
   * 合計の契約金額を計算する
   */
  public getTotalContractAmount() {
    if (this.baseCompnt.setValue(this.grossProfitData).length != 0) {
      return this.grossProfitData
        .map((t) => {
          if (this.baseCompnt.setValue(t.contractAmount) != '') {
            return Number(t.contractAmount);
          }else{ return 0}
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   * 合計の発注金額を計算する
   */
  public getTotalOrderAmount() {
    if (this.baseCompnt.setValue(this.grossProfitData).length != 0) {
      return this.grossProfitData
        .map((t) => {
          if (this.baseCompnt.setValue(t.orderAmount) != '') {
            return Number(t.orderAmount);
          }else{ return 0}
        })
        .reduce((acc, value) => acc + value, 0);
    }
  }

  /**
   * 金額が０の場合、空白で表示する
   * @param val 戻り値
   */
  public setValue(val: any) {
    if (this.baseCompnt.setValue(val) == '0') {
      return '';
    }
    else{
      return val;
    }
  }

  /**
   * 合計の粗利率を計算する
   */
  public getTotalGrossProfit() {
    let totalContractAmount = this.getTotalContractAmount();
    let totalOrderAmount = this.getTotalOrderAmount();
    let totalGrossProfit = '0';
    if(this.baseCompnt.setValue(totalContractAmount) == '') {
      return;
    }
    if (totalContractAmount != 0) {
      totalGrossProfit = ((totalContractAmount - totalOrderAmount) / totalContractAmount).toString();
    }
    return totalGrossProfit;
  }

}
