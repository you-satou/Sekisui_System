import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OrderDetailInputGeneral } from 'app/order-detail-input/order-detail-input-interface';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { eventNames } from 'process';

export class CommonComponent{

  public CommonOnSelHight(event:any){

        // テーブル 背景色 クリア
        var wTbody = event.target.parentElement.parentElement;
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
        var wTr = event.target.parentElement;
    
        // 背景色 変更
        for(var i=0; i<wTr.cells.length; i++){
          var wTd = wTr.cells[i];
          wTd.style.backgroundColor = '#CCFFFF';
        }
  }
}
