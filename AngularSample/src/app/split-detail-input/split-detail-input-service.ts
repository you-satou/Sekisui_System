import { SplitOrderDetailShiwake, SplitOrderDetailSplit, SplitOrderDetailInput } from './split-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject  } from 'rxjs';
import { AddOrderDetail } from './split-detail-input-interface';

@Injectable()
export class SplitOrderDetailService {

    //TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    // データの変更を通知するためのオブジェクト
    private closeEventSubject = new Subject<string>();

    // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
    public closeEventObservable$ = this.closeEventSubject.asObservable();

    private _urlShiwake: string = "assets/data/splitDataShiwake.json";
    private _urlSplitOrder: string = "assets/data/dataSplitOrder.json";
    private _urlOrderInput: string = "assets/data/dataOrderInput.json";
    
    /**
     * コンストラクタ
     *
     * @memberof OrderJournalSelectService
     */
    constructor(
        private http: HttpClient
    ) { }

    private _val1

    public getVal1() {
        return this._val1;
    }
    public setVal1(val1: string) {
        this._val1 = val1;

    }

    private _val2


  public getVal2() {
    return this._val2;
  }
  public setVal2(val2:string) {
    this._val2 = val2;
  }

  private _val3


  public getVal3() {
    return this._val3;
  }
  public setVal3(val3:string) {
    this._val3 = val3;
  }

  private _val4


  public getVal4() {
    return this._val4;
  }
  public setVal4(val4:string) {
    this._val4 = val4;
  }

    getSplitOderDetailShiwake(): Observable<SplitOrderDetailShiwake[]> {

        return this.http.get<SplitOrderDetailShiwake[]>(this._urlShiwake);
    }

    getSplitOrderInputData(): Observable<SplitOrderDetailInput[]> {

        return this.http.get<SplitOrderDetailInput[]>(this._urlOrderInput);
    }

    getSplitOrderDetailSplit(): Observable<SplitOrderDetailSplit[]> {

        return this.http.get<SplitOrderDetailSplit[]>(this._urlSplitOrder);
    }

    private message = new BehaviorSubject(String);
    sharedMessage = this.message.asObservable();

}