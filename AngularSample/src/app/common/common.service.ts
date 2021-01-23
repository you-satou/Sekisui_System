import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponseBody } from './ApiResponseBody';
import { ShHttpClientService, } from 'sh-http-client';

@Injectable()
export class CommonService {
    
    // private readonly BASE_URL: string = 'http://localhost:8080/api';
    // private readonly BASE_URL: string = 'http://FJDSU101:28498/ODIS/api';

    private readonly BASE_URL: string = 'http://10.96.8.123:80/ODISDev/api';

    constructor(
        private shApiService: ShHttpClientService,
        private http: HttpClient,
    ) { }

    public getAuthorizationSearch(url: string, data: any = null): Promise<ApiResponseBody<any>> {
        return this.shApiService.post<any[]>(this.BASE_URL + `${url}/`, data)
            .then((res => {
                const response: any = res;
                return response;
            }))
            .catch(this.handleError);

    }

    public fetchAuthorization(url: string): Promise<ApiResponseBody<any>> {
        return this.shApiService.post<any[]>(this.BASE_URL + `/${url}/`, null)
            .then((res => {
                const response: any = res;
                return response;
            }))
            .catch(this.handleError);
    }

    public logOut(url: string): Promise<ApiResponseBody<any>> {
        return this.shApiService.post<any[]>(this.BASE_URL + `/${url}/`, null)
            .then((res => {
                const response: any = res;
                return response;
            }))
    }

    //  エラーハンドル
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(error.error);
            return of(result as T);
        };
    }

    public getDownLoad(urlName: string, data: any):Observable<any>{
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type','application/json; charset=utf-8');
        let httpOptions = { observe:'response' as 'body', responseType: 'blob' as 'json', headers};
        return this.http.post(this.BASE_URL + `/${urlName}/`, data, httpOptions);
    }

}
