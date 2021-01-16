import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponseBody } from './ApiResponseBody';
import { ShHttpClientService, } from 'sh-http-client';

declare var require: any;
const FileSaver = require('file-saver');

@Injectable()
export class CommonService {
    private versions: { keyUrl: string, version: string }[] = [];

    private readonly BASE_URL: string = 'http://localhost:8080/api/';

    // private readonly BASE_URL: string = 'http://FJDSU101:28498/ODIS/api';

    constructor(
        private shApiService: ShHttpClientService,
        private http: HttpClient,
    ) { }

    // POST通信。
    public getSearchRequest(urlName: string, data: any): Promise<ApiResponseBody<any>> {
        return this.http.post<any[]>(this.BASE_URL + `/${urlName}/`, data)
            .toPromise()
            .then((res) => {
                const response: any = res;
                return response;
            })
            .catch(this.handleError);
    }




    public getAuthorizationSearch(url: string, data: any = null): Promise<ApiResponseBody<any>> {
        return this.shApiService.post<any[]>(this.BASE_URL + `/${url}/`, data)
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


    //  エラーハンドル
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(error.error);
            return of(result as T);
        };
    }


    public async getDownLoad(urlName: string, data: any): Promise<any> {
        const versionNo = await this.getVersion(this.BASE_URL);
        const options: object = this.getOption(versionNo);
        
        let httpOptions = { observe: 'response' as 'body', responseType: 'blob' as 'json', options };

        return this.http.post(this.BASE_URL + `/${urlName}/`, data, httpOptions);
    }

    private async getVersion(url: string): Promise<string> {
        const keyUrl = this.getKeyUrl(url);
        const projectVersion = this.versions
            .find(value => {
                return value.keyUrl === keyUrl;
            })
        if (!projectVersion) {
            const version = await this.fetchVersion(url)
            // //キャッシュする
            this.setVersionNo(url, version)
            return version;
        }
        return projectVersion.version;
    }

    private getKeyUrl(url: string) {
        if (!url) return "";
        return url.split("/api/")[0] + "/api/Version/";
    }

    public async fetchVersion(url: string): Promise<string> {
        const s = this.splitByApiUrl(url);
        const token = sessionStorage.getItem("AccessToken");
        return this.http.get<ApiResponseBody<any>>(s, { observe: "response", headers: { "Authorization": token ? "Bearer" + token : "Bearer" } }).toPromise()
            .then(response => {
                if (response.body.redirectURL == "reload") {
                    setTimeout(function () { location.reload(); }, 100);

                }
                else if ((response.body.redirectURL || "").indexOf("http") != -1) {
                    setTimeout(function () { location.href = response.body.redirectURL; }, 100);
                }
                return response.body.applicationData ? response.body.applicationData.versionNo : "";
            });
    }

    private splitByApiUrl(url: string) {
        return url.split("/api/")[0] + "/api/Version/" || '';
    }

    public setVersionNo(url: string, versionNo: string) {
        const keyUrl = this.getKeyUrl(url);
        if (!keyUrl || !versionNo) return
        const result = this.versions.findIndex(item => item.keyUrl == keyUrl);
        if(result != -1) {
          this.versions[result] = { keyUrl, version: versionNo };
        }else {
          this.versions.push({ keyUrl, version: versionNo });
        }
    }

    private getOption(versionNo: string): object {
        const token = sessionStorage.getItem("AccessToken");
        const accessToken = token ? 'Bearer' + token : 'Bearer';

        let headers = new HttpHeaders({ "Version-No": versionNo });
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        headers = headers.set('Authorization', accessToken);

        return { observe: Response, headers };
      }

}
