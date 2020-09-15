import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ODIS0020AddOrderDetail } from '../entities/odis0020-AddDetailForm.entity'

@Injectable({
    providedIn: 'root'
  })
/**
 * 発注明細入力発注明細入力_詳細入力サービス
 */
export class Odis0020Service {

  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();

    /**
   * コンストラクタ
   *
   * @memberof Odis0020Service
   */
  constructor() { }

  private _val

  
  public getVal() {
    return this._val;
  }

  //戻り値をセット
  public setVal(val:ODIS0020AddOrderDetail) {
    this._val = val;
  }


}