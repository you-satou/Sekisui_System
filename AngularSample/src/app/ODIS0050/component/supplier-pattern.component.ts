import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from './../../wk-all-item-types.service'
import { WkAllItemType } from './../../WkAllItemType';
import { Router } from '@angular/router';
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

export class SupplierPatternComponent implements OnInit {

  title = "発注明細入力_発注先パターン選択";

  // Todo
  pDatas: PatternList[];
  sDatas: SupplierList[];
  resVal: SupplierPatternList;
  Datas: ODIS0050SupplierPatternTotalInfo[];

  // url
  _patternList: string = "assets/data/odis0050-PatternName.json";
  _supplierList: string = "assets/data/odis0050-SupplierName.json";


  
  constructor(
    private modalService: SupplierPatternService,
    private commonComponent: CommonComponent,
    private orderService: CommonService,
  ){}

  ngOnInit() {

    this.getOrderInputData();

  }

  ngOnDestroy() {

  }

  public onClick($event) {
    this.notifyCloseModal();
  }

  private notifyCloseModal() {
    this.modalService.requestCloseModal(this.resVal);
  }

  /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem){
    // テーブル 背景色 クリア
    var wTbody = $event.target.parentElement.parentElement;

    this.commonComponent.CommonOnSelHight($event);

    // 要素取得
    var wTr = $event.target.parentElement;

    var wData: SupplierList[] =[
      {
        journalCode: "0200"
        ,accountingCategory:"020"
        ,journalName: "基礎工事"
        ,supplierCode: "803"
        ,supplierName: "積水建設㈱"
      },
      {
        journalCode: "0205"
        ,accountingCategory:"020"
        ,journalName: "安全誘導員"
        ,supplierCode: "803"
        ,supplierName: "積水建設㈱"
      }
    ]
    this.sDatas = wData;

  }
  /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelSelect($event, selectedItem){
    // テーブル 背景色 クリア
    var wTbody = $event.target.parentElement.parentElement;

    this.commonComponent.CommonOnSelHight($event);

    // 要素取得
    var wTr = $event.target.parentElement;

  }

  getOrderInputData(){

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
      }
    });


  }
}