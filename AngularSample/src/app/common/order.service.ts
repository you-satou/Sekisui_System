import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable()
export class OrderService{
    

    constructor(
        private http: HttpClient,
        
    ){}

    // サーバよりデータを取得するのに、URLを渡すのが必要です。
    //　Any[]を列として返す。
    getMultipileDataFromServer(url: string) : Observable<any[]>{
        return this.http.get<any[]>(url)
        .pipe(
            catchError(this.handleError<any[]>("Can't get Data from serve",[]))
        );
    }

    getSingleDataFromServer(url: string): Observable<any>{
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
