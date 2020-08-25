import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OrderDetailInputGeneral } from 'app/order-detail-input/order-detail-input-interface';


@Injectable()
export class CommonService{

    
    private baseUrl: string = "http://localhost:8080/";

    constructor(
        private http: HttpClient,
        
    ){}

    // サーバよりデータを取得するのに、URLを渡すのが必要です。
    //　Any[]を列として返す。
    getMultipileData(url: string) : Observable<any[]>{
        return this.http.get<any[]>(url)
        .pipe(
            catchError(this.handleError<any[]>("Can't get Data from serve",[]))
        );
    }

    getSingleData(url: string): Observable<any>{
        return this.http.get<any>(url)
        .pipe(
            catchError(this.handleError<any>("Error excepted while getting data from server",[]))
        );
    }


    //  エラーハンドル
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.log(error.error);
          return of(result as T)
        };
      }

}
