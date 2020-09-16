import { OrderSplitApprovalMasterTable  } from '../entities/odis0070.entity';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
/**
 * 発注分割承認者マスタからパラメータを受け取り専用
 */
export class OrderSplitApprovalMasterService {

    //TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    // データの変更を通知するためのオブジェクト
    private closeEventSubject = new Subject<string>();

    // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
    public closeEventObservable$ = this.closeEventSubject.asObservable();

    //発注分割承認者マスタテーブルのモッキングデータ
    private _url: string = "assets/data/dataSplitApproval.json";

    constructor(
        private http: HttpClient
    ) { }

    /**
   * 発注分割承認者マスタデータの取得
   */
    getOrderSplitApproval(): Observable<OrderSplitApprovalMasterTable[]> {

        return this.http.get<OrderSplitApprovalMasterTable[]>(this._url);
    }
}