import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  
  export class SupplierPatternService {
  
    // データの変更を通知するためのオブジェクト
    private closeEventSubject = new Subject<string>();
  
    // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
    public closeEventObservable$ = this.closeEventSubject.asObservable();
  
    /**
     * コンストラクタ
     *
     * @memberof SupplierPatternService
     */
    constructor() { }

    /**
     * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
     *
     * @memberof SupplierPatternService
     */
    public requestCloseModal() {
      this.closeEventSubject.next();
    }
  }