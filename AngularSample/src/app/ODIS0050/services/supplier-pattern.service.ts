import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SupplierPatternList } from'../entities/odis0050-SuppierPattern.entity'

@Injectable({
    providedIn: 'root'
  })

/**
 * 発注明細入力_発注先パターン選択サービス
 */
export class SupplierPatternService {
  
  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<any>();
  
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
  //戻り値をセット
  public setVal(val:SupplierPatternList[]) {
    this._val = val;
  }

  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof SupplierPatternService
   */
  public requestCloseModal(resVal: SupplierPatternList[]) {
    this.setVal(resVal);
    this.closeEventSubject.next();
  }
}