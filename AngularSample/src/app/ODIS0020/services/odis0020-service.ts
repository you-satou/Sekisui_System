import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ODIS0020AddOrderDetail } from '../entities/odis0020-AddDetailForm.entity';
import { ODIS0020OrderDetaiSplitBean } from '../entities/odis0020-OrderDetailSplit.entity'

@Injectable({
    providedIn: 'root'
  })
/**
 * 発注明細入力発注明細入力_詳細入力サービス
 */
export class ODIS0020Service {

  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();

  /**
  * コンストラクタ
  *
  * @memberof ODIS0020Service
  */

  private _tableData: ODIS0020OrderDetaiSplitBean[] = [];

  /**
   * 分割明細画面から渡されたパラメータを返す
   */
  get ReturnedSplitData(){
    if(this._tableData.length <= 0){
      return [];
    }
    return this._tableData;
  }

  constructor() { }

  private _val;


  public getVal() {
    return this._val;
  }

  /**
   * 金額差が合わない場合「True」を返す
   */
  isDeferenceAmount: boolean;

  /**
  * フォーカス対象の値をセット
  */
  public setVal(val:ODIS0020AddOrderDetail) {
    this._val = val;
  }

  setReturnSplitData(data: ODIS0020OrderDetaiSplitBean[]){
    this._tableData = data;
  }

  clearReturn(){
    this._tableData = null;
  }

}