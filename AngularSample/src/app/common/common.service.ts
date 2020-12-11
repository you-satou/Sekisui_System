import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponseBody } from './ApiResponseBody'
import { ShHttpClientConst, ShRedirectService , ShHttpClientService, LoggerService } from 'sh-http-client';

declare var require: any;
const FileSaver = require('file-saver');

@Injectable()
export class CommonService{

    private baseUrl: string = "http://localhost:8080/api";

    // private baseUrl: string = "http://FJDSU101:28498/ODIS";

    constructor(
        private shApiService: ShHttpClientService,
        private http: HttpClient,
    ){}

    // POST通信。
    getSearchRequest(urlName: string, data: any): Promise<ApiResponseBody<any>>{
        return this.http.post<any[]>(this.baseUrl + `/${urlName}/`, data)
        .toPromise()
        .then((res) => {
            const response: any = res;
            return response;
        })
        .catch(this.handleError);        
    }

    getDownLoad(urlName: string, data: any):Observable<any>{
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type','application/json; charset=utf-8')
        let httpOptions = { observe:'response' as 'body', responseType: 'blob' as 'json', headers};
        return this.http.post(this.baseUrl + `/${urlName}/`, data, httpOptions);
    }


    //  エラーハンドル
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.log(error.error);
          return of(result as T)
        };
    }

    getAuthorizationSearch(url: string, data: any): Promise<ApiResponseBody<any>>{
        return this.shApiService.post<any[]>(this.baseUrl + `/${url}/`, data)
        .then((res => {
            const response: any = res;
            return response;
        }))
        .catch(this.handleError);
        // .toPromise();

    }

    

}
