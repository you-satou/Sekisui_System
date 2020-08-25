import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderSupplierSelectType } from './orderSupplierSelectType'

@Injectable({
    providedIn: 'root'
  })
  
export class OrderSupplierSelectService {

  
  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();
  
  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();
  /**
   * コンストラクタ
   *
   * @memberof OrderSupplierSelectService
   */
  constructor() { }

  private _val


  public getVal() {
    return this._val;
  }
  public setVal(val:OrderSupplierSelectType) {
    this._val = val;
  }


  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof OrderSupplierSelectService
   */
  public requestCloseModal(resVal:OrderSupplierSelectType) {
    this.setVal(resVal)
    this.closeEventSubject.next();
  }
}