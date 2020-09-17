import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  
export class IndexService {

  
  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();
  
  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();
  /**
   * コンストラクタ
   *
   * @memberof String
   */
  constructor() { }

  private _frmUrl


  public getVal() {
    return this._frmUrl;
  }
  public setVal(val:String) {
    this._frmUrl = val;

  }

}