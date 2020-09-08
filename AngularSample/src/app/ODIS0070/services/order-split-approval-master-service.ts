import { OrderSplitApprovalMasterTable  } from '../entities/odis0070.entity';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class OrderSplitApprovalMasterService {

    //TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    // データの変更を通知するためのオブジェクト
    private closeEventSubject = new Subject<string>();

    // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
    public closeEventObservable$ = this.closeEventSubject.asObservable();

    private _url: string = "assets/data/dataSplitApproval.json";

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

    getOrderSplitApproval(): Observable<OrderSplitApprovalMasterTable[]> {

        return this.http.get<OrderSplitApprovalMasterTable[]>(this._url);
    }
}