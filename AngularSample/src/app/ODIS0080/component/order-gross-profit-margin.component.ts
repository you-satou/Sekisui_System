import { ODIS0080TotalData } from './../entities/odis0080.entity';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    'riritsu',       // 粗利率
    'rousaiKin',      // 労災金額
    'koujiHi',        // 工事費
    'houseZai',       // ハウス材
    'unChin',         // 運賃
    'nizouHokan',     // 荷造保管
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
    'freightRates',
    'packingStorage',
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
    private changeDetector : ChangeDetectorRef,
  ) { }

  ngOnInit() {

    //ヘッダー設定
    this.appComponent.setHeader(Const.ScreenName.S0008, Const.LinKSetting.L0000 + Const.LinKSetting.L0002);
    //URLのパラメーターを消す
    history.replaceState({}, '', '#' + Const.UrlSetting.U0002);

    //詳細入力画面から遷移された時のパラメータを取得する
    this.actvRoute.queryParams.subscribe(params =>{
    
      this.initParam.propertyManagerCd = params.prop;    // 物件管理番号
      this.initParam.contractNum = params.cntr;          // 契約番号      
      this.initParam.officeCode = params.offCd;          // 事業所コード
    });

    this.isLoading = true;
    this.isInitFlg = false;
     
    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0008_Init,this.initParam)    
     .then(
       (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.totalData = response.applicationData;

           this.orderInfo = this.totalData.orderInfo;
           this.grossProfitData = this.totalData.grossProfitData;
         }else{
           //返却データがない場合、データテーブルを初期化にする。
           this.router.navigate([Const.UrlSetting.U0002]);
         }
       }
     )
     .finally(
       ()=>{
         //ロード中を解除する。
         this.isLoading = false;
         this.isInitFlg = true;

         this.changeDetector.detectChanges();
       }
     )
  }  

  /**
   * 発注明細入力＿詳細入力画面に戻る
   * @param $event 
   */
  backToPreviousPage($event){

    //画面遷移
    this.router.navigate([Const.UrlSetting.U0002]);
  }

}
