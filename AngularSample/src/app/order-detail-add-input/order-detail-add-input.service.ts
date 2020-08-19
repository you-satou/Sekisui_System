import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderDetailAddInputType } from './orderDetailAddInputType'

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
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof orderDetailAddInputService
   */
  public requestCloseModal(resVal:OrderDetailAddInputType) {
    this.setVal(resVal)
    this.closeEventSubject.next();
  }
}