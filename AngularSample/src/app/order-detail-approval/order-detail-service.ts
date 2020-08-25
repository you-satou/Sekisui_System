import { OrderDetailShiwake, OrderDetailSplit, OrderDetailInput, OrderTABLE1} from './../order-detail-input/order-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetail } from './order-detail-approval-interface';
import { Observable } from 'rxjs';

@Injectable()
export class OrderDetailApprovalService {

    // TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    private url = 'assets/data/data.json';
    private urlShiwake = 'assets/data/dataShiwake.json';
    private urlSplit = 'assets/data/dataSplit.json';
    private urlOrderInput = 'assets/data/dataOrderInput.json';
    private urlOrderTBL1 = 'assets/data/dataInputTBL1.json';
    private urlOrderTBL2 = 'assets/data/dataInputTBL2.json';

    constructor(
        private http: HttpClient
    ) {}



    getOrderDetail(): Observable<OrderDetail[]> {
        return this.http.get<OrderDetail[]>(this.url);
    }

    getOderDetailShiwake(): Observable<OrderDetailShiwake[]> {
        return this.http.get<OrderDetailShiwake[]>(this.urlShiwake);
    }

    getOderDetailSplit(): Observable<OrderDetailSplit[]> {
        return this.http.get<OrderDetailSplit[]>(this.urlSplit);
    }

    getOrderInputData(): Observable<OrderDetailInput[]> {
        return this.http.get<OrderDetailInput[]>(this.urlOrderInput);
    }
    

    getOrderInputTBL1(): Observable<OrderTABLE1[]> {
        return this.http.get<OrderTABLE1[]>(this.urlOrderTBL1);
    }

    getOrderInputTBL2(): Observable<OrderTABLE1[]> {
        return this.http.get<OrderTABLE1[]>(this.urlOrderTBL2);
    }

}
