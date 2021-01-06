import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SupplierList } from'../entities/odis0050-SupplierList.entity'

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

  private _val: SupplierList[] = [];


  public getVal() {
    return this._val;
  }
  /**
  * 戻り値をセット
  */
  public setVal(val:SupplierList[]) {
    this._val = val;
  }

  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof SupplierPatternService
   */
  /**
  * 戻り値をセットしてモーダルを閉じる
  */
  public requestChooseVal(resVal: SupplierList[]) {
    this.setVal(resVal);
    this.closeEventSubject.next();
  }
  /**
  * モーダルを閉じる
  */
  public requestCloseModal() {
   //閉じるボタンの押下後、戻り値を初期化する
   this.setVal(null);
   this.closeEventSubject.next();
  }

  //物件管理ＮＯ
  private _propertyNo: string = '';

  /**
  * 物件管理ＮＯの戻り値をセット
  * @param val 物件管理ＮＯ
  */
  public setPropertyNo(val: string) {
    this._propertyNo = val;
  }

  /**
  * 物件管理ＮＯの戻り値を返す
  */
  public getPropertyNo() {
    return this._propertyNo;
  }
 
}