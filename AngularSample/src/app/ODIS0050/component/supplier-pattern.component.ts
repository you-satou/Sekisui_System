import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from './../../wk-all-item-types.service'
import { WkAllItemType } from './../../WkAllItemType';
import { Router } from '@angular/router';
import { SupplierPatternService } from '../services/supplier-pattern.service';
import { PatternType,SupplierPatternType,SupplierType } from '../entities/odis0050.entity';
import { pTestdata,sTestdata } from '../test-data'
import { CommonComponent } from '../../common/common.component'

@Component({
    selector: 'supplier-pattern',
    templateUrl: './supplier-pattern.component.html',
    styleUrls: ['./../../common/common.component.css',
                './supplier-pattern.component.css']
  })

export class SupplierPatternComponent implements OnInit {

  title = "発注明細入力_発注先パターン選択";

  // Todo
  pDatas: PatternType[] = pTestdata;
  sDatas: SupplierType[] = sTestdata;
  resVal: SupplierPatternType;
  
  constructor(
    private modalService: SupplierPatternService,
    private commonComponent: CommonComponent,

  ){}
  ngOnInit() {}
  ngOnDestroy() {
    // モーダルダイアログが閉じたタイミングで出力される
    console.log('destroyed');
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

    // 背景色 変更
    for(var i=0; i<wTr.cells.length; i++){
      var wTd = wTr.cells[i];
      wTd.style.backgroundColor = '#CCFFFF';
    }
    var wData: SupplierType[] =[
      {
        journalCode: "0200"
        ,accountingCategory:"020"
        ,journalName: "基礎工事"
        ,supplierCode: "803"
        ,supplierName: "積水建設㈱"
      }
    ]
    this.sDatas = wData;

  }
}