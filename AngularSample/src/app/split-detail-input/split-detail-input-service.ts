import { SplitOrderDetailShiwake, SplitOrderDetailSplit, SplitOrderDetailInput } from './split-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddOrderDetail } from './split-detail-input-interface'

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

    private _val

    public getVal() {
        return this._val;
    }
    public setVal(val: AddOrderDetail) {
        this._val = val;

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
}