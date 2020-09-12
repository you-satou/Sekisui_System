import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderJournalSelectType } from '../entities/odis0030.entity'

@Injectable({
    providedIn: 'root'
  })
  
/**
 * 発注仕訳マスタ選択サービス
 */
export class OrderJournalSelectService {

  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();
  
  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();

  /**
   * コンストラクタ
   *
   * @memberof OrderJournalSelectService
   */
  constructor() { }

  private _val

  public getVal() {
    return this._val;
  }

  //戻り値をセット
  public setVal(val:OrderJournalSelectType) {
    this._val = val;
  }

  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof OrderJournalSelectService
   */
  public requestCloseModal(resVal:OrderJournalSelectType) {
    this.setVal(resVal)
    this.closeEventSubject.next();
  }

}