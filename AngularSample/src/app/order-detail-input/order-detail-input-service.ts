import { OrderDetailShiwake, OrderDetailSplit, OrderDetailInput,OrderInfo} from './../order-detail-input/order-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class OrderDetailInputService{

    //TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    private _urlShiwake: string = "assets/data/dataShiwake.json";
    private _urlSplit: string = "assets/data/dataSplit.json";
    private _urlOrderInput: string = "assets/data/dataOrderInput.json";
    private _urlOrderTBL1: string = "assets/data/dataInputTBL1.json";
    private _urlOrderTBL2: string = "assets/data/dataInputTBL2.json";

    constructor (
        private http: HttpClient
    ){}

    getOderDetailShiwake():Observable<OrderDetailShiwake[]>{
        
        return this.http.get<OrderDetailShiwake[]>(this._urlShiwake);
    }

    getOrderInputData(): Observable<OrderDetailInput[]>{
        
        return this.http.get<OrderDetailInput[]>(this._urlOrderInput);
    }

    getOderDetailSplit(): Observable<OrderDetailSplit[]>{
        
        return this.http.get<OrderDetailSplit[]>(this._urlSplit);
    }


    getOrderInputTBL1():  Observable<OrderTABLE1[]>{
        
        return this.http.get<OrderTABLE1[]>(this._urlOrderTBL1);
    }

    getOrderInputTBL2():  Observable<OrderTABLE1[]>{
        
        return this.http.get<OrderTABLE1[]>(this._urlOrderTBL2);

    }

}