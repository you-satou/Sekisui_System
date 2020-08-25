import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetail } from './order-detail-approval-interface';
import { Observable } from 'rxjs';

@Injectable()
export class OrderDetailApprovalService{

    //TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    private _url: string = "assets/data/data.json";

    constructor (
        private http: HttpClient
    ){}

    getOrderDetail(): Observable<OrderDetail[]>{
        
        return this.http.get<OrderDetail[]>(this._url);
    }
}