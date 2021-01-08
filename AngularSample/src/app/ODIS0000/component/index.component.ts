import { Component, OnInit, ElementRef } from '@angular/core';
import { IndexService } from '../services/index.service'
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
//import { countReset } from 'console';

// ↓↓ 追加 2021-01-06 リクエスト送信に必要なクラスを追加 ↓↓
import { ShHttpClientService, } from 'sh-http-client';
// ↑↑ 追加 2021-01-06 リクエスト送信に必要なクラスを追加 ↑↑

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../../common/common.component.css',
              './index.component.css'],
})

export class IndexComponent implements OnInit{
    
  _element: HTMLElement;

  constructor(
      private element: ElementRef,
      private appComponent: AppComponent,
      private indexService: IndexService,
// ↓↓ 追加 2021-01-06 リクエスト送信に必要なクラスを追加 ↓↓
      private shHttpClient : ShHttpClientService 
// ↑↑ 追加 2021-01-06 リクエスト送信に必要なクラスを追加 ↑↑
  ) { this._element = this.element.nativeElement
  }

  ngOnInit() {
      // ヘッダー 設定
      this.appComponent.setHeader(Const.ScreenName.S0000);

// ↓↓ 追加 2021-01-06 AD認証の為にリクエスト送信 ↓↓
      this.shHttpClient.post<any[]>("http://localhost:8080/api/ODIS0000/authorization", null)
        .then((res => {
          // AD認証処理のためのリクエストなのでレスポンス受信時の処理なし
        }))
        .catch(error => {
            console.log(error);
        });
// ↑↑ 追加 2021-01-06 AD認証の為にリクエスト送信 ↑↑
  }

}
