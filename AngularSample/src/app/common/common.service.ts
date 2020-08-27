import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OrderDetailInputGeneral } from 'app/order-detail-input/order-detail-input-interface';


@Injectable()
export class CommonService{

    
    private baseUrl: string = "http://localhost:8080/";

    private searchUrl: string;

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


    //　検索ボタンを押下する時、検索リンクを作成する。
    createSearchUrl(dataList: Object): string{

        this.searchUrl = this.baseUrl + '?';

        for (let key of Object.keys(dataList)){

            if(dataList[key] != '' && dataList[key] != null){
                this.searchUrl += `${key}=${dataList[key]}&`;
            }
        }
        return this.searchUrl.slice(0,-1);
    }

    // POST通信。
    getSearchRequest(urlName: string, data: any): any[]{
        let result: any[];
        this.http.post<any[]>(this.baseUrl + `/${urlName}/`, data)
        .subscribe(
            response => {
                if (response != null) {
                     
                    console.log(JSON.stringify(response));
                    return response;
                }
                else{
                    catchError(this.handleError<any>("Error excepted while getting data from server",[]));
                };
            }
        );
        
        return result;
    }


    //  エラーハンドル
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.log(error.error);
          return of(result as T)
        };
      }

    

}
