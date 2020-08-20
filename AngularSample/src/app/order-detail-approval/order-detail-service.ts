import { OrderDetailShiwake, OrderDetailSplit, OrderDetailInput} from './../order-detail-input/order-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetail } from './orderDetail';
import { Observable } from 'rxjs';

@Injectable()
export class OrderDetailApprovalService{

    //TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    private _url: string = "assets/data/data.json";
    private _urlShiwake: string = "assets/data/dataShiwake.json";
    private _urlSplit: string = "assets/data/dataSplit.json";
    private _urlOrderInput: string = "assets/data/dataOrderInput.json";
    constructor (
        private http: HttpClient
    ){}


    getOrderDetail(): Observable<OrderDetail[]>{
        
        
        return this.http.get<OrderDetail[]>(this._url);
    }

    getOderDetailShiwake():Observable<OrderDetailShiwake[]>{
        
        return this.http.get<OrderDetailShiwake[]>(this._urlShiwake);
    }

    getOrderInputData(): Observable<OrderDetailInput>{
        return this.http.get<OrderDetailInput>(this._urlOrderInput);
    }

}