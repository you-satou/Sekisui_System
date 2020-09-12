import { Component, OnInit } from '@angular/core';
import { SupplierPatternService } from '../services/supplier-pattern.service';
import { PatternList } from '.././entities/odis0050-PatternList.entity'
import { SupplierPatternList } from'.././entities/odis0050-SuppierPattern.entity'
import { SupplierList } from '.././entities/odis0050-SupplierList.entity'
import { CommonComponent } from '../../common/common.component'
import { CommonService } from '../../common/common.service';
import { ODIS0050SupplierPatternTotalInfo } from'.././entities/odis0050-Form.entity'

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

  //画面表示データ（パターン名）
  pDatas: PatternList[];
  //画面表示データ（仕訳コードテーブル）
  sDatas: SupplierList[];
  //sDatas初期画面表示データを格納
  fDatas: SupplierList[];
  //戻り値
  resVal: SupplierPatternList[];
  //画面表示データフォーム
  Datas: ODIS0050SupplierPatternTotalInfo[];
  
  //選択されたパターン
  selectPattern:string;

  // JSONファイル
  _patternList: string = "assets/data/odis0050-PatternName.json";
  _supplierList: string = "assets/data/odis0050-SupplierName.json";

    /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */  
  constructor(
    private modalService: SupplierPatternService,
    private commonComponent: CommonComponent,
    private orderService: CommonService,
  ){}

  //初期処理
  ngOnInit() {

    this.getInputData();

  }

  ngOnDestroy() {}

  //閉じるボタン
  public onClick($event) {
    this.notifyCloseModal();
  }

  private notifyCloseModal() {
    this.resVal = this.sDatas;
    this.modalService.requestCloseModal(this.resVal);
  }

  /**
   * テーブル クリック 選択背景 設定
   * 選択されたパターン名の仕訳データを表示する
   * @param $event イベント
   */
  public onSelHighLight($event){

    this.commonComponent.CommonOnSelHight($event);

    this.selectPattern = $event.target.textContent;

    let wDatas: SupplierList[] = new Array();

    for (let fdata of this.fDatas){

      if(this.selectPattern == fdata.pattern){

        wDatas.push(fdata);
      }
    }
    //選択されたパターン名の仕訳データを格納
    this.sDatas = wDatas;
  }

  getInputData(){

    this.orderService.getSingleData(this._patternList)
    .subscribe(
      data => {
        if (data !== undefined) {
          this.pDatas = data;
      }
    });

    this.orderService.getSingleData(this._supplierList)
    .subscribe(
      data => {
        if (data !== undefined) {
          this.sDatas = data;
          this.fDatas = data;
      }
    });

  }
}