import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { eventNames } from 'process';
import { AppComponent } from '../app.component'
import { Const } from './const';

export class CommonComponent{

  /**
   * コンストラクタ
   * @param appComponent 
   */
  constructor(
    // private appComponent: AppComponent,
  ){}

  public CommonOnSelHight(event:any){

    // テーブル 背景色 クリア
    var wTbody = event.target.parentElement.parentElement;
    for(var i=0; i<wTbody.rows.length; i++){
      // 行 取得
      var wTr = wTbody.rows[i];
      for(var j=0; j<wTr.cells.length; j++){
        // セル クリア
        var wTd = wTr.cells[j];
        wTd.style.backgroundColor = Const.HighLightColour.None;
      }
    }

    // 要素取得
    var wTr = event.target.parentElement;

    // 背景色 変更
    for(var i=0; i<wTr.cells.length; i++){
      var wTd = wTr.cells[i];
      wTd.style.backgroundColor = Const.HighLightColour.Selected;
    }
  }
}