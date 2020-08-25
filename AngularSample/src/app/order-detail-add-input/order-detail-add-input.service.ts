import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderDetailAddInputType } from './orderDetailAddInputType'
import { OrderJournalSelectType } from '../order-journal-select/orderJournalSelectType';
import { OrderSupplierSelectType } from '../order-supplier-select/orderSupplierSelectType';

@Injectable({
    providedIn: 'root'
  })
  
export class OrderDetailAddInputService {

  
  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();
  
  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();
  /**
   * コンストラクタ
   *
   * @memberof orderDetailAddInputService
   */
  constructor() { }

  private _val

  public getVal() {
    return this._val;
  }
  public setVal(val:OrderDetailAddInputType) {
    this._val = val;
  }
      /**
   * コンストラクタ
   *
   * @memberof OrderSupplierSelectService
   */

  private _val2


  public getVal2() {
    return this._val2;
  }
  public setVal2(val:OrderJournalSelectType) {
    this._val = val;
  }

    /**
   * コンストラクタ
   *
   * @memberof OrderSupplierSelectService
   */

  private _val3


  public getVal3() {
    return this._val3;
  }
  public setVal3(val:OrderSupplierSelectType) {
    this._val = val;
  }




  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof orderDetailAddInputService
   */
  public requestCloseModal(resVal:OrderDetailAddInputType) {
    this.setVal(resVal)
    this.closeEventSubject.next();
  }

      /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof OrderJournalSelectService
   */
  public requestCloseModal2(resVal2:OrderJournalSelectType) {
    this.setVal2(resVal2)
    this.closeEventSubject.next();
  }

    /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof OrderSupplierSelectService
   */
  public requestCloseModal3(resVal3:OrderSupplierSelectType) {
    this.setVal3(resVal3)
    this.closeEventSubject.next();
  }
}