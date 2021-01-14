import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponseBody } from './ApiResponseBody';
import { ShHttpClientService, } from 'sh-http-client';

declare var require: any;
const FileSaver = require('file-saver');

@Injectable()
export class CommonService{

    private readonly BASE_URL: string = "http://localhost:8080/api";

    // private readonly BASE_URL: string = "http://FJDSU101:28498/ODIS/api";

    constructor(
        private shApiService: ShHttpClientService,
        private http: HttpClient,
    ){}

    // POST通信。
    public getSearchRequest(urlName: string, data: any): Promise<ApiResponseBody<any>>{
         return this.http.post<any[]>(this.BASE_URL + `/${urlName}/`, data)
        .toPromise()
        .then((res) => {
            const response: any = res;
            return response;
        })
        .catch(this.handleError);        
    }

    public getDownLoad(urlName: string, data: any):Observable<any>{
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type','application/json; charset=utf-8');
        let httpOptions = { observe:'response' as 'body', responseType: 'blob' as 'json', headers};
        return this.http.post(this.BASE_URL + `/${urlName}/`, data, httpOptions);
    }


    public getAuthorizationSearch(url: string, data: any): Promise<ApiResponseBody<any>>{
        return this.shApiService.post<any[]>(this.BASE_URL + `/${url}/`, data)
        .then((res => {
            const response: any = res;
            return response;
        }))
        .catch(this.handleError);

    }

    public fetchAuthorization (url: string): Promise<ApiResponseBody<any>> {
        return this.shApiService.post<any[]>(this.BASE_URL + `/${url}/`, null)
        .then((res => {
            const response: any = res;
            return response;
        }))
        .catch(this.handleError);
    }

    // public downloadFile (url: string, data: any) {
    //     let headers: HttpHeaders = new HttpHeaders();
    //     headers = headers.set('Content-Type','application/json; charset=utf-8');
    //     let httpOptions = { observe:'response' as 'body', responseType: 'blob' as 'json', headers};
    //     return this.shApiService.post(this.BASE_URL + `/${url}/`, data, httpOptions);
    // }
    

    //  エラーハンドル
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.log(error.error);
          return of(result as T)
        };
    }

}
