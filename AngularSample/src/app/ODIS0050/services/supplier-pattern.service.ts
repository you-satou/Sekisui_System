import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PatternList } from '../entities/odis0050-PatternList.entity'
import { SupplierPatternList } from'../entities/odis0050-SuppierPattern.entity'
import { SupplierList } from '../entities/odis0050-SupplierList.entity'

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
  public setVal(val:SupplierPatternList) {
    this._val = val;
  }

  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof SupplierPatternService
   */
  public requestCloseModal(resVal: SupplierPatternList) {
    this.setVal(resVal);
    this.closeEventSubject.next();
  }
}