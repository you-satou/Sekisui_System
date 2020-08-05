import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http'
import { WkAllItemType } from './WkAllItemType';
import { Observable, of, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class WkAllItemTypesService {

  private wkAllItemTypes: WkAllItemType[];
  private wkAllItemTypeSubject = new Subject<WkAllItemType[]>();
  public wkAllItemTypeState = this.wkAllItemTypeSubject.asObservable();
  //接続先
  private baseUrl: string = "http://localhost:8080";
  //検索用URL
  private searchUrl: string;
  //選択された1レコードのID
  private selectedId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }
  //PDF印刷
  print(data: WkAllItemType[]) {
    this.http.post(this.baseUrl + "/print", data).subscribe(
      response => {
        if (response == 0) {
          alert("PDF出力に失敗しました");
          return;
        }
        window.open(this.baseUrl + "/files/" + response)
      }
    );
  }
  //条件指定検索
  search(url: string): Observable<WkAllItemType[]> {
    return this.http.get<WkAllItemType[]>(url);
  }
  //レコード全件取得
  fetchAll(): Observable<WkAllItemType[]> {
    return this.http.get<WkAllItemType[]>(`${this.baseUrl}/all`);
  }
  //IDを元にデータを1件取得
  find(): Observable<WkAllItemType> {
    return this.http.get<WkAllItemType>(`${this.baseUrl}/${this.selectedId}`)
  }
  findById(id: string): Observable<WkAllItemType> {
    return this.http.get<WkAllItemType>(`${this.baseUrl}/${id}`);
  }
  //新規登録
  insert(data: WkAllItemType) {
    return this.http.post(this.baseUrl, data).pipe(
      tap(response => response),
      catchError(this.handleError<WkAllItemType[]>("insert error", []))
    );
  }
  //更新処理
  update(data: WkAllItemType) {
    return this.http.put(this.baseUrl, data).pipe(
      tap(response => response),
      catchError(this.handleError<WkAllItemType[]>("update error", []))
    );
  }
  //削除処理
  delete(data: WkAllItemType) {
    return this.http.request("delete", this.baseUrl, { body: data }).pipe(
      tap(response => console.log("delete " + response + " record !!")),
      catchError(this.handleError<WkAllItemType[]>("delete error", []))
    );
  }
  //新しいIDを取得
  fetchMaxId(): Observable<WkAllItemType> {
    return this.http.get<WkAllItemType>(`${this.baseUrl}/newId`);
  }
  //選択レコードIDのセット
  setId(id: number) {
    this.selectedId = id;
  }
  //選択中のレコードIDの取得
  getId(): number {
    return this.selectedId;
  }
  //検索文字列生成
  createSearchUrl(dataList: Object): string {
    //検索URL初期化
    this.searchUrl = this.baseUrl + "?";
    //検索dataをループ
    for (let key of Object.keys(dataList)) {
      //空文字　or　null でなければ
      if (dataList[key] != "" && dataList[key] != null) {
        //URLを追加
        this.searchUrl += `${key}=${dataList[key]}&`
      }
    }
    //最後の”＆”を取り除く
    return this.searchUrl.slice(0, -1);
  }
  setSearchUrl(url: string) {
    this.searchUrl = url;
  }
  getSearchUrl(): string {
    return this.searchUrl;
  }

  reload() {
    this.wkAllItemTypes = [];
    this.wkAllItemTypeSubject.next(this.wkAllItemTypes);
    this.router.navigate(['/']);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error.error);
      return of(result as T)
    };
  }
}
