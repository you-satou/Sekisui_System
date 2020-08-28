import { SplitOrderDetailShiwake, AddOrderDetail } from '../split-detail-input/split-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AddSupplierPatternService {

  constructor(
    private http: HttpClient
  ) { }


  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();

  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();

  private _urlShiwake: string = "assets/data/splitDataShiwake.json";

  private _val


  public getVal() {
    return this._val;
  }
  public setVal(val:AddOrderDetail) {
    this._val = val;
  }

  getSplitOderDetailShiwake(): Observable<SplitOrderDetailShiwake[]> {

    return this.http.get<SplitOrderDetailShiwake[]>(this._urlShiwake);
  }
}