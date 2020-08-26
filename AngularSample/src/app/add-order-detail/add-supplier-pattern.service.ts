import { SplitOrderDetailShiwake, SplitOrderDetailSplit, SplitOrderDetailInput } from './../split-detail-input/split-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AddSupplierPatternService {

  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();

  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();

  private _urlShiwake: string = "assets/data/splitDataShiwake.json";

  /**
   * コンストラクタ
   *
   * @memberof AddSupplierPatternService
   */
  constructor(
    private http: HttpClient
  ) { }

  private _val


  public getVal() {
    return this._val;
  }
  public setVal(val:SplitOrderDetailShiwake) {
    this._val = val;
  }

  getSplitOderDetailShiwake(): Observable<SplitOrderDetailShiwake[]> {

    return this.http.get<SplitOrderDetailShiwake[]>(this._urlShiwake);
  }

  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof AddSupplierPatternService
   */
  public requestCloseModal(resVal:SplitOrderDetailShiwake) {
    this.setVal(resVal)
    this.closeEventSubject.next();
  }
}