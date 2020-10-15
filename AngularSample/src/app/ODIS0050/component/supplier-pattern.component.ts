import { Component, OnInit } from '@angular/core';
import { SupplierPatternService } from '../services/supplier-pattern.service';
import { PatternList } from '.././entities/odis0050-PatternList.entity'
import { SupplierPatternList } from '.././entities/odis0050-SuppierPattern.entity'
import { SupplierList } from '.././entities/odis0050-SupplierList.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { ODIS0050Form } from '.././entities/odis0050-Form.entity';
import { Const } from '../../common/const';

@Component({
  selector: 'supplier-pattern',
  templateUrl: './supplier-pattern.component.html',
  styleUrls: ['./../../common/common.component.css',
    './supplier-pattern.component.css']
})

/**
 * 発注明細入力_発注先パターン選択コンポーネント
 */
export class SupplierPatternComponent implements OnInit {

  //タイトル
  title = "発注明細入力_発注先パターン選択";

  // データ取得
  datas: SupplierPatternList[]


  //画面表示データ（パターン名）
  pDatas: PatternList[];
  //画面表示データ（仕訳コードテーブル）
  sDatas: SupplierList[];
  //sDatas初期画面表示データを格納
  fDatas: SupplierList[];
  //戻り値
  resVal: SupplierList[];
  // パラメータ
  param = new ODIS0050Form();

  //選択されたパターン
  selectPattern:string;

  //エラーメッセージ
  errormsg: string = "";

  // ローディング 判定
  isLoading: boolean = true;

  /**
  *コンストラクタ
  *
  * @param {ModalService} modalService
  * @memberof ModalComponent
  */
  constructor(
    private modalService: SupplierPatternService,
    private commonComponent: CommonComponent,
    private orderService: CommonService,
  ) { }

  /**
   * 初期処理
   */
  ngOnInit() {

    this.getInputData();

    //this.mockingData();

  }

  mockingData() {
    // url
    let _patternList: string = "assets/data/odis0050-PatternName.json";
    let _supplierList: string = "assets/data/odis0050-SupplierName.json";

    this.orderService.getSingleData(_patternList)
      .subscribe(
        data => {
          if (data !== undefined) {
            this.pDatas = data;
          }
        });

    this.orderService.getSingleData(_supplierList)
      .subscribe(
        data => {
          if (data !== undefined) {
            this.fDatas = data;
          }
        });


  }
  /**
   * 終了時
   */
  ngOnDestroy() { }
  /**
   * 閉じるボタン
   */
  public onCloseClick() {
    this.modalService.requestCloseModal();
  }

  /**
  * 選択ボタン
  */
  public onChooseClick($event) {

    this.resVal = this.sDatas;
    
    if (this.resVal == undefined || this.resVal == null) {
      this.errormsg = Const.ErrorMsg.E0008;
      $event.stopPropagation();
    }
    else {

      this.modalService.requestChooseVal(this.resVal);
    }
  }

  /**
   * テーブル クリック 選択背景 設定
   * 選択されたパターン名の仕訳データを表示する
   * @param $event イベント
   */
  public onSelHighLight($event, data: SupplierPatternList){

    this.commonComponent.CommonOnSelHight($event);

    //選択されたパターン名の仕訳データを格納
    this.sDatas = data.supplierList;
  }

  /**
  * JSONファイルをdatasに格納
  */
  getInputData(){
    // Todo　システムログイン情報から取得すること！
    // 事業区分コード設定
    this.param.officeCode = '827007';

    // 発注仕訳マスタ取得
    this.orderService.getSearchRequest(Const.UrlLinkName.S0005_Init,this.param)
      .then(
      (response) => {

        if(response.result === Const.ConnectResult.R0001){
          this.datas = response.applicationData;
        }else{
          alert(response.message);
        }

        //ロード画面を解除する。
        this.isLoading = false;
      }
    );
  }
}