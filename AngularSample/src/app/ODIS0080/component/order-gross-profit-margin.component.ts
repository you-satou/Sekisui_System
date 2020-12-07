import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { CommonComponent } from 'app/common/common.component';
import { CommonService } from 'app/common/common.service';
import { Const } from 'app/common/const';
import { ODIS0080GrossProfitBean, ODIS0080InitParam } from '../entities/ODIS0080.entity';

@Component({
  selector: 'gross-profit-margin',
  templateUrl: './order-gross-profit-margin.component.html',
  styleUrls: ['./order-gross-profit-margin.component.css']
})
export class OrderGrossProfitMarginComponent implements OnInit {


  @Input() dataSource: ODIS0080GrossProfitBean[] = [new ODIS0080GrossProfitBean()];

  /** テーブルの全カラム */
  mainColumns:string[] = [
    'keiyakuNo',      // 契約
    'keiyakuKeitai',  // 受注形態
    'edaBan',         // 枝番
    'keiyakuYmd',     // 契約日
    'keiyakuKin',     // 契約金額
    'hachuuKin',      // 発注金額
    'shiritsu',       // 粗利率
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

  isGetting = false;
  isInitFlg = false;


  constructor(
    private appComponent: AppComponent,
    private orderService: CommonService,
    private router: Router,
    private baseCompnt: CommonComponent,
    private actvRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.isGetting = true;
    //TODO: init Param設定
    this.initParam.officeCode = "402000";
    this.initParam.contractNum = "504660066";
    this.initParam.propertyManagerCd = "60256";

     
    this.orderService.getAuthorizationSearch(Const.UrlLinkName.S0008_Init,this.initParam)    
     .then(
       (response) => {
         if(response.result === Const.ConnectResult.R0001){
           this.dataSource = response.applicationData;
         }else{
           //返却データがない場合、データテーブルを初期化にする。
           this.dataSource = [];
         }
         //ロード中を解除する。
         this.isGetting = false;
         this.isInitFlg = true;
       }
     );
  }  

  backToPreviousPage($event){

    this.router.navigate(['']);
  }

}
