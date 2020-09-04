import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../../wk-all-item-types.service';
import { WkAllItemType } from '../../WkAllItemType';
import { Router } from '@angular/router';
import { SupplierPatternService } from '../services/supplier-pattern.service';
import { PatternType } from '../entities/odis0050.entity';
import { SupplierType } from '../entities/odis0050.entity';
import { pTestdata, sTestdata } from '../test-data';
import { CommonComponent } from '../../common/common.component'
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'

@Component({
    selector: 'supplier-pattern',
    templateUrl: './supplier-pattern.component.html',
    styleUrls: ['../../common/common.component.css',
                './supplier-pattern.component.css']
  })

export class SupplierPatternComponent implements OnInit {

  title = "発注先パターン選択";

   // Todo
  pDatas: PatternType[] = pTestdata;
  sDatas: SupplierType[] = sTestdata;
  constructor(
    private modalService: SupplierPatternService,
    private appComponent: AppComponent,
  ){}


  ngOnInit() {

    this.appComponent.setHeader(Const.ScreenName.S0003,Const.LinKSetting.L0003);

  }
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