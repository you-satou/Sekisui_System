import { SplitOrderDetailShiwake, SplitOrderDetailSplit, SplitOrderDetailInput} from './../split-detail-input/split-detail-input-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SplitOrderDetailService{

    //TODO: add URL to Server
    // private _url: string = "/order-detail-approval/data/data.json";

    private _urlShiwake: string = "assets/data/dataShiwake.json";
    private _urlSplitOrder: string = "assets/data/dataSplitOrder.json";
    private _urlOrderInput: string = "assets/data/dataOrderInput.json";

    constructor (
        private http: HttpClient
    ){}
    
    getSplitOderDetailShiwake():Observable<SplitOrderDetailShiwake[]>{
        
        return this.http.get<SplitOrderDetailShiwake[]>(this._urlShiwake);
    }

    getSplitOrderInputData(): Observable<SplitOrderDetailInput[]>{
        
        return this.http.get<SplitOrderDetailInput[]>(this._urlOrderInput);
    }

    getSplitOrderDetailSplit(): Observable<SplitOrderDetailSplit[]>{
        
        return this.http.get<SplitOrderDetailSplit[]>(this._urlSplitOrder);
    }

}