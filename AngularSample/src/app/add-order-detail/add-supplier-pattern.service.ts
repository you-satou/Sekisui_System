import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  
export class AddSupplierPatternService {
  
  // データの変更を通知するためのオブジェクト
  private closeEventSubject = new Subject<string>();
  
  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public closeEventObservable$ = this.closeEventSubject.asObservable();
  
  /**
   * コンストラクタ
   *
   * @memberof AddSupplierPatternService
   */
  constructor() { }

  /**
   * イベント通知のリクエストを処理する( モーダルダイアログを閉じる )
   *
   * @memberof AddSupplierPatternService
   */
  public requestCloseModal() {
    this.closeEventSubject.next();
  }
}