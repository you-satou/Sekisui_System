import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CommonService{

    private baseUrl: string = "http://localhost:8080/api";

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
    getSearchRequest(urlName: string, data: any): Promise<any[]>{
        return this.http.post<any[]>(this.baseUrl + `/${urlName}/`, data)
        .toPromise()
        .then((res) => {
            const response: any = res;
            return response;
        })
        .catch(this.handleError);        
    }


    //  エラーハンドル
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.log(error.error);
          return of(result as T)
        };
      }

    

}
