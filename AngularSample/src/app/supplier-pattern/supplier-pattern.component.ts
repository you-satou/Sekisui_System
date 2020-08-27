import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { SupplierPatternService } from './supplier-pattern.service';
import { PatternType } from './supplierPatternType';
import { SupplierType } from './supplierPatternType';
import { pTestdata } from './test-data'
import { sTestdata } from './test-data'

@Component({
    selector: 'supplier-pattern',
    templateUrl: './supplier-pattern.component.html',
    styleUrls: ['../common/common.component.css',
                './supplier-pattern.component.css']
  })

export class SupplierPatternComponent implements OnInit {

  title = "発注先パターン選択";

   // Todo
  pDatas: PatternType[] = pTestdata;
  sDatas: SupplierType[] = sTestdata;
  constructor(
    private modalService: SupplierPatternService
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
    this.modalService.requestCloseModal();
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
    for(var i=0; i<wTbody.rows.length; i++){
      // 行 取得
      var wTr = wTbody.rows[i];
      for(var j=0; j<wTr.cells.length; j++){
        // セル クリア
        var wTd = wTr.cells[j];
        wTd.style.backgroundColor = '';
      }
    }

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