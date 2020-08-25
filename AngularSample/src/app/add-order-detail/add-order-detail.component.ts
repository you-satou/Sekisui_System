import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { AddSupplierPatternService } from './add-supplier-pattern.service';
import { AddPatternType } from './supplierPatternType';
import { AddSupplierType } from './supplierPatternType';
import { pTestdata } from './test-data'
import { sTestdata } from './test-data'

@Component({
    selector: 'supplier-pattern',
    templateUrl: './add-order-detail.component.html',
    styleUrls: ['../common/common.component.css',
                './add-order-detail.component.css']
  })

export class AddOrderDetailComponent implements OnInit {


  // Todo
  pDatas: AddPatternType[] = pTestdata;
  sDatas: AddSupplierType[] = sTestdata;
  constructor(
    private modalService: AddSupplierPatternService
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
    var wData: AddSupplierType[] =[
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