import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PatternType,SupplierPatternType,SupplierType } from '../entities/odis0050.entity';

@Injectable({
    providedIn: 'root'
  })
  
export class SupplierPatternService {
  
  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();
  
  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();
  
  /**
   * コンストラクタ
   *
   * @memberof SupplierPatternService
   */
  constructor() { }

  private _val


  public getVal() {
    return this._val;
  }
  public setVal(val:SupplierPatternType) {
    this._val = val;
  }



  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof SupplierPatternService
   */
  public requestCloseModal(resVal: SupplierPatternType) {
    this.setVal(resVal);
    this.closeEventSubject.next();
  }
}